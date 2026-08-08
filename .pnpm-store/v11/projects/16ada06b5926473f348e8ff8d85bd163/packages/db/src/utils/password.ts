// packages/db/src/utils/password.ts
// 密码哈希工具（Node 内置 crypto.pbkdf2Sync，无需额外原生依赖，与 better-sqlite3 共存无冲突）

import { randomBytes, pbkdf2Sync, timingSafeEqual } from 'crypto'

const ITERATIONS = 100_000
const KEY_LENGTH = 64
const DIGEST = 'sha512'

/** 生成密码哈希（随机 salt + pbkdf2） */
export function hashPassword(plain: string): { salt: string; hash: string } {
  const salt = randomBytes(16).toString('hex')
  const hash = pbkdf2Sync(plain, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex')
  return { salt, hash }
}

/** 校验密码是否匹配（使用 timingSafeEqual 防止时序攻击） */
export function verifyPassword(plain: string, salt: string, expectedHash: string): boolean {
  const actual = pbkdf2Sync(plain, salt, ITERATIONS, KEY_LENGTH, DIGEST)
  const expected = Buffer.from(expectedHash, 'hex')
  if (actual.length !== expected.length) return false
  return timingSafeEqual(actual, expected)
}
