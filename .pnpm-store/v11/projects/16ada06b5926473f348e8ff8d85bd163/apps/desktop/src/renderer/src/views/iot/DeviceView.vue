<script setup lang="ts">
defineOptions({ name: 'IotDevice' })
import {
  NCard, NButton, NSpace, NTag, NModal, NForm, NFormItem,
  NInput, NInputNumber, NSelect, useMessage, useDialog
} from 'naive-ui'
import { BasePage, BaseTable } from '@yanglao/ui'
import { useIotStore } from '../../stores/iot.store'
import { useElderlyStore } from '../../stores/elderly.store'
import { useAuthStore } from '../../stores/auth.store'
import { ref, h, computed } from 'vue'
import { formatDateTime } from '@yanglao/core'
import { usePageRefresh } from '../../composables/usePageRefresh'
import type { IotDeviceAlertRow, IotDeviceDataRow, IotDeviceRow } from '@yanglao/db'

const iotStore = useIotStore()
const elderlyStore = useElderlyStore()
const authStore = useAuthStore()
const message = useMessage()
const dialog = useDialog()

async function loadData() {
  await Promise.all([iotStore.fetchDevices(), elderlyStore.fetchList()])
  const opened = await iotStore.checkHealth()
  await syncAlertsToReminders(iotStore.alerts)
  if (opened.length) message.warning(`系统发现 ${opened.length} 项设备异常，请安排维修`)
  await iotStore.fetchDevices()
}
const { refresh, refreshing } = usePageRefresh(loadData)

const elderlyOptions = computed(() =>
  elderlyStore.list.filter(e => e.status !== 'left').map(e => ({ label: e.name, value: e.id }))
)

function elderlyName(id: string | null) {
  if (!id) return '—（公共设备）'
  return elderlyStore.list.find(e => e.id === id)?.name ?? '—'
}

const deviceTypeOptions = [
  { label: '智能体征监测仪', value: 'vital_monitor' },
  { label: '智能手环', value: 'wristband' },
  { label: '体重秤', value: 'scale' },
  { label: '血压计', value: 'blood_pressure' },
  { label: '电路监测器', value: 'circuit_monitor' },
  { label: '网络网关/探针', value: 'network_gateway' },
  { label: '其他', value: 'other' },
]
const deviceTypeLabel: Record<string, string> = {
  vital_monitor: '智能体征监测仪', wristband: '智能手环', scale: '体重秤', blood_pressure: '血压计',
  circuit_monitor: '电路监测器', network_gateway: '网络网关/探针', other: '其他',
}

const connTypeOptions = [
  { label: 'WiFi（局域网 HTTP 上报）', value: 'wifi' },
  { label: '蓝牙（设备档案登记，暂不支持自动数据接入）', value: 'bluetooth' },
]

// ── 新增/编辑设备 ─────────────────────────────────
const showDeviceModal = ref(false)
const editingId = ref<string | null>(null)
const deviceForm = ref({
  name: '', device_type: 'vital_monitor', conn_type: 'wifi' as 'wifi' | 'bluetooth',
  ip_address: '', port: 8080 as number | null, mac_address: '', elderly_id: null as string | null, remark: '', device_prefix: 'DEV',
})

function openCreate() {
  editingId.value = null
  deviceForm.value = { name: '', device_type: 'vital_monitor', conn_type: 'wifi', ip_address: '', port: 8080, mac_address: '', elderly_id: null, remark: '', device_prefix: 'DEV' }
  showDeviceModal.value = true
}

function openEdit(row: IotDeviceRow) {
  editingId.value = row.id
  deviceForm.value = {
    name: row.name, device_type: row.device_type, conn_type: row.conn_type,
    ip_address: row.ip_address ?? '', port: row.port, mac_address: row.mac_address ?? '',
    elderly_id: row.elderly_id, remark: row.remark ?? '', device_prefix: '',
  }
  showDeviceModal.value = true
}

