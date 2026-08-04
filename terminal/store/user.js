/**
 * user.js — 用户状态管理
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as apiLogin, logout as apiLogout, getUserInfo } from '../api/auth'

export const useUserStore = defineStore('user', () => {
  const token    = ref(uni.getStorageSync('yl_token') || '')
  const userInfo = ref(null)
  const roles    = ref([])
  const perms    = ref([])

  /** 登录 */
  async function login(username, password) {
    const res = await apiLogin(username, password)
    // RuoYi 返回 { code: 200, token: 'xxx', ... }
    const accessToken = res.token || res.access_token
    if (!accessToken) throw new Error('登录失败，未获取到 token')
    token.value = accessToken
    uni.setStorageSync('yl_token', accessToken)
    await fetchUserInfo()
    return res
  }

  /** 拉取用户信息 */
  async function fetchUserInfo() {
    const res = await getUserInfo()
    userInfo.value = res.data || res.user || res
    roles.value    = res.roles || []
    perms.value    = res.permissions || []
    // 本地缓存用户基本信息
    uni.setStorageSync('yl_user', JSON.stringify(userInfo.value))
  }

  /** 退出登录 */
  async function logout() {
    try {
      await apiLogout()
    } catch (_) { /* 即使后台接口失败也清除本地 token */ }
    token.value    = ''
    userInfo.value = null
    roles.value    = []
    perms.value    = []
    uni.removeStorageSync('yl_token')
    uni.removeStorageSync('yl_user')
  }

  /** 从缓存恢复用户信息（应用冷启动时） */
  function restoreFromStorage() {
    const raw = uni.getStorageSync('yl_user')
    if (raw) {
      try { userInfo.value = JSON.parse(raw) } catch (_) {}
    }
  }

  return { token, userInfo, roles, perms, login, logout, fetchUserInfo, restoreFromStorage }
})
