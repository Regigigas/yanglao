import storage from './storage'

const CONFIG_KEY = 'funeral_storage_config'

export const FUNERAL_STORAGE_LOCATIONS = [
  {
    id: 'documents',
    label: '公共文档目录',
    description: '便于通过文件管理器查找和备份',
    virtualRoot: '_documents',
    fileSystem: 'PUBLIC_DOCUMENTS',
    defaultFolder: '养老护理/白事材料'
  },
  {
    id: 'downloads',
    label: '公共下载目录',
    description: '便于连接电脑后集中导出',
    virtualRoot: '_downloads',
    fileSystem: 'PUBLIC_DOWNLOADS',
    defaultFolder: '养老护理/白事材料'
  },
  {
    id: 'private',
    label: '应用专用目录',
    description: '仅应用可管理，隐私性更高',
    virtualRoot: '_doc',
    fileSystem: 'PRIVATE_DOC',
    defaultFolder: 'funeral-materials'
  }
]

const DEFAULT_CONFIG = {
  location: 'documents',
  folder: '养老护理/白事材料',
  quality: 70,
  resolvedPath: ''
}

function normalizeFolder(value, fallback) {
  const segments = String(value || '')
    .replace(/\\/g, '/')
    .split('/')
    .map((item) => item.trim().replace(/[<>:"|?*]/g, ''))
    .filter((item) => item && item !== '.' && item !== '..')
  return segments.join('/') || fallback
}

export function getStorageLocation(locationId) {
  return FUNERAL_STORAGE_LOCATIONS.find((item) => item.id === locationId) || FUNERAL_STORAGE_LOCATIONS[0]
}

export function normalizeFuneralStorageConfig(input = {}) {
  const location = getStorageLocation(input.location)
  const quality = Number(input.quality)
  return {
    location: location.id,
    folder: normalizeFolder(input.folder, location.defaultFolder),
    quality: Number.isInteger(quality) && quality >= 40 && quality <= 90 ? quality : DEFAULT_CONFIG.quality,
    resolvedPath: String(input.resolvedPath || '')
  }
}

export function getFuneralStorageConfig() {
  return normalizeFuneralStorageConfig(storage.get(CONFIG_KEY, DEFAULT_CONFIG))
}

export function saveFuneralStorageConfig(config) {
  const normalized = normalizeFuneralStorageConfig(config)
  storage.set(CONFIG_KEY, normalized)
  return normalized
}

export function sanitizeFileSegment(value) {
  return String(value || '')
    .trim()
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 60) || '未命名档案'
}

export function getConfiguredStoragePath(config = getFuneralStorageConfig(), caseFolder = '') {
  const normalized = normalizeFuneralStorageConfig(config)
  const location = getStorageLocation(normalized.location)
  const suffix = caseFolder ? `/${sanitizeFileSegment(caseFolder)}` : ''
  return `${location.virtualRoot}/${normalized.folder}${suffix}`
}

function getDirectory(root, path) {
  return path.split('/').filter(Boolean).reduce((promise, segment) => promise.then((parent) => new Promise((resolve, reject) => {
    parent.getDirectory(segment, { create: true }, resolve, reject)
  })), Promise.resolve(root))
}

function requestAppDirectory(config, caseFolder = '') {
  const location = getStorageLocation(config.location)
  const folder = caseFolder ? `${config.folder}/${sanitizeFileSegment(caseFolder)}` : config.folder
  return new Promise((resolve, reject) => {
    plus.io.requestFileSystem(plus.io[location.fileSystem], (fileSystem) => {
      getDirectory(fileSystem.root, folder).then(resolve).catch(reject)
    }, reject)
  })
}

function absolutePath(localPath) {
  if (typeof plus === 'undefined' || !plus.io) return localPath
  try {
    return plus.io.convertLocalFileSystemURL(localPath)
  } catch (_) {
    return localPath
  }
}

export async function prepareFuneralStorageDirectory(config = getFuneralStorageConfig()) {
  const normalized = normalizeFuneralStorageConfig(config)
  if (typeof plus === 'undefined' || !plus.io) {
    const path = getConfiguredStoragePath(normalized)
    return { localPath: path, absolutePath: path, persistent: false }
  }
  const directory = await requestAppDirectory(normalized)
  const localPath = directory.toLocalURL()
  return { localPath, absolutePath: absolutePath(localPath), persistent: true }
}

function compressImage(src, quality) {
  return new Promise((resolve, reject) => {
    uni.compressImage({ src, quality, success: (result) => resolve(result.tempFilePath), fail: reject })
  })
}

function getFileSize(filePath) {
  return new Promise((resolve) => {
    if (typeof uni.getFileInfo !== 'function') return resolve(0)
    uni.getFileInfo({ filePath, success: (result) => resolve(result.size || 0), fail: () => resolve(0) })
  })
}

function extensionOf(filePath) {
  const match = String(filePath).split('?')[0].match(/\.(jpe?g|png|webp)$/i)
  return match ? `.${match[1].toLowerCase()}` : '.jpg'
}

function copyAppFile(sourcePath, directory, fileName) {
  return new Promise((resolve, reject) => {
    plus.io.resolveLocalFileSystemURL(sourcePath, (sourceEntry) => {
      sourceEntry.copyTo(directory, fileName, resolve, reject)
    }, reject)
  })
}

function saveWithUni(sourcePath) {
  if (typeof uni.saveFile !== 'function') {
    return Promise.resolve({ localPath: sourcePath, absolutePath: sourcePath, persistent: false })
  }
  return new Promise((resolve) => {
    uni.saveFile({
      tempFilePath: sourcePath,
      success: ({ savedFilePath }) => resolve({ localPath: savedFilePath, absolutePath: savedFilePath, persistent: true }),
      fail: () => resolve({ localPath: sourcePath, absolutePath: sourcePath, persistent: false })
    })
  })
}

export async function saveFuneralProofImage(sourcePath, caseFolder, originalSize = 0, config = getFuneralStorageConfig()) {
  const normalized = normalizeFuneralStorageConfig(config)
  const compressedPath = await compressImage(sourcePath, normalized.quality)
  const compressedSize = await getFileSize(compressedPath)
  const fileName = `proof_${Date.now()}_${Math.random().toString(36).slice(2, 7)}${extensionOf(compressedPath)}`

  let saved
  if (typeof plus !== 'undefined' && plus.io) {
    const directory = await requestAppDirectory(normalized, caseFolder)
    const entry = await copyAppFile(compressedPath, directory, fileName)
    const localPath = entry.toLocalURL()
    saved = { localPath, absolutePath: absolutePath(localPath), persistent: true }
  } else {
    saved = await saveWithUni(compressedPath)
  }

  return {
    ...saved,
    originalSize: Number(originalSize) || 0,
    compressedSize,
    quality: normalized.quality
  }
}

export function deleteFuneralProofImage(filePath) {
  if (!filePath || typeof plus === 'undefined' || !plus.io) return Promise.resolve()
  return new Promise((resolve) => {
    plus.io.resolveLocalFileSystemURL(filePath, (entry) => entry.remove(resolve, resolve), resolve)
  })
}
