<script setup lang="ts">
defineOptions({ name: 'PermissionGroupManage' })
import {
  NCard, NButton, NSpace, NModal, NForm, NFormItem,
  NInput, NCheckbox, NCheckboxGroup, NDivider, useMessage, useDialog
} from 'naive-ui'
import { BasePage, BaseTable, BaseEmpty } from '@yanglao/ui'
import { usePermissionGroupStore } from '../../stores/permission-group.store'
import { ref, h, computed } from 'vue'
import { MENU_GROUPS, MENU_CATALOG, BUTTON_CATALOG } from '../../config/menu-catalog'
import { usePageRefresh } from '../../composables/usePageRefresh'
import type { PermissionGroupRow } from '@yanglao/db'

const store = usePermissionGroupStore()
const message = useMessage()
const dialog = useDialog()

async function loadData() {
  await store.fetchList()
}
const { refresh, refreshing } = usePageRefresh(loadData)

// ── 搜索筛选 ─────────────────────────────────────
const search = ref('')

function safeParse(json: string): string[] {
  try { return JSON.parse(json) } catch { return [] }
}

const filtered = computed(() => {
  return store.list.filter(g => {
    return !search.value
      || g.name.includes(search.value)
      || g.code.includes(search.value)
  })
})

// ── 新增/编辑权限组 ─────────────────────────────────
const showModal = ref(false)
const editingId = ref<string | null>(null)
const form = ref({
  name: '', code: '', remark: '',
  menuKeys: [] as string[],
  buttonKeys: [] as string[],
})

function openCreate() {
  editingId.value = null
  form.value = { name: '', code: '', remark: '', menuKeys: [], buttonKeys: [] }
  showModal.value = true
}

function openEdit(row: PermissionGroupRow) {
  editingId.value = row.id
  form.value = {
    name: row.name, code: row.code, remark: row.remark ?? '',
    menuKeys: safeParse(row.menu_keys), buttonKeys: safeParse(row.button_keys),
  }
  showModal.value = true
}

async function save() {
  if (!form.value.name || !form.value.code) return message.error('请填写权限组名称和编码')
  const payload = {
    name: form.value.name,
    code: form.value.code,
    menu_keys: JSON.stringify(form.value.menuKeys),
    button_keys: JSON.stringify(form.value.buttonKeys),
    remark: form.value.remark || null,
  }
  if (editingId.value) {
    const res = await store.update(editingId.value, payload)
    if (!res.ok) return message.error(res.error ?? '保存失败')
    message.success('保存成功')
  } else {
    const res = await store.create(payload)
    if (!res.ok) return message.error(res.error ?? '创建失败')
    message.success('权限组创建成功')
  }
  showModal.value = false
  await refresh()
}

function remove(row: PermissionGroupRow) {
  dialog.warning({
    title: '删除权限组', content: `确定要删除权限组"${row.name}"吗？已套用过该权限组的角色不受影响。`, positiveText: '确定', negativeText: '取消',
    onPositiveClick: async () => {
      const res = await store.remove(row.id)
      if (!res.ok) return message.error(res.error ?? '删除失败')
      message.success('已删除')
      await refresh()
    }
  })
}

const columns = [
  { title: '权限组名称', key: 'name', width: 150 },
  { title: '编码', key: 'code', width: 120 },
  { title: '菜单权限数', key: 'menu_keys', width: 100, render: (r: PermissionGroupRow) => { const k = safeParse(r.menu_keys); return k.includes('*') ? '全部' : `${k.length} 项` } },
  { title: '按钮权限数', key: 'button_keys', width: 100, render: (r: PermissionGroupRow) => { const k = safeParse(r.button_keys); return k.includes('*') ? '全部' : `${k.length} 项` } },
  { title: '备注', key: 'remark', render: (r: PermissionGroupRow) => r.remark ?? '—' },
  {
    title: '操作', key: 'actions', width: 160,
    render: (r: PermissionGroupRow) => h(NSpace, null, { default: () => [
      h(NButton, { size: 'small', onClick: () => openEdit(r) }, '编辑'),
      h(NButton, { size: 'small', type: 'error', onClick: () => remove(r) }, '删除'),
    ]}),
  },
]
</script>

<template>
  <BasePage title="权限组管理">
    <NCard class="mb-4">
      <NSpace align="center" justify="space-between">
        <NInput v-model:value="search" placeholder="搜索权限组名称/编码" clearable style="width: 240px" />
        <NSpace>
          <NButton v-perm="'permission-group:create'" type="primary" @click="openCreate">+ 新增权限组</NButton>
          <NButton :loading="refreshing" size="small" @click="refresh">刷新</NButton>
        </NSpace>
      </NSpace>
    </NCard>

    <BaseEmpty v-if="!store.loading && filtered.length === 0" description="暂无权限组，点击右上角新增" />

    <BaseTable
      v-else
      :columns="columns"
      :data="filtered"
      :loading="store.loading"
      :pagination="{ pageSize: 15 }"
    />

    <!-- 新增/编辑权限组弹窗 -->
    <NModal v-model:show="showModal" :title="editingId ? '编辑权限组' : '新增权限组'" preset="card" style="width:640px">
      <NForm :model="form" label-placement="left" label-width="100">
        <NFormItem label="权限组名称" required><NInput v-model:value="form.name" placeholder="如：护理人员" /></NFormItem>
        <NFormItem label="权限组编码" required><NInput v-model:value="form.code" :disabled="!!editingId" placeholder="如：nurse，创建后不可修改" /></NFormItem>

        <NDivider style="margin: 8px 0">菜单权限</NDivider>
        <div v-for="group in MENU_GROUPS" :key="group.key" class="mb-2">
          <div class="text-xs text-gray-400 mb-1">{{ group.label }}</div>
          <NCheckboxGroup v-model:value="form.menuKeys">
            <NSpace>
              <NCheckbox
                v-for="item in MENU_CATALOG.filter(m => m.group === group.key)"
                :key="item.key"
                :value="item.key"
                :label="item.label"
              />
            </NSpace>
          </NCheckboxGroup>
        </div>

        <NDivider style="margin: 8px 0">按钮权限</NDivider>
        <NCheckboxGroup v-model:value="form.buttonKeys">
          <NSpace>
            <NCheckbox v-for="btn in BUTTON_CATALOG" :key="btn.key" :value="btn.key" :label="btn.label" />
          </NSpace>
        </NCheckboxGroup>

        <NFormItem label="备注" class="mt-3"><NInput v-model:value="form.remark" type="textarea" :rows="2" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showModal = false">取消</NButton>
          <NButton type="primary" @click="save">保存</NButton>
        </NSpace>
      </template>
    </NModal>
  </BasePage>
</template>
