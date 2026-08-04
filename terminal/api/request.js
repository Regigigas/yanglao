/**
 * request.js — uni-app 请求封装
 * 与 RuoYi 后台系统对接
 */

// 默认后台地址（首次使用前未配置时的兜底值）
const DEFAULT_BASE_URL = 'http://192.168.1.100:8080'

// Token 请求头名称（与 RuoYi 保持一致）
const TOKEN_HEADER = 'Authorization'

/**
 * 获取当前配置的后台地址（动态读取，每次请求都取最新值）
 */
export function getBaseUrl() {
  return (uni.getStorageSync('yl_server_url') || DEFAULT_BASE_URL).replace(/\/$/, '')
}

/**
 * 保存后台地址
 * @param {string} url
 */
export function setBaseUrl(url) {
  uni.setStorageSync('yl_server_url', url.trim().replace(/\/$/, ''))
}

/**
 * 封装 uni.request，支持 Promise 链式调用
 * @param {Object} options
 */
function request(options) {
  const token   = uni.getStorageSync('yl_token')
  const baseUrl = getBaseUrl()

  return new Promise((resolve, reject) => {
    uni.request({
      url: baseUrl + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...(token ? { [TOKEN_HEADER]: 'Bearer ' + token } : {}),
        ...(options.header || {})
      },
      timeout: options.timeout || 15000,
      success(res) {
        const { statusCode, data } = res

        // HTTP 层错误
        if (statusCode === 401) {
          uni.removeStorageSync('yl_token')
          uni.showToast({ title: '登录已过期，请重新登录', icon: 'none', duration: 2000 })
          setTimeout(() => {
            uni.reLaunch({ url: '/pages-auth/login/index' })
          }, 1500)
          return reject(new Error('Unauthorized'))
        }

        if (statusCode !== 200) {
          uni.showToast({ title: `请求失败 (${statusCode})`, icon: 'none' })
          return reject(new Error(`HTTP ${statusCode}`))
        }

        // 业务层错误（RuoYi code 200 = 成功）
        if (data.code !== undefined && data.code !== 200) {
          const msg = data.msg || '操作失败'
          uni.showToast({ title: msg, icon: 'none', duration: 2000 })
          return reject(new Error(msg))
        }

        resolve(data)
      },
      fail(err) {
        const msg = err.errMsg || '网络连接失败'
        uni.showToast({ title: msg, icon: 'none' })
        reject(new Error(msg))
      }
    })
  })
}

export const get = (url, data, options = {}) =>
  request({ ...options, url, method: 'GET', data })

export const post = (url, data, options = {}) =>
  request({ ...options, url, method: 'POST', data })

export const put = (url, data, options = {}) =>
  request({ ...options, url, method: 'PUT', data })

export const del = (url, data, options = {}) =>
  request({ ...options, url, method: 'DELETE', data })

export default request
