import { describe, expect, it } from 'vitest'
import { compareVersions, normalizeUpdateResponse, parseUpdateUrl } from './update-core'

describe('update core', () => {
  it('比较多段版本号', () => {
    expect(compareVersions('1.10.0', '1.9.9')).toBe(1)
    expect(compareVersions('2.0.0-beta', '2.0.0-alpha')).toBe(1)
    expect(compareVersions('1.0', '1.0.0')).toBe(0)
  })

  it('拒绝公网明文更新地址和降级包', () => {
    expect(() => parseUpdateUrl('http://example.com/update')).toThrow(/HTTPS/)
    expect(normalizeUpdateResponse({ code: 200, data: {
      available: true,
      type: 'apk',
      versionName: '1.0.0',
      versionCode: 100,
      downloadUrl: 'https://example.com/app.apk'
    } }, { appVersion: '1.0.0', versionCode: 100 }, 'https://example.com/latest')).toEqual({
      available: false,
      message: '当前已是最新版本'
    })
  })

  it('规范化可用 WGT 更新并校验摘要', () => {
    const result = normalizeUpdateResponse({ code: 200, data: {
      available: true,
      type: 'wgt',
      versionName: '1.1.0',
      versionCode: 101,
      downloadUrl: './care.wgt',
      sha256: 'a'.repeat(64)
    } }, { appVersion: '1.0.0', wgtVersion: '1.0.0', versionCode: 100 }, 'https://example.com/app-update/latest')
    expect(result.available).toBe(true)
    expect(result.packageUrl).toBe('https://example.com/app-update/care.wgt')
  })

  it('拒绝缺少 SHA-256 的线上 APK 更新', () => {
    expect(() => normalizeUpdateResponse({ code: 200, data: {
      available: true,
      type: 'apk',
      versionName: '1.1.0',
      versionCode: 101,
      downloadUrl: 'https://example.com/app.apk'
    } }, { appVersion: '1.0.0', versionCode: 100 }, 'https://example.com/latest')).toThrow(/SHA-256/)
  })
})
