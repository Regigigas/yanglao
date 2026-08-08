<script setup lang="ts">
defineOptions({ name: 'BedManage' })

import {
  NAlert,
  NButton,
  NCard,
  NCheckbox,
  NForm,
  NFormItem,
  NGi,
  NGrid,
  NInput,
  NInputNumber,
  NModal,
  NSelect,
  NSpace,
  NTabPane,
  NTabs,
  NTag,
  useDialog,
  useMessage,
} from 'naive-ui'
import { BasePage, BaseTable } from '@yanglao/ui'
import { computed, h, ref, watch } from 'vue'
import type { BedRow, BuildingRow, CorridorRow, RoomRow, RoomTypeRow } from '@yanglao/db'
import { usePageRefresh } from '../../composables/usePageRefresh'
import { useBuildingStore } from '../../stores/building.store'
import Building3DViewer from '../../components/Building3DViewer.vue'

type RoomStatus = RoomRow['status']
type LayoutSide = RoomRow['layout_side']

const store = useBuildingStore()
const message = useMessage()
const dialog = useDialog()

async function loadData() {
  await store.fetchAll()
}
const { refresh, refreshing } = usePageRefresh(loadData)

const selectedBuildingId = ref<string | null>(null)
const filterRoomId = ref<string | null>(null)

const buildingOptions = computed(() =>
  store.buildings.map((item) => ({ label: item.name, value: item.id })),
)
const roomTypeOptions = computed(() =>
  store.roomTypes
    .filter((item) => item.status === 'active')
    .map((item) => ({ label: `${item.name} (${item.default_capacity}床)`, value: item.id })),
)
const corridorOptions = computed(() =>
  store.corridors
    .filter((item) => !selectedBuildingId.value || item.building_id === selectedBuildingId.value)
    .map((item) => ({ label: `${buildingName(item.building_id)} ${item.floor}F · ${item.name}`, value: item.id })),
)
const roomOptions = computed(() =>
  store.rooms.map((item) => ({ label: `${roomLabel(item)} (${item.floor}层)`, value: item.id })),
)
const filteredRooms = computed(() =>
  selectedBuildingId.value ? store.rooms.filter((item) => item.building_id === selectedBuildingId.value) : store.rooms,
)
const filteredBeds = computed(() =>
  filterRoomId.value ? store.beds.filter((item) => item.room_id === filterRoomId.value) : store.beds,
)

const statusOptions = [
  { label: '空闲', value: 'available' },
  { label: '占用', value: 'occupied' },
  { label: '维修中', value: 'maintenance' },
]
const layoutSideOptions = [
  { label: '不区分', value: 'none' },
  { label: '左侧', value: 'left' },
  { label: '右侧', value: 'right' },
]
const generateSideOptions = [
  { label: '不区分', value: 'none' },
  { label: '左侧', value: 'left' },
  { label: '右侧', value: 'right' },
  { label: '左右两侧', value: 'both' },
]
const directionOptions = [
  { label: '东西向', value: 'east_west' },
  { label: '南北向', value: 'north_south' },
]
const roomStatusMap: Record<RoomStatus, { label: string; type: 'success' | 'warning' | 'error' }> = {
  available: { label: '空闲', type: 'success' },
  occupied: { label: '占用', type: 'warning' },
  maintenance: { label: '维修', type: 'error' },
}

function buildingName(id: string) {
  return store.buildings.find((item) => item.id === id)?.name ?? id
}

function roomTypeName(room: Pick<RoomRow, 'room_type' | 'room_type_id'>) {
  return store.roomTypes.find((item) => item.id === room.room_type_id)?.name
    ?? ({ single: '单人间', double: '双人间', triple: '三人间', ward: '多人间/病房' }[room.room_type] ?? room.room_type)
}

function corridorName(id: string | null) {
  if (!id) return '未分区'
  const corridor = store.corridors.find((item) => item.id === id)
  return corridor ? `${corridor.floor}F · ${corridor.name}` : '未分区'
}

function roomLabel(room: RoomRow) {
  const building = store.buildings.find((item) => item.id === room.building_id)?.name
  return `${building ? `${building} ` : ''}${room.room_no}`
}

function applyRoomTypeToRoomForm(roomTypeId: string | null) {
  const type = store.roomTypes.find((item) => item.id === roomTypeId)
  if (!type) return
  roomForm.value.room_type_id = type.id
  roomForm.value.room_type = type.code
  roomForm.value.capacity = type.default_capacity
  roomForm.value.price = type.default_price
}

