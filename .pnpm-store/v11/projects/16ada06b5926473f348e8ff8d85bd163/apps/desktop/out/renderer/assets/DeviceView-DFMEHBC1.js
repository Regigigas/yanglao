import { _ as _sfc_main$2 } from "./BaseTable.vue_vue_type_script_setup_true_lang-DzS_Zf-X.js";
import "./vendor-echarts-Bn4I93f0.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang--gRmLkOT.js";
import { u as useAuthStore } from "./index-Y_pGVxO7.js";
import { S as defineStore, r as ref, l as defineComponent, U as createBlock, W as withCtx, u as unref, V as openBlock, X as createVNode, a3 as createBaseVNode, k as createTextVNode, m as withDirectives, a9 as createCommentVNode, a1 as createElementBlock, F as Fragment, c as computed, q as h, ag as resolveDirective } from "./vendor-vue-C6_copC_.js";
import { u as useElderlyStore } from "./elderly.store-DDWtrLhY.js";
import { f as formatDateTime } from "./validators-BfKhytEl.js";
import { u as usePageRefresh } from "./usePageRefresh-C1gnRN9Y.js";
import { u as useMessage, p as useDialog, v as NSpace, B as Button, g as NCard, j as NForm, k as NFormItem, l as NInput, J as NSelect, U as NInputNumber, h as NModal, o as NTag } from "./vendor-naive-CeveemIE.js";
import "./vendor-query-DzdY0EvJ.js";
import "./vendor-utils-DD6FGs_H.js";
import "./useAutoRefresh-BeuDS8Br.js";
const useIotStore = defineStore("iot", () => {
  const devices = ref([]);
  const deviceData = ref([]);
  const alerts = ref([]);
  const loading = ref(false);
  async function fetchDevices() {
    loading.value = true;
    try {
      devices.value = await window.api.iot.device.list();
    } finally {
      loading.value = false;
    }
  }
  async function createDevice(data) {
    const row = await window.api.iot.device.create(data);
    devices.value.unshift(row);
    return row;
  }
  async function updateDevice(id, data) {
    await window.api.iot.device.update(id, data);
    const idx = devices.value.findIndex((d) => d.id === id);
    if (idx !== -1) devices.value[idx] = { ...devices.value[idx], ...data };
  }
  async function removeDevice(id) {
    await window.api.iot.device.delete(id);
    devices.value = devices.value.filter((d) => d.id !== id);
  }
  async function fetchDeviceData(deviceId, limit) {
    deviceData.value = await window.api.iot.data.list(deviceId, limit);
  }
  async function fetchDeviceDataByElderly(elderlyId, limit) {
    deviceData.value = await window.api.iot.data.listByElderly(elderlyId, limit);
  }
  async function checkHealth() {
    const result = await window.api.iot.alert.check();
    alerts.value = result.alerts;
    return result.opened;
  }
  async function fetchAlerts(includeResolved = false) {
    alerts.value = await window.api.iot.alert.list(includeResolved);
  }
  async function createManualAlert(data) {
    const row = await window.api.iot.alert.create(data);
    alerts.value.unshift(row);
    return row;
  }
  async function syncAlertToReminder(alertId, userId) {
    return window.api.iot.alert.syncReminder(alertId, userId);
  }
  async function startAlertRepair(id) {
    await window.api.iot.alert.startRepair(id);
    await fetchAlerts();
  }
  async function resolveAlert(id) {
    await window.api.iot.alert.resolve(id);
    await fetchAlerts();
  }
  async function simulateReport(deviceId, elderlyId, data) {
    return window.api.iot.report({ deviceId, elderlyId, data });
  }
  return {
    devices,
    deviceData,
    alerts,
    loading,
    fetchDevices,
    createDevice,
    updateDevice,
    removeDevice,
    fetchDeviceData,
    fetchDeviceDataByElderly,
    checkHealth,
    fetchAlerts,
    createManualAlert,
    syncAlertToReminder,
    startAlertRepair,
    resolveAlert,
    simulateReport
  };
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "IotDevice" },
  __name: "DeviceView",
  setup(__props) {
    const iotStore = useIotStore();
    const elderlyStore = useElderlyStore();
    const authStore = useAuthStore();
    const message = useMessage();
    const dialog = useDialog();
    async function loadData() {
      await Promise.all([iotStore.fetchDevices(), elderlyStore.fetchList()]);
      const opened = await iotStore.checkHealth();
      await syncAlertsToReminders(iotStore.alerts);
      if (opened.length) message.warning(`系统发现 ${opened.length} 项设备异常，请安排维修`);
      await iotStore.fetchDevices();
    }
    const { refresh, refreshing } = usePageRefresh(loadData);
    const elderlyOptions = computed(
      () => elderlyStore.list.filter((e) => e.status !== "left").map((e) => ({ label: e.name, value: e.id }))
    );
    function elderlyName(id) {
      if (!id) return "—（公共设备）";
      return elderlyStore.list.find((e) => e.id === id)?.name ?? "—";
    }
    const deviceTypeOptions = [
      { label: "智能体征监测仪", value: "vital_monitor" },
      { label: "智能手环", value: "wristband" },
      { label: "体重秤", value: "scale" },
      { label: "血压计", value: "blood_pressure" },
      { label: "电路监测器", value: "circuit_monitor" },
      { label: "网络网关/探针", value: "network_gateway" },
      { label: "其他", value: "other" }
    ];
    const deviceTypeLabel = {
      vital_monitor: "智能体征监测仪",
      wristband: "智能手环",
      scale: "体重秤",
      blood_pressure: "血压计",
      circuit_monitor: "电路监测器",
      network_gateway: "网络网关/探针",
      other: "其他"
    };
    const connTypeOptions = [
      { label: "WiFi（局域网 HTTP 上报）", value: "wifi" },
      { label: "蓝牙（设备档案登记，暂不支持自动数据接入）", value: "bluetooth" }
    ];
    const showDeviceModal = ref(false);
    const editingId = ref(null);
    const deviceForm = ref({
      name: "",
      device_type: "vital_monitor",
      conn_type: "wifi",
      ip_address: "",
      port: 8080,
      mac_address: "",
      elderly_id: null,
      remark: "",
      device_prefix: "DEV"
    });
    function openCreate() {
      editingId.value = null;
      deviceForm.value = { name: "", device_type: "vital_monitor", conn_type: "wifi", ip_address: "", port: 8080, mac_address: "", elderly_id: null, remark: "", device_prefix: "DEV" };
      showDeviceModal.value = true;
    }
    function openEdit(row) {
      editingId.value = row.id;
      deviceForm.value = {
        name: row.name,
        device_type: row.device_type,
        conn_type: row.conn_type,
        ip_address: row.ip_address ?? "",
        port: row.port,
        mac_address: row.mac_address ?? "",
        elderly_id: row.elderly_id,
        remark: row.remark ?? "",
        device_prefix: ""
      };
      showDeviceModal.value = true;
    }
    async function saveDevice() {
      if (!deviceForm.value.name) return message.error("请填写设备名称");
      const devicePrefix = deviceForm.value.device_prefix.trim();
      if (devicePrefix && /\s/.test(devicePrefix)) return message.error("设备编号前缀不能包含空白字符");
      if (deviceForm.value.conn_type === "wifi" && !deviceForm.value.ip_address) {
        return message.error("WiFi 设备请填写 IP 地址");
      }
      const payload = {
        ...deviceForm.value,
        ip_address: deviceForm.value.ip_address || null,
        mac_address: deviceForm.value.mac_address || null,
        remark: deviceForm.value.remark || null,
        device_prefix: devicePrefix
      };
      if (editingId.value) {
        const { device_prefix: _devicePrefix, ...updatePayload } = payload;
        await iotStore.updateDevice(editingId.value, updatePayload);
        message.success("保存成功");
      } else {
        await iotStore.createDevice(payload);
        message.success("设备已添加，WiFi 设备请在硬件端配置上报地址：http://本机局域网IP:7788/iot/report");
      }
      showDeviceModal.value = false;
      await iotStore.fetchDevices();
    }
    function removeDevice(row) {
      dialog.warning({
        title: "删除设备",
        content: `确定要删除设备"${row.name}"吗？`,
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: async () => {
          await iotStore.removeDevice(row.id);
          message.success("已删除");
          await iotStore.fetchDevices();
        }
      });
    }
    const showDataModal = ref(false);
    const currentDevice = ref(null);
    async function viewData(row) {
      currentDevice.value = row;
      await iotStore.fetchDeviceData(row.id, 50);
      showDataModal.value = true;
    }
    function parseData(json) {
      try {
        return JSON.parse(json);
      } catch {
        return {};
      }
    }
    function formatDataValue(json) {
      const obj = parseData(json);
      return Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join("，");
    }
    const showSimulateModal = ref(false);
    const simulateForm = ref({ key: "", value: "" });
    function openSimulate(row) {
      currentDevice.value = row;
      if (row.device_type === "circuit_monitor") simulateForm.value = { key: "voltage", value: "220" };
      else if (row.device_type === "network_gateway") simulateForm.value = { key: "network_status", value: "normal" };
      else simulateForm.value = { key: "heart_rate", value: "78" };
      showSimulateModal.value = true;
    }
    async function submitSimulate() {
      if (!currentDevice.value || !simulateForm.value.key) return;
      const res = await iotStore.simulateReport(currentDevice.value.id, currentDevice.value.elderly_id, {
        [simulateForm.value.key]: simulateForm.value.value
      });
      if (!res.ok) return message.error(res.error ?? "模拟上报失败");
      message.success("模拟数据上报成功，设备已标记为在线");
      showSimulateModal.value = false;
      await loadData();
    }
    function findAlert(deviceId, type) {
      return iotStore.alerts.find((alert) => alert.device_id === deviceId && alert.alert_type === type);
    }
    function networkStatus(device) {
      const alert = findAlert(device.id, "network");
      if (alert) return { type: alert.severity === "critical" ? "error" : "warning", label: alert.title };
      return { type: device.status === "online" ? "success" : "default", label: device.status === "online" ? "正常" : "待连接" };
    }
    function circuitStatus(device) {
      const alert = findAlert(device.id, "circuit");
      return alert ? { type: "error", label: alert.title } : { type: "success", label: "正常" };
    }
    async function syncAlertsToReminders(alerts, notify = false) {
      const userId = authStore.currentUser?.id;
      if (!userId || !alerts.length) return;
      const results = await Promise.all(alerts.map((alert) => iotStore.syncAlertToReminder(alert.id, userId)));
      const createdCount = results.filter((result) => result.created).length;
      if (notify && createdCount) message.success(`已同步 ${createdCount} 项维修任务到任务提醒`);
    }
    async function syncAlertToReminder(alert) {
      await syncAlertsToReminders([alert], true);
    }
    const showRepairModal = ref(false);
    const repairSubmitting = ref(false);
    const repairForm = ref({
      device_id: "",
      alert_type: "network",
      severity: "warning",
      title: "",
      content: ""
    });
    const repairDeviceOptions = computed(
      () => iotStore.devices.map((device) => ({ label: `${device.device_no} ${device.name}`, value: device.id }))
    );
    const repairTypeOptions = [
      { label: "网络维修", value: "network" },
      { label: "电路维修", value: "circuit" }
    ];
    const repairSeverityOptions = [
      { label: "一般", value: "warning" },
      { label: "紧急", value: "critical" }
    ];
    function openCreateRepair() {
      repairForm.value = {
        device_id: iotStore.devices[0]?.id ?? "",
        alert_type: "network",
        severity: "warning",
        title: "",
        content: ""
      };
      showRepairModal.value = true;
    }
    async function saveRepair() {
      if (!repairForm.value.device_id) return message.error("请选择设备");
      if (!repairForm.value.title.trim()) return message.error("请填写维修事项");
      if (!repairForm.value.content.trim()) return message.error("请填写维修说明");
      repairSubmitting.value = true;
      try {
        const alert = await iotStore.createManualAlert({
          ...repairForm.value,
          title: repairForm.value.title.trim(),
          content: repairForm.value.content.trim()
        });
        await syncAlertsToReminders([alert]);
        showRepairModal.value = false;
        message.success("维修事项已登记并同步到任务提醒");
      } finally {
        repairSubmitting.value = false;
      }
    }
    async function startRepair(alert) {
      await iotStore.startAlertRepair(alert.id);
      message.success("已标记为维修中");
    }
    async function resolveAlert(alert) {
      await iotStore.resolveAlert(alert.id);
      message.success("已确认修复");
    }
    const columns = [
      { title: "设备编号", key: "device_no", width: 130 },
      { title: "设备名称", key: "name", width: 150 },
      { title: "类型", key: "device_type", width: 130, render: (r) => deviceTypeLabel[r.device_type] ?? r.device_type },
      { title: "接入方式", key: "conn_type", width: 100, render: (r) => h(NTag, { type: r.conn_type === "wifi" ? "info" : "default" }, () => r.conn_type === "wifi" ? "WiFi" : "蓝牙") },
      { title: "地址", key: "ip_address", width: 150, render: (r) => r.conn_type === "wifi" ? `${r.ip_address ?? "—"}${r.port ? ":" + r.port : ""}` : r.mac_address ?? "—" },
      { title: "绑定老人", key: "elderly_id", width: 110, render: (r) => elderlyName(r.elderly_id) },
      { title: "网络情况", key: "network", width: 130, render: (r) => {
        const status = networkStatus(r);
        return h(NTag, { type: status.type }, () => status.label);
      } },
      { title: "电路情况", key: "circuit", width: 120, render: (r) => {
        const status = circuitStatus(r);
        return h(NTag, { type: status.type }, () => status.label);
      } },
      { title: "最近上报", key: "last_seen_at", width: 170, render: (r) => r.last_seen_at ? formatDateTime(r.last_seen_at) : "尚未上报" },
      {
        title: "操作",
        key: "actions",
        width: 220,
        render: (r) => h(NSpace, null, { default: () => [
          h(Button, { size: "small", onClick: () => viewData(r) }, "数据记录"),
          h(Button, { size: "small", onClick: () => openSimulate(r) }, "模拟上报"),
          h(Button, { size: "small", onClick: () => openEdit(r) }, "编辑"),
          h(Button, { size: "small", type: "error", onClick: () => removeDevice(r) }, "删除")
        ] })
      }
    ];
    const alertColumns = [
      { title: "设备", key: "device_name", width: 150, render: (r) => r.device_name ?? "已删除设备" },
      { title: "来源", key: "source", width: 80, render: (r) => h(NTag, { type: r.source === "manual" ? "info" : "default" }, () => r.source === "manual" ? "人工登记" : "自动巡检") },
      { title: "异常类别", key: "alert_type", width: 100, render: (r) => h(NTag, { type: r.alert_type === "circuit" ? "error" : "warning" }, () => r.alert_type === "circuit" ? "电路" : "网络") },
      { title: "异常说明", key: "content", minWidth: 320 },
      { title: "状态", key: "status", width: 100, render: (r) => h(NTag, { type: r.status === "pending" ? "error" : "warning" }, () => r.status === "pending" ? "待维修" : "维修中") },
      { title: "发现时间", key: "opened_at", width: 170, render: (r) => formatDateTime(r.opened_at) },
      {
        title: "操作",
        key: "actions",
        width: 245,
        render: (r) => h(NSpace, null, { default: () => [
          h(Button, { size: "small", onClick: () => syncAlertToReminder(r) }, "同步提醒"),
          r.status === "pending" ? h(Button, { size: "small", onClick: () => startRepair(r) }, "开始维修") : null,
          h(Button, { size: "small", type: "primary", onClick: () => resolveAlert(r) }, "确认修复")
        ].filter(Boolean) })
      }
    ];
    const dataColumns = [
      { title: "上报时间", key: "reported_at", width: 170, render: (r) => formatDateTime(r.reported_at) },
      { title: "数据内容", key: "data", render: (r) => formatDataValue(r.data) }
    ];
    return (_ctx, _cache) => {
      const _directive_perm = resolveDirective("perm");
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "设备与维修" }, {
        default: withCtx(() => [
          createVNode(unref(NCard), { class: "mb-4" }, {
            default: withCtx(() => [
              _cache[27] || (_cache[27] = createBaseVNode("div", { class: "text-sm text-gray-500 mb-2" }, [
                createTextVNode(" WiFi 设备接入说明：先在此注册设备的局域网 IP/端口，再在硬件端将数据上报地址配置为 "),
                createBaseVNode("code", null, "http://本机局域网IP:7788/iot/report"),
                createTextVNode("，POST JSON 格式 "),
                createBaseVNode("code", null, '{"deviceId":"设备ID","data":{...}}'),
                createTextVNode("。 电路监测器可上报 "),
                createBaseVNode("code", null, "voltage"),
                createTextVNode("、"),
                createBaseVNode("code", null, "circuit_status"),
                createTextVNode(" 或 "),
                createBaseVNode("code", null, "power_status"),
                createTextVNode("；网络网关可上报 "),
                createBaseVNode("code", null, "network_status"),
                createTextVNode("、"),
                createBaseVNode("code", null, "signal_strength"),
                createTextVNode("、"),
                createBaseVNode("code", null, "packet_loss"),
                createTextVNode("。 ")
              ], -1)),
              createVNode(unref(NSpace), null, {
                default: withCtx(() => [
                  withDirectives((openBlock(), createBlock(unref(Button), {
                    type: "primary",
                    onClick: openCreate
                  }, {
                    default: withCtx(() => [..._cache[24] || (_cache[24] = [
                      createTextVNode("+ 添加设备", -1)
                    ])]),
                    _: 1
                  })), [
                    [_directive_perm, "iot-device:create"]
                  ]),
                  createVNode(unref(Button), { onClick: openCreateRepair }, {
                    default: withCtx(() => [..._cache[25] || (_cache[25] = [
                      createTextVNode("+ 登记维修", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    loading: unref(refreshing),
                    size: "small",
                    onClick: unref(refresh)
                  }, {
                    default: withCtx(() => [..._cache[26] || (_cache[26] = [
                      createTextVNode("巡检刷新", -1)
                    ])]),
                    _: 1
                  }, 8, ["loading", "onClick"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          unref(iotStore).alerts.length ? (openBlock(), createBlock(unref(NCard), {
            key: 0,
            title: "待维修提醒",
            class: "mb-4"
          }, {
            default: withCtx(() => [
              createVNode(unref(_sfc_main$2), {
                columns: alertColumns,
                data: unref(iotStore).alerts,
                pagination: false
              }, null, 8, ["data"])
            ]),
            _: 1
          })) : createCommentVNode("", true),
          createVNode(unref(NCard), null, {
            default: withCtx(() => [
              createVNode(unref(_sfc_main$2), {
                columns,
                data: unref(iotStore).devices,
                loading: unref(iotStore).loading,
                pagination: { pageSize: 15 }
              }, null, 8, ["data", "loading"])
            ]),
            _: 1
          }),
          createVNode(unref(NModal), {
            show: showDeviceModal.value,
            "onUpdate:show": _cache[10] || (_cache[10] = ($event) => showDeviceModal.value = $event),
            title: editingId.value ? "编辑设备" : "添加设备",
            preset: "card",
            style: { "width": "520px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[9] || (_cache[9] = ($event) => showDeviceModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[28] || (_cache[28] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveDevice
                  }, {
                    default: withCtx(() => [..._cache[29] || (_cache[29] = [
                      createTextVNode("保存", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: deviceForm.value,
                "label-placement": "left",
                "label-width": "100"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "设备名称",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: deviceForm.value.name,
                        "onUpdate:value": _cache[0] || (_cache[0] = ($event) => deviceForm.value.name = $event),
                        placeholder: "如：3号床智能手环"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  !editingId.value ? (openBlock(), createBlock(unref(NFormItem), {
                    key: 0,
                    label: "编号前缀"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: deviceForm.value.device_prefix,
                        "onUpdate:value": _cache[1] || (_cache[1] = ($event) => deviceForm.value.device_prefix = $event),
                        maxlength: "20",
                        placeholder: "默认 DEV，可自行修改"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  createVNode(unref(NFormItem), { label: "设备类型" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: deviceForm.value.device_type,
                        "onUpdate:value": _cache[2] || (_cache[2] = ($event) => deviceForm.value.device_type = $event),
                        options: deviceTypeOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "接入方式" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: deviceForm.value.conn_type,
                        "onUpdate:value": _cache[3] || (_cache[3] = ($event) => deviceForm.value.conn_type = $event),
                        options: connTypeOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  deviceForm.value.conn_type === "wifi" ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                    createVNode(unref(NFormItem), {
                      label: "IP 地址",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NInput), {
                          value: deviceForm.value.ip_address,
                          "onUpdate:value": _cache[4] || (_cache[4] = ($event) => deviceForm.value.ip_address = $event),
                          placeholder: "如：192.168.1.20"
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(NFormItem), { label: "端口" }, {
                      default: withCtx(() => [
                        createVNode(unref(NInputNumber), {
                          value: deviceForm.value.port,
                          "onUpdate:value": _cache[5] || (_cache[5] = ($event) => deviceForm.value.port = $event),
                          min: 1,
                          max: 65535
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    })
                  ], 64)) : (openBlock(), createBlock(unref(NFormItem), {
                    key: 2,
                    label: "设备 MAC"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: deviceForm.value.mac_address,
                        "onUpdate:value": _cache[6] || (_cache[6] = ($event) => deviceForm.value.mac_address = $event),
                        placeholder: "蓝牙设备 MAC 地址"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })),
                  createVNode(unref(NFormItem), { label: "绑定老人" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: deviceForm.value.elderly_id,
                        "onUpdate:value": _cache[7] || (_cache[7] = ($event) => deviceForm.value.elderly_id = $event),
                        options: elderlyOptions.value,
                        clearable: "",
                        filterable: "",
                        placeholder: "可选，留空表示公共设备"
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: deviceForm.value.remark,
                        "onUpdate:value": _cache[8] || (_cache[8] = ($event) => deviceForm.value.remark = $event),
                        type: "textarea",
                        rows: 2
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["model"])
            ]),
            _: 1
          }, 8, ["show", "title"]),
          createVNode(unref(NModal), {
            show: showRepairModal.value,
            "onUpdate:show": _cache[17] || (_cache[17] = ($event) => showRepairModal.value = $event),
            title: "登记维修事项",
            preset: "card",
            style: { "width": "520px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[16] || (_cache[16] = ($event) => showRepairModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[30] || (_cache[30] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    loading: repairSubmitting.value,
                    onClick: saveRepair
                  }, {
                    default: withCtx(() => [..._cache[31] || (_cache[31] = [
                      createTextVNode("登记并同步", -1)
                    ])]),
                    _: 1
                  }, 8, ["loading"])
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: repairForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "维修设备",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: repairForm.value.device_id,
                        "onUpdate:value": _cache[11] || (_cache[11] = ($event) => repairForm.value.device_id = $event),
                        options: repairDeviceOptions.value,
                        filterable: "",
                        placeholder: "请选择设备"
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "维修类别" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: repairForm.value.alert_type,
                        "onUpdate:value": _cache[12] || (_cache[12] = ($event) => repairForm.value.alert_type = $event),
                        options: repairTypeOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "紧急程度" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: repairForm.value.severity,
                        "onUpdate:value": _cache[13] || (_cache[13] = ($event) => repairForm.value.severity = $event),
                        options: repairSeverityOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "维修事项",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: repairForm.value.title,
                        "onUpdate:value": _cache[14] || (_cache[14] = ($event) => repairForm.value.title = $event),
                        maxlength: "60",
                        placeholder: "如：更换房间网络面板"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "维修说明",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: repairForm.value.content,
                        "onUpdate:value": _cache[15] || (_cache[15] = ($event) => repairForm.value.content = $event),
                        type: "textarea",
                        rows: 3,
                        placeholder: "请填写故障表现、位置或处理要求"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["model"])
            ]),
            _: 1
          }, 8, ["show"]),
          createVNode(unref(NModal), {
            show: showDataModal.value,
            "onUpdate:show": _cache[19] || (_cache[19] = ($event) => showDataModal.value = $event),
            title: `${currentDevice.value?.name} - 数据记录`,
            preset: "card",
            style: { "width": "600px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[18] || (_cache[18] = ($event) => showDataModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[32] || (_cache[32] = [
                      createTextVNode("关闭", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(_sfc_main$2), {
                columns: dataColumns,
                data: unref(iotStore).deviceData,
                pagination: false
              }, null, 8, ["data"])
            ]),
            _: 1
          }, 8, ["show", "title"]),
          createVNode(unref(NModal), {
            show: showSimulateModal.value,
            "onUpdate:show": _cache[23] || (_cache[23] = ($event) => showSimulateModal.value = $event),
            title: "模拟设备数据上报（联调测试）",
            preset: "card",
            style: { "width": "420px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[22] || (_cache[22] = ($event) => showSimulateModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[33] || (_cache[33] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: submitSimulate
                  }, {
                    default: withCtx(() => [..._cache[34] || (_cache[34] = [
                      createTextVNode("发送模拟数据", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: simulateForm.value,
                "label-placement": "left",
                "label-width": "80"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), { label: "字段名" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: simulateForm.value.key,
                        "onUpdate:value": _cache[20] || (_cache[20] = ($event) => simulateForm.value.key = $event),
                        placeholder: "如：voltage、network_status、heart_rate"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "数值" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: simulateForm.value.value,
                        "onUpdate:value": _cache[21] || (_cache[21] = ($event) => simulateForm.value.value = $event),
                        placeholder: "如：220、normal、78"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["model"])
            ]),
            _: 1
          }, 8, ["show"])
        ]),
        _: 1
      });
    };
  }
});
export {
  _sfc_main as default
};
