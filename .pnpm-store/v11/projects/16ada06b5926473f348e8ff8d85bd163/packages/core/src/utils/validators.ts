// packages/core/src/utils/validators.ts
// 常用校验工具（使用 zod）

import { z } from 'zod'

export const phoneSchema = z
  .string()
  .regex(/^1[3-9]\d{9}$/, '手机号格式不正确')

export const idCardSchema = z
  .string()
  .regex(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, '身份证号格式不正确')

export const emailSchema = z.string().email('邮箱格式不正确')

export const urlSchema = z.string().url('URL格式不正确')

/** 通用校验帮助函数：返回 [boolean, errorMessage?] */
export const validate = <T>(
  schema: z.ZodType<T>,
  value: unknown
): [boolean, string?] => {
  const result = schema.safeParse(value)
  if (result.success) return [true]
  return [false, result.error.issues[0]?.message]
}
