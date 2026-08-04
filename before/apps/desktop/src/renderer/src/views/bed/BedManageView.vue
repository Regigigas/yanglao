<script setup lang="ts">
defineOptions({ name: 'BedManage' })
import {
  NCard, NButton, NSpace, NTag, NModal, NForm, NFormItem,
  NInput, NInputNumber, NSelect, NGrid, NGi, useMessage, useDialog
} from 'naive-ui'
import { BasePage, BaseTable } from '@yanglao/ui'
import { useBuildingStore } from '../../stores/building.store'
import { ref, h, computed } from 'vue'
import { usePageRefresh } from '../../composables/usePageRefresh'
import type { BuildingRow, RoomRow, BedRow } from '@yanglao/db'

const store = useBuildingStore()
const message = useMessage()
const dialog = useDialog()

async function loadData() {
  await store.fetchAll()
}
const { refresh, refreshing } = usePageRefresh(loadData)

const selectedBuildingId = ref<string | null>(null)

const roomOptions = computed(() =>
  store.rooms.map(r => ({ label: `${r.room_no}（${r.floor}层）`, value: r.id }))
)
const buildingOptions = computed(() =>
  store.buildings.map(b => ({ label: b.name, value: b.id }))
)

// ── 楼栋 ─────────────────────────────────────────
const showBuildingModal = ref(false)
const buildingForm = ref({ name: '', floors: 1, remark: '' })
const editingBuildingId = ref<string | null>(null)

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

const savingBuilding = ref(false)
async function saveBuilding() {
  if (!buildingForm.value.name) return message.error('请填写楼栋名称')
  if (savingBuilding.value) return
  savingBuilding.value = true
  try {
    if (editingBuildingId.value) {
      await store.updateBuilding(editingBuildingId.value, { ...buildingForm.value })
    } else {
      await store.createBuilding({ ...buildingForm.value, sort_order: store.buildings.length })
    }
    showBuildingModal.value = false
    message.success('保存成功')
    await refresh()
  } catch (err) {
    console.error('保存楼栋失败:', err)
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
    title: '操作', key: 'actions', width: 140,
    render: (row: BuildingRow) => h(NSpace, null, {
      default: () => [
        h(NButton, { size: 'small', onClick: () => openEditBuilding(row) }, '编辑'),
        h(NButton, { size: 'small', type: 'error', onClick: () => {
          dialog.warning({ title: '确认删除', content: `确定删除楼栋 ${row.name}？`, positiveText: '确定', negativeText: '取消',
            onPositiveClick: async () => { await store.deleteBuilding(row.id); message.success('删除成功'); await refresh() }
          })
        }}, '删除'),
      ]
    })
  }
]

// ── 房间 ─────────────────────────────────────────
const showRoomModal = ref(false)
const roomForm = ref({ building_id: '', floor: 1, room_no: '', room_type: 'single', capacity: 1, price: 0, status: 'available', remark: '' })
const editingRoomId = ref<string | null>(null)

const filteredRooms = computed(() =>
  selectedBuildingId.value ? store.rooms.filter(r => r.building_id === selectedBuildingId.value) : store.rooms
)

function openNewRoom() {
  editingRoomId.value = null
  roomForm.value = { building_id: selectedBuildingId.value ?? '', floor: 1, room_no: '', room_type: 'single', capacity: 1, price: 0, status: 'available', remark: '' }
  showRoomModal.value = true
}

function openEditRoom(row: RoomRow) {
  editingRoomId.value = row.id
  roomForm.value = { building_id: row.building_id, floor: row.floor, room_no: row.room_no, room_type: row.room_type, capacity: row.capacity, price: row.price, status: row.status, remark: row.remark ?? '' }
  showRoomModal.value = true
}

const savingRoom = ref(false)
async function saveRoom() {
  if (!roomForm.value.building_id) return message.error('请选择所在楼栋')
  if (!roomForm.value.floor && roomForm.value.floor !== 0) return message.error('请填写楼层')
  if (!roomForm.value.room_no) return message.error('请填写房间号')
  if (savingRoom.value) return
  savingRoom.value = true
  try {
    if (editingRoomId.value) {
      await store.updateRoom(editingRoomId.value, { ...roomForm.value } as import('@yanglao/db').RoomRow)
    } else {
      await store.createRoom({ ...roomForm.value } as Omit<RoomRow, 'id'|'created_at'|'updated_at'|'deleted_at'>)
    }
    showRoomModal.value = false
    message.success('保存成功')
    await refresh()
  } catch (err) {
    console.error('保存房间失败:', err)
    message.error(`保存失败：${err instanceof Error ? err.message : String(err)}`)
  } finally {
    savingRoom.value = false
  }
}

