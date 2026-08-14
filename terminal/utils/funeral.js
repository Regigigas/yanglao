import storage from './storage'
import Big from 'big.js'

const CASES_KEY = 'funeral_cases'

export const FUNERAL_LINK_TASKS = [
  {
    id: 'care-stop',
    module: 'care',
    title: '护理任务交接',
    description: '暂停逝者日常护理任务，补齐末次护理记录和交接说明。',
    requiredBeforeArchive: true
  },
  {
    id: 'health-close',
    module: 'health',
    title: '健康监测停采',
    description: '停止健康监测采集，确认未处理告警已关闭或转入备注。',
    requiredBeforeArchive: true
  },
  {
    id: 'device-release',
    module: 'device',
    title: '床位与设备释放',
    description: '解绑床旁设备、清点床位物品，并将床位状态交由入住管理更新。',
    requiredBeforeArchive: true
  },
  {
    id: 'funeral-purchase',
    module: 'purchase',
    title: '白事物资申领',
    description: '按家属意愿申领或采购寿衣、鲜花、资料袋等白事物资。',
    requiredBeforeArchive: false
  },
  {
    id: 'fee-settlement',
    module: 'fee',
    title: '费用结算确认',
    description: '核对入住押金、护理费用和白事代办费用，完成家属签字确认。',
    requiredBeforeArchive: true
  }
]

export const FUNERAL_PURCHASE_ITEMS = [
  { itemName: '白事资料袋', quantity: 1, unit: '套', remark: '证明材料、交接清单归档使用' },
  { itemName: '鲜花/告别布置用品', quantity: 1, unit: '套', remark: '按家属意愿调整规格' },
  { itemName: '遗物封存袋', quantity: 2, unit: '个', remark: '个人物品清点交接使用' }
]

export const FUNERAL_STEPS = [
  {
    id: 'register',
    title: '建立档案与死亡确认',
    description: '核对逝者信息，取得医疗卫生机构或公安机关出具的死亡证明。'
  },
  {
    id: 'family',
    title: '联系家属与事项确认',
    description: '确认经办家属、联系方式、治丧意愿和服务事项。'
  },
  {
    id: 'transfer',
    title: '遗体交接与殡仪预约',
    description: '办理遗体交接，联系殡仪馆并记录接运、存放或火化安排。'
  },
  {
    id: 'settlement',
    title: '物品交接与费用结算',
    description: '清点个人物品，完成机构费用核对及家属签字确认。'
  },
  {
    id: 'archive',
    title: '注销与资料归档',
    description: '完成床位、照护档案等内部注销，收齐火化或安葬材料后归档。'
  }
]

export const FUNERAL_PROOF_TYPES = [
  { id: 'death-certificate', label: '死亡证明', required: true, stepId: 'register' },
  { id: 'deceased-identity', label: '逝者身份证明', required: true, stepId: 'register' },
  { id: 'family-confirmation', label: '家属确认材料', required: true, stepId: 'family' },
  { id: 'handover', label: '遗体交接确认单', required: true, stepId: 'transfer' },
  { id: 'cremation-confirmation', label: '火化确认书', required: false, stepId: 'transfer' },
  { id: 'cremation-certificate', label: '火化证明', required: false, stepId: 'archive' },
  { id: 'item-list', label: '物品交接清单', required: true, stepId: 'settlement' },
  { id: 'settlement', label: '费用结算单', required: true, stepId: 'settlement' },
  { id: 'burial-certificate', label: '安葬相关证明', required: false, stepId: 'archive' },
  { id: 'other', label: '其他材料', required: false, stepId: 'archive' }
]

function createLinkTasks(timestamp) {
  const createdAt = new Date(timestamp).toISOString()
  return FUNERAL_LINK_TASKS.map((task) => ({
    ...task,
    completed: false,
    completedAt: '',
    createdAt
  }))
}

function normalizeLinkTasks(record) {
  const source = Array.isArray(record?.linkTasks) ? record.linkTasks : []
  return FUNERAL_LINK_TASKS.map((task) => {
    const saved = source.find((item) => item.id === task.id) || {}
    return {
      ...task,
      completed: Boolean(saved.completed),
      completedAt: saved.completedAt || '',
      createdAt: saved.createdAt || record?.createdAt || ''
    }
  })
}

function normalizeRecord(record) {
  if (!record || typeof record !== 'object') return record
  return {
    ...record,
    steps: Array.isArray(record.steps) ? record.steps : FUNERAL_STEPS.map((step) => ({ ...step, completed: false, completedAt: '' })),
    proofs: Array.isArray(record.proofs) ? record.proofs : [],
    linkTasks: normalizeLinkTasks(record),
    finance: normalizeFuneralFinance(record.finance)
  }
}

function bigValue(value) {
  try { return new Big(value === '' || value === null || value === undefined ? 0 : value) } catch (_) { return new Big(0) }
}

function cents(value) {
  const amount = bigValue(value)
  return amount.gte(0) ? amount.round(0, Big.roundHalfUp).toFixed(0) : '0'
}

function hasMoneyValue(value) {
  if (value === '' || value === null || value === undefined) return false
  try { return new Big(value).gte(0) } catch (_) { return false }
}