async function saveDevice() {
  if (!deviceForm.value.name) return message.error('请填写设备名称')
  const devicePrefix = deviceForm.value.device_prefix.trim()
  if (devicePrefix && /\s/.test(devicePrefix)) return message.error('设备编号前缀不能包含空白字符')
  if (deviceForm.value.conn_type === 'wifi' && !deviceForm.value.ip_address) {
    return message.error('WiFi 设备请填写 IP 地址')
  }
  const payload = {
    ...deviceForm.value,
    ip_address: deviceForm.value.ip_address || null,
    mac_address: deviceForm.value.mac_address || null,
    remark: deviceForm.value.remark || null,
    device_prefix: devicePrefix,
  }
  if (editingId.value) {
    const { device_prefix: _devicePrefix, ...updatePayload } = payload
    await iotStore.updateDevice(editingId.value, updatePayload)
    message.success('保存成功')
  } else {
    await iotStore.createDevice(payload)
    message.success('设备已添加，WiFi 设备请在硬件端配置上报地址：http://本机局域网IP:7788/iot/report')
  }
  showDeviceModal.value = false
  await iotStore.fetchDevices()
}

function removeDevice(row: IotDeviceRow) {
  dialog.warning({
    title: '删除设备', content: `确定要删除设备"${row.name}"吗？`, positiveText: '确定', negativeText: '取消',
    onPositiveClick: async () => { await iotStore.removeDevice(row.id); message.success('已删除'); await iotStore.fetchDevices() }
  })
}

// ── 数据记录查看 ─────────────────────────────────
const showDataModal = ref(false)
const currentDevice = ref<IotDeviceRow | null>(null)

async function viewData(row: IotDeviceRow) {
  currentDevice.value = row
  await iotStore.fetchDeviceData(row.id, 50)
  showDataModal.value = true
}

function parseData(json: string): Record<string, unknown> {
  try { return JSON.parse(json) } catch { return {} }
}

function formatDataValue(json: string) {
  const obj = parseData(json)
  return Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join('，')
}

// ── 模拟上报（联调测试用） ─────────────────────────
const showSimulateModal = ref(false)
const simulateForm = ref({ key: '', value: '' })

function openSimulate(row: IotDeviceRow) {
  currentDevice.value = row
  if (row.device_type === 'circuit_monitor') simulateForm.value = { key: 'voltage', value: '220' }
  else if (row.device_type === 'network_gateway') simulateForm.value = { key: 'network_status', value: 'normal' }
  else simulateForm.value = { key: 'heart_rate', value: '78' }
  showSimulateModal.value = true
}

async function submitSimulate() {
  if (!currentDevice.value || !simulateForm.value.key) return
  const res = await iotStore.simulateReport(currentDevice.value.id, currentDevice.value.elderly_id, {
    [simulateForm.value.key]: simulateForm.value.value,
  })
  if (!res.ok) return message.error(res.error ?? '模拟上报失败')
  message.success('模拟数据上报成功，设备已标记为在线')
  showSimulateModal.value = false
  await loadData()
}

function findAlert(deviceId: string, type: IotDeviceAlertRow['alert_type']) {
  return iotStore.alerts.find(alert => alert.device_id === deviceId && alert.alert_type === type)
}

function networkStatus(device: IotDeviceRow) {
  const alert = findAlert(device.id, 'network')
  if (alert) return { type: alert.severity === 'critical' ? 'error' : 'warning', label: alert.title }
  return { type: device.status === 'online' ? 'success' : 'default', label: device.status === 'online' ? '正常' : '待连接' }
}

function circuitStatus(device: IotDeviceRow) {
  const alert = findAlert(device.id, 'circuit')
  return alert
    ? { type: 'error', label: alert.title }
    : { type: 'success', label: '正常' }
}

