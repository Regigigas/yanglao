import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  completeFuneralCareTask,
  createFuneralCase,
  funeralProgress,
  getFuneralCareTasks,
  getFuneralCase,
  getFuneralPurchaseItems,
  missingArchiveLinkTasks,
  saveFuneralCase,
  setFuneralLinkTask,
  setFuneralStep
} from './funeral'
import { getConfiguredStoragePath, normalizeFuneralStorageConfig, sanitizeFileSegment } from './funeral-storage'

beforeEach(() => {
  const values = new Map()
  globalThis.uni = {
    setStorageSync: vi.fn((key, value) => values.set(key, value)),
    getStorageSync: vi.fn((key) => values.get(key) ?? ''),
    removeStorageSync: vi.fn((key) => values.delete(key)),
    clearStorageSync: vi.fn(() => values.clear())
  }
})

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
    expect(record.linkTasks).toHaveLength(5)
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

  it('归档前要求必需联动事项完成', () => {
    let record = createFuneralCase({ deceasedName: '王五' }, 1)
    expect(missingArchiveLinkTasks(record).map((task) => task.id)).toEqual([
      'care-stop',
      'health-close',
      'device-release',
      'fee-settlement'
    ])

    record = setFuneralLinkTask(record, 'care-stop', true, 2)
    expect(missingArchiveLinkTasks(record).map((task) => task.id)).toEqual([
      'health-close',
      'device-release',
      'fee-settlement'
    ])
  })

  it('护理任务完成后回写白事联动事项', () => {
    const record = saveFuneralCase(createFuneralCase({ deceasedName: '赵六', roomNo: '302-A' }, 10))
    const tasks = getFuneralCareTasks().filter((item) => item.funeralCaseId === record.id)
    const task = tasks.find((item) => item.funeralLinkTaskId === 'care-stop')

    expect(tasks).toHaveLength(1)
    expect(task.status).toBe('pending')
    expect(task.elderlyName).toBe('赵六')

    completeFuneralCareTask(task.taskId, 20)

    const updated = getFuneralCareTasks().find((item) => item.taskId === task.taskId)
    expect(updated.status).toBe('done')
  })

  it('提供白事采购默认清单副本', () => {
    const items = getFuneralPurchaseItems()
    items[0].itemName = '已修改'
    expect(getFuneralPurchaseItems()[0].itemName).toBe('白事资料袋')
  })

  it('读取历史档案时补齐联动事项且保留原状态', () => {
    uni.setStorageSync('yl_funeral_cases', JSON.stringify([{
      id: 'legacy-case',
      deceasedName: '历史档案',
      status: 'processing',
      steps: [],
      proofs: [],
      linkTasks: [{ id: 'care-stop', completed: true, completedAt: '2026-08-10T08:00:00.000Z' }]
    }]))

    const record = getFuneralCase('legacy-case')
    expect(record.linkTasks).toHaveLength(5)
    expect(record.linkTasks.find((task) => task.id === 'care-stop')).toMatchObject({
      completed: true,
      completedAt: '2026-08-10T08:00:00.000Z'
    })
    expect(record.linkTasks.find((task) => task.id === 'health-close').completed).toBe(false)
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
