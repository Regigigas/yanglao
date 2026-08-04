<script setup lang="ts">
defineOptions({ name: 'UserManage' })
import {
  NCard, NButton, NSpace, NModal, NForm, NFormItem,
  NInput, NSelect, NSwitch, useMessage, useDialog
} from 'naive-ui'
import { BasePage, BaseTable, BaseEmpty } from '@yanglao/ui'
import { useUserStore } from '../../stores/user.store'
import { useRoleStore } from '../../stores/role.store'
import { ref, h, computed } from 'vue'
import { formatDateTime } from '@yanglao/core'
import { usePageRefresh } from '../../composables/usePageRefresh'
import type { UserRow } from '@yanglao/db'

type SafeUser = Omit<UserRow, 'password_hash' | 'password_salt'>

const userStore = useUserStore()
const roleStore = useRoleStore()
const message = useMessage()
const dialog = useDialog()

async function loadData() {
  await Promise.all([userStore.fetchList(), roleStore.fetchList()])
}
const { refresh, refreshing } = usePageRefresh(loadData)

const roleOptions = computed(() =>
  roleStore.list.map(r => ({ label: r.name, value: r.id }))
)

function roleName(roleId: string) {
  return roleStore.list.find(r => r.id === roleId)?.name ?? '—'
}

// ── 搜索筛选 ─────────────────────────────────────
const search = ref('')
const roleFilter = ref<string | null>(null)
const statusFilter = ref<string | null>(null)

const filtered = computed(() => {
  return userStore.list.filter(u => {
    const matchSearch = !search.value
      || u.username.includes(search.value)
      || u.real_name.includes(search.value)
      || u.phone?.includes(search.value)
    const matchRole = !roleFilter.value || u.role_id === roleFilter.value
    const matchStatus = !statusFilter.value || u.status === statusFilter.value
    return matchSearch && matchRole && matchStatus
  })
})

// ── 列表内快速启停 ─────────────────────────────────
async function toggleStatus(row: SafeUser, val: boolean) {
  if (row.username === 'admin' && !val) {
    message.error('内置管理员账号不允许禁用')
    return
  }
  await userStore.update(row.id, { status: val ? 'active' : 'disabled' })
  message.success(val ? '已启用' : '已禁用')
  await userStore.fetchList()
}

// ── 新增/编辑账号 ─────────────────────────────────
const showUserModal = ref(false)
const editingId = ref<string | null>(null)
const userForm = ref({
  username: '', password: '', real_name: '', phone: '',
  role_id: '', status: 'active' as 'active' | 'disabled',
  position: '', department: '', remark: '',
})

// 常用职位/部门选项：可直接选择，也可在输入框内手动输入自定义值（NSelect tag 模式）
const positionOptions = [
  { label: '护士', value: '护士' },
  { label: '护理员', value: '护理员' },
  { label: '前台', value: '前台' },
  { label: '后勤', value: '后勤' },
  { label: '厨师', value: '厨师' },
  { label: '管理员', value: '管理员' },
]
const departmentOptions = [
  { label: '护理部', value: '护理部' },
  { label: '前台', value: '前台' },
  { label: '后勤部', value: '后勤部' },
  { label: '行政部', value: '行政部' },
]

function openCreate() {
  editingId.value = null
  userForm.value = {
    username: '', password: '', real_name: '', phone: '', role_id: roleStore.list[0]?.id ?? '',
    status: 'active', position: '', department: '', remark: '',
  }
  showUserModal.value = true
}

function openEdit(row: SafeUser) {
  editingId.value = row.id
  userForm.value = {
    username: row.username, password: '', real_name: row.real_name,
    phone: row.phone ?? '', role_id: row.role_id, status: row.status,
    position: row.position ?? '', department: row.department ?? '', remark: row.remark ?? '',
  }
  showUserModal.value = true
}

async function saveUser() {
  if (!userForm.value.real_name || !userForm.value.role_id) return message.error('请填写姓名并选择角色')
  if (editingId.value) {
    const res = await userStore.update(editingId.value, {
      real_name: userForm.value.real_name,
      phone: userForm.value.phone || null,
      role_id: userForm.value.role_id,
      status: userForm.value.status,
      position: userForm.value.position || null,
      department: userForm.value.department || null,
      remark: userForm.value.remark || null,
    })
    if (!res.ok) return message.error(res.error ?? '保存失败')
    showUserModal.value = false
    message.success('保存成功')
    await refresh()
  } else {
    if (!userForm.value.username || !userForm.value.password) return message.error('请填写用户名和初始密码')
    if (userForm.value.password.length < 6) return message.error('密码至少6位')
    const res = await userStore.create({
      username: userForm.value.username,
      password: userForm.value.password,
      real_name: userForm.value.real_name,
      phone: userForm.value.phone || null,
      role_id: userForm.value.role_id,
      status: userForm.value.status,
      must_change_pw: 0,
      position: userForm.value.position || null,
      department: userForm.value.department || null,
      remark: userForm.value.remark || null,
    })
    if (!res.ok) return message.error(res.error ?? '创建失败')
    showUserModal.value = false
    message.success('账号创建成功')
    await refresh()
  }
}

// ── 重置密码 ─────────────────────────────────────
const showResetModal = ref(false)
const resetUserId = ref<string | null>(null)
const resetPassword = ref('')

function openReset(row: SafeUser) {
  resetUserId.value = row.id
  resetPassword.value = ''
  showResetModal.value = true
}

