// packages/core/src/utils/format.ts
// 数据格式化工具

/** 格式化金额（单位分 → 元） */
export const formatYuan = (fen: number): string =>
  (fen / 100).toFixed(2)

/** 格式化年龄（根据出生年月日计算） */
export const calcAge = (birthDate: string | Date): number => {
  const birth = new Date(birthDate)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}

/** 文件大小格式化 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}

/** 手机号脱敏 */
export const maskPhone = (phone: string): string =>
  phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')

/** 身份证脱敏 */
export const maskIdCard = (id: string): string =>
  id.replace(/(\d{6})\d{8}(\w{4})/, '$1********$2')