function applyRoomTypeToGenerate(roomTypeId: string | null) {
  const type = store.roomTypes.find((item) => item.id === roomTypeId)
  if (!type) return
  generateForm.value.room_type_id = type.id
  generateForm.value.room_type = type.code
  generateForm.value.capacity = type.default_capacity
  generateForm.value.price = type.default_price
}

// ── 楼栋 ─────────────────────────────────────────
const showBuildingModal = ref(false)
const buildingForm = ref({ name: '', floors: 1, remark: '' })
const editingBuildingId = ref<string | null>(null)
const savingBuilding = ref(false)

function openNewBuilding() {
  editingBuildingId.value = null
  buildingForm.value = { name: '', floors: 1, remark: '' }
  showBuildingModal.value = true
}

function openEditBuilding(row: BuildingRow) {
  editingBuildingId.value = row.id
  buildingForm.value = { name: row.name, floors: row.floors, remark: row.remark ?? '' }
  showBuildingModal.value = true
}

async function saveBuilding() {
  if (!buildingForm.value.name.trim()) return message.error('请填写楼栋名称')
  if (savingBuilding.value) return
  savingBuilding.value = true
  try {
    if (editingBuildingId.value) {
      await store.updateBuilding(editingBuildingId.value, { ...buildingForm.value, name: buildingForm.value.name.trim() })
    } else {
      await store.createBuilding({ ...buildingForm.value, name: buildingForm.value.name.trim(), sort_order: store.buildings.length })
    }
    showBuildingModal.value = false
    message.success('保存成功')
    await refresh()
  } catch (err) {
    message.error(`保存失败：${err instanceof Error ? err.message : String(err)}`)
  } finally {
    savingBuilding.value = false
  }
}

const buildingColumns = [
  { title: '楼栋名称', key: 'name', width: 150 },
  { title: '楼层数', key: 'floors', width: 100 },
  { title: '备注', key: 'remark', ellipsis: { tooltip: true } },
  {
    title: '操作',
    key: 'actions',
    width: 140,
    render: (row: BuildingRow) => h(NSpace, null, {
      default: () => [
        h(NButton, { size: 'small', onClick: () => openEditBuilding(row) }, '编辑'),
        h(NButton, {
          size: 'small',
          type: 'error',
          onClick: () => dialog.warning({
            title: '确认删除',
            content: `确定删除楼栋 ${row.name}？已有房间不会被物理删除，但会失去楼栋入口。`,
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: async () => {
              await store.deleteBuilding(row.id)
              message.success('删除成功')
              await refresh()
            },
          }),
        }, '删除'),
      ],
    }),
  },
]

// ── 房型 ─────────────────────────────────────────
const showRoomTypeModal = ref(false)
const editingRoomTypeId = ref<string | null>(null)
const savingRoomType = ref(false)
const roomTypeForm = ref({
  code: '',
  name: '',
  default_capacity: 1,
  default_price: 0,
  area: null as number | null,
  has_window: 1 as 0 | 1,
  has_private_bathroom: 0 as 0 | 1,
  care_equipment: '',
  status: 'active' as RoomTypeRow['status'],
  remark: '',
  sort_order: 0,
})

function openNewRoomType() {
  editingRoomTypeId.value = null
  roomTypeForm.value = {
    code: '',
    name: '',
    default_capacity: 1,
    default_price: 0,
    area: null,
    has_window: 1,
    has_private_bathroom: 0,
    care_equipment: '',
    status: 'active',
    remark: '',
    sort_order: store.roomTypes.length + 1,
  }
  showRoomTypeModal.value = true
}

function openEditRoomType(row: RoomTypeRow) {
  editingRoomTypeId.value = row.id
  roomTypeForm.value = {
    code: row.code,
    name: row.name,
    default_capacity: row.default_capacity,
    default_price: row.default_price,
    area: row.area,
    has_window: row.has_window,
    has_private_bathroom: row.has_private_bathroom,
    care_equipment: row.care_equipment ?? '',
    status: row.status,
    remark: row.remark ?? '',
    sort_order: row.sort_order,
  }
  showRoomTypeModal.value = true
}

async function saveRoomType() {
  if (!roomTypeForm.value.name.trim()) return message.error('请填写房型名称')
  if (!roomTypeForm.value.code.trim()) return message.error('请填写房型编码')
  if (savingRoomType.value) return
  savingRoomType.value = true
  try {
    const payload = {
      ...roomTypeForm.value,
      code: roomTypeForm.value.code.trim(),
      name: roomTypeForm.value.name.trim(),
      care_equipment: roomTypeForm.value.care_equipment.trim() || null,
      remark: roomTypeForm.value.remark.trim() || null,
    }
    if (editingRoomTypeId.value) await store.updateRoomType(editingRoomTypeId.value, payload)
    else await store.createRoomType(payload)
    showRoomTypeModal.value = false
    message.success('保存成功')
    await refresh()
  } catch (err) {
    message.error(`保存失败：${err instanceof Error ? err.message : String(err)}`)
  } finally {
    savingRoomType.value = false
  }
}

