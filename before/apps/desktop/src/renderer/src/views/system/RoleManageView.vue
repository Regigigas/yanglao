<script setup lang="ts">
defineOptions({ name: 'RoleManage' })
import {
  NCard, NButton, NSpace, NTag, NModal, NForm, NFormItem,
  NInput, NSelect, NCheckbox, NCheckboxGroup, NDivider, useMessage, useDialog
} from 'naive-ui'
import { BasePage, BaseTable, BaseEmpty } from '@yanglao/ui'
import { useRoleStore, type RoleWithCount } from '../../stores/role.store'
import { usePermissionGroupStore } from '../../stores/permission-group.store'
import { ref, h, computed } from 'vue'
import { MENU_GROUPS, MENU_CATALOG, BUTTON_CATALOG } from '../../config/menu-catalog'
import { usePageRefresh } from '../../composables/usePageRefresh'

const roleStore = useRoleStore()
const permissionGroupStore = usePermissionGroupStore()
const message = useMessage()
const dialog = useDialog()

async function loadData() {
  await Promise.all([roleStore.fetchList(), permissionGroupStore.fetchList()])
}
const { refresh, refreshing } = usePageRefresh(loadData)

// ── 搜索筛选 ─────────────────────────────────────
const search = ref('')

const filtered = computed(() => {
  return roleStore.list.filter(r => {
    return !search.value
      || r.name.includes(search.value)
      || r.code.includes(search.value)
  })
})

// ── 新增/编辑角色 ─────────────────────────────────
const showRoleModal = ref(false)
const editingId = ref<string | null>(null)
const roleForm = ref({
  name: '', code: '', remark: '',
  menuKeys: [] as string[],
  buttonKeys: [] as string[],
})
const presetChoice = ref<string | null>(null)

function openCreate() {
  editingId.value = null
  presetChoice.value = null
  roleForm.value = { name: '', code: '', remark: '', menuKeys: [], buttonKeys: [] }
  showRoleModal.value = true
}

function openEdit(row: RoleWithCount) {
  editingId.value = row.id
  presetChoice.value = null
  roleForm.value = {
    name: row.name, code: row.code, remark: row.remark ?? '',
    menuKeys: safeParse(row.menu_keys), buttonKeys: safeParse(row.button_keys),
  }
  showRoleModal.value = true
}

function safeParse(json: string): string[] {
  try { return JSON.parse(json) } catch { return [] }
}

const presetOptions = computed(() => permissionGroupStore.list.map(g => ({ label: g.name, value: g.id })))

/** 选择权限组后，直接套用其菜单+按钮权限勾选（仍可在此基础上手动增减，属于"预设+自定义"结合） */
function applyPreset(id: string | null) {
  if (!id) return
  const preset = permissionGroupStore.list.find(g => g.id === id)
  if (preset) {
    roleForm.value.menuKeys = safeParse(preset.menu_keys)
    roleForm.value.buttonKeys = safeParse(preset.button_keys)
  }
}

async function saveRole() {
  if (!roleForm.value.name || !roleForm.value.code) return message.error('请填写角色名称和编码')
  const payload = {
    name: roleForm.value.name,
    code: roleForm.value.code,
    menu_keys: JSON.stringify(roleForm.value.menuKeys),
    button_keys: JSON.stringify(roleForm.value.buttonKeys),
    remark: roleForm.value.remark || null,
  }
  if (editingId.value) {
    const res = await roleStore.update(editingId.value, payload)
    if (!res.ok) return message.error(res.error ?? '保存失败')
    message.success('保存成功')
  } else {
    await roleStore.create(payload)
    message.success('角色创建成功')
  }
  showRoleModal.value = false
  await refresh()
}

function removeRole(row: RoleWithCount) {
  if (row.user_count > 0) {
    message.error(`该角色下仍有 ${row.user_count} 个账号，请先转移或删除相关账号`)
    return
  }
  dialog.warning({
    title: '删除角色', content: `确定要删除角色"${row.name}"吗？`, positiveText: '确定', negativeText: '取消',
    onPositiveClick: async () => {
      const res = await roleStore.remove(row.id)
      if (!res.ok) return message.error(res.error ?? '删除失败')
      message.success('已删除')
      await refresh()
    }
  })
}

