import { beforeEach, describe, expect, it, vi } from 'vitest'
import { scanWifiList } from './wifi'

beforeEach(() => {
  vi.useRealTimers()
  globalThis.uni = {
    onGetWifiList: vi.fn(),
    offGetWifiList: vi.fn(),
    getWifiList: vi.fn()
  }
})

describe('scanWifiList', () => {
  it('收到列表后移除监听器', async () => {
    let listener
    uni.onGetWifiList.mockImplementation((callback) => { listener = callback })
    uni.getWifiList.mockImplementation(({ success }) => success())

    const result = scanWifiList()
    listener({ wifiList: [{ SSID: 'Nurse-WiFi' }] })

    await expect(result).resolves.toEqual([{ SSID: 'Nurse-WiFi' }])
    expect(uni.offGetWifiList).toHaveBeenCalledWith(listener)
  })

  it('扫描启动失败时移除监听器', async () => {
    let listener
    uni.onGetWifiList.mockImplementation((callback) => { listener = callback })
    uni.getWifiList.mockImplementation(({ fail }) => fail({ errMsg: '权限不足' }))

    await expect(scanWifiList()).rejects.toThrow('权限不足')
    expect(uni.offGetWifiList).toHaveBeenCalledWith(listener)
  })

  it('长时间无回调时超时并移除监听器', async () => {
    vi.useFakeTimers()
    let listener
    uni.onGetWifiList.mockImplementation((callback) => { listener = callback })
    uni.getWifiList.mockImplementation(({ success }) => success())

    const assertion = expect(scanWifiList()).rejects.toThrow('WiFi 扫描超时，请重试')
    await vi.advanceTimersByTimeAsync(10000)
    await assertion
    expect(uni.offGetWifiList).toHaveBeenCalledWith(listener)
  })
})