const roomTypeColumns = [
  { title: '房型', key: 'name', width: 130 },
  { title: '编码', key: 'code', width: 110 },
  { title: '默认床位', key: 'default_capacity', width: 90 },
  { title: '默认价格', key: 'default_price', width: 100 },
  { title: '面积', key: 'area', width: 80, render: (row: RoomTypeRow) => row.area ? `${row.area}㎡` : '—' },
  { title: '设施', key: 'facility', render: (row: RoomTypeRow) => [row.has_window ? '有窗' : '无窗', row.has_private_bathroom ? '独卫' : '公卫', row.care_equipment].filter(Boolean).join(' / ') },
  { title: '状态', key: 'status', width: 90, render: (row: RoomTypeRow) => h(NTag, { type: row.status === 'active' ? 'success' : 'default' }, () => row.status === 'active' ? '启用' : '停用') },
  {
    title: '操作',
    key: 'actions',
    width: 140,
    render: (row: RoomTypeRow) => h(NSpace, null, {
      default: () => [
        h(NButton, { size: 'small', onClick: () => openEditRoomType(row) }, '编辑'),
        h(NButton, {
          size: 'small',
          type: 'error',
          onClick: () => dialog.warning({
            title: '删除房型',
            content: `确定删除 ${row.name}？已引用房间会保留文本类型，并解除房型引用。`,
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: async () => {
              await store.deleteRoomType(row.id)
              message.success('删除成功')
              await refresh()
            },
          }),
        }, '删除'),
      ],
    }),
  },
]

// ── 走廊/分区 ─────────────────────────────────────
const showCorridorModal = ref(false)
const editingCorridorId = ref<string | null>(null)
const savingCorridor = ref(false)
const corridorForm = ref({
  building_id: '',
  floor: 1,
  name: '',
  direction: 'east_west' as CorridorRow['direction'],
  sort_order: 0,
  remark: '',
})

function openNewCorridor() {
  editingCorridorId.value = null
  corridorForm.value = {
    building_id: selectedBuildingId.value ?? store.buildings[0]?.id ?? '',
    floor: 1,
    name: '',
    direction: 'east_west',
    sort_order: store.corridors.length + 1,
    remark: '',
  }
  showCorridorModal.value = true
}

function openEditCorridor(row: CorridorRow) {
  editingCorridorId.value = row.id
  corridorForm.value = {
    building_id: row.building_id,
    floor: row.floor,
    name: row.name,
    direction: row.direction,
    sort_order: row.sort_order,
    remark: row.remark ?? '',
  }
  showCorridorModal.value = true
}

async function saveCorridor() {
  if (!corridorForm.value.building_id) return message.error('请选择所在楼栋')
  if (!corridorForm.value.name.trim()) return message.error('请填写走廊/分区名称')
  if (savingCorridor.value) return
  savingCorridor.value = true
  try {
    const payload = { ...corridorForm.value, name: corridorForm.value.name.trim(), remark: corridorForm.value.remark.trim() || null }
    if (editingCorridorId.value) await store.updateCorridor(editingCorridorId.value, payload)
    else await store.createCorridor(payload)
    showCorridorModal.value = false
    message.success('保存成功')
    await refresh()
  } catch (err) {
    message.error(`保存失败：${err instanceof Error ? err.message : String(err)}`)
  } finally {
    savingCorridor.value = false
  }
}

const corridorColumns = [
  { title: '楼栋', key: 'building_id', width: 120, render: (row: CorridorRow) => buildingName(row.building_id) },
  { title: '楼层', key: 'floor', width: 80 },
  { title: '走廊/分区', key: 'name', width: 140 },
  { title: '方向', key: 'direction', width: 90, render: (row: CorridorRow) => row.direction === 'east_west' ? '东西向' : '南北向' },
  { title: '排序', key: 'sort_order', width: 80 },
  { title: '备注', key: 'remark', ellipsis: { tooltip: true } },
  {
    title: '操作',
    key: 'actions',
    width: 140,
    render: (row: CorridorRow) => h(NSpace, null, {
      default: () => [
        h(NButton, { size: 'small', onClick: () => openEditCorridor(row) }, '编辑'),
        h(NButton, {
          size: 'small',
          type: 'error',
          onClick: () => dialog.warning({
            title: '删除走廊/分区',
            content: '确定删除？已关联房间会自动移到未分区。',
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: async () => {
              await store.deleteCorridor(row.id)
              message.success('删除成功')
              await refresh()
            },
          }),
        }, '删除'),
      ],
    }),
  },
]

