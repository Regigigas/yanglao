import storage from './storage'

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
    linkTasks: normalizeLinkTasks(record)
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
  const steps = current.steps.map((step) => step.id === stepId
    ? { ...step, completed, completedAt: completed ? updatedAt : '' }
    : step)
  const status = steps.every((step) => step.completed) ? 'completed' : 'processing'
  return { ...current, steps, status, updatedAt }
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
