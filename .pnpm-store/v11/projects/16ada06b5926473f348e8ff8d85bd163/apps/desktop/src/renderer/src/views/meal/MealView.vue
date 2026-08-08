<script setup lang="ts">
defineOptions({ name: 'Meal' })
import {
  NCard, NButton, NSpace, NTag, NModal, NForm, NFormItem,
  NInput, NInputNumber, NSelect, NDatePicker, NTabs, NTabPane, useMessage
} from 'naive-ui'
import { BasePage, BaseTable } from '@yanglao/ui'
import { useMealStore } from '../../stores/meal.store'
import { useElderlyStore } from '../../stores/elderly.store'
import { ref, h, computed } from 'vue'
import { formatDateTime } from '@yanglao/core'
import { usePageRefresh } from '../../composables/usePageRefresh'
import type { MealMenuRow, MealRecordRow } from '@yanglao/db'

const mealStore = useMealStore()
const elderlyStore = useElderlyStore()
const message = useMessage()

const today = formatDateTime(Date.now())
const selectedDate = ref(today)

async function loadData() {
  await Promise.all([
    elderlyStore.fetchList(),
    mealStore.fetchMenuByDate(selectedDate.value),
    mealStore.fetchRecordsByDate(selectedDate.value),
  ])
}
const { refresh, refreshing } = usePageRefresh(loadData)

async function onDateChange() {
  await Promise.all([
    mealStore.fetchMenuByDate(selectedDate.value),
    mealStore.fetchRecordsByDate(selectedDate.value),
  ])
}

// ── 菜单管理 ─────────────────────────────────────
const showMenuModal = ref(false)
const menuForm = ref({
  menu_date: today,
  meal_type: 'lunch',
  dishes: '[]',
  calories: null as number | null,
  remark: '',
  created_by: '',
})
const dishInput = ref('')
const dishList = ref<string[]>([])

const editingMenuId = ref<string | null>(null)

function openMenuModal(mealType: string) {
  const existing = menuByType.value[mealType]
  editingMenuId.value = existing?.id ?? null
  if (existing) {
    menuForm.value = {
      menu_date: existing.menu_date,
      meal_type: existing.meal_type,
      dishes: existing.dishes,
      calories: existing.calories,
      remark: existing.remark ?? '',
      created_by: '',
    }
    dishList.value = JSON.parse(existing.dishes)
  } else {
    menuForm.value = { menu_date: selectedDate.value, meal_type: mealType, dishes: '[]', calories: null, remark: '', created_by: '' }
    dishList.value = []
  }
  dishInput.value = ''
  showMenuModal.value = true
}

function addDish() {
  if (dishInput.value.trim()) {
    dishList.value.push(dishInput.value.trim())
    dishInput.value = ''
  }
}

function removeDish(idx: number) {
  dishList.value.splice(idx, 1)
}

async function saveMenu() {
  const payload = { ...menuForm.value, dishes: JSON.stringify(dishList.value) }
  if (editingMenuId.value) {
    await mealStore.updateMenu(editingMenuId.value, payload)
  } else {
    await mealStore.createMenu({ ...payload, deleted_at: null })
  }
  showMenuModal.value = false
  await mealStore.fetchMenuByDate(selectedDate.value)
  message.success('菜单已保存')
}

const mealTypeMap: Record<string, string> = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐' }
const mealTypeOrder = ['breakfast', 'lunch', 'dinner']
const menuByType = computed(() => {
  const result: Record<string, MealMenuRow | undefined> = {}
  for (const t of mealTypeOrder) {
    result[t] = mealStore.menus.find(m => m.meal_type === t)
  }
  return result
})

// ── 用餐记录 ─────────────────────────────────────
const showMealRecordModal = ref(false)
const recordBatch = ref<{ elderly_id: string; meal_type: string; status: string; intake_rate: number; remark: string }[]>([])

function openBatchRecord(mealType: string) {
  recordBatch.value = elderlyStore.list
    .filter(e => e.status === 'active')
    .map(e => ({ elderly_id: e.id, meal_type: mealType, status: 'normal', intake_rate: 100, remark: '' }))
  showMealRecordModal.value = true
}

async function saveBatchRecord() {
  const batchMealType = recordBatch.value[0]?.meal_type ?? 'lunch'
  for (const r of recordBatch.value) {
    await mealStore.createRecord({ ...r, record_date: selectedDate.value, recorder: null, deleted_at: null })
  }
  showMealRecordModal.value = false
  await mealStore.fetchRecordsByDate(selectedDate.value)
  message.success(`${mealTypeMap[batchMealType]}用餐记录已保存`)
}

const mealRecordColumns = [
  { title: '老人', key: 'elderly_id', width: 100, render: (r: MealRecordRow) => elderlyStore.list.find(e => e.id === r.elderly_id)?.name ?? r.elderly_id },
  { title: '餐次', key: 'meal_type', width: 80, render: (r: MealRecordRow) => mealTypeMap[r.meal_type] ?? r.meal_type },
  { title: '状态', key: 'status', width: 90, render: (r: MealRecordRow) => h(NTag, { type: { normal: 'success', absent: 'error', special: 'warning' }[r.status] as 'success'|'error'|'warning' }, () => ({ normal: '正常', absent: '未用餐', special: '特殊饮食' }[r.status] ?? r.status)) },
  { title: '进食率', key: 'intake_rate', width: 80, render: (r: MealRecordRow) => `${r.intake_rate}%` },
  { title: '备注', key: 'remark' },
]

