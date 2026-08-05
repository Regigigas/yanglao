<script setup lang="ts">
  import { Icon } from '@iconify/vue';
  import type { BackupInfo, LocalSyncResult } from '@yanglao/db';
  import {
    NButton,
    NDivider,
    NSpace,
    NTable,
    NText,
    useDialog,
    useMessage,
  } from 'naive-ui';
  import { onMounted, ref } from 'vue';

  const emit = defineEmits<{ synchronized: [] }>();
  const dialog = useDialog();
  const message = useMessage();
  const backups = ref<BackupInfo[]>([]);
  const backupCreating = ref(false);
  const backupExporting = ref('');
  const backupRestoring = ref('');
  const integrityChecking = ref(false);
  const localSyncing = ref(false);
  const lastLocalSync = ref<LocalSyncResult | null>(null);

  function errorMessage(error: unknown, fallback: string): string {
    return error instanceof Error && error.message ? error.message : fallback;
  }

  function formatBytes(value: number): string {
    if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
    return `${(value / 1024 / 1024).toFixed(2)} MB`;
  }

  function formatDate(value: string): string {
    return new Date(value).toLocaleString('zh-CN', { hour12: false });
  }

  async function loadBackups(): Promise<void> {
    backups.value = await window.api.db.listBackups();
  }

  async function createBackup(): Promise<void> {
    backupCreating.value = true;
    try {
      const backup = await window.api.db.createBackup();
      await loadBackups();
      message.success(`本地备份已创建：${backup.name}`);
    } catch (error) {
      message.error(errorMessage(error, '创建本地备份失败'));
    } finally {
      backupCreating.value = false;
    }
  }

  async function checkIntegrity(): Promise<void> {
    integrityChecking.value = true;
    try {
      const result = await window.api.db.checkIntegrity();
      if (result.ok) message.success('数据库完整性检查通过');
      else message.error(result.messages.join('；'));
    } catch (error) {
      message.error(errorMessage(error, '数据库完整性检查失败'));
    } finally {
      integrityChecking.value = false;
    }
  }

  function syncLocalFile(): void {
    dialog.warning({
      title: '选择数据文件本地同步',
      content: '系统会先校验所选 SQLite 文件并自动备份当前数据库，再按记录更新时间合并。当前云端、局域网、定时同步配置和本机附件路径不会被覆盖。',
      positiveText: '选择文件并同步',
      negativeText: '取消',
      onPositiveClick: async () => {
        localSyncing.value = true;
        try {
          const response = await window.api.db.syncLocalFile();
          if (response.canceled || !response.result) return;
          lastLocalSync.value = response.result;
          await loadBackups();
          emit('synchronized');
          message.success(
            `本地同步完成：新增 ${response.result.inserted} 条，更新 ${response.result.updated} 条`,
          );
        } catch (error) {
          message.error(errorMessage(error, '本地数据同步失败'));
        } finally {
          localSyncing.value = false;
        }
      },
    });
  }

  async function exportBackup(name: string): Promise<void> {
    backupExporting.value = name;
    try {
      const result = await window.api.db.exportBackup(name);
      if (!result.canceled) message.success('备份已导出到所选位置');
    } catch (error) {
      message.error(errorMessage(error, '导出备份失败'));
    } finally {
      backupExporting.value = '';
    }
  }

  function restoreBackup(name: string): void {
    dialog.warning({
      title: '恢复数据库备份',
      content: `恢复 ${name} 将用备份中的整库数据替换当前数据库，应用会立即重启。系统会先保存当前数据库用于安全回退。`,
      positiveText: '继续',
      negativeText: '取消',
      onPositiveClick: () => {
        dialog.error({
          title: '再次确认恢复',
          content: '请确认远程同步已经停止，并且当前没有未完成的数据录入。确定后应用将立即关闭并执行恢复。',
          positiveText: '确认恢复并重启',
          negativeText: '取消',
          onPositiveClick: async () => {
            backupRestoring.value = name;
            try {
              await window.api.db.restoreBackup(name);
              message.info('恢复请求已提交，应用正在重启');
            } catch (error) {
              backupRestoring.value = '';
              message.error(errorMessage(error, '提交数据库恢复请求失败'));
            }
          },
        });
      },
    });
  }

  async function openBackupDirectory(): Promise<void> {
    try {
      await window.api.db.openBackupDirectory();
    } catch (error) {
      message.error(errorMessage(error, '无法打开备份目录'));
    }
  }

  onMounted(() => {
    void loadBackups().catch((error) => {
      message.error(errorMessage(error, '读取本地备份历史失败'));
    });
  });
</script>