async function syncAlertsToReminders(alerts: IotDeviceAlertRow[], notify = false) {
  const userId = authStore.currentUser?.id
  if (!userId || !alerts.length) return
  const results = await Promise.all(alerts.map(alert => iotStore.syncAlertToReminder(alert.id, userId)))
  const createdCount = results.filter(result => result.created).length
  if (notify && createdCount) message.success(`已同步 ${createdCount} 项维修任务到任务提醒`)
}

async function syncAlertToReminder(alert: IotDeviceAlertRow) {
  await syncAlertsToReminders([alert], true)
}

// ── 人工登记维修事项 ───────────────────────────────────────────
const showRepairModal = ref(false)
const repairSubmitting = ref(false)
const repairForm = ref({
  device_id: '',
  alert_type: 'network' as 'network' | 'circuit',
  severity: 'warning' as 'warning' | 'critical',
  title: '',
  content: '',
})

const repairDeviceOptions = computed(() =>
  iotStore.devices.map(device => ({ label: `${device.device_no} ${device.name}`, value: device.id }))
)

const repairTypeOptions = [
  { label: '网络维修', value: 'network' },
  { label: '电路维修', value: 'circuit' },
]

const repairSeverityOptions = [
  { label: '一般', value: 'warning' },
  { label: '紧急', value: 'critical' },
]

function openCreateRepair() {
  repairForm.value = {
    device_id: iotStore.devices[0]?.id ?? '',
    alert_type: 'network',
    severity: 'warning',
    title: '',
    content: '',
  }
  showRepairModal.value = true
}

async function saveRepair() {
  if (!repairForm.value.device_id) return message.error('请选择设备')
  if (!repairForm.value.title.trim()) return message.error('请填写维修事项')
  if (!repairForm.value.content.trim()) return message.error('请填写维修说明')
  repairSubmitting.value = true
  try {
    const alert = await iotStore.createManualAlert({
      ...repairForm.value,
      title: repairForm.value.title.trim(),
      content: repairForm.value.content.trim(),
    })
    await syncAlertsToReminders([alert])
    showRepairModal.value = false
    message.success('维修事项已登记并同步到任务提醒')
  } finally {
    repairSubmitting.value = false
  }
}

async function startRepair(alert: IotDeviceAlertRow) {
  await iotStore.startAlertRepair(alert.id)
  message.success('已标记为维修中')
}

async function resolveAlert(alert: IotDeviceAlertRow) {
  await iotStore.resolveAlert(alert.id)
  message.success('已确认修复')
}

const columns = [
  { title: '设备编号', key: 'device_no', width: 130 },
  { title: '设备名称', key: 'name', width: 150 },
  { title: '类型', key: 'device_type', width: 130, render: (r: IotDeviceRow) => deviceTypeLabel[r.device_type] ?? r.device_type },
  { title: '接入方式', key: 'conn_type', width: 100, render: (r: IotDeviceRow) => h(NTag, { type: r.conn_type === 'wifi' ? 'info' : 'default' }, () => r.conn_type === 'wifi' ? 'WiFi' : '蓝牙') },
  { title: '地址', key: 'ip_address', width: 150, render: (r: IotDeviceRow) => r.conn_type === 'wifi' ? `${r.ip_address ?? '—'}${r.port ? ':' + r.port : ''}` : (r.mac_address ?? '—') },
  { title: '绑定老人', key: 'elderly_id', width: 110, render: (r: IotDeviceRow) => elderlyName(r.elderly_id) },
  { title: '网络情况', key: 'network', width: 130, render: (r: IotDeviceRow) => { const status = networkStatus(r); return h(NTag, { type: status.type as 'success' | 'warning' | 'error' | 'default' }, () => status.label) } },
  { title: '电路情况', key: 'circuit', width: 120, render: (r: IotDeviceRow) => { const status = circuitStatus(r); return h(NTag, { type: status.type as 'success' | 'error' }, () => status.label) } },
  { title: '最近上报', key: 'last_seen_at', width: 170, render: (r: IotDeviceRow) => r.last_seen_at ? formatDateTime(r.last_seen_at) : '尚未上报' },
  {
    title: '操作', key: 'actions', width: 220,
    render: (r: IotDeviceRow) => h(NSpace, null, { default: () => [
      h(NButton, { size: 'small', onClick: () => viewData(r) }, '数据记录'),
      h(NButton, { size: 'small', onClick: () => openSimulate(r) }, '模拟上报'),
      h(NButton, { size: 'small', onClick: () => openEdit(r) }, '编辑'),
      h(NButton, { size: 'small', type: 'error', onClick: () => removeDevice(r) }, '删除'),
    ]}),
  },
]

