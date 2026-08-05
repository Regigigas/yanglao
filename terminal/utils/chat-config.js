export const CHAT_MODE_ONLINE = 'online'
export const CHAT_MODE_LOCAL = 'local'

export const CHAT_STORAGE_KEYS = Object.freeze({
  mode: 'yl_chat_mode',
  localUrl: 'yl_chat_local_url',
  secret: 'yl_chat_local_secret',
  token: 'yl_chat_local_token',
  username: 'yl_chat_local_username'
})

export const DEFAULT_CHAT_CONFIG = Object.freeze({
  mode: CHAT_MODE_ONLINE,
  localUrl: '',
  secret: '',
  token: '',
  username: ''
})

export function normalizeChatMode(mode) {
  return mode === CHAT_MODE_LOCAL ? CHAT_MODE_LOCAL : CHAT_MODE_ONLINE
}

export function normalizeLocalUrl(value) {
  const raw = String(value || '').trim()
  if (!raw) return ''

  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(raw) ? raw : `http://${raw}`
  let parsed
  try {
    parsed = new URL(candidate)
  } catch (_) {
    throw new Error('请输入有效的本地服务地址')
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('本地服务地址仅支持 HTTP 或 HTTPS')
  }

  parsed.search = ''
  parsed.hash = ''
  const pathname = parsed.pathname.replace(/\/+$/, '')
  return `${parsed.origin}${pathname === '/' ? '' : pathname}`
}

export function normalizeChatConfig(config = {}) {
  return {
    mode: normalizeChatMode(config.mode),
    localUrl: normalizeLocalUrl(config.localUrl),
    secret: String(config.secret || '').trim(),
    token: String(config.token || '').trim(),
    username: String(config.username || '').trim()
  }
}

export function buildLocalRequestConfig(config, path, options = {}) {
  const normalized = normalizeChatConfig(config)
  if (!normalized.localUrl) throw new Error('请先配置本地聊天服务地址')

  const requestPath = `/${String(path || '').replace(/^\/+/, '')}`
  const header = { 'Content-Type': 'application/json' }
  if (options.includeToken !== false && normalized.token) {
    header.Authorization = `Bearer ${normalized.token}`
  }
  if (normalized.secret) header['X-Secret'] = normalized.secret

  return {
    url: normalized.localUrl + requestPath,
    method: options.method || 'GET',
    data: options.data || {},
    header,
    timeout: options.timeout || 15000
  }
}

function resolveStorage(storage) {
  if (storage?.getStorageSync && storage?.setStorageSync && storage?.removeStorageSync) return storage
  if (globalThis.uni?.getStorageSync) return globalThis.uni
  if (globalThis.localStorage) {
    return {
      getStorageSync: (key) => globalThis.localStorage.getItem(key) || '',
      setStorageSync: (key, value) => globalThis.localStorage.setItem(key, String(value ?? '')),
      removeStorageSync: (key) => globalThis.localStorage.removeItem(key)
    }
  }
  throw new Error('当前环境不支持聊天配置存储')
}

export function getChatConfig(storage) {
  const target = resolveStorage(storage)
  return normalizeChatConfig({
    mode: target.getStorageSync(CHAT_STORAGE_KEYS.mode),
    localUrl: target.getStorageSync(CHAT_STORAGE_KEYS.localUrl),
    secret: target.getStorageSync(CHAT_STORAGE_KEYS.secret),
    token: target.getStorageSync(CHAT_STORAGE_KEYS.token),
    username: target.getStorageSync(CHAT_STORAGE_KEYS.username)
  })
}

export function saveChatConfig(config, storage) {
  const target = resolveStorage(storage)
  const previous = getChatConfig(target)
  const normalized = normalizeChatConfig({ ...previous, ...config })
  if (normalized.localUrl !== previous.localUrl || normalized.secret !== previous.secret) {
    normalized.token = ''
  }
  Object.entries(CHAT_STORAGE_KEYS).forEach(([field, key]) => {
    target.setStorageSync(key, normalized[field])
  })
  return normalized
}

export function setLocalChatToken(token, storage) {
  resolveStorage(storage).setStorageSync(CHAT_STORAGE_KEYS.token, String(token || '').trim())
}

export function clearLocalChatToken(storage) {
  resolveStorage(storage).removeStorageSync(CHAT_STORAGE_KEYS.token)
}
