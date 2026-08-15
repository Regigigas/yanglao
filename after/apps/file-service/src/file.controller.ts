import { BadRequestException, Controller, Delete, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { extname, relative, resolve, sep } from 'node:path';
import { randomUUID } from 'node:crypto';
import { success, type DataRecord } from '@app/common';

@Controller()
export class FileController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: Number(process.env.FILE_MAX_SIZE ?? 50) * 1024 * 1024 } }))
  async upload(@UploadedFile() file: Express.Multer.File): Promise<DataRecord> {
    if (!file) throw new BadRequestException('上传文件不能为空');
    const extension = extname(file.originalname).toLowerCase();
    if (['.exe', '.bat', '.cmd', '.ps1', '.sh', '.jar'].includes(extension)) throw new BadRequestException('不允许上传可执行文件');
    const date = new Date();
    const directory = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    const root = resolve(process.env.UPLOAD_DIR ?? './uploads');
    const targetDirectory = resolve(root, directory);
    if (relative(root, targetDirectory).startsWith('..')) throw new BadRequestException('上传路径无效');
    await mkdir(targetDirectory, { recursive: true });
    const filename = `${randomUUID()}${extension}`;
    await writeFile(resolve(targetDirectory, filename), file.buffer, { flag: 'wx' });
    const path = `${directory}/${filename}`;
    const url = `${process.env.FILE_PUBLIC_URL ?? 'http://127.0.0.1:8080/file/statics'}/${path}`;
    return success({ name: file.originalname, url });
  }

  @Delete('delete')
  async delete(@Query('fileUrl') fileUrl: string): Promise<DataRecord> {
    const marker = '/statics/';
    const index = String(fileUrl ?? '').indexOf(marker);
    if (index < 0) throw new BadRequestException('文件地址无效');
    const root = resolve(process.env.UPLOAD_DIR ?? './uploads');
    const target = resolve(root, decodeURIComponent(fileUrl.slice(index + marker.length)));
    const relativePath = relative(root, target);
    if (!relativePath || relativePath.startsWith('..') || relativePath.startsWith(sep)) throw new BadRequestException('文件地址越界');
    try { await unlink(target); } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
    return success(true);
  }

  @Get('health')
  health(): DataRecord { return { status: 'ok', service: 'file-service', timestamp: new Date().toISOString() }; }
}
