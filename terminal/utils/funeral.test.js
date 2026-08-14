import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  completeFuneralCareTask,
  calculateFuneralProfit,
  centToChineseUppercase,
  centToYuan,
  convertFuneralFinanceYuanToCent,
  createFuneralCase,
  funeralProgress,
  getFuneralCareTasks,
  getFuneralCase,
  getFuneralPurchaseItems,
  missingArchiveLinkTasks,
  missingPreviousFuneralSteps,
  saveFuneralCase,
  setFuneralLinkTask,
  setFuneralStep,
  yuanToCent
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
  it('计算初始成本、补录成本、预估利润和真实利润', () => {
    expect(calculateFuneralProfit({ amountUnit: 'cent', estimatedRevenue: 100000, actualRevenue: 90000, initialCost: 30000, intermediateCosts: [{ name: '运输', amount: 12000 }] })).toMatchObject({ totalCost: '42000', estimatedProfit: '58000', actualProfit: '48000' })
  })
  it('收入未录入时不应误算为亏损，并保留明确录入的零收入', () => {
    expect(calculateFuneralProfit({ amountUnit: 'cent', initialCost: 30000 })).toMatchObject({ estimatedProfit: null, actualProfit: null })
    expect(calculateFuneralProfit({ amountUnit: 'cent', actualRevenue: 0, initialCost: 30000 })).toMatchObject({ hasActualRevenue: true, actualProfit: '-30000' })
  })
  it('界面元与存储分之间准确转换，并兼容旧的元数据', () => {
    expect(yuanToCent('12.34')).toBe('1234')
    expect(centToYuan(1234)).toBe('12.34')
    expect(convertFuneralFinanceYuanToCent({ estimatedRevenue: '99.99', initialCost: '12.34', intermediateCosts: [{ amount: '0.10' }] })).toMatchObject({ amountUnit: 'cent', estimatedRevenue: '9999', initialCost: '1234', intermediateCosts: [{ amount: '10' }] })
    expect(calculateFuneralProfit({ estimatedRevenue: 100, initialCost: 20 })).toMatchObject({ amountUnit: 'cent', estimatedRevenue: '10000', totalCost: '2000', estimatedProfit: '8000' })
  })
  it('支持超过安全整数的金额计算和人民币大写转换', () => {
    const result = calculateFuneralProfit({ amountUnit: 'cent', estimatedRevenue: '900719925474099312345', initialCost: '12345', intermediateCosts: [{ amount: '55' }] })
    expect(result.estimatedProfit).toBe('900719925474099299945')
    expect(centToChineseUppercase('123456789')).toBe('人民币壹佰贰拾叁万肆仟伍佰陆拾柒元捌角玖分')
    expect(centToChineseUppercase('-100005')).toBe('人民币负壹仟元零伍分')
  })
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

  it('流程必须按顺序完成，撤销前序步骤时同步撤销后续步骤', () => {
    let record = createFuneralCase({ deceasedName: '顺序测试' }, 1)
    expect(missingPreviousFuneralSteps(record, 'transfer').map((step) => step.id)).toEqual(['register', 'family'])

    record = setFuneralStep(record, 'register', true, 2)
    record = setFuneralStep(record, 'family', true, 3)
    record = setFuneralStep(record, 'transfer', true, 4)
    expect(missingPreviousFuneralSteps(record, 'transfer')).toEqual([])

    record = setFuneralStep(record, 'family', false, 5)
    expect(record.steps.find((step) => step.id === 'register').completed).toBe(true)
    expect(record.steps.find((step) => step.id === 'family').completed).toBe(false)
    expect(record.steps.find((step) => step.id === 'transfer').completed).toBe(false)
    expect(record.status).toBe('processing')
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