const alertColumns = [
  { title: '设备', key: 'device_name', width: 150, render: (r: IotDeviceAlertRow) => r.device_name ?? '已删除设备' },
  { title: '来源', key: 'source', width: 80, render: (r: IotDeviceAlertRow) => h(NTag, { type: r.source === 'manual' ? 'info' : 'default' }, () => r.source === 'manual' ? '人工登记' : '自动巡检') },
  { title: '异常类别', key: 'alert_type', width: 100, render: (r: IotDeviceAlertRow) => h(NTag, { type: r.alert_type === 'circuit' ? 'error' : 'warning' }, () => r.alert_type === 'circuit' ? '电路' : '网络') },
  { title: '异常说明', key: 'content', minWidth: 320 },
  { title: '状态', key: 'status', width: 100, render: (r: IotDeviceAlertRow) => h(NTag, { type: r.status === 'pending' ? 'error' : 'warning' }, () => r.status === 'pending' ? '待维修' : '维修中') },
  { title: '发现时间', key: 'opened_at', width: 170, render: (r: IotDeviceAlertRow) => formatDateTime(r.opened_at) },
  {
    title: '操作', key: 'actions', width: 245,
    render: (r: IotDeviceAlertRow) => h(NSpace, null, { default: () => [
      h(NButton, { size: 'small', onClick: () => syncAlertToReminder(r) }, '同步提醒'),
      r.status === 'pending' ? h(NButton, { size: 'small', onClick: () => startRepair(r) }, '开始维修') : null,
      h(NButton, { size: 'small', type: 'primary', onClick: () => resolveAlert(r) }, '确认修复'),
    ].filter(Boolean) }),
  },
]

const dataColumns = [
  { title: '上报时间', key: 'reported_at', width: 170, render: (r: IotDeviceDataRow) => formatDateTime(r.reported_at) },
  { title: '数据内容', key: 'data', render: (r: IotDeviceDataRow) => formatDataValue(r.data) },
]
</script>

