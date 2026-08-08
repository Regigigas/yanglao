<script setup lang="ts">
  defineOptions({ name: 'ElderlyList' })
  import { NButton, NSpace, NCard, NInput, NSelect, NDatePicker, NModal, NForm, NFormItem, useMessage, useDialog } from 'naive-ui'
  import { BasePage, BaseTable, BaseEmpty } from '@yanglao/ui'
  import { useElderlyStore } from '../../stores/elderly.store'
  import { useRouter } from 'vue-router'
  import { ref, computed, h } from 'vue'
  import { formatDate } from '@yanglao/core'
  import { usePageRefresh } from '../../composables/usePageRefresh'
  import type { ElderlyRow } from '@yanglao/db'

  const store = useElderlyStore()
  const router = useRouter()
  const message = useMessage()
  const dialog = useDialog()

  const search = ref('')
  const statusFilter = ref<string | null>(null)

  async function loadData() {
    await store.fetchList()
  }
  const { refresh, refreshing } = usePageRefresh(loadData)

  // ── 新增老人弹窗 ──────────────────────────────────────────────
  const showCreateModal = ref(false)
  const creating = ref(false)
  const genderOptions = [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' },
  ]
  const createForm = ref({
    name: '',
    gender: 'male' as 'male' | 'female',
    birth_date: null as string | null,
    id_card: '',
    phone: '',
    address: '',
    room_no: '',
    remark: '',
  })

  function openCreateModal() {
    createForm.value = { name: '', gender: 'male', birth_date: null, id_card: '', phone: '', address: '', room_no: '', remark: '' }
    showCreateModal.value = true
  }

  async function submitCreate() {
    if (!createForm.value.name) {
      message.error('请填写姓名')
      return
    }
    if (creating.value) return
    creating.value = true
    try {
      const row = await store.create({
        name: createForm.value.name,
        gender: createForm.value.gender,
        birth_date: createForm.value.birth_date || null,
        id_card: createForm.value.id_card || null,
        phone: createForm.value.phone || null,
        address: createForm.value.address || null,
        room_no: createForm.value.room_no || null,
        nation: null,
        marriage: null,
        education: null,
        medicare_no: null,
        remark: createForm.value.remark || null,
        care_level: null,
        bed_id: null,
        admission_date: null,
        photo_path: null,
        status: 'inactive',
      })
      message.success('新增老人成功')
      showCreateModal.value = false
      router.push(`/elderly/${row.id}`)
    } catch (err) {
      console.error('新增老人失败:', err)
      message.error(`新增失败：${err instanceof Error ? err.message : String(err)}`)
    } finally {
      creating.value = false
    }
  }

  const filtered = computed(() => {
    return store.list.filter(e => {
      const matchSearch = !search.value
        || e.name.includes(search.value)
        || e.phone?.includes(search.value)
      const matchStatus = !statusFilter.value || e.status === statusFilter.value
      return matchSearch && matchStatus
    })
  })

  const columns = [
    { title: '姓名', key: 'name', width: 100 },
    { title: '性别', key: 'gender', width: 70,
      render: (row: ElderlyRow) => row.gender === 'male' ? '男' : '女' },
    { title: '出生日期', key: 'birth_date', width: 110 },
    { title: '手机号', key: 'phone', width: 130 },
    { title: '房间号', key: 'room_no', width: 90 },
    { title: '状态', key: 'status', width: 90,
      render: (row: ElderlyRow) => ({ active: '在院', inactive: '暂离', left: '离院' }[row.status] ?? row.status) },
    { title: '入院时间', key: 'created_at', width: 160,
      render: (row: ElderlyRow) => formatDate(row.created_at) },
    {
      title: '操作',
      key: 'actions',
      width: 140,
      render: (row: ElderlyRow) =>
        h(NSpace, null, {
          default: () => [
            h(NButton, { size: 'small', onClick: () => router.push(`/elderly/${row.id}`) }, () => '详情'),
            h(NButton, {
              size: 'small', type: 'error',
              onClick: () => {
                dialog.warning({
                  title: '确认删除',
                  content: `确定要删除 ${row.name} 的记录吗？`,
                  positiveText: '确定',
                  negativeText: '取消',
                  onPositiveClick: async () => {
                    await store.remove(row.id)
                    message.success('删除成功')
                    await refresh()
                  },
                })
              },
            }, () => '删除'),
          ],
        }),
    },
  ]
</script>

<template>
  <BasePage title="老人管理">
    <NCard class="mb-4">
      <NSpace align="center" justify="space-between">
        <NSpace>
          <NInput v-model:value="search" placeholder="搜索姓名/手机号" clearable style="width: 220px" />
          <NSelect
            v-model:value="statusFilter"
            clearable
            placeholder="状态筛选"
            :options="[
              { label: '在院', value: 'active' },
              { label: '暂离', value: 'inactive' },
              { label: '离院', value: 'left' },
            ]"
            style="width: 130px"
          />
        </NSpace>
        <NButton type="primary" @click="openCreateModal">
          + 新增老人
        </NButton>
        <NButton :loading="refreshing" size="small" @click="refresh">刷新</NButton>
      </NSpace>
    </NCard>

    <BaseEmpty v-if="!store.loading && filtered.length === 0" description="暂无数据，点击右上角新增" />

    <BaseTable
      v-else
      :columns="columns"
      :data="filtered"
      :loading="store.loading"
      :pagination="{ pageSize: 15 }"
    />

    <!-- 新增老人弹窗 -->
    <NModal v-model:show="showCreateModal" title="新增老人" preset="card" style="width:480px">
      <NForm :model="createForm" label-placement="left" label-width="90">
        <NFormItem label="姓名" required><NInput v-model:value="createForm.name" /></NFormItem>
        <NFormItem label="性别"><NSelect v-model:value="createForm.gender" :options="genderOptions" /></NFormItem>
        <NFormItem label="出生日期">
          <NDatePicker
            v-model:formatted-value="createForm.birth_date"
            value-format="yyyy-MM-dd"
            type="date"
            clearable
            placeholder="请选择出生日期"
            style="width: 100%"
          />
        </NFormItem>
        <NFormItem label="身份证"><NInput v-model:value="createForm.id_card" /></NFormItem>
        <NFormItem label="手机号"><NInput v-model:value="createForm.phone" /></NFormItem>
        <NFormItem label="房间号"><NInput v-model:value="createForm.room_no" /></NFormItem>
        <NFormItem label="地址"><NInput v-model:value="createForm.address" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="createForm.remark" type="textarea" :rows="2" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showCreateModal = false">取消</NButton>
          <NButton type="primary" :loading="creating" @click="submitCreate">确认新增</NButton>
        </NSpace>
      </template>
    </NModal>
  </BasePage>
</template>
