<script setup lang="ts">
defineOptions({ name: 'Nutrition' })

import {
  NAlert, NButton, NCard, NDatePicker, NDynamicTags, NForm, NFormItem,
  NInput, NInputNumber, NModal, NSelect, NSpace, NTag, useDialog, useMessage,
} from 'naive-ui'
import { computed, h, ref } from 'vue'
import type { NutritionPlanRow } from '@yanglao/db'
import { formatDateTime } from '@yanglao/core'
import { BasePage, BaseTable } from '@yanglao/ui'
import { useElderlyStore } from '../../stores/elderly.store'
import { useMealStore } from '../../stores/meal.store'
import { usePageRefresh } from '../../composables/usePageRefresh'

const elderlyStore = useElderlyStore()
const mealStore = useMealStore()
const message = useMessage()
const dialog = useDialog()

const selectedElderlyId = ref<string | null>(null)
const showPlanModal = ref(false)
const editingPlanId = ref<string | null>(null)
const today = formatDateTime(Date.now())

const dietTypeOptions = [
  { label: '普通均衡膳食', value: 'normal' },
  { label: '糖尿病膳食', value: 'diabetes' },
  { label: '低盐控压膳食', value: 'hypertension' },
  { label: '低嘌呤膳食', value: 'low_purine' },
  { label: '软食/易咀嚼膳食', value: 'soft' },
  { label: '营养改善膳食', value: 'malnutrition' },
  { label: '其他个性化膳食', value: 'other' },
]
const dietTypeMap = Object.fromEntries(dietTypeOptions.map(item => [item.value, item.label]))
const statusOptions = [
  { label: '执行中', value: 'active' },
  { label: '已停用', value: 'inactive' },
]

const planForm = ref({
  elderly_id: '',
  diet_type: 'normal' as NutritionPlanRow['diet_type'],
  allergies: [] as string[],
  avoid_foods: [] as string[],
  daily_calories: null as number | null,
  protein_target: null as number | null,
  meal_advice: '',
  effective_date: today,
  expiry_date: null as string | null,
  status: 'active' as NutritionPlanRow['status'],
  remark: '',
})

const elderlyOptions = computed(() =>
  elderlyStore.list
    .filter(elderly => elderly.status === 'active')
    .map(elderly => ({ label: elderly.name, value: elderly.id }))
)
const currentPlan = computed(() => mealStore.nutritionPlans.find(plan => plan.status === 'active'))

async function loadData() {
  await elderlyStore.fetchList()
  if (selectedElderlyId.value) await mealStore.fetchNutritionPlans(selectedElderlyId.value)
}
const { refresh, refreshing } = usePageRefresh(loadData)

async function onElderlyChange(elderlyId: string) {
  selectedElderlyId.value = elderlyId
  await mealStore.fetchNutritionPlans(elderlyId)
}

function splitTags(value: string | null): string[] {
  return value ? value.split(/[，,\n]/).map(item => item.trim()).filter(Boolean) : []
}

function resetPlanForm() {
  planForm.value = {
    elderly_id: selectedElderlyId.value ?? '',
    diet_type: 'normal',
    allergies: [],
    avoid_foods: [],
    daily_calories: null,
    protein_target: null,
    meal_advice: '',
    effective_date: today,
    expiry_date: null,
    status: 'active',
    remark: '',
  }
}

function openCreatePlan() {
  if (!selectedElderlyId.value) return message.error('请先选择老人')
  editingPlanId.value = null
  resetPlanForm()
  showPlanModal.value = true
}

function openEditPlan(plan: NutritionPlanRow) {
  editingPlanId.value = plan.id
  planForm.value = {
    elderly_id: plan.elderly_id,
    diet_type: plan.diet_type,
    allergies: splitTags(plan.allergies),
    avoid_foods: splitTags(plan.avoid_foods),
    daily_calories: plan.daily_calories,
    protein_target: plan.protein_target,
    meal_advice: plan.meal_advice ?? '',
    effective_date: plan.effective_date,
    expiry_date: plan.expiry_date,
    status: plan.status,
    remark: plan.remark ?? '',
  }
  showPlanModal.value = true
}

async function savePlan() {
  if (!planForm.value.elderly_id || !planForm.value.effective_date) return message.error('请填写生效日期')
  const payload = {
    ...planForm.value,
    allergies: planForm.value.allergies.join('、') || null,
    avoid_foods: planForm.value.avoid_foods.join('、') || null,
    meal_advice: planForm.value.meal_advice || null,
    remark: planForm.value.remark || null,
  }

  if (editingPlanId.value) {
    await mealStore.updateNutritionPlan(editingPlanId.value, payload)
  } else {
    await mealStore.createNutritionPlan({ ...payload, created_by: null, deleted_at: null })
  }
  showPlanModal.value = false
  await mealStore.fetchNutritionPlans(planForm.value.elderly_id)
  message.success('营养方案已保存')
}

function deletePlan(plan: NutritionPlanRow) {
  dialog.warning({
    title: '删除营养方案',
    content: '删除后不可恢复，确认继续？',
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      await mealStore.deleteNutritionPlan(plan.id)
      message.success('营养方案已删除')
    },
  })
}

