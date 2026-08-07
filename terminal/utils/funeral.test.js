import { describe, expect, it } from 'vitest'
import { createFuneralCase, funeralProgress, setFuneralStep } from './funeral'
import { getConfiguredStoragePath, normalizeFuneralStorageConfig, sanitizeFileSegment } from './funeral-storage'

describe('funeral model', () => {
  it('创建包含标准流程和可选民俗信息的档案', () => {
    const record = createFuneralCase({
      deceasedName: '张三',
      deathDate: '2026-08-06',
      folkCustomEnabled: true,
      lunarBirth: '农历一九四一年正月初一',
      eightCharacters: '家属提供内容'
    }, Date.UTC(2026, 7, 6, 8, 9, 10))

    expect(record.deceasedName).toBe('张三')
    expect(record.steps).toHaveLength(5)
    expect(record.folkCustom.eightCharacters).toBe('家属提供内容')
    expect(funeralProgress(record)).toBe(0)
  })

  it('全部流程完成后自动办结档案', () => {
    let record = createFuneralCase({ deceasedName: '李四' }, 1)
    record.steps.forEach((step, index) => {
      record = setFuneralStep(record, step.id, true, index + 2)
    })
    expect(record.status).toBe('completed')
    expect(funeralProgress(record)).toBe(100)
  })
})

describe('funeral storage config', () => {
  it('限制压缩质量并清理目录名称', () => {
    const config = normalizeFuneralStorageConfig({ location: 'downloads', folder: '../白事:材料', quality: 100 })
    expect(config.folder).toBe('白事材料')
    expect(config.quality).toBe(70)
    expect(getConfiguredStoragePath(config, 'BS01/张三')).toBe('_downloads/白事材料/BS01_张三')
    expect(sanitizeFileSegment('A/B:01')).toBe('A_B_01')
  })
})
