import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const auth = vi.hoisted(() => ({
  login: vi.fn(),
  logout: vi.fn(),
  getUserInfo: vi.fn()
}))

vi.mock('../api/auth', () => ({
  login: auth.login,
  logout: auth.logout,
  getUserInfo: auth.getUserInfo
}))

import { useUserStore } from './user'

function mockUniStorage(initial = {}) {
  const storage = new Map(Object.entries(initial))
  globalThis.uni = {
    getStorageSync: vi.fn((key) => storage.get(key) || ''),
    setStorageSync: vi.fn((key, value) => storage.set(key, value)),
    removeStorageSync: vi.fn((key) => storage.delete(key))
  }
  return storage
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
  mockUniStorage()
})

describe('user store login', () => {
  it('用户资料加载成功后保留完整会话', async () => {
    auth.login.mockResolvedValue({ token: 'new-token' })
    auth.getUserInfo.mockResolvedValue({
      data: { userId: 7, nickName: '护理员' },
      roles: ['care'],
      permissions: ['care:task:list']
    })

    const store = useUserStore()
    await store.login('nurse', 'secret')

    expect(store.token).toBe('new-token')
    expect(store.userInfo).toEqual({ userId: 7, nickName: '护理员' })
    expect(uni.setStorageSync).toHaveBeenCalledWith('yl_token', 'new-token')
    expect(uni.setStorageSync).toHaveBeenCalledWith('yl_user', JSON.stringify(store.userInfo))
  })

  it('用户资料加载失败时回滚临时 token', async () => {
    const storage = mockUniStorage({ yl_user: '{"userId":1}' })
    auth.login.mockResolvedValue({ token: 'partial-token' })
    auth.getUserInfo.mockRejectedValue(new Error('资料加载失败'))

    const store = useUserStore()
    await expect(store.login('nurse', 'secret')).rejects.toThrow('资料加载失败')

    expect(store.token).toBe('')
    expect(store.userInfo).toBeNull()
    expect(store.roles).toEqual([])
    expect(store.perms).toEqual([])
    expect(storage.has('yl_token')).toBe(false)
    expect(storage.has('yl_user')).toBe(false)
  })
})