const roomColumns = [
  { title: '房间号', key: 'room_no', width: 100 },
  { title: '楼层', key: 'floor', width: 80 },
  { title: '类型', key: 'room_type', width: 100, render: (r: RoomRow) => ({ single: '单人间', double: '双人间', triple: '三人间', ward: '大间' }[r.room_type] ?? r.room_type) },
  { title: '床位数', key: 'capacity', width: 80 },
  { title: '月租金(元)', key: 'price', width: 120 },
  { title: '状态', key: 'status', width: 90, render: (r: RoomRow) => h(NTag, { type: { available: 'success', occupied: 'warning', maintenance: 'error' }[r.status] as 'success' | 'warning' | 'error' }, () => ({ available: '空闲', occupied: '占用', maintenance: '维修' }[r.status])) },
  { title: '操作', key: 'actions', width: 140, render: (r: RoomRow) => h(NSpace, null, { default: () => [h(NButton, { size: 'small', onClick: () => openEditRoom(r) }, '编辑'), h(NButton, { size: 'small', type: 'error', onClick: () => { dialog.warning({ title: '删除', content: '确认删除？', positiveText: '确定', negativeText: '取消', onPositiveClick: async () => { await store.deleteRoom(r.id); message.success('删除成功'); await refresh() } }) } }, '删除')] }) }
]

// ── 床位 ─────────────────────────────────────────
const showBedModal = ref(false)
const bedForm = ref({ room_id: '', bed_no: '', status: 'available', remark: '' })
const editingBedId = ref<string | null>(null)
const filterRoomId = ref<string | null>(null)

const filteredBeds = computed(() =>
  filterRoomId.value ? store.beds.filter(b => b.room_id === filterRoomId.value) : store.beds
)

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

const savingBed = ref(false)
async function saveBed() {
  if (!bedForm.value.room_id) return message.error('请选择所在房间')
  if (!bedForm.value.bed_no) return message.error('请填写床位号')
  if (savingBed.value) return
  savingBed.value = true
  try {
    if (editingBedId.value) {
      await store.updateBed(editingBedId.value, { ...bedForm.value } as import('@yanglao/db').BedRow)
    } else {
      await store.createBed({ ...bedForm.value, elderly_id: null } as Omit<BedRow, 'id'|'created_at'|'updated_at'|'deleted_at'>)
    }
    showBedModal.value = false
    message.success('保存成功')
    await refresh()
  } catch (err) {
    console.error('保存床位失败:', err)
    message.error(`保存失败：${err instanceof Error ? err.message : String(err)}`)
  } finally {
    savingBed.value = false
  }
}

const bedColumns = [
  { title: '床位号', key: 'bed_no', width: 100 },
  { title: '所在房间', key: 'room_id', width: 120, render: (b: BedRow) => store.rooms.find(r => r.id === b.room_id)?.room_no ?? b.room_id },
  { title: '状态', key: 'status', width: 90, render: (b: BedRow) => h(NTag, { type: { available: 'success', occupied: 'warning', maintenance: 'error' }[b.status] as 'success'|'warning'|'error' }, () => ({ available: '空闲', occupied: '占用', maintenance: '维修' }[b.status])) },
  { title: '备注', key: 'remark' },
  { title: '操作', key: 'actions', width: 140, render: (b: BedRow) => h(NSpace, null, { default: () => [h(NButton, { size: 'small', onClick: () => openEditBed(b) }, '编辑'), h(NButton, { size: 'small', type: 'error', onClick: () => { dialog.warning({ title: '删除', content: '确认删除？', positiveText: '确定', negativeText: '取消', onPositiveClick: async () => { await store.deleteBed(b.id); message.success('删除成功'); await refresh() } }) } }, '删除')] }) }
]

const roomTypeOptions = [
  { label: '单人间', value: 'single' },
  { label: '双人间', value: 'double' },
  { label: '三人间', value: 'triple' },
  { label: '大间/病房', value: 'ward' },
]
const statusOptions = [
  { label: '空闲', value: 'available' },
  { label: '占用', value: 'occupied' },
  { label: '维修中', value: 'maintenance' },
]
</script>

