import storage from './storage'

const CASES_KEY = 'funeral_cases'

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
  const steps = record.steps.map((step) => step.id === stepId
    ? { ...step, completed, completedAt: completed ? updatedAt : '' }
    : step)
  const status = steps.every((step) => step.completed) ? 'completed' : 'processing'
  return { ...record, steps, status, updatedAt }
}

export function getFuneralCases() {
  const records = storage.get(CASES_KEY, [])
  return Array.isArray(records) ? records : []
}

export function getFuneralCase(id) {
  return getFuneralCases().find((record) => record.id === id) || null
}

export function saveFuneralCase(record) {
  const records = getFuneralCases()
  const index = records.findIndex((item) => item.id === record.id)
  const next = { ...record, updatedAt: new Date().toISOString() }
  if (index >= 0) records.splice(index, 1, next)
  else records.unshift(next)
  storage.set(CASES_KEY, records)
  return next
}
