<script setup lang="ts">
defineOptions({ name: 'Bed3DView' })

import { BasePage } from '@yanglao/ui'
import { BaseTable } from '@yanglao/ui'
import {
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
  NStatistic,
  NTag,
  useDialog,
  useMessage,
} from 'naive-ui'
import { computed, h, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { RoomTypeRow } from '@yanglao/db'
import Building3DViewer from '../../components/Building3DViewer.vue'
import { usePageRefresh } from '../../composables/usePageRefresh'
import { useBuildingStore } from '../../stores/building.store'

const store = useBuildingStore()
const router = useRouter()
const message = useMessage()
const dialog = useDialog()
const selectedBuildingId = ref<string | null>(null)

async function loadData() {
  await store.fetchAll()
  if (!selectedBuildingId.value && store.buildings.length) {
    selectedBuildingId.value = store.buildings[0].id
  }
}

const { refresh, refreshing } = usePageRefresh(loadData)

const buildingOptions = computed(() =>
  store.buildings.map((item) => ({ label: item.name, value: item.id })),
)

const selectedRooms = computed(() =>
  selectedBuildingId.value
    ? store.rooms.filter((item) => item.building_id === selectedBuildingId.value)
    : store.rooms,
)

const selectedRoomIds = computed(() => new Set(selectedRooms.value.map((item) => item.id)))
const selectedBeds = computed(() =>
  store.beds.filter((item) => selectedRoomIds.value.has(item.room_id)),
)

const availableBeds = computed(() =>
  selectedBeds.value.filter((item) => item.status === 'available').length,
)
const occupiedBeds = computed(() =>
  selectedBeds.value.filter((item) => item.status === 'occupied').length,
)
const maintenanceBeds = computed(() =>
  selectedBeds.value.filter((item) => item.status === 'maintenance').length,
)

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

const roomTypeStatusOptions = [
  { label: '启用', value: 'active' },
  { label: '停用', value: 'inactive' },
]

function resetRoomTypeForm() {
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
}

function openNewRoomType() {
  resetRoomTypeForm()
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
    message.success('房型已保存')
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
  { title: '床位数', key: 'default_capacity', width: 90 },
  { title: '默认价格', key: 'default_price', width: 100 },
  { title: '面积', key: 'area', width: 80, render: (row: RoomTypeRow) => row.area ? `${row.area}㎡` : '-' },
  {
    title: '设施',
    key: 'facility',
    render: (row: RoomTypeRow) => [
      row.has_window ? '有窗' : '无窗',
      row.has_private_bathroom ? '独卫' : '公卫',
      row.care_equipment,
    ].filter(Boolean).join(' / '),
  },
  {
    title: '状态',
    key: 'status',
    width: 90,
    render: (row: RoomTypeRow) => h(
      NTag,
      { type: row.status === 'active' ? 'success' : 'default' },
      () => row.status === 'active' ? '启用' : '停用',
    ),
  },
  {
    title: '操作',
    key: 'actions',
    width: 140,
    render: (row: RoomTypeRow) => h(NSpace, null, {
      default: () => [
        h(NButton, { size: 'small', onClick: () => openEditRoomType(row) }, () => '编辑'),
        h(NButton, {
          size: 'small',
          type: 'error',
          onClick: () => dialog.warning({
            title: '删除房型',
            content: `确定删除 ${row.name}？已引用的房间会保留文本类型，并解除房型引用。`,
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: async () => {
              await store.deleteRoomType(row.id)
              message.success('删除成功')
              await refresh()
            },
          }),
        }, () => '删除'),
      ],
    }),
  },
]
</script>

<template>
  <BasePage title="床位三维图">
    <NSpace vertical :size="16">
      <div class="viewer-header">
        <NSpace align="center" wrap>
          <NSelect
            v-model:value="selectedBuildingId"
            :options="buildingOptions"
            clearable
            placeholder="选择楼栋"
            style="width: 220px"
          />
          <NButton :loading="refreshing" @click="refresh">刷新</NButton>
          <NButton secondary type="primary" @click="router.push('/bed')">进入床位管理</NButton>
        </NSpace>
      </div>

      <NGrid :cols="4" :x-gap="12" :y-gap="12" responsive="screen">
        <NGi><NCard><NStatistic label="房间" :value="selectedRooms.length" /></NCard></NGi>
        <NGi><NCard><NStatistic label="空闲床位" :value="availableBeds" /></NCard></NGi>
        <NGi><NCard><NStatistic label="占用床位" :value="occupiedBeds" /></NCard></NGi>
        <NGi><NCard><NStatistic label="维修床位" :value="maintenanceBeds" /></NCard></NGi>
      </NGrid>

      <Building3DViewer
        v-model="selectedBuildingId"
        :buildings="store.buildings"
        :corridors="store.corridors"
        :rooms="store.rooms"
        :beds="store.beds"
      />

      <NCard title="房型配置">
        <NSpace vertical :size="12">
          <NSpace justify="space-between" align="center">
            <span class="section-note">维护单人间、双人间、护理房等房型，批量生成房间时会直接带入默认床位数和价格。</span>
            <NButton type="primary" @click="openNewRoomType">新增房型</NButton>
          </NSpace>
          <BaseTable
            :columns="roomTypeColumns"
            :data="store.roomTypes"
            :loading="store.loading"
            :pagination="{ pageSize: 8 }"
          />
        </NSpace>
      </NCard>
    </NSpace>

    <NModal v-model:show="showRoomTypeModal" preset="card" title="房型配置" style="width: 560px">
      <NForm :model="roomTypeForm" label-placement="left" label-width="100">
        <NGrid :cols="2" :x-gap="12">
          <NGi><NFormItem label="房型名称" required><NInput v-model:value="roomTypeForm.name" placeholder="如 单人间" /></NFormItem></NGi>
          <NGi><NFormItem label="房型编码" required><NInput v-model:value="roomTypeForm.code" placeholder="如 single" /></NFormItem></NGi>
          <NGi><NFormItem label="默认床位" required><NInputNumber v-model:value="roomTypeForm.default_capacity" :min="1" /></NFormItem></NGi>
          <NGi><NFormItem label="默认价格"><NInputNumber v-model:value="roomTypeForm.default_price" :min="0" /></NFormItem></NGi>
          <NGi><NFormItem label="面积"><NInputNumber v-model:value="roomTypeForm.area" :min="0" clearable /></NFormItem></NGi>
          <NGi><NFormItem label="状态"><NSelect v-model:value="roomTypeForm.status" :options="roomTypeStatusOptions" /></NFormItem></NGi>
          <NGi>
            <NFormItem label="设施">
              <NSpace>
                <NCheckbox v-model:checked="roomTypeForm.has_window" :checked-value="1" :unchecked-value="0">有窗</NCheckbox>
                <NCheckbox v-model:checked="roomTypeForm.has_private_bathroom" :checked-value="1" :unchecked-value="0">独卫</NCheckbox>
              </NSpace>
            </NFormItem>
          </NGi>
          <NGi><NFormItem label="排序"><NInputNumber v-model:value="roomTypeForm.sort_order" :min="0" /></NFormItem></NGi>
        </NGrid>
        <NFormItem label="护理设施"><NInput v-model:value="roomTypeForm.care_equipment" placeholder="如 护理床、呼叫器" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="roomTypeForm.remark" type="textarea" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showRoomTypeModal = false">取消</NButton>
          <NButton type="primary" :loading="savingRoomType" @click="saveRoomType">保存</NButton>
        </NSpace>
      </template>
    </NModal>
  </BasePage>
</template>

<style scoped>
.viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-note {
  color: #66756e;
  font-size: 13px;
}
</style>
