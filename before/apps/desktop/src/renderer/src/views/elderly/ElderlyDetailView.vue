<script setup lang="ts">
  defineOptions({ name: 'ElderlyDetail' })
  import { NCard, NDescriptions, NDescriptionsItem, NButton, NTag, NForm, NFormItem, NInput, NSelect, NDatePicker, NSpin, useMessage } from 'naive-ui'
  import { BasePage } from '@yanglao/ui'
  import { useElderlyStore } from '../../stores/elderly.store'
  import { useRoute, useRouter } from 'vue-router'
  import { onMounted, computed, ref } from 'vue'
  import { formatDateTime, calcAge } from '@yanglao/core'

  const store = useElderlyStore()
  const route = useRoute()
  const router = useRouter()
  const message = useMessage()

  // 新增老人已改为列表页弹窗（ElderlyListView），本页只负责查看/编辑已有老人
  const id = route.params.id as string

  const loading = ref(false)
  // 默认只读，点击"编辑"后才可修改
  const editing = ref(false)

  onMounted(async () => {
    loading.value = true
    try {
      await store.fetchById(id!)
      if (store.current) {
        Object.assign(form.value, {
          name: store.current.name,
          gender: store.current.gender,
          birth_date: store.current.birth_date?.slice(0, 10) ?? null,
          id_card: store.current.id_card ?? '',
          phone: store.current.phone ?? '',
          address: store.current.address ?? '',
          room_no: store.current.room_no ?? '',
          nation: store.current.nation ?? '',
          marriage: store.current.marriage ?? '',
          education: store.current.education ?? '',
          medicare_no: store.current.medicare_no ?? '',
          remark: store.current.remark ?? '',
        })
      }
    } finally {
      loading.value = false
    }
  })

  const elderly = computed(() => store.current)
  const age = computed(() => (elderly.value?.birth_date ? calcAge(elderly.value.birth_date) : '—'))

  // 用元组固定长度，避免 statusMap[status] 越界返回 undefined 时解构崩溃
  const statusMap: Record<string, readonly ['success' | 'warning' | 'default', string]> = {
    active: ['success', '在院'],
    inactive: ['warning', '暂离'],
    left: ['default', '离院'],
  }
  const statusDisplay = computed(() => {
    const s = elderly.value?.status
    return (s && statusMap[s]) ?? (['default', s ?? '未知'] as const)
  })

  const genderOptions = [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' },
  ]

  const form = ref({
    name: '',
    gender: 'male' as 'male' | 'female',
    birth_date: null as string | null,
    id_card: '',
    phone: '',
    address: '',
    room_no: '',
    nation: '',
    marriage: '',
    education: '',
    medicare_no: '',
    remark: '',
  })

  async function handleSave() {
    if (!form.value.name) {
      message.error('请填写姓名')
      return
    }
    await store.update(id, {
      ...form.value,
      birth_date: form.value.birth_date || null,
      id_card: form.value.id_card || null,
      phone: form.value.phone || null,
      address: form.value.address || null,
      room_no: form.value.room_no || null,
      nation: form.value.nation || null,
      marriage: form.value.marriage || null,
      education: form.value.education || null,
      medicare_no: form.value.medicare_no || null,
      remark: form.value.remark || null,
    })
    await store.fetchById(id)
    editing.value = false
    message.success('保存成功')
  }

  function cancelEdit() {
    if (elderly.value) {
      Object.assign(form.value, {
        name: elderly.value.name,
        gender: elderly.value.gender ?? 'male',
        birth_date: elderly.value.birth_date?.slice(0, 10) ?? null,
        id_card: elderly.value.id_card ?? '',
        phone: elderly.value.phone ?? '',
        address: elderly.value.address ?? '',
        room_no: elderly.value.room_no ?? '',
        nation: elderly.value.nation ?? '',
        marriage: elderly.value.marriage ?? '',
        education: elderly.value.education ?? '',
        medicare_no: elderly.value.medicare_no ?? '',
        remark: elderly.value.remark ?? '',
      })
    }
    editing.value = false
  }
</script>