export function normalizeFuneralFinance(finance = {}) {
  const isCent = finance?.amountUnit === 'cent'
  const toCent = (value) => isCent ? cents(value) : yuanToCent(value)
  const intermediateCosts = Array.isArray(finance?.intermediateCosts)
    ? finance.intermediateCosts.map((item, index) => ({
      id: item.id || `supplement-${index}`,
      name: String(item.name || '').trim(),
      amount: toCent(item.amount),
      occurredAt: String(item.occurredAt || ''),
      status: 'supplemented',
      createdAt: String(item.createdAt || item.updatedAt || ''),
      updatedAt: String(item.updatedAt || item.createdAt || '')
    }))
    : []
  return {
    amountUnit: 'cent',
    estimatedRevenue: toCent(finance?.estimatedRevenue),
    actualRevenue: toCent(finance?.actualRevenue),
    hasEstimatedRevenue: typeof finance?.hasEstimatedRevenue === 'boolean' ? finance.hasEstimatedRevenue : hasMoneyValue(finance?.estimatedRevenue),
    hasActualRevenue: typeof finance?.hasActualRevenue === 'boolean' ? finance.hasActualRevenue : hasMoneyValue(finance?.actualRevenue),
    initialCost: toCent(finance?.initialCost),
    intermediateCosts
  }
}

export function yuanToCent(value) {
  if (!hasMoneyValue(value)) return '0'
  return new Big(value).times(100).round(0, Big.roundHalfUp).toFixed(0)
}

export function isValidYuanAmount(value, allowEmpty = false) {
  if (value === '' || value === null || value === undefined) return allowEmpty
  return /^\d+(\.\d{1,2})?$/.test(String(value).trim())
}

export function centToYuan(value) {
  return bigValue(value).div(100).toFixed(2)
}

export function addCentAmounts(...values) {
  return values.reduce((total, value) => total.plus(bigValue(value)), new Big(0)).toFixed(0)
}

export function centToChineseUppercase(value) {
  const amount = bigValue(value).round(0, Big.roundHalfUp)
  const negative = amount.lt(0)
  const absolute = amount.abs()
  const yuan = absolute.div(100).round(0, Big.roundDown).toFixed(0)
  const remainder = Number(absolute.mod(100).toFixed(0))
  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const smallUnits = ['', '拾', '佰', '仟']
  const sectionUnits = ['', '万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载']

  function sectionText(section) {
    let result = ''
    let zero = false
    for (let index = 3; index >= 0; index -= 1) {
      const divisor = 10 ** index
      const digit = Math.floor(section / divisor) % 10
      if (digit) {
        if (zero && result) result += digits[0]
        result += digits[digit] + smallUnits[index]
        zero = false
      } else if (result) zero = true
    }
    return result
  }

  const sections = []
  for (let end = yuan.length; end > 0; end -= 4) sections.unshift(Number(yuan.slice(Math.max(0, end - 4), end)))
  let integerText = ''
  let pendingZero = false
  sections.forEach((section, index) => {
    const unitIndex = sections.length - index - 1
    if (!section) {
      if (integerText) pendingZero = true
      return
    }
    if (integerText && (pendingZero || section < 1000)) integerText += digits[0]
    integerText += sectionText(section) + (sectionUnits[unitIndex] ?? `10^${unitIndex * 4}`)
    pendingZero = false
  })
  if (!integerText) integerText = digits[0]

  const jiao = Math.floor(remainder / 10)
  const fen = remainder % 10
  let decimalText = ''
  if (jiao) decimalText += `${digits[jiao]}角`
  if (!jiao && fen) decimalText += digits[0]
  if (fen) decimalText += `${digits[fen]}分`
  if (!decimalText) decimalText = '整'
  return `人民币${negative ? '负' : ''}${integerText}元${decimalText}`
}

export function convertFuneralFinanceYuanToCent(finance = {}) {
  return {
    ...finance,
    amountUnit: 'cent',
    estimatedRevenue: yuanToCent(finance.estimatedRevenue),
    actualRevenue: yuanToCent(finance.actualRevenue),
    initialCost: yuanToCent(finance.initialCost),
    intermediateCosts: Array.isArray(finance.intermediateCosts)
      ? finance.intermediateCosts.map((item) => ({ ...item, amount: yuanToCent(item.amount) }))
      : []
  }
}

export function calculateFuneralProfit(finance) {
  const normalized = normalizeFuneralFinance(finance)
  const intermediateCost = addCentAmounts(...normalized.intermediateCosts.map((item) => item.amount))
  const totalCost = addCentAmounts(normalized.initialCost, intermediateCost)
  return {
    ...normalized,
    intermediateCost,
    totalCost,
    estimatedProfit: normalized.hasEstimatedRevenue ? new Big(normalized.estimatedRevenue).minus(totalCost).toFixed(0) : null,
    actualProfit: normalized.hasActualRevenue ? new Big(normalized.actualRevenue).minus(totalCost).toFixed(0) : null
  }
}

function pad(value) {
  return String(value).padStart(2, '0')
}

