// apps/desktop/src/main/ipc/lan.handler.ts
// 局域网主机模式 IPC 处理器

import type { IpcMain } from 'electron'
import type { UserRepo } from '@yanglao/db'
import type { LanServer } from '../lan-server'
import { requireActiveUser } from './auth.handler'

export function registerLanHandlers(ipc: IpcMain, lanServer: LanServer, userRepo: UserRepo): void {
  const requireAdministrator = (): void => {
    if (requireActiveUser(userRepo).role_id !== 'role-admin') throw new Error('仅系统管理员可配置局域网服务')
  }

  // 获取配置和状态
  ipc.handle('lan:config:get', () => {
    requireAdministrator()
    return lanServer.getConfig()
  })
  ipc.handle('lan:status', () => {
    requireAdministrator()
    return lanServer.getStatus()
  })
  ipc.handle('lan:ips', () => {
    requireAdministrator()
    return lanServer.getLanIPs()
  })

  // 保存配置（不启停服务器）
  ipc.handle('lan:config:save', (_e, cfg: { enabled?: 0|1; port?: number; allow_write?: 0|1; secret?: string | null }) => {
    requireAdministrator()
    lanServer.saveConfig(cfg)
    return { ok: true }
  })

  // 启动主机服务
  ipc.handle('lan:start', async (_e, port?: number) => {
    try {
      requireAdministrator()
      await lanServer.start(port)
      return { ok: true, status: lanServer.getStatus() }
    } catch (err) {
      return { ok: false, error: String(err) }
    }
  })

  // 停止主机服务
  ipc.handle('lan:stop', () => {
    requireAdministrator()
    lanServer.stop()
    return { ok: true, status: lanServer.getStatus() }
  })

  // 连通性测试（从客户端角度 ping 目标地址）
  ipc.handle('lan:ping', async (_e, url: string) => {
    requireAdministrator()
    const http = await import('http')
    const https = await import('https')
    return new Promise<{ ok: boolean; latency?: number; error?: string }>(resolve => {
      const startAt = Date.now()
      const mod = url.startsWith('https') ? https : http
      const timeout = setTimeout(() => resolve({ ok: false, error: '连接超时（5s）' }), 5000)
      const req = mod.get(`${url.replace(/\/$/, '')}/ping`, res => {
        clearTimeout(timeout)
        const latency = Date.now() - startAt
        if (res.statusCode === 200) {
          resolve({ ok: true, latency })
        } else {
          resolve({ ok: false, error: `HTTP ${res.statusCode}` })
        }
        res.resume()
      })
      req.on('error', err => {
        clearTimeout(timeout)
        resolve({ ok: false, error: err.message })
      })
    })
  })
}