<template>
  <BasePage title="老人详情">
    <NSpin :show="loading">
      <NCard v-if="elderly">
        <!-- 只读展示 -->
        <NDescriptions v-if="!editing" label-placement="left" :column="2" bordered>
          <NDescriptionsItem label="姓名">{{ elderly!.name }}</NDescriptionsItem>
          <NDescriptionsItem label="性别">{{ elderly!.gender === 'male' ? '男' : '女' }}</NDescriptionsItem>
          <NDescriptionsItem label="出生日期">{{ elderly!.birth_date ?? '—' }}</NDescriptionsItem>
          <NDescriptionsItem label="年龄">{{ age }} 岁</NDescriptionsItem>
          <NDescriptionsItem label="身份证">{{ elderly!.id_card ?? '—' }}</NDescriptionsItem>
          <NDescriptionsItem label="手机号">{{ elderly!.phone ?? '—' }}</NDescriptionsItem>
          <NDescriptionsItem label="房间号">{{ elderly!.room_no ?? '—' }}</NDescriptionsItem>
          <NDescriptionsItem label="地址">{{ elderly!.address ?? '—' }}</NDescriptionsItem>
          <NDescriptionsItem label="民族">{{ elderly!.nation ?? '—' }}</NDescriptionsItem>
          <NDescriptionsItem label="婚姻状况">{{ elderly!.marriage ?? '—' }}</NDescriptionsItem>
          <NDescriptionsItem label="文化程度">{{ elderly!.education ?? '—' }}</NDescriptionsItem>
          <NDescriptionsItem label="医保号">{{ elderly!.medicare_no ?? '—' }}</NDescriptionsItem>
          <NDescriptionsItem label="状态">
            <NTag :type="statusDisplay[0]">{{ statusDisplay[1] }}</NTag>
          </NDescriptionsItem>
          <NDescriptionsItem label="入院日期">
            {{ elderly!.admission_date ? formatDateTime(elderly!.admission_date) : '尚未办理入院' }}
          </NDescriptionsItem>
          <NDescriptionsItem label="备注" :span="2">{{ elderly!.remark ?? '—' }}</NDescriptionsItem>
        </NDescriptions>

        <!-- 编辑/新增表单 -->
        <NForm v-else :model="form" label-placement="left" label-width="90">
          <NFormItem label="姓名" required><NInput v-model:value="form.name" /></NFormItem>
          <NFormItem label="性别"><NSelect v-model:value="form.gender" :options="genderOptions" /></NFormItem>
          <NFormItem label="出生日期">
            <NDatePicker
              v-model:formatted-value="form.birth_date"
              value-format="yyyy-MM-dd"
              type="date"
              clearable
              placeholder="请选择出生日期"
              style="width: 100%"
            />
          </NFormItem>
          <NFormItem label="身份证"><NInput v-model:value="form.id_card" /></NFormItem>
          <NFormItem label="手机号"><NInput v-model:value="form.phone" /></NFormItem>
          <NFormItem label="房间号"><NInput v-model:value="form.room_no" /></NFormItem>
          <NFormItem label="地址"><NInput v-model:value="form.address" /></NFormItem>
          <NFormItem label="民族"><NInput v-model:value="form.nation" /></NFormItem>
          <NFormItem label="婚姻状况"><NInput v-model:value="form.marriage" /></NFormItem>
          <NFormItem label="文化程度"><NInput v-model:value="form.education" /></NFormItem>
          <NFormItem label="医保号"><NInput v-model:value="form.medicare_no" /></NFormItem>
          <NFormItem label="备注"><NInput v-model:value="form.remark" type="textarea" :rows="2" /></NFormItem>
        </NForm>

        <div class="flex gap-2 mt-4">
          <template v-if="editing">
            <NButton type="primary" @click="handleSave">保存</NButton>
            <NButton @click="cancelEdit">取消</NButton>
          </template>
          <template v-else>
            <NButton type="primary" @click="editing = true">编辑</NButton>
            <NButton @click="router.back()">返回列表</NButton>
          </template>
        </div>
      </NCard>
    </NSpin>
  </BasePage>
</template>