function createCaseNo(date) {
  return `BS${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
}

export function createFuneralCase(input, timestamp = Date.now()) {
  const now = new Date(timestamp)
  const iso = now.toISOString()
  const folkCustomEnabled = Boolean(input.folkCustomEnabled)

  return {
    id: `funeral-${timestamp}`,
    caseNo: createCaseNo(now),
    deceasedName: String(input.deceasedName || '').trim(),
    roomNo: String(input.roomNo || '').trim(),
    deathDate: String(input.deathDate || '').trim(),
    deathTime: String(input.deathTime || '').trim(),
    responsible: String(input.responsible || '').trim(),
    familyContact: String(input.familyContact || '').trim(),
    familyPhone: String(input.familyPhone || '').trim(),
    remark: String(input.remark || '').trim(),
    folkCustomEnabled,
    folkCustom: folkCustomEnabled ? {
      birthDate: String(input.birthDate || '').trim(),
      birthTime: String(input.birthTime || '').trim(),
      lunarBirth: String(input.lunarBirth || '').trim(),
      eightCharacters: String(input.eightCharacters || '').trim(),
      notes: String(input.folkCustomNotes || '').trim()
    } : null,
    status: 'processing',
    steps: FUNERAL_STEPS.map((step) => ({ ...step, completed: false, completedAt: '' })),
    proofs: [],
    linkTasks: createLinkTasks(timestamp),
    finance: normalizeFuneralFinance(),
    createdAt: iso,
    updatedAt: iso
  }
}

export function funeralProgress(record) {
  const steps = Array.isArray(record?.steps) ? record.steps : []
  if (!steps.length) return 0
  return Math.round((steps.filter((step) => step.completed).length / steps.length) * 100)
}

export function setFuneralStep(record, stepId, completed, timestamp = Date.now()) {
  const updatedAt = new Date(timestamp).toISOString()
  const current = normalizeRecord(record)
  const targetIndex = current.steps.findIndex((step) => step.id === stepId)
  const steps = current.steps.map((step, index) => {
    if (index === targetIndex) return { ...step, completed, completedAt: completed ? updatedAt : '' }
    if (!completed && targetIndex >= 0 && index > targetIndex) {
      return { ...step, completed: false, completedAt: '' }
    }
    return step
  })
  const status = steps.every((step) => step.completed) ? 'completed' : 'processing'
  return { ...current, steps, status, updatedAt }
}

export function missingPreviousFuneralSteps(record, stepId) {
  const current = normalizeRecord(record)
  const targetIndex = current.steps.findIndex((step) => step.id === stepId)
  if (targetIndex <= 0) return []
  return current.steps.slice(0, targetIndex).filter((step) => !step.completed)
}

export function setFuneralLinkTask(record, taskId, completed, timestamp = Date.now()) {
  const updatedAt = new Date(timestamp).toISOString()
  const current = normalizeRecord(record)
  const linkTasks = current.linkTasks.map((task) => task.id === taskId
    ? { ...task, completed, completedAt: completed ? updatedAt : '' }
    : task)
  return { ...current, linkTasks, updatedAt }
}

export function missingArchiveLinkTasks(record) {
  const current = normalizeRecord(record)
  return current.linkTasks.filter((task) => task.requiredBeforeArchive && !task.completed)
}

export function getFuneralCareTasks() {
  return getFuneralCases()
    .filter((record) => record.status !== 'completed')
    .flatMap((record) => record.linkTasks
      .filter((task) => task.module === 'care')
      .map((task) => ({
      taskId: `funeral:${record.id}:${task.id}`,
      funeralCaseId: record.id,
      funeralLinkTaskId: task.id,
      taskName: task.title,
      elderlyName: record.deceasedName,
      planTime: [record.deathDate, record.deathTime].filter(Boolean).join(' ') || record.createdAt?.slice(0, 16) || '',
      remark: `${task.description}${record.roomNo ? `（房间/床位：${record.roomNo}）` : ''}`,
      status: task.completed ? 'done' : 'pending',
      source: 'funeral'
      })))
}

export function completeFuneralCareTask(taskId, timestamp = Date.now()) {
  const [, caseId, linkTaskId] = String(taskId || '').split(':')
  const record = getFuneralCase(caseId)
  if (!record || !linkTaskId) return null
  return saveFuneralCase(setFuneralLinkTask(record, linkTaskId, true, timestamp))
}

export function getFuneralPurchaseItems() {
  return FUNERAL_PURCHASE_ITEMS.map((item) => ({ ...item }))
}

export function getFuneralCases() {
  const records = storage.get(CASES_KEY, [])
  return Array.isArray(records) ? records.map(normalizeRecord) : []
}

export function getFuneralCase(id) {
  return getFuneralCases().find((record) => record.id === id) || null
}

export function saveFuneralCase(record) {
  const records = getFuneralCases()
  const index = records.findIndex((item) => item.id === record.id)
  const next = normalizeRecord({ ...record, updatedAt: new Date().toISOString() })
  if (index >= 0) records.splice(index, 1, next)
  else records.unshift(next)
  storage.set(CASES_KEY, records)
  return next
}
