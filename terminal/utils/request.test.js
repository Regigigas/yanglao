import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from '../api/request'

function mockUni(response) {
  globalThis.uni = {
    getStorageSync: vi.fn((key) => key === 'yl_token' ? 'token' : ''),
    removeStorageSync: vi.fn(),
    showToast: vi.fn(),
    reLaunch: vi.fn((options) => options.complete?.()),
    request: vi.fn((options) => options.success(response))
  }
}

beforeEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('request', () => {
  it('接受 201 和空响应体', async () => {
    mockUni({ statusCode: 201, data: null })
    await expect(request({ url: '/created', method: 'POST' })).resolves.toBeNull()
    expect(uni.showToast).not.toHaveBeenCalled()
  })

  it('优先展示服务端 HTTP 错误信息', async () => {
    mockUni({ statusCode: 503, data: { msg: '服务暂不可用' } })
    await expect(request({ url: '/failed' })).rejects.toThrow('服务暂不可用')
    expect(uni.showToast).toHaveBeenCalledWith(expect.objectContaining({ title: '服务暂不可用' }))
  })

  it('并发 401 只提示和跳转一次', async () => {
    vi.useFakeTimers()
    mockUni({ statusCode: 401, data: { msg: 'Unauthorized' } })
    await Promise.allSettled([
      request({ url: '/one' }),
      request({ url: '/two' })
    ])
    expect(uni.showToast).toHaveBeenCalledTimes(1)
    await vi.runAllTimersAsync()
    expect(uni.reLaunch).toHaveBeenCalledTimes(1)
  })
})