<template>
  <div class="data-safety-tools">
    <section class="data-safety-tool">
      <span class="data-safety-icon"><Icon icon="ion:server-outline" /></span>
      <div>
        <strong>新建本地数据库备份</strong>
        <NText depth="3" class="tool-detail">
          生成包含当前 WAL 数据的一致性 SQLite 快照，程序保留最近 30 份。
        </NText>
      </div>
      <NButton type="primary" :loading="backupCreating" @click="createBackup">
        <template #icon><Icon icon="ion:save-outline" /></template>
        立即备份
      </NButton>
    </section>

    <section class="data-safety-tool">
      <span class="data-safety-icon integrity"><Icon icon="ion:shield-checkmark-outline" /></span>
      <div>
        <strong>数据库完整性</strong>
        <NText depth="3" class="tool-detail">检查数据库页结构、索引和数据一致性。</NText>
      </div>
      <NButton :loading="integrityChecking" @click="checkIntegrity">
        <template #icon><Icon icon="ion:checkmark-circle-outline" /></template>
        运行检查
      </NButton>
    </section>

    <section class="data-safety-tool local-sync-tool">
      <span class="data-safety-icon sync"><Icon icon="ion:push-outline" /></span>
      <div>
        <strong>选择数据文件本地同步</strong>
        <NText depth="3" class="tool-detail">
          合并其他养老管理系统数据库中的较新业务记录，现有其他同步方式保持不变。
        </NText>
        <NText v-if="lastLocalSync" depth="3" class="last-sync-detail">
          最近：{{ lastLocalSync.sourceName }}，新增 {{ lastLocalSync.inserted }}，更新
          {{ lastLocalSync.updated }}
        </NText>
      </div>
      <NButton type="info" secondary :loading="localSyncing" @click="syncLocalFile">
        <template #icon><Icon icon="ion:document-attach-outline" /></template>
        选择数据文件
      </NButton>
    </section>
  </div>

  <NDivider />

  <div class="backup-heading">
    <div>
      <strong>本地备份历史</strong>
      <NText depth="3" class="tool-detail">{{ backups.length }} 份备份</NText>
    </div>
    <NSpace>
      <NButton quaternary title="刷新备份历史" @click="loadBackups">
        <template #icon><Icon icon="ion:refresh-outline" /></template>
        刷新
      </NButton>
      <NButton quaternary title="打开备份目录" @click="openBackupDirectory">
        <template #icon><Icon icon="ion:folder-open-outline" /></template>
        打开目录
      </NButton>
    </NSpace>
  </div>

  <div class="backup-table-wrap">
    <NTable v-if="backups.length" :single-line="false" size="small">
      <thead>
        <tr><th>备份文件</th><th>大小</th><th>创建时间</th><th>操作</th></tr>
      </thead>
      <tbody>
        <tr v-for="backup in backups" :key="backup.name">
          <td>
            <strong class="backup-name">{{ backup.name }}</strong>
            <NText depth="3" class="backup-path">{{ backup.path }}</NText>
          </td>
          <td>{{ formatBytes(backup.size) }}</td>
          <td>{{ formatDate(backup.createdAt) }}</td>
          <td>
            <NSpace :wrap="false" size="small">
              <NButton
                quaternary
                size="small"
                type="warning"
                title="恢复此备份"
                :loading="backupRestoring === backup.name"
                :disabled="Boolean(backupRestoring) && backupRestoring !== backup.name"
                @click="restoreBackup(backup.name)"
              >
                <template #icon><Icon icon="ion:refresh-circle-outline" /></template>
                恢复
              </NButton>
              <NButton
                quaternary
                size="small"
                title="导出备份"
                :loading="backupExporting === backup.name"
                @click="exportBackup(backup.name)"
              >
                <template #icon><Icon icon="ion:download-outline" /></template>
                导出
              </NButton>
            </NSpace>
          </td>
        </tr>
      </tbody>
    </NTable>
    <NText v-else depth="3">尚未创建本地数据库备份</NText>
  </div>
</template>

<style scoped>
  .data-safety-tools {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .data-safety-tool {
    min-height: 82px;
    padding: 14px;
    display: grid;
    grid-template-columns: 38px minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    border: 1px solid var(--n-border-color);
    border-radius: 6px;
  }

  .local-sync-tool {
    grid-column: 1 / -1;
  }

  .data-safety-icon {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    color: #34754d;
    background: #e8f3ec;
    border-radius: 6px;
  }

  .data-safety-icon.integrity {
    color: #9a6718;
    background: #f8f0df;
  }

  .data-safety-icon.sync {
    color: #326d84;
    background: #e6f1f5;
  }

  .data-safety-icon :deep(svg) {
    width: 20px;
    height: 20px;
  }

  .tool-detail,
  .last-sync-detail,
  .backup-path {
    display: block;
    margin-top: 4px;
    font-size: 12px;
  }

  .last-sync-detail {
    color: #34754d;
  }

  .backup-heading {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .backup-table-wrap {
    overflow-x: auto;
  }

  .backup-table-wrap table {
    min-width: 720px;
  }

  .backup-name,
  .backup-path {
    max-width: 480px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .backup-name {
    display: block;
  }

  @media (max-width: 760px) {
    .data-safety-tools {
      grid-template-columns: 1fr;
    }

    .data-safety-tool {
      grid-template-columns: 38px minmax(0, 1fr);
    }

    .data-safety-tool .n-button {
      grid-column: 2;
      justify-self: start;
    }

    .backup-heading {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>