<template>
  <BasePage title="床位管理">
    <!-- 统计 -->
    <NGrid :x-gap="16" :y-gap="16" :cols="4" class="mb-4">
      <NGi><NCard><div class="text-center"><div class="text-2xl font-bold text-blue-600">{{ store.bedStats.total }}</div><div class="text-gray-500 mt-1">总床位</div></div></NCard></NGi>
      <NGi><NCard><div class="text-center"><div class="text-2xl font-bold text-green-600">{{ store.bedStats.available }}</div><div class="text-gray-500 mt-1">空闲</div></div></NCard></NGi>
      <NGi><NCard><div class="text-center"><div class="text-2xl font-bold text-orange-500">{{ store.bedStats.occupied }}</div><div class="text-gray-500 mt-1">占用</div></div></NCard></NGi>
      <NGi><NCard><div class="text-center"><div class="text-2xl font-bold text-red-500">{{ store.bedStats.maintenance }}</div><div class="text-gray-500 mt-1">维修</div></div></NCard></NGi>
    </NGrid>

    <!-- 楼栋管理 -->
    <NCard class="mb-4" title="楼栋管理">
      <template #header-extra>
        <NSpace>
          <NButton :loading="refreshing" size="small" @click="refresh">刷新</NButton>
          <NButton type="primary" size="small" @click="openNewBuilding">+ 新增楼栋</NButton>
        </NSpace>
      </template>
      <BaseTable :columns="buildingColumns" :data="store.buildings" :loading="store.loading" :pagination="false" />
    </NCard>

    <!-- 房间管理 -->
    <NCard class="mb-4" title="房间管理">
      <template #header-extra>
        <NSpace>
          <NSelect v-model:value="selectedBuildingId" :options="buildingOptions" clearable placeholder="筛选楼栋" style="width:150px" />
          <NButton type="primary" size="small" @click="openNewRoom">+ 新增房间</NButton>
        </NSpace>
      </template>
      <BaseTable :columns="roomColumns" :data="filteredRooms" :loading="store.loading" :pagination="{ pageSize: 10 }" />
    </NCard>

    <!-- 床位管理 -->
    <NCard title="床位管理">
      <template #header-extra>
        <NSpace>
          <NSelect v-model:value="filterRoomId" :options="roomOptions" clearable placeholder="筛选房间" style="width:180px" />
          <NButton type="primary" size="small" @click="openNewBed">+ 新增床位</NButton>
        </NSpace>
      </template>
      <BaseTable :columns="bedColumns" :data="filteredBeds" :loading="store.loading" :pagination="{ pageSize: 15 }" />
    </NCard>

    <!-- 楼栋弹窗 -->
    <NModal v-model:show="showBuildingModal" title="楼栋信息" preset="card" style="width:440px">
      <NForm :model="buildingForm" label-placement="left" label-width="80">
        <NFormItem label="楼栋名称" required><NInput v-model:value="buildingForm.name" placeholder="如：A栋" /></NFormItem>
        <NFormItem label="楼层数"><NInputNumber v-model:value="buildingForm.floors" :min="1" :max="50" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="buildingForm.remark" type="textarea" :rows="2" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showBuildingModal = false">取消</NButton>
          <NButton type="primary" :loading="savingBuilding" @click="saveBuilding">保存</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 房间弹窗 -->
    <NModal v-model:show="showRoomModal" title="房间信息" preset="card" style="width:480px">
      <NForm :model="roomForm" label-placement="left" label-width="80">
        <NFormItem label="所在楼栋" required><NSelect v-model:value="roomForm.building_id" :options="buildingOptions" /></NFormItem>
        <NFormItem label="楼层" required><NInputNumber v-model:value="roomForm.floor" :min="1" /></NFormItem>
        <NFormItem label="房间号" required><NInput v-model:value="roomForm.room_no" placeholder="如：101" /></NFormItem>
        <NFormItem label="房间类型"><NSelect v-model:value="roomForm.room_type" :options="roomTypeOptions" /></NFormItem>
        <NFormItem label="床位数"><NInputNumber v-model:value="roomForm.capacity" :min="1" /></NFormItem>
        <NFormItem label="月租金(元)"><NInputNumber v-model:value="roomForm.price" :min="0" :precision="2" /></NFormItem>
        <NFormItem label="状态"><NSelect v-model:value="roomForm.status" :options="statusOptions" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showRoomModal = false">取消</NButton>
          <NButton type="primary" :loading="savingRoom" @click="saveRoom">保存</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 床位弹窗 -->
    <NModal v-model:show="showBedModal" title="床位信息" preset="card" style="width:440px">
      <NForm :model="bedForm" label-placement="left" label-width="80">
        <NFormItem label="所在房间" required><NSelect v-model:value="bedForm.room_id" :options="roomOptions" /></NFormItem>
        <NFormItem label="床位号" required><NInput v-model:value="bedForm.bed_no" placeholder="如：A床" /></NFormItem>
        <NFormItem label="状态"><NSelect v-model:value="bedForm.status" :options="statusOptions" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="bedForm.remark" type="textarea" :rows="2" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showBedModal = false">取消</NButton>
          <NButton type="primary" :loading="savingBed" @click="saveBed">保存</NButton>
        </NSpace>
      </template>
    </NModal>
  </BasePage>
</template>
