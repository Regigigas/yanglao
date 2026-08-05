import { get, post, put } from './request'
import {
  CHAT_MODE_LOCAL,
  buildLocalRequestConfig,
  clearLocalChatToken,
  getChatConfig,
  saveChatConfig,
  setLocalChatToken
} from '../utils/chat-config'

const data = (response) => response?.data ?? response

export function localRequest(path, method = 'GET', requestData = {}, options = {}) {
  const config = getChatConfig()
  let requestOptions
  try {
    requestOptions = buildLocalRequestConfig(config, path, { method, data: requestData, ...options })
  } catch (error) {
    return Promise.reject(error)
  }

  return new Promise((resolve, reject) => {
    uni.request({
      ...requestOptions,
      success(response) {
        const responseData = response.data || {}
        if (response.statusCode === 401 || responseData.code === 401) {
          clearLocalChatToken()
          return reject(new Error('本地聊天登录已失效'))
        }
        if (response.statusCode < 200 || response.statusCode >= 300) {
          return reject(new Error(responseData.msg || `本地聊天请求失败 (${response.statusCode})`))
        }
        if (responseData.code !== undefined && responseData.code !== 200) {
          return reject(new Error(responseData.msg || '本地聊天操作失败'))
        }
        resolve(responseData)
      },
      fail(error) {
        reject(new Error(error.errMsg || '无法连接本地聊天服务'))
      }
    })
  })
}

export async function getBuildingScene() {
  const config = getChatConfig()
  if (config.mode !== CHAT_MODE_LOCAL) {
    throw new Error('请先切换到局域网本地模式')
  }
  if (!config.token) {
    throw new Error('请先登录本地聊天')
  }
  return data(await localRequest('/system/scene/buildings'))
}

function chatRequest(path, method = 'GET', requestData = {}) {
  if (getChatConfig().mode === CHAT_MODE_LOCAL) {
    return localRequest(path, method, requestData)
  }
  if (method === 'POST') return post(path, requestData)
  if (method === 'PUT') return put(path, requestData)
  return get(path, requestData)
}

export async function loginLocalChat(username, password) {
  const cleanUsername = String(username || '').trim()
  if (!cleanUsername || !password) throw new Error('请输入本地聊天用户名和密码')
  saveChatConfig({ username: cleanUsername })
  const response = await localRequest('/system/chat/login', 'POST', {
    username: cleanUsername,
    password
  }, { includeToken: false })
  const result = data(response)
  if (!result?.token) throw new Error('本地聊天登录响应缺少 token')
  setLocalChatToken(result.token)
  return result
}

export async function testChatConnection() {
  return data(await chatRequest('/system/chat/me'))
}

export async function getCurrentChatUser() {
  return data(await chatRequest('/system/chat/me'))
}

export async function getChatContacts(keyword = '') {
  return data(await chatRequest('/system/chat/contacts', 'GET', { keyword })) || []
}

export async function getConversations() {
  return data(await chatRequest('/system/chat/conversations')) || []
}

export async function createDirectConversation(peerUserId) {
  return data(await chatRequest('/system/chat/conversations/direct', 'POST', { peerUserId }))
}

export async function createGroupConversation(name, memberUserIds) {
  return data(await chatRequest('/system/chat/conversations/group', 'POST', { name, memberUserIds }))
}

export async function getMessages(conversationId, params = {}) {
  return data(await chatRequest(`/system/chat/conversations/${conversationId}/messages`, 'GET', params)) || []
}

export async function sendMessage(conversationId, clientMessageId, content) {
  return data(await chatRequest(`/system/chat/conversations/${conversationId}/messages`, 'POST', {
    clientMessageId,
    messageType: 'text',
    content
  }))
}

export async function markConversationRead(conversationId, lastReadMessageId) {
  return data(await chatRequest(`/system/chat/conversations/${conversationId}/read`, 'PUT', { lastReadMessageId }))
}