// ── 房间 ─────────────────────────────────────────
const showRoomModal = ref(false)
const editingRoomId = ref<string | null>(null)
const savingRoom = ref(false)
const roomForm = ref({
  building_id: '',
  floor: 1,
  corridor_id: null as string | null,
  room_no: '',
  room_type: 'single',
  room_type_id: null as string | null,
  capacity: 1,
  price: 0,
  status: 'available' as RoomStatus,
  layout_side: 'none' as LayoutSide,
  sort_order: 0,
  remark: '',
})

function openNewRoom() {
  editingRoomId.value = null
  const type = store.roomTypes.find((item) => item.status === 'active')
  roomForm.value = {
    building_id: selectedBuildingId.value ?? store.buildings[0]?.id ?? '',
    floor: 1,
    corridor_id: null,
    room_no: '',
    room_type: type?.code ?? 'single',
    room_type_id: type?.id ?? null,
    capacity: type?.default_capacity ?? 1,
    price: type?.default_price ?? 0,
    status: 'available',
    layout_side: 'none',
    sort_order: 0,
    remark: '',
  }
  showRoomModal.value = true
}

function openEditRoom(row: RoomRow) {
  editingRoomId.value = row.id
  roomForm.value = {
    building_id: row.building_id,
    floor: row.floor,
    corridor_id: row.corridor_id,
    room_no: row.room_no,
    room_type: row.room_type,
    room_type_id: row.room_type_id,
    capacity: row.capacity,
    price: row.price,
    status: row.status,
    layout_side: row.layout_side,
    sort_order: row.sort_order,
    remark: row.remark ?? '',
  }
  showRoomModal.value = true
}

async function saveRoom() {
  if (!roomForm.value.building_id) return message.error('请选择所在楼栋')
  if (!roomForm.value.room_no.trim()) return message.error('请填写房间号')
  if (savingRoom.value) return
  savingRoom.value = true
  try {
    const payload = { ...roomForm.value, room_no: roomForm.value.room_no.trim(), remark: roomForm.value.remark.trim() || null }
    if (editingRoomId.value) await store.updateRoom(editingRoomId.value, payload)
    else await store.createRoom(payload)
    showRoomModal.value = false
    message.success('保存成功')
    await refresh()
  } catch (err) {
    message.error(`保存失败：${err instanceof Error ? err.message : String(err)}`)
  } finally {
    savingRoom.value = false
  }
}

const roomColumns = [
  { title: '房间号', key: 'room_no', width: 100 },
  { title: '楼栋', key: 'building_id', width: 110, render: (row: RoomRow) => buildingName(row.building_id) },
  { title: '楼层', key: 'floor', width: 70 },
  { title: '走廊/分区', key: 'corridor_id', width: 130, render: (row: RoomRow) => corridorName(row.corridor_id) },
  { title: '侧位', key: 'layout_side', width: 70, render: (row: RoomRow) => ({ left: '左侧', right: '右侧', none: '—' }[row.layout_side]) },
  { title: '房型', key: 'room_type', width: 120, render: (row: RoomRow) => roomTypeName(row) },
  { title: '床位数', key: 'capacity', width: 80 },
  { title: '月租金', key: 'price', width: 100 },
  { title: '状态', key: 'status', width: 90, render: (row: RoomRow) => h(NTag, { type: roomStatusMap[row.status].type }, () => roomStatusMap[row.status].label) },
  {
    title: '操作',
    key: 'actions',
    width: 140,
    render: (row: RoomRow) => h(NSpace, null, {
      default: () => [
        h(NButton, { size: 'small', onClick: () => openEditRoom(row) }, '编辑'),
        h(NButton, {
          size: 'small',
          type: 'error',
          onClick: () => dialog.warning({
            title: '删除房间',
            content: '确认删除？房间下床位不会被自动删除，请先确认入住联动。',
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: async () => {
              await store.deleteRoom(row.id)
              message.success('删除成功')
              await refresh()
            },
          }),
        }, '删除'),
      ],
    }),
  },
]

// ── 床位 ─────────────────────────────────────────
const showBedModal = ref(false)
const editingBedId = ref<string | null>(null)
const savingBed = ref(false)
const bedForm = ref({ room_id: '', bed_no: '', status: 'available' as BedRow['status'], remark: '' })