const columns = [
  { title: '角色名称', key: 'name', width: 150 },
  { title: '编码', key: 'code', width: 120 },
  { title: '类型', key: 'is_system', width: 100, render: (r: RoleWithCount) => r.is_system ? h(NTag, { type: 'warning' }, () => '系统内置') : h(NTag, () => '自定义') },
  { title: '菜单权限数', key: 'menu_keys', width: 100, render: (r: RoleWithCount) => { const k = safeParse(r.menu_keys); return k.includes('*') ? '全部' : `${k.length} 项` } },
  { title: '关联账号数', key: 'user_count', width: 100 },
  { title: '备注', key: 'remark', render: (r: RoleWithCount) => r.remark ?? '—' },
  {
    title: '操作', key: 'actions', width: 160,
    render: (r: RoleWithCount) => r.is_system
      ? h(NTag, { type: 'default' }, () => '不可修改')
      : h(NSpace, null, { default: () => [
          h(NButton, { size: 'small', onClick: () => openEdit(r) }, '编辑'),
          h(NButton, { size: 'small', type: 'error', onClick: () => removeRole(r) }, '删除'),
        ]}),
  },
]
</script>

<template>
  <BasePage title="角色权限">
    <NCard class="mb-4">
      <NSpace align="center" justify="space-between">
        <NInput v-model:value="search" placeholder="搜索角色名称/编码" clearable style="width: 240px" />
        <NSpace>
          <NButton v-perm="'role:create'" type="primary" @click="openCreate">+ 新增角色</NButton>
          <NButton :loading="refreshing" size="small" @click="refresh">刷新</NButton>
        </NSpace>
      </NSpace>
    </NCard>

    <BaseEmpty v-if="!roleStore.loading && filtered.length === 0" description="暂无角色，点击右上角新增" />

    <BaseTable
      v-else
      :columns="columns"
      :data="filtered"
      :loading="roleStore.loading"
      :pagination="{ pageSize: 15 }"
    />

    <!-- 新增/编辑角色弹窗 -->
    <NModal v-model:show="showRoleModal" :title="editingId ? '编辑角色' : '新增角色'" preset="card" style="width:640px">
      <NForm :model="roleForm" label-placement="left" label-width="100">
        <NFormItem label="角色名称" required><NInput v-model:value="roleForm.name" placeholder="如：护理人员" /></NFormItem>
        <NFormItem label="角色编码" required><NInput v-model:value="roleForm.code" :disabled="!!editingId" placeholder="如：nurse，创建后不可修改" /></NFormItem>

        <NFormItem label="套用权限组">
          <NSelect
            v-model:value="presetChoice"
            :options="presetOptions"
            clearable
            placeholder="可选：选择权限组快速套用菜单+按钮权限，之后仍可手动调整"
            @update:value="applyPreset"
          />
        </NFormItem>

        <NDivider style="margin: 8px 0">菜单权限（自定义勾选）</NDivider>
        <div v-for="group in MENU_GROUPS" :key="group.key" class="mb-2">
          <div class="text-xs text-gray-400 mb-1">{{ group.label }}</div>
          <NCheckboxGroup v-model:value="roleForm.menuKeys">
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

        <NDivider style="margin: 8px 0">按钮权限（自定义勾选）</NDivider>
        <NCheckboxGroup v-model:value="roleForm.buttonKeys">
          <NSpace>
            <NCheckbox v-for="btn in BUTTON_CATALOG" :key="btn.key" :value="btn.key" :label="btn.label" />
          </NSpace>
        </NCheckboxGroup>

        <NFormItem label="备注" class="mt-3"><NInput v-model:value="roleForm.remark" type="textarea" :rows="2" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showRoleModal = false">取消</NButton>
          <NButton type="primary" @click="saveRole">保存</NButton>
        </NSpace>
      </template>
    </NModal>
  </BasePage>
</template>
