import { BadRequestException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { DatabaseService, type CrudResource, type DataRecord, type PageQuery } from '@app/common';

const JOB_RESOURCE: CrudResource = {
  table: 'sys_job', id: 'job_id',
  columns: ['jobId', 'jobName', 'jobGroup', 'invokeTarget', 'cronExpression', 'misfirePolicy', 'concurrent', 'status', 'createBy', 'createTime', 'updateBy', 'updateTime', 'remark'],
  like: ['jobName', 'invokeTarget'], exact: ['jobGroup', 'status'], defaultOrder: 'job_id',
};
const LOG_RESOURCE: CrudResource = {
  table: 'sys_job_log', id: 'job_log_id',
  columns: ['jobLogId', 'jobName', 'jobGroup', 'invokeTarget', 'jobMessage', 'status', 'exceptionInfo', 'createTime'],
  like: ['jobName', 'invokeTarget'], exact: ['jobGroup', 'status'], defaultOrder: 'job_log_id',
};

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);
  private running = new Set<number>();
  constructor(private readonly database: DatabaseService, private readonly registry: SchedulerRegistry) {}

  async onModuleInit(): Promise<void> {
    try {
      const jobs = await this.database.query("SELECT * FROM sys_job WHERE status='0'");
      for (const job of jobs) this.schedule(job);
    } catch (error) {
      this.logger.warn(`Jobs were not loaded: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  list(query: PageQuery): Promise<{ rows: DataRecord[]; total: number }> { return this.database.list(JOB_RESOURCE, query); }
  logs(query: PageQuery): Promise<{ rows: DataRecord[]; total: number }> { return this.database.list(LOG_RESOURCE, query); }
  get(id: number): Promise<DataRecord | null> { return this.database.get(JOB_RESOURCE, id); }
  getLog(id: number): Promise<DataRecord | null> { return this.database.get(LOG_RESOURCE, id); }

  async create(input: DataRecord, username: string): Promise<number> {
    this.validate(input);
    const result = await this.database.insert(JOB_RESOURCE, { ...input, status: input.status ?? '0' }, username);
    if (String(input.status ?? '0') === '0') this.schedule({ ...input, jobId: result.insertId });
    return result.affectedRows;
  }

  async update(input: DataRecord, username: string): Promise<number> {
    this.validate(input);
    const result = await this.database.update(JOB_RESOURCE, input, username);
    this.unschedule(Number(input.jobId));
    if (String(input.status) === '0') this.schedule(input);
    return result.affectedRows;
  }

  async changeStatus(input: DataRecord): Promise<number> {
    const id = Number(input.jobId); const status = String(input.status);
    const result = await this.database.execute('UPDATE sys_job SET status=?,update_time=NOW() WHERE job_id=?', [status, id]);
    this.unschedule(id);
    if (status === '0') { const job = await this.get(id); if (job) this.schedule(job); }
    return result.affectedRows;
  }

  async run(id: number): Promise<void> {
    const job = await this.get(id); if (!job) throw new BadRequestException('任务不存在');
    await this.executeJob(job);
  }

  async remove(ids: number[]): Promise<number> {
    for (const id of ids) this.unschedule(id);
    return (await this.database.remove(JOB_RESOURCE, ids)).affectedRows;
  }

  async removeLogs(ids: number[]): Promise<number> { return (await this.database.remove(LOG_RESOURCE, ids)).affectedRows; }
  async cleanLogs(): Promise<void> { await this.database.execute('TRUNCATE TABLE sys_job_log'); }

  private schedule(input: DataRecord): void {
    const id = Number(input.jobId); const name = this.name(id); this.unschedule(id);
    try {
      const expression = String(input.cronExpression ?? '').replaceAll('?', '*');
      const job = new CronJob(expression, () => void this.executeJob(input));
      this.registry.addCronJob(name, job); job.start();
    } catch (error) {
      this.logger.error(`Invalid cron for job ${id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private unschedule(id: number): void {
    const name = this.name(id);
    try { this.registry.deleteCronJob(name); } catch { /* Job is not currently scheduled. */ }
  }

  private async executeJob(input: DataRecord): Promise<void> {
    const id = Number(input.jobId);
    if (String(input.concurrent ?? '1') === '1' && this.running.has(id)) return;
    const started = Date.now(); this.running.add(id);
    try {
      const result = await this.invoke(String(input.invokeTarget ?? ''));
      await this.log(input, '0', `执行成功: ${String(result ?? '')}`.slice(0, 500), '');
    } catch (error) {
      await this.log(input, '1', '执行失败', error instanceof Error ? (error.stack ?? error.message) : String(error));
    } finally {
      this.running.delete(id);
      this.logger.log(`Job ${id} finished in ${Date.now() - started}ms`);
    }
  }

  private async invoke(target: string): Promise<unknown> {
    const name = target.replace(/\(.*$/, '').trim();
    const args = [...target.matchAll(/['"]([^'"]*)['"]/g)].map((match) => match[1]);
    const handlers: Record<string, (...values: string[]) => unknown> = {
      heartbeat: () => ({ ok: true, timestamp: Date.now() }),
      echo: (value) => `echo completed: ${value ?? ''}`,
      join: (...values) => `join completed: ${values.join(',')}`,
    };
    const handler = handlers[name];
    if (!handler) throw new Error(`未注册的 NestJS 任务处理器: ${target}`);
    return handler(...args);
  }

  private async log(job: DataRecord, status: string, message: string, exception: string): Promise<void> {
    await this.database.execute(
      'INSERT INTO sys_job_log(job_name,job_group,invoke_target,job_message,status,exception_info,create_time) VALUES(?,?,?,?,?,?,NOW())',
      [String(job.jobName ?? ''), String(job.jobGroup ?? 'DEFAULT'), String(job.invokeTarget ?? ''), message, status, exception.slice(0, 2000)],
    );
  }

  private validate(input: DataRecord): void {
    if (!String(input.jobName ?? '').trim()) throw new BadRequestException('任务名称不能为空');
    if (!String(input.invokeTarget ?? '').trim()) throw new BadRequestException('调用目标不能为空');
    try { new CronJob(String(input.cronExpression ?? '').replaceAll('?', '*'), () => undefined); }
    catch { throw new BadRequestException('Cron表达式不正确'); }
  }
  private name(id: number): string { return `db-job-${id}`; }
}