function openNewBed() {
  editingBedId.value = null
  bedForm.value = { room_id: filterRoomId.value ?? '', bed_no: '', status: 'available', remark: '' }
  showBedModal.value = true
}

function openEditBed(row: BedRow) {
  editingBedId.value = row.id
  bedForm.value = { room_id: row.room_id, bed_no: row.bed_no, status: row.status, remark: row.remark ?? '' }
  showBedModal.value = true
}

async function saveBed() {
  if (!bedForm.value.room_id) return message.error('请选择所在房间')
  if (!bedForm.value.bed_no.trim()) return message.error('请填写床位号')
  if (savingBed.value) return
  savingBed.value = true
  try {
    const payload = { ...bedForm.value, bed_no: bedForm.value.bed_no.trim(), remark: bedForm.value.remark.trim() || null }
    if (editingBedId.value) await store.updateBed(editingBedId.value, payload)
    else await store.createBed({ ...payload, elderly_id: null })
    showBedModal.value = false
    message.success('保存成功')
    await refresh()
  } catch (err) {
    message.error(`保存失败：${err instanceof Error ? err.message : String(err)}`)
  } finally {
    savingBed.value = false
  }
}

const bedColumns = [
  { title: '床位号', key: 'bed_no', width: 100 },
  { title: '所在房间', key: 'room_id', width: 160, render: (row: BedRow) => {
    const room = store.rooms.find((item) => item.id === row.room_id)
    return room ? roomLabel(room) : row.room_id
  } },
  { title: '状态', key: 'status', width: 90, render: (row: BedRow) => h(NTag, { type: roomStatusMap[row.status].type }, () => roomStatusMap[row.status].label) },
  { title: '备注', key: 'remark', ellipsis: { tooltip: true } },
  {
    title: '操作',
    key: 'actions',
    width: 140,
    render: (row: BedRow) => h(NSpace, null, {
      default: () => [
        h(NButton, { size: 'small', onClick: () => openEditBed(row) }, '编辑'),
        h(NButton, {
          size: 'small',
          type: 'error',
          disabled: row.status === 'occupied',
          onClick: () => dialog.warning({
            title: '删除床位',
            content: '确认删除？已入住床位不能删除。',
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: async () => {
              await store.deleteBed(row.id)
              message.success('删除成功')
              await refresh()
            },
          }),
        }, '删除'),
      ],
    }),
  },
]

// ── 批量生成 ─────────────────────────────────────
const generating = ref(false)
const generateForm = ref({
  building_id: '',
  floor: 1,
  corridor_id: null as string | null,
  side: 'both' as 'left' | 'right' | 'none' | 'both',
  start_no: 101,
  room_count: 6,
  room_prefix: '',
  room_suffix: '',
  number_width: 3,
  room_type_id: null as string | null,
  room_type: 'single',
  capacity: 1,
  price: 0,
  bed_prefix: '',
  bed_style: 'letter' as 'letter' | 'number',
  skip_existing: true,
})

watch(() => generateForm.value.building_id, (buildingId) => {
  if (selectedBuildingId.value !== buildingId) selectedBuildingId.value = buildingId || null
})

function openGenerateDefaults() {
  const type = store.roomTypes.find((item) => item.status === 'active')
  generateForm.value = {
    building_id: selectedBuildingId.value ?? store.buildings[0]?.id ?? '',
    floor: 1,
    corridor_id: null,
    side: 'both',
    start_no: 101,
    room_count: 6,
    room_prefix: '',
    room_suffix: '',
    number_width: 3,
    room_type_id: type?.id ?? null,
    room_type: type?.code ?? 'single',
    capacity: type?.default_capacity ?? 1,
    price: type?.default_price ?? 0,
    bed_prefix: '',
    bed_style: 'letter',
    skip_existing: true,
  }
}

async function generateRooms() {
  if (!generateForm.value.building_id) return message.error('请选择楼栋')
  if (generateForm.value.room_count < 1) return message.error('请填写生成房间数')
  if (generateForm.value.capacity < 1) return message.error('床位数至少为 1')
  generating.value = true
  try {
    const result = await store.generateRooms({ ...generateForm.value })
    message.success(`已生成 ${result.rooms.length} 间房、${result.beds.length} 张床${result.skipped.length ? `，跳过 ${result.skipped.length} 间` : ''}`)
    await refresh()
  } catch (err) {
    message.error(`生成失败：${err instanceof Error ? err.message : String(err)}`)
  } finally {
    generating.value = false
  }
}

openGenerateDefaults()
</script>