const statusOptions = [
  { label: '正常', value: 'normal' },
  { label: '未用餐', value: 'absent' },
  { label: '特殊饮食', value: 'special' },
]
</script>

<template>
  <BasePage title="餐饮管理">
    <NCard class="mb-4">
      <NSpace align="center">
        <span>日期：</span>
        <NDatePicker
          v-model:formatted-value="selectedDate"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          style="width:220px"
          @update:formatted-value="onDateChange"
        />
        <NButton @click="onDateChange">查询</NButton>
        <NButton :loading="refreshing" size="small" @click="refresh">刷新</NButton>
      </NSpace>
    </NCard>

    <NTabs type="line" animated>
      <!-- 今日菜单 -->
      <NTabPane name="menu" tab="今日菜单">
        <div class="grid grid-cols-3 gap-4">
          <NCard v-for="mealType in mealTypeOrder" :key="mealType" :title="mealTypeMap[mealType]">
            <template #header-extra>
              <NButton size="small" type="primary" @click="openMenuModal(mealType)">
                {{ menuByType[mealType] ? '修改' : '录入' }}菜单
              </NButton>
            </template>
            <div v-if="menuByType[mealType]">
              <div v-for="(dish, idx) in JSON.parse(menuByType[mealType]!.dishes)" :key="idx" class="py-1 border-b border-gray-100 last:border-0">
                {{ dish }}
              </div>
              <div v-if="menuByType[mealType]!.calories" class="text-gray-400 text-sm mt-2">约 {{ menuByType[mealType]!.calories }} 千卡</div>
            </div>
            <div v-else class="text-gray-400 text-center py-4">暂无菜单</div>
          </NCard>
        </div>
      </NTabPane>

      <!-- 用餐记录 -->
      <NTabPane name="records" tab="用餐记录">
        <NCard>
          <template #header-extra>
            <NSpace>
              <NButton size="small" @click="openBatchRecord('breakfast')">批量录入早餐</NButton>
              <NButton size="small" @click="openBatchRecord('lunch')">批量录入午餐</NButton>
              <NButton size="small" @click="openBatchRecord('dinner')">批量录入晚餐</NButton>
            </NSpace>
          </template>
          <BaseTable :columns="mealRecordColumns" :data="mealStore.records" :loading="mealStore.loading" :pagination="{ pageSize: 15 }" />
        </NCard>
      </NTabPane>
    </NTabs>

    <!-- 菜单弹窗 -->
    <NModal v-model:show="showMenuModal" :title="`${mealTypeMap[menuForm.meal_type]}菜单`" preset="card" style="width:480px">
      <NForm :model="menuForm" label-placement="left" label-width="80">
        <NFormItem label="菜单日期">
          <NDatePicker v-model:formatted-value="menuForm.menu_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" style="width: 100%" />
        </NFormItem>
        <NFormItem label="添加菜品">
          <NSpace>
            <NInput v-model:value="dishInput" placeholder="输入菜品名称" @keydown.enter="addDish" />
            <NButton @click="addDish">添加</NButton>
          </NSpace>
        </NFormItem>
        <NFormItem label="菜单">
          <div class="flex flex-wrap gap-2">
            <NTag v-for="(dish, idx) in dishList" :key="idx" closable @close="removeDish(idx)">{{ dish }}</NTag>
            <span v-if="!dishList.length" class="text-gray-400">暂无菜品</span>
          </div>
        </NFormItem>
        <NFormItem label="热量(千卡)"><NInputNumber v-model:value="menuForm.calories" :min="0" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="menuForm.remark" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showMenuModal = false">取消</NButton>
          <NButton type="primary" @click="saveMenu">保存</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 批量用餐记录弹窗 -->
    <NModal v-model:show="showMealRecordModal" title="批量录入用餐记录" preset="card" style="width:680px">
      <div class="max-h-96 overflow-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50">
              <th class="p-2 text-left">老人</th>
              <th class="p-2">状态</th>
              <th class="p-2">进食率(%)</th>
              <th class="p-2">备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, idx) in recordBatch" :key="idx" class="border-b">
              <td class="p-2">{{ elderlyStore.list.find(e => e.id === r.elderly_id)?.name }}</td>
              <td class="p-2">
                <NSelect v-model:value="r.status" :options="statusOptions" size="small" style="width:110px" />
              </td>
              <td class="p-2">
                <NInputNumber v-model:value="r.intake_rate" :min="0" :max="100" size="small" style="width:90px" />
              </td>
              <td class="p-2">
                <NInput v-model:value="r.remark" size="small" placeholder="备注" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showMealRecordModal = false">取消</NButton>
          <NButton type="primary" @click="saveBatchRecord">批量保存</NButton>
        </NSpace>
      </template>
    </NModal>
  </BasePage>
</template>
