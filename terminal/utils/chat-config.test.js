import { describe, expect, it } from 'vitest'
import {
  CHAT_MODE_LOCAL,
  CHAT_MODE_ONLINE,
  buildLocalRequestConfig,
  getChatConfig,
  normalizeChatConfig,
  normalizeChatMode,
  normalizeLocalUrl,
  saveChatConfig
} from './chat-config'

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial))
  return {
    getStorageSync: key => values.get(key) || '',
    setStorageSync: (key, value) => values.set(key, value),
    removeStorageSync: key => values.delete(key)
  }
}

describe('chat config', () => {
  it('默认使用线上模式', () => {
    expect(normalizeChatMode()).toBe(CHAT_MODE_ONLINE)
    expect(normalizeChatMode('invalid')).toBe(CHAT_MODE_ONLINE)
    expect(normalizeChatConfig()).toEqual({
      mode: CHAT_MODE_ONLINE,
      localUrl: '',
      secret: '',
      token: '',
      username: ''
    })
  })

  it('规范化本地服务 URL', () => {
    expect(normalizeLocalUrl(' 192.168.1.8:9000/ ')).toBe('http://192.168.1.8:9000')
    expect(normalizeLocalUrl('https://chat.local/base///?debug=1#top')).toBe('https://chat.local/base')
    expect(() => normalizeLocalUrl('ftp://chat.local')).toThrow(/HTTP/)
  })

  it('生成携带本地认证信息的请求配置', () => {
    expect(buildLocalRequestConfig({
      mode: CHAT_MODE_LOCAL,
      localUrl: '192.168.1.8:9000/',
      secret: ' room-secret ',
      token: 'local-token'
    }, '/system/chat/me', { method: 'POST', data: { value: 1 } })).toEqual({
      url: 'http://192.168.1.8:9000/system/chat/me',
      method: 'POST',
      data: { value: 1 },
      header: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer local-token',
        'X-Secret': 'room-secret'
      },
      timeout: 15000
    })
  })

  it('登录请求不发送已有本地 token', () => {
    const request = buildLocalRequestConfig({ localUrl: 'http://localhost:9000', token: 'old' }, '/system/chat/login', {
      method: 'POST',
      includeToken: false
    })
    expect(request.header.Authorization).toBeUndefined()
  })

  it('本地服务地址或密钥变化时清除旧主机令牌', () => {
    const storage = memoryStorage({
      yl_chat_mode: CHAT_MODE_LOCAL,
      yl_chat_local_url: 'http://192.168.1.8:9000',
      yl_chat_local_secret: 'old-secret',
      yl_chat_local_token: 'old-token'
    })
    saveChatConfig({ localUrl: 'http://192.168.1.9:9000' }, storage)
    expect(getChatConfig(storage).token).toBe('')

    storage.setStorageSync('yl_chat_local_token', 'another-token')
    saveChatConfig({ secret: 'new-secret' }, storage)
    expect(getChatConfig(storage).token).toBe('')
  })
})