<template>
  <BasePage title="床位管理">
    <NGrid :x-gap="16" :y-gap="16" :cols="4" class="mb-4">
      <NGi><NCard><div class="stat-card"><div class="stat-num text-blue-600">{{ store.bedStats.total }}</div><div class="stat-label">总床位</div></div></NCard></NGi>
      <NGi><NCard><div class="stat-card"><div class="stat-num text-green-600">{{ store.bedStats.available }}</div><div class="stat-label">空闲</div></div></NCard></NGi>
      <NGi><NCard><div class="stat-card"><div class="stat-num text-orange-500">{{ store.bedStats.occupied }}</div><div class="stat-label">占用</div></div></NCard></NGi>
      <NGi><NCard><div class="stat-card"><div class="stat-num text-red-500">{{ store.bedStats.maintenance }}</div><div class="stat-label">维修</div></div></NCard></NGi>
    </NGrid>

    <NCard class="mb-4" title="3D 楼栋床位总览">
      <Building3DViewer
        v-model="selectedBuildingId"
        :buildings="store.buildings"
        :corridors="store.corridors"
        :rooms="store.rooms"
        :beds="store.beds"
      />
    </NCard>

    <NCard>
      <NTabs type="line" animated>
        <NTabPane name="layout" tab="批量生成">
          <NAlert type="info" class="mb-4">
            先建楼栋、房型和走廊/分区，再用规则生成房间和床位。生成过程只新增数据，不会覆盖已有入住床位。
          </NAlert>
          <NForm :model="generateForm" label-placement="left" label-width="110">
            <NGrid :cols="3" :x-gap="16">
              <NGi><NFormItem label="楼栋" required><NSelect v-model:value="generateForm.building_id" :options="buildingOptions" /></NFormItem></NGi>
              <NGi><NFormItem label="楼层" required><NInputNumber v-model:value="generateForm.floor" :min="1" /></NFormItem></NGi>
              <NGi><NFormItem label="走廊/分区"><NSelect v-model:value="generateForm.corridor_id" :options="corridorOptions" clearable /></NFormItem></NGi>
              <NGi><NFormItem label="生成侧位"><NSelect v-model:value="generateForm.side" :options="generateSideOptions" /></NFormItem></NGi>
              <NGi><NFormItem label="起始房号"><NInputNumber v-model:value="generateForm.start_no" :min="1" /></NFormItem></NGi>
              <NGi><NFormItem label="每侧房间数"><NInputNumber v-model:value="generateForm.room_count" :min="1" :max="200" /></NFormItem></NGi>
              <NGi><NFormItem label="房号前缀"><NInput v-model:value="generateForm.room_prefix" placeholder="如 A-" /></NFormItem></NGi>
              <NGi><NFormItem label="数字位数"><NInputNumber v-model:value="generateForm.number_width" :min="1" :max="6" /></NFormItem></NGi>
              <NGi><NFormItem label="房号后缀"><NInput v-model:value="generateForm.room_suffix" placeholder="可不填" /></NFormItem></NGi>
              <NGi><NFormItem label="房型"><NSelect v-model:value="generateForm.room_type_id" :options="roomTypeOptions" clearable @update:value="applyRoomTypeToGenerate" /></NFormItem></NGi>
              <NGi><NFormItem label="床位数"><NInputNumber v-model:value="generateForm.capacity" :min="1" :max="20" /></NFormItem></NGi>
              <NGi><NFormItem label="月租金"><NInputNumber v-model:value="generateForm.price" :min="0" :precision="2" /></NFormItem></NGi>
              <NGi><NFormItem label="床位前缀"><NInput v-model:value="generateForm.bed_prefix" placeholder="如 床" /></NFormItem></NGi>
              <NGi><NFormItem label="床位编号"><NSelect v-model:value="generateForm.bed_style" :options="[{ label: 'A/B/C', value: 'letter' }, { label: '1/2/3', value: 'number' }]" /></NFormItem></NGi>
              <NGi><NFormItem label="重复房号"><NCheckbox v-model:checked="generateForm.skip_existing">自动跳过</NCheckbox></NFormItem></NGi>
            </NGrid>
            <NSpace justify="end">
              <NButton @click="openGenerateDefaults">重置</NButton>
              <NButton type="primary" :loading="generating" @click="generateRooms">生成房间和床位</NButton>
            </NSpace>
          </NForm>
        </NTabPane>

        <NTabPane name="room-types" tab="房型配置">
          <template #tab>房型配置</template>
          <NSpace justify="end" class="mb-3">
            <NButton type="primary" size="small" @click="openNewRoomType">新增房型</NButton>
          </NSpace>
          <BaseTable :columns="roomTypeColumns" :data="store.roomTypes" :loading="store.loading" :pagination="{ pageSize: 10 }" />
        </NTabPane>

        <NTabPane name="corridors" tab="走廊分区">
          <NSpace justify="space-between" class="mb-3">
            <NSelect v-model:value="selectedBuildingId" :options="buildingOptions" clearable placeholder="筛选楼栋" style="width: 180px" />
            <NButton type="primary" size="small" @click="openNewCorridor">新增走廊/分区</NButton>
          </NSpace>
          <BaseTable :columns="corridorColumns" :data="selectedBuildingId ? store.corridors.filter(item => item.building_id === selectedBuildingId) : store.corridors" :loading="store.loading" :pagination="{ pageSize: 10 }" />
        </NTabPane>

        <NTabPane name="buildings" tab="楼栋">
          <NSpace justify="end" class="mb-3">
            <NButton :loading="refreshing" size="small" @click="refresh">刷新</NButton>
            <NButton type="primary" size="small" @click="openNewBuilding">新增楼栋</NButton>
          </NSpace>
          <BaseTable :columns="buildingColumns" :data="store.buildings" :loading="store.loading" :pagination="false" />
        </NTabPane>

        <NTabPane name="rooms" tab="房间">
          <NSpace justify="space-between" class="mb-3">
            <NSelect v-model:value="selectedBuildingId" :options="buildingOptions" clearable placeholder="筛选楼栋" style="width: 180px" />
            <NButton type="primary" size="small" @click="openNewRoom">新增房间</NButton>
          </NSpace>
          <BaseTable :columns="roomColumns" :data="filteredRooms" :loading="store.loading" :pagination="{ pageSize: 10 }" />
        </NTabPane>

        <NTabPane name="beds" tab="床位">
          <NSpace justify="space-between" class="mb-3">
            <NSelect v-model:value="filterRoomId" :options="roomOptions" clearable placeholder="筛选房间" style="width: 220px" />
            <NButton type="primary" size="small" @click="openNewBed">新增床位</NButton>
          </NSpace>
          <BaseTable :columns="bedColumns" :data="filteredBeds" :loading="store.loading" :pagination="{ pageSize: 15 }" />
        </NTabPane>
      </NTabs>
    </NCard>

    <NModal v-model:show="showBuildingModal" title="楼栋信息" preset="card" style="width: 440px">
      <NForm :model="buildingForm" label-placement="left" label-width="80">
        <NFormItem label="楼栋名称" required><NInput v-model:value="buildingForm.name" placeholder="如：A栋" /></NFormItem>
        <NFormItem label="楼层数"><NInputNumber v-model:value="buildingForm.floors" :min="1" :max="50" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="buildingForm.remark" type="textarea" :rows="2" /></NFormItem>
      </NForm>
      <template #footer><NSpace justify="end"><NButton @click="showBuildingModal = false">取消</NButton><NButton type="primary" :loading="savingBuilding" @click="saveBuilding">保存</NButton></NSpace></template>
    </NModal>

    <NModal v-model:show="showRoomTypeModal" title="房型信息" preset="card" style="width: 560px">
      <NForm :model="roomTypeForm" label-placement="left" label-width="100">
        <NFormItem label="房型名称" required><NInput v-model:value="roomTypeForm.name" placeholder="如：南向双人间" /></NFormItem>
        <NFormItem label="房型编码" required><NInput v-model:value="roomTypeForm.code" placeholder="如 double-south" /></NFormItem>
        <NFormItem label="默认床位"><NInputNumber v-model:value="roomTypeForm.default_capacity" :min="1" :max="20" /></NFormItem>
        <NFormItem label="默认价格"><NInputNumber v-model:value="roomTypeForm.default_price" :min="0" :precision="2" /></NFormItem>
        <NFormItem label="面积"><NInputNumber v-model:value="roomTypeForm.area" :min="0" :precision="1" placeholder="可不填" /></NFormItem>
        <NFormItem label="设施"><NSpace><NCheckbox v-model:checked="roomTypeForm.has_window" :checked-value="1" :unchecked-value="0">有窗</NCheckbox><NCheckbox v-model:checked="roomTypeForm.has_private_bathroom" :checked-value="1" :unchecked-value="0">独立卫生间</NCheckbox></NSpace></NFormItem>
        <NFormItem label="护理设备"><NInput v-model:value="roomTypeForm.care_equipment" placeholder="如 呼叫器、护理床、供氧口" /></NFormItem>
        <NFormItem label="状态"><NSelect v-model:value="roomTypeForm.status" :options="[{ label: '启用', value: 'active' }, { label: '停用', value: 'inactive' }]" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="roomTypeForm.remark" type="textarea" :rows="2" /></NFormItem>
      </NForm>
      <template #footer><NSpace justify="end"><NButton @click="showRoomTypeModal = false">取消</NButton><NButton type="primary" :loading="savingRoomType" @click="saveRoomType">保存</NButton></NSpace></template>
    </NModal>

    <NModal v-model:show="showCorridorModal" title="走廊/分区信息" preset="card" style="width: 480px">
      <NForm :model="corridorForm" label-placement="left" label-width="100">
        <NFormItem label="所在楼栋" required><NSelect v-model:value="corridorForm.building_id" :options="buildingOptions" /></NFormItem>
        <NFormItem label="楼层" required><NInputNumber v-model:value="corridorForm.floor" :min="1" /></NFormItem>
        <NFormItem label="名称" required><NInput v-model:value="corridorForm.name" placeholder="如：东走廊、护理一区" /></NFormItem>
        <NFormItem label="方向"><NSelect v-model:value="corridorForm.direction" :options="directionOptions" /></NFormItem>
        <NFormItem label="排序"><NInputNumber v-model:value="corridorForm.sort_order" :min="0" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="corridorForm.remark" type="textarea" :rows="2" /></NFormItem>
      </NForm>
      <template #footer><NSpace justify="end"><NButton @click="showCorridorModal = false">取消</NButton><NButton type="primary" :loading="savingCorridor" @click="saveCorridor">保存</NButton></NSpace></template>
    </NModal>

    <NModal v-model:show="showRoomModal" title="房间信息" preset="card" style="width: 560px">
      <NForm :model="roomForm" label-placement="left" label-width="100">
        <NFormItem label="所在楼栋" required><NSelect v-model:value="roomForm.building_id" :options="buildingOptions" /></NFormItem>
        <NFormItem label="楼层" required><NInputNumber v-model:value="roomForm.floor" :min="1" /></NFormItem>
        <NFormItem label="走廊/分区"><NSelect v-model:value="roomForm.corridor_id" :options="corridorOptions" clearable /></NFormItem>
        <NFormItem label="侧位"><NSelect v-model:value="roomForm.layout_side" :options="layoutSideOptions" /></NFormItem>
        <NFormItem label="房间号" required><NInput v-model:value="roomForm.room_no" placeholder="如：101" /></NFormItem>
        <NFormItem label="房型"><NSelect v-model:value="roomForm.room_type_id" :options="roomTypeOptions" clearable @update:value="applyRoomTypeToRoomForm" /></NFormItem>
        <NFormItem label="床位数"><NInputNumber v-model:value="roomForm.capacity" :min="1" :max="20" /></NFormItem>
        <NFormItem label="月租金"><NInputNumber v-model:value="roomForm.price" :min="0" :precision="2" /></NFormItem>
        <NFormItem label="排序"><NInputNumber v-model:value="roomForm.sort_order" :min="0" /></NFormItem>
        <NFormItem label="状态"><NSelect v-model:value="roomForm.status" :options="statusOptions" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="roomForm.remark" type="textarea" :rows="2" /></NFormItem>
      </NForm>
      <template #footer><NSpace justify="end"><NButton @click="showRoomModal = false">取消</NButton><NButton type="primary" :loading="savingRoom" @click="saveRoom">保存</NButton></NSpace></template>
    </NModal>

    <NModal v-model:show="showBedModal" title="床位信息" preset="card" style="width: 440px">
      <NForm :model="bedForm" label-placement="left" label-width="80">
        <NFormItem label="所在房间" required><NSelect v-model:value="bedForm.room_id" :options="roomOptions" /></NFormItem>
        <NFormItem label="床位号" required><NInput v-model:value="bedForm.bed_no" placeholder="如：A床" /></NFormItem>
        <NFormItem label="状态"><NSelect v-model:value="bedForm.status" :options="statusOptions" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="bedForm.remark" type="textarea" :rows="2" /></NFormItem>
      </NForm>
      <template #footer><NSpace justify="end"><NButton @click="showBedModal = false">取消</NButton><NButton type="primary" :loading="savingBed" @click="saveBed">保存</NButton></NSpace></template>
    </NModal>
  </BasePage>
</template>

<style scoped>
.stat-card {
  text-align: center;
}

.stat-num {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
}

.stat-label {
  margin-top: 4px;
  color: #6b7280;
  font-size: 13px;
}
</style>