async function confirmReset() {
  if (!resetUserId.value || resetPassword.value.length < 6) return message.error('新密码至少6位')
  const res = await userStore.resetPassword(resetUserId.value, resetPassword.value)
  if (!res.ok) return message.error(res.error ?? '重置失败')
  showResetModal.value = false
  message.success('密码已重置，用户下次登录需修改密码')
  await refresh()
}

const statusOptions = [
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'disabled' },
]

const columns = [
  { title: '用户名', key: 'username', width: 120 },
  { title: '姓名', key: 'real_name', width: 100 },
  { title: '手机号', key: 'phone', width: 130, render: (r: SafeUser) => r.phone ?? '—' },
  { title: '职位', key: 'position', width: 100, render: (r: SafeUser) => r.position ?? '—' },
  { title: '部门', key: 'department', width: 100, render: (r: SafeUser) => r.department ?? '—' },
  { title: '角色', key: 'role_id', width: 130, render: (r: SafeUser) => roleName(r.role_id) },
  {
    title: '状态', key: 'status', width: 80,
    render: (r: SafeUser) => h(NSwitch, {
      value: r.status === 'active',
      disabled: r.username === 'admin',
      onUpdateValue: (val: boolean) => toggleStatus(r, val),
    }),
  },
  { title: '最后登录', key: 'last_login_at', width: 160, render: (r: SafeUser) => r.last_login_at ? formatDateTime(r.last_login_at) : '尚未登录' },
  {
    title: '操作', key: 'actions', width: 200,
    render: (r: SafeUser) => h(NSpace, null, { default: () => [
      h(NButton, { size: 'small', onClick: () => openEdit(r) }, '编辑'),
      h(NButton, { size: 'small', onClick: () => openReset(r) }, '重置密码'),
      r.username !== 'admin' ? h(NButton, { size: 'small', type: 'error', onClick: () => {
        dialog.warning({ title: '删除账号', content: `确定要删除账号 ${r.username} 吗？`, positiveText: '确定', negativeText: '取消',
          onPositiveClick: async () => {
            const res = await userStore.remove(r.id)
            if (!res.ok) return message.error(res.error ?? '删除失败')
            message.success('已删除')
            await refresh()
          }
        })
      }}, '删除') : null,
    ]})
  },
]
</script>

<template>
  <BasePage title="账号管理">
    <NCard class="mb-4">
      <NSpace align="center" justify="space-between">
        <NSpace>
          <NInput v-model:value="search" placeholder="搜索用户名/姓名/手机号" clearable style="width: 220px" />
          <NSelect v-model:value="roleFilter" clearable placeholder="角色筛选" :options="roleOptions" style="width: 140px" />
          <NSelect v-model:value="statusFilter" clearable placeholder="状态筛选" :options="statusOptions" style="width: 120px" />
        </NSpace>
        <NSpace>
          <NButton :loading="refreshing" size="small" @click="refresh">刷新</NButton>
          <NButton v-perm="'user:create'" type="primary" @click="openCreate">+ 新增账号</NButton>
        </NSpace>
      </NSpace>
    </NCard>

    <BaseEmpty v-if="!userStore.loading && filtered.length === 0" description="暂无账号，点击右上角新增" />

    <BaseTable
      v-else
      :columns="columns"
      :data="filtered"
      :loading="userStore.loading"
      :pagination="{ pageSize: 15 }"
    />

    <!-- 新增/编辑弹窗 -->
    <NModal v-model:show="showUserModal" :title="editingId ? '编辑账号' : '新增账号'" preset="card" style="width:480px">
      <NForm :model="userForm" label-placement="left" label-width="90">
        <NFormItem label="用户名" required>
          <NInput v-model:value="userForm.username" :disabled="!!editingId" placeholder="登录用户名，创建后不可修改" />
        </NFormItem>
        <NFormItem v-if="!editingId" label="初始密码" required>
          <NInput v-model:value="userForm.password" type="password" show-password-on="click" placeholder="至少6位" />
        </NFormItem>
        <NFormItem label="姓名" required><NInput v-model:value="userForm.real_name" /></NFormItem>
        <NFormItem label="手机号"><NInput v-model:value="userForm.phone" /></NFormItem>
        <NFormItem label="职位">
          <NSelect v-model:value="userForm.position" :options="positionOptions" filterable tag placeholder="选择或输入职位" clearable />
        </NFormItem>
        <NFormItem label="部门">
          <NSelect v-model:value="userForm.department" :options="departmentOptions" filterable tag placeholder="选择或输入部门" clearable />
        </NFormItem>
        <NFormItem label="角色" required><NSelect v-model:value="userForm.role_id" :options="roleOptions" /></NFormItem>
        <NFormItem label="状态"><NSelect v-model:value="userForm.status" :options="statusOptions" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="userForm.remark" type="textarea" :rows="2" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showUserModal = false">取消</NButton>
          <NButton type="primary" @click="saveUser">保存</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 重置密码弹窗 -->
    <NModal v-model:show="showResetModal" title="重置密码" preset="card" style="width:400px">
      <NForm label-placement="left" label-width="90">
        <NFormItem label="新密码" required>
          <NInput v-model:value="resetPassword" type="password" show-password-on="click" placeholder="至少6位，重置后用户下次登录需修改密码" />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showResetModal = false">取消</NButton>
          <NButton type="primary" @click="confirmReset">确认重置</NButton>
        </NSpace>
      </template>
    </NModal>
  </BasePage>
</template>
