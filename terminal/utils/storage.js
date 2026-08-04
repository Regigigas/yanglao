/**
 * storage.js — 本地存储工具类
 */

const PREFIX = 'yl_'

export const storage = {
  set(key, value) {
    uni.setStorageSync(PREFIX + key, typeof value === 'object' ? JSON.stringify(value) : value)
  },

  get(key, defaultValue = null) {
    const val = uni.getStorageSync(PREFIX + key)
    if (val === '' || val === null || val === undefined) return defaultValue
    try { return JSON.parse(val) } catch (_) { return val }
  },

  remove(key) {
    uni.removeStorageSync(PREFIX + key)
  },

  clear() {
    uni.clearStorageSync()
  }
}

export default storage
