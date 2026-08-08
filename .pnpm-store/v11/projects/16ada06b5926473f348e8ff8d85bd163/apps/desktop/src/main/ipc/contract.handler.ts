// apps/desktop/src/main/ipc/contract.handler.ts
import { app, dialog, shell } from 'electron'
import { randomUUID } from 'node:crypto'
import { copyFile, mkdir } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import type { IpcMain } from 'electron'
import type { ContractRepo } from '@yanglao/db'

export function registerContractHandlers(ipc: IpcMain, repo: ContractRepo): void {
  ipc.handle('contract:list', () => repo.findAll())
  ipc.handle('contract:list:elderly', (_e, elderlyId: string) => repo.findByElderly(elderlyId))
  ipc.handle('contract:active', (_e, elderlyId: string) => repo.findActiveByElderly(elderlyId))
  ipc.handle('contract:expiring', (_e, days?: number) => repo.findExpiringSoon(days))
  ipc.handle('contract:create', (_e, data) => repo.insert(data))
  ipc.handle('contract:update', (_e, { id, data }) => { repo.update(id, data); return { ok: true } })
  ipc.handle('contract:delete', (_e, id: string) => { repo.softDelete(id); return { ok: true } })
  ipc.handle('contract:gen:no', () => repo.generateContractNo())
  ipc.handle('contract:attachment:select', async () => {
    const result = await dialog.showOpenDialog({
      title: '选择合同扫描件',
      properties: ['openFile'],
      filters: [
        { name: '合同文件', extensions: ['pdf', 'jpg', 'jpeg', 'png', 'webp'] },
      ],
    })
    if (result.canceled || result.filePaths.length === 0) return { canceled: true }

    const sourcePath = result.filePaths[0]
    const attachmentDir = join(app.getPath('userData'), 'contract-attachments')
    await mkdir(attachmentDir, { recursive: true })
    const storedPath = join(attachmentDir, `${Date.now()}-${randomUUID()}${extname(sourcePath).toLowerCase()}`)
    await copyFile(sourcePath, storedPath)
    return { canceled: false, filePath: storedPath, fileName: basename(sourcePath) }
  })
  ipc.handle('contract:attachment:open', async (_e, filePath: string) => {
    const error = await shell.openPath(filePath)
    if (error) throw new Error(error)
    return { ok: true }
  })
}