<template>
  <BasePage title="设备与维修">
    <NCard class="mb-4">
      <div class="text-sm text-gray-500 mb-2">
        WiFi 设备接入说明：先在此注册设备的局域网 IP/端口，再在硬件端将数据上报地址配置为
        <code>http://本机局域网IP:7788/iot/report</code>，POST JSON 格式 <code>{"deviceId":"设备ID","data":{...}}</code>。
        电路监测器可上报 <code>voltage</code>、<code>circuit_status</code> 或 <code>power_status</code>；网络网关可上报 <code>network_status</code>、<code>signal_strength</code>、<code>packet_loss</code>。
      </div>
      <NSpace>
        <NButton v-perm="'iot-device:create'" type="primary" @click="openCreate">+ 添加设备</NButton>
        <NButton @click="openCreateRepair">+ 登记维修</NButton>
        <NButton :loading="refreshing" size="small" @click="refresh">巡检刷新</NButton>
      </NSpace>
    </NCard>

    <NCard v-if="iotStore.alerts.length" title="待维修提醒" class="mb-4">
      <BaseTable :columns="alertColumns" :data="iotStore.alerts" :pagination="false" />
    </NCard>

    <NCard>
      <BaseTable :columns="columns" :data="iotStore.devices" :loading="iotStore.loading" :pagination="{ pageSize: 15 }" />
    </NCard>

    <!-- 新增/编辑设备弹窗 -->
    <NModal v-model:show="showDeviceModal" :title="editingId ? '编辑设备' : '添加设备'" preset="card" style="width:520px">
      <NForm :model="deviceForm" label-placement="left" label-width="100">
        <NFormItem label="设备名称" required><NInput v-model:value="deviceForm.name" placeholder="如：3号床智能手环" /></NFormItem>
        <NFormItem v-if="!editingId" label="编号前缀"><NInput v-model:value="deviceForm.device_prefix" maxlength="20" placeholder="默认 DEV，可自行修改" /></NFormItem>
        <NFormItem label="设备类型"><NSelect v-model:value="deviceForm.device_type" :options="deviceTypeOptions" /></NFormItem>
        <NFormItem label="接入方式"><NSelect v-model:value="deviceForm.conn_type" :options="connTypeOptions" /></NFormItem>
        <template v-if="deviceForm.conn_type === 'wifi'">
          <NFormItem label="IP 地址" required><NInput v-model:value="deviceForm.ip_address" placeholder="如：192.168.1.20" /></NFormItem>
          <NFormItem label="端口"><NInputNumber v-model:value="deviceForm.port" :min="1" :max="65535" /></NFormItem>
        </template>
        <NFormItem v-else label="设备 MAC"><NInput v-model:value="deviceForm.mac_address" placeholder="蓝牙设备 MAC 地址" /></NFormItem>
        <NFormItem label="绑定老人"><NSelect v-model:value="deviceForm.elderly_id" :options="elderlyOptions" clearable filterable placeholder="可选，留空表示公共设备" /></NFormItem>
        <NFormItem label="备注"><NInput v-model:value="deviceForm.remark" type="textarea" :rows="2" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showDeviceModal = false">取消</NButton>
          <NButton type="primary" @click="saveDevice">保存</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 人工登记维修弹窗 -->
    <NModal v-model:show="showRepairModal" title="登记维修事项" preset="card" style="width:520px">
      <NForm :model="repairForm" label-placement="left" label-width="90">
        <NFormItem label="维修设备" required>
          <NSelect v-model:value="repairForm.device_id" :options="repairDeviceOptions" filterable placeholder="请选择设备" />
        </NFormItem>
        <NFormItem label="维修类别">
          <NSelect v-model:value="repairForm.alert_type" :options="repairTypeOptions" />
        </NFormItem>
        <NFormItem label="紧急程度">
          <NSelect v-model:value="repairForm.severity" :options="repairSeverityOptions" />
        </NFormItem>
        <NFormItem label="维修事项" required>
          <NInput v-model:value="repairForm.title" maxlength="60" placeholder="如：更换房间网络面板" />
        </NFormItem>
        <NFormItem label="维修说明" required>
          <NInput v-model:value="repairForm.content" type="textarea" :rows="3" placeholder="请填写故障表现、位置或处理要求" />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showRepairModal = false">取消</NButton>
          <NButton type="primary" :loading="repairSubmitting" @click="saveRepair">登记并同步</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 数据记录弹窗 -->
    <NModal v-model:show="showDataModal" :title="`${currentDevice?.name} - 数据记录`" preset="card" style="width:600px">
      <BaseTable :columns="dataColumns" :data="iotStore.deviceData" :pagination="false" />
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showDataModal = false">关闭</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 模拟上报弹窗 -->
    <NModal v-model:show="showSimulateModal" title="模拟设备数据上报（联调测试）" preset="card" style="width:420px">
      <NForm :model="simulateForm" label-placement="left" label-width="80">
        <NFormItem label="字段名"><NInput v-model:value="simulateForm.key" placeholder="如：voltage、network_status、heart_rate" /></NFormItem>
        <NFormItem label="数值"><NInput v-model:value="simulateForm.value" placeholder="如：220、normal、78" /></NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showSimulateModal = false">取消</NButton>
          <NButton type="primary" @click="submitSimulate">发送模拟数据</NButton>
        </NSpace>
      </template>
    </NModal>
  </BasePage>
</template>
