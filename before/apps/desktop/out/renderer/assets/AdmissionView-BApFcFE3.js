import { _ as _sfc_main$2 } from "./BaseTable.vue_vue_type_script_setup_true_lang-91_j3aWk.js";
import "./vendor-echarts-DEbY5nl3.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-DqZb80g7.js";
import "./index-BSVdjrbM.js";
import { S as defineStore, r as ref, l as defineComponent, U as createBlock, W as withCtx, u as unref, V as openBlock, X as createVNode, k as createTextVNode, a8 as toDisplayString, q as h, c as computed } from "./vendor-vue-Hc3ejqjp.js";
import { u as useBuildingStore } from "./building.store-ZepJ20td.js";
import { u as useElderlyStore } from "./elderly.store-isfnimJX.js";
import { f as formatDateTime } from "./validators-BfKhytEl.js";
import { u as usePageRefresh } from "./usePageRefresh-Wnx_lW1d.js";
import { u as useMessage, B as Button, v as NSpace, T as NTabPane, g as NCard, i as NAlert, o as NTag, U as NTabs, j as NForm, k as NFormItem, J as NSelect, H as NDatePicker, S as NInputNumber, l as NInput, h as NModal } from "./vendor-naive-sdNTCZPI.js";
import "./vendor-query-CFvMrhIw.js";
import "./vendor-utils-DD6FGs_H.js";
import "./useAutoRefresh-BeuDS8Br.js";
const useAdmissionStore = defineStore("admission", () => {
  const admissions = ref([]);
  const leaveRecords = ref([]);
  const discharges = ref([]);
  const loading = ref(false);
  async function fetchAdmissions(elderlyId) {
    loading.value = true;
    try {
      admissions.value = elderlyId ? await window.api.admission.listByElderly(elderlyId) : await window.api.admission.list();
    } finally {
      loading.value = false;
    }
  }
  async function createAdmission(data) {
    const row = await window.api.admission.create(data);
    admissions.value.unshift(row);
    return row;
  }
  async function updateAdmission(id, data) {
    await window.api.admission.update(id, data);
    const idx = admissions.value.findIndex((a) => a.id === id);
    if (idx !== -1) admissions.value[idx] = { ...admissions.value[idx], ...data };
  }
  async function fetchLeave(elderlyId) {
    leaveRecords.value = await window.api.leave.list(elderlyId);
  }
  async function createLeave(data) {
    const row = await window.api.leave.create(data);
    leaveRecords.value.unshift(row);
    return row;
  }
  async function returnFromLeave(id, actualReturn) {
    await window.api.leave.return(id, actualReturn);
    const idx = leaveRecords.value.findIndex((l) => l.id === id);
    if (idx !== -1) leaveRecords.value[idx] = { ...leaveRecords.value[idx], status: "returned", actual_return: actualReturn };
  }
  async function fetchDischarges(elderlyId) {
    discharges.value = await window.api.discharge.list(elderlyId);
  }
  async function createDischarge(data) {
    const row = await window.api.discharge.create(data);
    discharges.value.unshift(row);
    return row;
  }
  return {
    admissions,
    leaveRecords,
    discharges,
    loading,
    fetchAdmissions,
    createAdmission,
    updateAdmission,
    fetchLeave,
    createLeave,
    returnFromLeave,
    fetchDischarges,
    createDischarge
  };
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "Admission" },
  __name: "AdmissionView",
  setup(__props) {
    const admissionStore = useAdmissionStore();
    const buildingStore = useBuildingStore();
    const elderlyStore = useElderlyStore();
    const message = useMessage();
    async function loadData() {
      await Promise.all([
        admissionStore.fetchAdmissions(),
        buildingStore.fetchAll(),
        elderlyStore.fetchList()
      ]);
    }
    const { refresh, refreshing } = usePageRefresh(loadData);
    const showAdmissionModal = ref(false);
    function createAdmissionForm() {
      return {
        elderly_id: "",
        bed_id: "",
        admission_date: formatDateTime(Date.now()),
        care_level: "level2",
        deposit: 0,
        monthly_fee: 0,
        remark: ""
      };
    }
    const admissionForm = ref(createAdmissionForm());
    function openAdmissionModal() {
      admissionForm.value = createAdmissionForm();
      showAdmissionModal.value = true;
    }
    const pendingElderlyOptions = computed(
      () => elderlyStore.list.filter((e) => e.status !== "active").map((e) => ({ label: `${e.name}（${e.id_card ?? e.phone ?? ""}）`, value: e.id }))
    );
    const activeElderlyOptions = computed(
      () => elderlyStore.list.filter((e) => e.status === "active").map((e) => ({ label: `${e.name}（${e.id_card ?? e.phone ?? ""}）`, value: e.id }))
    );
    const dischargeElderlyOptions = computed(
      () => admissionStore.admissions.filter((a) => a.status === "active").map((a) => {
        const elderly = elderlyStore.list.find((e) => e.id === a.elderly_id);
        return {
          label: elderly ? `${elderly.name}（${elderly.id_card ?? elderly.phone ?? ""}）` : "未找到老人信息",
          value: a.elderly_id
        };
      })
    );
    const availableBedOptions = computed(() => {
      const available = buildingStore.beds.filter((b) => b.status === "available");
      return available.map((b) => {
        const room = buildingStore.rooms.find((r) => r.id === b.room_id);
        return { label: `${room?.room_no ?? ""}—${b.bed_no}`, value: b.id };
      });
    });
    const careLevelOptions = [
      { label: "自理（一级）", value: "level1" },
      { label: "半自理（二级）", value: "level2" },
      { label: "不能自理（三级）", value: "level3" },
      { label: "完全不能自理（四级）", value: "level4" }
    ];
    async function saveAdmission() {
      if (!admissionForm.value.elderly_id || !admissionForm.value.admission_date) {
        return message.error("请填写老人和入院日期");
      }
      try {
        await admissionStore.createAdmission({
          ...admissionForm.value,
          bed_id: admissionForm.value.bed_id || null,
          status: "active",
          remark: admissionForm.value.remark || null,
          created_by: null
        });
        if (admissionForm.value.bed_id) {
          await buildingStore.updateBed(admissionForm.value.bed_id, { status: "occupied", elderly_id: admissionForm.value.elderly_id });
        }
        await elderlyStore.update(admissionForm.value.elderly_id, {
          status: "active",
          bed_id: admissionForm.value.bed_id || null,
          admission_date: admissionForm.value.admission_date,
          care_level: admissionForm.value.care_level
        });
        showAdmissionModal.value = false;
        message.success("入院登记成功");
      } catch (e) {
        message.error(e instanceof Error ? e.message : "入院登记失败，请检查数据后重试");
      } finally {
        await refresh();
      }
    }
    const showLeaveModal = ref(false);
    const leaveForm = ref({ elderly_id: "", leave_date: formatDateTime(Date.now()), expect_return: null, reason: "", contact_phone: "" });
    async function saveLeave() {
      if (!leaveForm.value.elderly_id || !leaveForm.value.leave_date) return message.error("请填写必填项");
      try {
        await admissionStore.createLeave({ ...leaveForm.value, status: "out", actual_return: null, created_by: null });
        await elderlyStore.update(leaveForm.value.elderly_id, { status: "inactive" });
        showLeaveModal.value = false;
        message.success("暂离登记成功");
      } catch (e) {
        message.error(e instanceof Error ? e.message : "暂离登记失败，请检查数据后重试");
      } finally {
        await refresh();
      }
    }
    const showDischargeModal = ref(false);
    const dischargeForm = ref({ elderly_id: "", admission_id: "", discharge_date: formatDateTime(Date.now()), reason: "", refund_amount: 0, remark: "" });
    function openDischargeModal() {
      dischargeForm.value = { elderly_id: "", admission_id: "", discharge_date: formatDateTime(Date.now()), reason: "", refund_amount: 0, remark: "" };
      showDischargeModal.value = true;
    }
    const dischargeReasonOptions = [
      { label: "自愿离院", value: "自愿离院" },
      { label: "家属接回", value: "家属接回" },
      { label: "转院", value: "转院" },
      { label: "去世", value: "去世" },
      { label: "其他", value: "其他" }
    ];
    function onDischargeElderlyChange(elderlyId) {
      if (!elderlyId) {
        dischargeForm.value.admission_id = "";
        return;
      }
      const admission = admissionStore.admissions.find((a) => a.elderly_id === elderlyId && a.status === "active");
      dischargeForm.value.admission_id = admission?.id ?? "";
    }
    async function saveDischarge() {
      if (!dischargeForm.value.elderly_id || !dischargeForm.value.discharge_date) return message.error("请填写必填项");
      const elderly = elderlyStore.list.find((e) => e.id === dischargeForm.value.elderly_id);
      const bedId = elderly?.bed_id ?? null;
      try {
        await admissionStore.createDischarge({ ...dischargeForm.value, created_by: null });
        if (dischargeForm.value.admission_id) {
          await admissionStore.updateAdmission(dischargeForm.value.admission_id, { status: "discharged" });
        }
        await elderlyStore.update(dischargeForm.value.elderly_id, { status: "left", bed_id: null });
        if (bedId) {
          await buildingStore.updateBed(bedId, { status: "available", elderly_id: null });
        }
        showDischargeModal.value = false;
        message.success("离院办理成功");
      } catch (e) {
        message.error(e instanceof Error ? e.message : "离院办理失败，请检查数据后重试");
      } finally {
        await refresh();
      }
    }
    const admissionColumns = [
      { title: "老人姓名", key: "elderly_id", width: 100, render: (r) => elderlyStore.list.find((e) => e.id === r.elderly_id)?.name ?? r.elderly_id },
      { title: "入院日期", key: "admission_date", width: 160, render: (r) => formatDateTime(r.admission_date) },
      { title: "护理级别", key: "care_level", width: 130, render: (r) => careLevelOptions.find((c) => c.value === r.care_level)?.label ?? r.care_level },
      { title: "押金(元)", key: "deposit", width: 100 },
      { title: "月费(元)", key: "monthly_fee", width: 100 },
      { title: "状态", key: "status", width: 80, render: (r) => h(NTag, { type: r.status === "active" ? "success" : "default" }, () => r.status === "active" ? "在院" : "已离院") },
      {
        title: "操作",
        key: "actions",
        width: 120,
        render: (r) => h(Button, {
          size: "small",
          type: "error",
          disabled: r.status !== "active",
          onClick: () => {
            dischargeForm.value = { elderly_id: r.elderly_id, admission_id: r.id, discharge_date: formatDateTime(Date.now()), reason: "自愿离院", refund_amount: 0, remark: "" };
            showDischargeModal.value = true;
          }
        }, () => "办理离院")
      }
    ];
    const outElderlyList = computed(
      () => elderlyStore.list.filter((e) => e.status === "inactive")
    );
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "入住管理" }, {
        default: withCtx(() => [
          createVNode(unref(NSpace), { class: "mb-4" }, {
            default: withCtx(() => [
              createVNode(unref(Button), {
                type: "primary",
                onClick: openAdmissionModal
              }, {
                default: withCtx(() => [..._cache[24] || (_cache[24] = [
                  createTextVNode("+ 办理入院", -1)
                ])]),
                _: 1
              }),
              createVNode(unref(Button), {
                onClick: _cache[0] || (_cache[0] = ($event) => showLeaveModal.value = true)
              }, {
                default: withCtx(() => [..._cache[25] || (_cache[25] = [
                  createTextVNode("+ 暂离登记", -1)
                ])]),
                _: 1
              }),
              createVNode(unref(Button), { onClick: openDischargeModal }, {
                default: withCtx(() => [..._cache[26] || (_cache[26] = [
                  createTextVNode("办理离院", -1)
                ])]),
                _: 1
              }),
              createVNode(unref(Button), {
                loading: unref(refreshing),
                size: "small",
                onClick: unref(refresh)
              }, {
                default: withCtx(() => [..._cache[27] || (_cache[27] = [
                  createTextVNode("刷新", -1)
                ])]),
                _: 1
              }, 8, ["loading", "onClick"])
            ]),
            _: 1
          }),
          createVNode(unref(NTabs), {
            type: "line",
            animated: ""
          }, {
            default: withCtx(() => [
              createVNode(unref(NTabPane), {
                name: "active",
                tab: "在院记录"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: admissionColumns,
                        data: unref(admissionStore).admissions.filter((a) => a.status === "active"),
                        loading: unref(admissionStore).loading,
                        pagination: { pageSize: 15 }
                      }, null, 8, ["data", "loading"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NTabPane), {
                name: "leave",
                tab: `暂离中（${outElderlyList.value.length}人）`
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createVNode(unref(NSpace), { class: "mb-3" }, {
                        default: withCtx(() => [
                          createVNode(unref(NAlert), {
                            type: "warning",
                            style: { "flex": "1" }
                          }, {
                            default: withCtx(() => [
                              createTextVNode("当前有 " + toDisplayString(outElderlyList.value.length) + " 位老人在外，请及时关注返院情况。", 1)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$2), {
                        columns: [
                          { title: "老人姓名", key: "name", width: 100 },
                          { title: "房间号", key: "room_no", width: 100 },
                          { title: "手机号", key: "phone", width: 130 },
                          { title: "状态", key: "status", width: 80, render: () => h(unref(NTag), { type: "warning" }, () => "暂离") }
                        ],
                        data: outElderlyList.value,
                        pagination: false
                      }, null, 8, ["columns", "data"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["tab"]),
              createVNode(unref(NTabPane), {
                name: "discharged",
                tab: "离院历史"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: admissionColumns,
                        data: unref(admissionStore).admissions.filter((a) => a.status === "discharged"),
                        loading: unref(admissionStore).loading,
                        pagination: { pageSize: 15 }
                      }, null, 8, ["data", "loading"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(unref(NModal), {
            show: showAdmissionModal.value,
            "onUpdate:show": _cache[9] || (_cache[9] = ($event) => showAdmissionModal.value = $event),
            title: "办理入院",
            preset: "card",
            style: { "width": "520px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[8] || (_cache[8] = ($event) => showAdmissionModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[28] || (_cache[28] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveAdmission
                  }, {
                    default: withCtx(() => [..._cache[29] || (_cache[29] = [
                      createTextVNode("确认入院", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: admissionForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "选择老人",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: admissionForm.value.elderly_id,
                        "onUpdate:value": _cache[1] || (_cache[1] = ($event) => admissionForm.value.elderly_id = $event),
                        options: pendingElderlyOptions.value,
                        filterable: "",
                        placeholder: "搜索待入院老人"
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "分配床位" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: admissionForm.value.bed_id,
                        "onUpdate:value": _cache[2] || (_cache[2] = ($event) => admissionForm.value.bed_id = $event),
                        options: availableBedOptions.value,
                        clearable: "",
                        placeholder: "选择空闲床位"
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "入院日期",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": admissionForm.value.admission_date,
                        "onUpdate:formattedValue": _cache[3] || (_cache[3] = ($event) => admissionForm.value.admission_date = $event),
                        "value-format": "yyyy-MM-dd HH:mm:ss",
                        type: "datetime",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "护理级别" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: admissionForm.value.care_level,
                        "onUpdate:value": _cache[4] || (_cache[4] = ($event) => admissionForm.value.care_level = $event),
                        options: careLevelOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "押金(元)" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: admissionForm.value.deposit,
                        "onUpdate:value": _cache[5] || (_cache[5] = ($event) => admissionForm.value.deposit = $event),
                        min: 0,
                        precision: 2
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "月费用(元)" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: admissionForm.value.monthly_fee,
                        "onUpdate:value": _cache[6] || (_cache[6] = ($event) => admissionForm.value.monthly_fee = $event),
                        min: 0,
                        precision: 2
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: admissionForm.value.remark,
                        "onUpdate:value": _cache[7] || (_cache[7] = ($event) => admissionForm.value.remark = $event),
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
          }, 8, ["show"]),
          createVNode(unref(NModal), {
            show: showLeaveModal.value,
            "onUpdate:show": _cache[16] || (_cache[16] = ($event) => showLeaveModal.value = $event),
            title: "暂离登记",
            preset: "card",
            style: { "width": "480px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[15] || (_cache[15] = ($event) => showLeaveModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[30] || (_cache[30] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveLeave
                  }, {
                    default: withCtx(() => [..._cache[31] || (_cache[31] = [
                      createTextVNode("登记外出", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: leaveForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "选择老人",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: leaveForm.value.elderly_id,
                        "onUpdate:value": _cache[10] || (_cache[10] = ($event) => leaveForm.value.elderly_id = $event),
                        options: activeElderlyOptions.value,
                        filterable: ""
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "外出日期",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": leaveForm.value.leave_date,
                        "onUpdate:formattedValue": _cache[11] || (_cache[11] = ($event) => leaveForm.value.leave_date = $event),
                        "value-format": "yyyy-MM-dd HH:mm:ss",
                        type: "datetime",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "预计返院" }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": leaveForm.value.expect_return,
                        "onUpdate:formattedValue": _cache[12] || (_cache[12] = ($event) => leaveForm.value.expect_return = $event),
                        "value-format": "yyyy-MM-dd HH:mm:ss",
                        type: "datetime",
                        clearable: "",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "外出原因" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: leaveForm.value.reason,
                        "onUpdate:value": _cache[13] || (_cache[13] = ($event) => leaveForm.value.reason = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "联系电话" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: leaveForm.value.contact_phone,
                        "onUpdate:value": _cache[14] || (_cache[14] = ($event) => leaveForm.value.contact_phone = $event)
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
            show: showDischargeModal.value,
            "onUpdate:show": _cache[23] || (_cache[23] = ($event) => showDischargeModal.value = $event),
            title: "办理离院",
            preset: "card",
            style: { "width": "480px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[22] || (_cache[22] = ($event) => showDischargeModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[32] || (_cache[32] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveDischarge
                  }, {
                    default: withCtx(() => [..._cache[33] || (_cache[33] = [
                      createTextVNode("确认离院", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: dischargeForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "选择老人",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: dischargeForm.value.elderly_id,
                        "onUpdate:value": [
                          _cache[17] || (_cache[17] = ($event) => dischargeForm.value.elderly_id = $event),
                          onDischargeElderlyChange
                        ],
                        options: dischargeElderlyOptions.value,
                        filterable: ""
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "离院日期",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": dischargeForm.value.discharge_date,
                        "onUpdate:formattedValue": _cache[18] || (_cache[18] = ($event) => dischargeForm.value.discharge_date = $event),
                        "value-format": "yyyy-MM-dd HH:mm:ss",
                        type: "datetime",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "离院原因",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: dischargeForm.value.reason,
                        "onUpdate:value": _cache[19] || (_cache[19] = ($event) => dischargeForm.value.reason = $event),
                        options: dischargeReasonOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "退款金额" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: dischargeForm.value.refund_amount,
                        "onUpdate:value": _cache[20] || (_cache[20] = ($event) => dischargeForm.value.refund_amount = $event),
                        min: 0,
                        precision: 2
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: dischargeForm.value.remark,
                        "onUpdate:value": _cache[21] || (_cache[21] = ($event) => dischargeForm.value.remark = $event),
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
