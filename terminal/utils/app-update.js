import { getBaseUrl } from '../api/request'
import { normalizeUpdateResponse, parseUpdateUrl } from './update-core'

// #ifdef APP-PLUS
import { chooseUpdatePackage, inspectUpdatePackage } from '@/uni_modules/yanglao-update-picker'
// #endif

const SETTINGS_KEY = 'yanglao_update_settings'

export function defaultUpdateUrl() {
  return `${getBaseUrl()}/system/app-update/latest`
}

export function getUpdateSettings() {
  const stored = uni.getStorageSync(SETTINGS_KEY)
  return stored && typeof stored === 'object'
    ? { source: stored.source === 'custom' ? 'custom' : 'default', customUrl: String(stored.customUrl || '') }
    : { source: 'default', customUrl: '' }
}

export function saveUpdateSettings(settings) {
  const result = {
    source: settings.source === 'custom' ? 'custom' : 'default',
    customUrl: String(settings.customUrl || '').trim()
  }
  if (result.source === 'custom') parseUpdateUrl(result.customUrl, '自定义更新地址')
  uni.setStorageSync(SETTINGS_KEY, result)
  return result
}

export function activeUpdateUrl(settings) {
  return settings.source === 'custom'
    ? parseUpdateUrl(settings.customUrl, '自定义更新地址').toString()
    : parseUpdateUrl(defaultUpdateUrl(), '默认更新地址').toString()
}

export function getRuntimeInfo() {
  let baseInfo = {}
  let systemInfo = {}
  try {
    baseInfo = typeof uni.getAppBaseInfo === 'function' ? uni.getAppBaseInfo() : {}
    systemInfo = uni.getSystemInfoSync()
  } catch (_) {}
  return new Promise(resolve => {
    const finish = (properties = {}) => resolve({
      appId: String(baseInfo.appId || properties.appid || ''),
      appVersion: String(properties.version || baseInfo.appVersion || '1.0.0'),
      wgtVersion: String(properties.version || baseInfo.appVersion || '1.0.0'),
      versionCode: Number(properties.versionCode || baseInfo.appVersionCode || 0),
      platform: String(properties.platform || systemInfo.uniPlatform || systemInfo.platform || 'unknown').toLowerCase()
    })
    // #ifdef APP-PLUS
    plus.runtime.getProperty(plus.runtime.appid, properties => finish({
      ...properties,
      appid: plus.runtime.appid,
      platform: plus.os.name
    }))
    // #endif
    // #ifndef APP-PLUS
    finish()
    // #endif
  })
}

export async function checkForUpdate(url, runtime) {
  const parsed = parseUpdateUrl(url)
  Object.entries({
    appid: runtime.appId,
    platform: runtime.platform,
    appVersion: runtime.appVersion,
    versionCode: runtime.versionCode,
    wgtVersion: runtime.wgtVersion
  }).forEach(([key, value]) => parsed.searchParams.set(key, String(value ?? '')))
  const responseData = await new Promise((resolve, reject) => {
    const businessOrigin = parseUpdateUrl(getBaseUrl(), '业务服务地址').origin
    const token = parsed.origin === businessOrigin ? uni.getStorageSync('yl_token') : ''
    uni.request({
      url: parsed.toString(),
      method: 'GET',
      timeout: 15000,
      header: token ? { Authorization: `Bearer ${token}` } : {},
      success(response) {
        if (response.statusCode >= 200 && response.statusCode < 300) return resolve(response.data)
        reject(new Error(response.data?.msg || `更新服务请求失败（${response.statusCode}）`))
      },
      fail(error) { reject(new Error(error.errMsg || '无法连接更新服务')) }
    })
  })
  return normalizeUpdateResponse(responseData, runtime, url)
}

export function createUpdateDownload(packageUrl, onProgress) {
  let task
  const promise = new Promise((resolve, reject) => {
    task = uni.downloadFile({
      url: parseUpdateUrl(packageUrl, '安装包地址').toString(),
      timeout: 10 * 60 * 1000,
      success(result) {
        if (result.statusCode === 200 && result.tempFilePath) return resolve(result.tempFilePath)
        reject(new Error(`安装包下载失败（${result.statusCode || '未知状态'}）`))
      },
      fail(error) { reject(new Error(String(error.errMsg || '').includes('abort') ? '下载已取消' : error.errMsg || '安装包下载失败')) }
    })
    task?.onProgressUpdate?.(progress => onProgress?.(Math.max(0, Math.min(100, progress.progress || 0))))
  })
  return { promise, abort: () => task?.abort() }
}

export function verifyUpdatePackage(filePath, update) {
  return new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    if (plus.os.name !== 'Android') return resolve()
    if (!update.sha256) return reject(new Error('线上更新缺少 SHA-256 校验值'))
    inspectUpdatePackage({
      path: plus.io.convertLocalFileSystemURL(filePath),
      success(result) {
        if (update.size > 0 && Number(result.size) !== Number(update.size)) return reject(new Error('安装包大小与更新信息不一致'))
        if (update.sha256 && String(result.sha256).toLowerCase() !== update.sha256) return reject(new Error('安装包 SHA-256 校验失败'))
        resolve()
      },
      fail: error => reject(new Error(error.errMsg || '无法校验安装包'))
    })
    // #endif
    // #ifndef APP-PLUS
    resolve()
    // #endif
  })
}

export function installUpdatePackage(filePath, type) {
  return new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    plus.runtime.install(filePath, { force: false }, () => {
      if (type === 'wgt') return plus.runtime.restart()
      resolve()
    }, error => reject(new Error(error.message || '安装更新失败')))
    // #endif
    // #ifndef APP-PLUS
    reject(new Error('当前平台不支持直接安装更新包'))
    // #endif
  })
}

export function chooseLocalUpdatePackage() {
  return new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    if (plus.os.name !== 'Android') return reject(new Error('本地更新仅支持 Android App'))
    chooseUpdatePackage({ success: resolve, fail: error => reject(new Error(error.errMsg || '未能读取更新包')) })
    // #endif
    // #ifndef APP-PLUS
    reject(new Error('本地更新仅支持 Android App'))
    // #endif
  })
}

export function packageType(fileName) {
  const lower = String(fileName || '').toLowerCase()
  if (lower.endsWith('.apk')) return 'apk'
  if (lower.endsWith('.wgt')) return 'wgt'
  throw new Error('只支持 APK 或 WGT 更新包')
}

export function openExternalUrl(url) {
  const target = parseUpdateUrl(url, '跳转地址').toString()
  // #ifdef APP-PLUS
  plus.runtime.openURL(target)
  // #endif
  // #ifdef H5
  window.location.assign(target)
  // #endif
}
