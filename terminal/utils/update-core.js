export function compareVersions(left, right) {
  const normalize = (value) => String(value || '0')
    .split(/[.-]/)
    .map(part => (/^\d+$/.test(part) ? Number(part) : part.toLowerCase()))
  const leftParts = normalize(left)
  const rightParts = normalize(right)
  const length = Math.max(leftParts.length, rightParts.length)
  for (let index = 0; index < length; index += 1) {
    const leftPart = leftParts[index] ?? 0
    const rightPart = rightParts[index] ?? 0
    if (leftPart === rightPart) continue
    if (typeof leftPart === 'number' && typeof rightPart === 'number') return leftPart > rightPart ? 1 : -1
    if (typeof leftPart === 'number') return 1
    if (typeof rightPart === 'number') return -1
    return leftPart > rightPart ? 1 : -1
  }
  return 0
}

export function parseUpdateUrl(value, label = '更新地址') {
  const text = String(value || '').trim()
  if (!text) throw new Error(`请输入${label}`)
  let parsed
  try {
    parsed = new URL(text)
  } catch (_) {
    throw new Error(`${label}格式不正确`)
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error(`${label}仅支持 HTTP 或 HTTPS`)
  const hostname = parsed.hostname.toLowerCase()
  const privateAddress = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
    || hostname.endsWith('.local') || /^10\./.test(hostname) || /^192\.168\./.test(hostname)
    || /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
  if (parsed.protocol === 'http:' && !privateAddress) throw new Error(`${label}在公网环境必须使用 HTTPS`)
  if (parsed.username || parsed.password) throw new Error(`${label}不能包含账号或密码`)
  parsed.hash = ''
  return parsed
}

export function normalizeUpdateResponse(responseData, runtime, sourceUrl) {
  if (!responseData || typeof responseData !== 'object') throw new Error('更新服务返回的数据格式不正确')
  const payload = responseData.data && typeof responseData.data === 'object' ? responseData.data : responseData
  if (payload.available === false || payload.hasUpdate === false || Number(responseData.code) === 0) {
    return { available: false, message: String(payload.message || responseData.msg || '当前已是最新版本') }
  }
  const rawType = String(payload.type || payload.updateType || 'apk').toLowerCase()
  const type = ['wgt', 'hotfix', 'resource'].includes(rawType) ? 'wgt'
    : ['store', 'appstore'].includes(rawType) ? 'store' : 'apk'
  const versionName = String(payload.versionName || payload.version || '').trim()
  const versionCode = Number(payload.versionCode || payload.version_code || 0)
  const newer = type === 'wgt'
    ? compareVersions(versionName, runtime.wgtVersion || runtime.appVersion) > 0
    : versionCode > Number(runtime.versionCode || 0)
  if (!newer) return { available: false, message: '当前已是最新版本' }
  const packageValue = String(payload.downloadUrl || payload.packageUrl || payload.url || payload.storeUrl || '').trim()
  if (!versionName) throw new Error('更新服务未提供版本名称')
  if (type !== 'wgt' && (!Number.isInteger(versionCode) || versionCode <= 0)) throw new Error('更新服务返回的版本号无效')
  if (!packageValue) throw new Error('更新服务未提供安装包地址')
  const packageUrl = parseUpdateUrl(new URL(packageValue, sourceUrl).toString(), '安装包地址').toString()
  const storeValue = String(payload.storeUrl || '').trim()
  const storeUrl = storeValue ? parseUpdateUrl(new URL(storeValue, sourceUrl).toString(), '应用商店地址').toString() : ''
  const sha256 = String(payload.sha256 || '').trim().toLowerCase()
  if (sha256 && !/^[a-f0-9]{64}$/.test(sha256)) throw new Error('更新服务返回的 SHA-256 无效')
  if ((type === 'wgt' || type === 'apk') && !sha256) throw new Error('安装包更新必须提供 SHA-256 校验值')
  return {
    available: true,
    type,
    versionName,
    versionCode,
    title: String(payload.title || `发现新版本 ${versionName}`),
    description: Array.isArray(payload.description) ? payload.description.join('\n') : String(payload.description || ''),
    packageUrl,
    storeUrl,
    size: Math.max(0, Number(payload.size || 0)),
    sha256,
    mandatory: Boolean(payload.mandatory ?? payload.isMandatory),
    publishedAt: String(payload.publishedAt || ''),
    sourceHost: parseUpdateUrl(sourceUrl).host
  }
}