const planColumns = [
  { title: '适用膳食', key: 'diet_type', width: 150, render: (plan: NutritionPlanRow) => dietTypeMap[plan.diet_type] ?? plan.diet_type },
  { title: '生效日期', key: 'effective_date', width: 165 },
  { title: '目标能量', key: 'daily_calories', width: 110, render: (plan: NutritionPlanRow) => plan.daily_calories ? `${plan.daily_calories} 千卡` : '-' },
  { title: '蛋白目标', key: 'protein_target', width: 110, render: (plan: NutritionPlanRow) => plan.protein_target ? `${plan.protein_target} g` : '-' },
  { title: '过敏/忌口', key: 'avoid_foods', ellipsis: { tooltip: true }, render: (plan: NutritionPlanRow) => [plan.allergies, plan.avoid_foods].filter(Boolean).join('；') || '-' },
  { title: '状态', key: 'status', width: 90, render: (plan: NutritionPlanRow) => h(NTag, { type: plan.status === 'active' ? 'success' : 'default' }, () => plan.status === 'active' ? '执行中' : '已停用') },
  {
    title: '操作', key: 'actions', width: 150,
    render: (plan: NutritionPlanRow) => h(NSpace, null, {
      default: () => [
        h(NButton, { size: 'small', onClick: () => openEditPlan(plan) }, () => '编辑'),
        h(NButton, { size: 'small', type: 'error', onClick: () => deletePlan(plan) }, () => '删除'),
      ],
    }),
  },
]
</script>

<template>
  <BasePage title="营养搭配">
    <NCard class="mb-4">
      <NSpace align="center">
        <NSelect
          v-model:value="selectedElderlyId"
          :options="elderlyOptions"
          filterable
          placeholder="请选择老人"
          style="width: 220px"
          @update:value="onElderlyChange"
        />
        <NButton type="primary" :disabled="!selectedElderlyId" @click="openCreatePlan">新增营养方案</NButton>
        <NButton size="small" :loading="refreshing" @click="refresh">刷新</NButton>
      </NSpace>
    </NCard>

    <template v-if="selectedElderlyId">
      <NCard v-if="currentPlan" class="mb-4" title="当前执行方案">
        <div class="grid grid-cols-4 gap-4 text-sm">
          <div><span class="text-gray-400">膳食类型：</span>{{ dietTypeMap[currentPlan.diet_type] }}</div>
          <div><span class="text-gray-400">每日能量：</span>{{ currentPlan.daily_calories ? `${currentPlan.daily_calories} 千卡` : '未设置' }}</div>
          <div><span class="text-gray-400">蛋白目标：</span>{{ currentPlan.protein_target ? `${currentPlan.protein_target} g` : '未设置' }}</div>
          <div><span class="text-gray-400">生效日期：</span>{{ currentPlan.effective_date }}</div>
        </div>
        <div v-if="currentPlan.meal_advice" class="mt-3 text-sm text-gray-600">三餐建议：{{ currentPlan.meal_advice }}</div>
      </NCard>
      <NAlert v-else class="mb-4" type="info">该老人尚未配置执行中的营养方案。</NAlert>

      <NCard title="营养方案记录">
        <BaseTable :columns="planColumns" :data="mealStore.nutritionPlans" :loading="mealStore.loading" :pagination="{ pageSize: 15 }" />
      </NCard>
    </template>
    <NAlert v-else type="info">请选择老人后维护其个性化营养方案。</NAlert>

    <NModal v-model:show="showPlanModal" :title="editingPlanId ? '编辑营养方案' : '新增营养方案'" preset="card" style="width: 620px">
      <NForm :model="planForm" label-placement="left" label-width="100">
        <NFormItem label="膳食类型" required><NSelect v-model:value="planForm.diet_type" :options="dietTypeOptions" /></NFormItem>
        <NFormItem label="过敏食物"><NDynamicTags v-model:value="planForm.allergies" /></NFormItem>
        <NFormItem label="忌口食物"><NDynamicTags v-model:value="planForm.avoid_foods" /></NFormItem>
        <NFormItem label="每日能量"><NInputNumber v-model:value="planForm.daily_calories" :min="0" :precision="0"><template #suffix>千卡</template></NInputNumber></NFormItem>
        <NFormItem label="蛋白目标"><NInputNumber v-model:value="planForm.protein_target" :min="0" :precision="1"><template #suffix>g/天</template></NInputNumber></NFormItem>
        <NFormItem label="生效日期" required><NDatePicker v-model:formatted-value="planForm.effective_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" style="width: 100%" /></NFormItem>
        <NFormItem label="截止日期"><NDatePicker v-model:formatted-value="planForm.expiry_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" clearable style="width: 100%" /></NFormItem>
        <NFormItem label="执行状态"><NSelect v-model:value="planForm.status" :options="statusOptions" /></NFormItem>
        <NFormItem label="三餐建议"><NInput v-model:value="planForm.meal_advice" type="textarea" :rows="3" placeholder="例如：早餐搭配全谷物和蛋类，午晚餐控制精制主食比例" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="planForm.remark" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showPlanModal = false">取消</NButton>
          <NButton type="primary" @click="savePlan">保存</NButton>
        </NSpace>
      </template>
    </NModal>
  </BasePage>
</template>
