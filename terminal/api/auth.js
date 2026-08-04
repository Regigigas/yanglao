/**
 * auth.js — 认证相关 API
 * 对接 RuoYi 后台认证系统
 */
import { get, post } from './request'

/**
 * 登录
 * @param {string} username 用户名
 * @param {string} password 密码
 * @param {string} [code] 验证码（如有）
 */
export function login(username, password, code = '') {
  return post('/auth/login', { username, password, code })
}

/**
 * 退出登录（通知后台使 token 失效）
 */
export function logout() {
  return post('/auth/logout')
}

/**
 * 获取当前用户信息
 */
export function getUserInfo() {
  return get('/system/user/profile')
}

/**
 * 获取当前用户路由/权限
 */
export function getUserRoutes() {
  return get('/system/menu/treeselect')
}

/**
 * 修改密码
 */
export function updatePassword(oldPassword, newPassword, confirmPassword) {
  return put('/system/user/profile/updatePwd', {
    oldPassword, newPassword, confirmPassword
  })
}

/**
 * 刷新 token
 */
export function refreshToken() {
  return post('/auth/refresh')
}
