import { _ as _sfc_main$2 } from "./BaseTable.vue_vue_type_script_setup_true_lang-DzS_Zf-X.js";
import "./vendor-echarts-Bn4I93f0.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang--gRmLkOT.js";
import "./index-Y_pGVxO7.js";
import { u as useContractStore } from "./contract.store-DmfAtV6u.js";
import { u as useElderlyStore } from "./elderly.store-DDWtrLhY.js";
import { f as formatDateTime } from "./validators-BfKhytEl.js";
import { u as usePageRefresh } from "./usePageRefresh-C1gnRN9Y.js";
import { u as useMessage, p as useDialog, i as NAlert, B as Button, v as NSpace, g as NCard, j as NForm, k as NFormItem, l as NInput, J as NSelect, H as NDatePicker, U as NInputNumber, h as NModal, o as NTag } from "./vendor-naive-CeveemIE.js";
import { l as defineComponent, U as createBlock, W as withCtx, u as unref, V as openBlock, k as createTextVNode, a8 as toDisplayString, a9 as createCommentVNode, X as createVNode, a1 as createElementBlock, c as computed, r as ref, q as h } from "./vendor-vue-C6_copC_.js";
import "./vendor-query-DzdY0EvJ.js";
import "./vendor-utils-DD6FGs_H.js";
import "./useAutoRefresh-BeuDS8Br.js";
const _hoisted_1 = {
  key: 1,
  class: "text-xs text-gray-400"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "Contract" },
  __name: "ContractView",
  setup(__props) {
    const contractStore = useContractStore();
    const elderlyStore = useElderlyStore();
    const message = useMessage();
    const dialog = useDialog();
    async function loadData() {
      await Promise.all([
        contractStore.fetchAll(),
        contractStore.fetchExpiring(30),
        elderlyStore.fetchList()
      ]);
    }
    const { refresh, refreshing } = usePageRefresh(loadData);
    const elderlyOptions = computed(
      () => elderlyStore.list.map((e) => ({ label: e.name, value: e.id }))
    );
    const showContractModal = ref(false);
    const contractForm = ref(createContractForm());
    const attachmentName = ref("");
    function createContractForm() {
      const now = Date.now();
      return {
        elderly_id: "",
        contract_no: "",
        sign_date: now,
        start_date: now,
        end_date: null,
        auto_renew: 0,
        renew_months: 12,
        monthly_amount: 0,
        status: "active",
        file_path: "",
        remark: "",
        created_by: ""
      };
    }
    async function openNewContract() {
      const no = await contractStore.genContractNo();
      contractForm.value = { ...createContractForm(), contract_no: no };
      attachmentName.value = "";
      showContractModal.value = true;
    }
    async function saveContract() {
      if (!contractForm.value.elderly_id || !contractForm.value.start_date || !contractForm.value.end_date) {
        return message.error("请填写老人、开始日期和结束日期");
      }
      await contractStore.create({
        ...contractForm.value,
        sign_date: formatDateTime(contractForm.value.sign_date),
        start_date: formatDateTime(contractForm.value.start_date),
        end_date: formatDateTime(contractForm.value.end_date)
      });
      showContractModal.value = false;
      message.success("合同已创建");
      await refresh();
    }
    async function selectAttachment() {
      try {
        const result = await window.api.contract.selectAttachment();
        if (result.canceled || !result.filePath) return;
        contractForm.value.file_path = result.filePath;
        attachmentName.value = result.fileName ?? "已选择合同扫描件";
      } catch {
        message.error("选择合同扫描件失败");
      }
    }
    async function openAttachment(filePath) {
      try {
        await window.api.contract.openAttachment(filePath);
      } catch {
        message.error("无法打开合同扫描件，文件可能已被移动或删除");
      }
    }
    async function terminateContract(id) {
      dialog.warning({
        title: "终止合同",
        content: "确定要终止此合同吗？",
        positiveText: "确定终止",
        negativeText: "取消",
        onPositiveClick: async () => {
          await contractStore.update(id, { status: "terminated" });
          message.success("合同已终止");
          await refresh();
        }
      });
    }
    const statusTagType = {
      active: "success",
      expired: "warning",
      terminated: "error"
    };
    const statusLabel = {
      active: "有效",
      expired: "已过期",
      terminated: "已终止"
    };
    const contractColumns = [
      { title: "合同编号", key: "contract_no", width: 160 },
      { title: "老人", key: "elderly_id", width: 90, render: (r) => elderlyStore.list.find((e) => e.id === r.elderly_id)?.name ?? "—" },
      { title: "签订日期", key: "sign_date", width: 160, render: (r) => formatDateTime(r.sign_date) },
      { title: "起始日期", key: "start_date", width: 160, render: (r) => formatDateTime(r.start_date) },
      { title: "终止日期", key: "end_date", width: 160, render: (r) => formatDateTime(r.end_date) },
      { title: "月费(元)", key: "monthly_amount", width: 100, render: (r) => `¥${r.monthly_amount}` },
      { title: "扫描件", key: "file_path", width: 90, render: (r) => r.file_path ? h(Button, { text: true, type: "primary", size: "small", onClick: () => openAttachment(r.file_path) }, "查看") : "—" },
      { title: "状态", key: "status", width: 90, render: (r) => h(NTag, { type: statusTagType[r.status] ?? "default" }, () => statusLabel[r.status] ?? r.status) },
      {
        title: "操作",
        key: "actions",
        width: 120,
        render: (r) => h(NSpace, null, { default: () => [
          h(Button, { size: "small", disabled: r.status !== "active", onClick: () => terminateContract(r.id) }, "终止"),
          h(Button, { size: "small", type: "error", onClick: () => {
            dialog.warning({
              title: "删除",
              content: "确认删除？",
              positiveText: "确定",
              negativeText: "取消",
              onPositiveClick: async () => {
                await contractStore.remove(r.id);
                message.success("已删除");
                await refresh();
              }
            });
          } }, "删除")
        ] })
      }
    ];
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "合同管理" }, {
        default: withCtx(() => [
          unref(contractStore).expiring.length > 0 ? (openBlock(), createBlock(unref(NAlert), {
            key: 0,
            type: "warning",
            class: "mb-4",
            title: "合同即将到期提醒"
          }, {
            default: withCtx(() => [
              createTextVNode(" 以下 " + toDisplayString(unref(contractStore).expiring.length) + " 份合同将在30天内到期，请及时处理： " + toDisplayString(unref(contractStore).expiring.map((c) => unref(elderlyStore).list.find((e) => e.id === c.elderly_id)?.name).filter(Boolean).join("、")), 1)
            ]),
            _: 1
          })) : createCommentVNode("", true),
          createVNode(unref(NSpace), {
            justify: "end",
            class: "mb-4"
          }, {
            default: withCtx(() => [
              createVNode(unref(Button), {
                loading: unref(refreshing),
                size: "small",
                onClick: unref(refresh)
              }, {
                default: withCtx(() => [..._cache[12] || (_cache[12] = [
                  createTextVNode("刷新", -1)
                ])]),
                _: 1
              }, 8, ["loading", "onClick"]),
              createVNode(unref(Button), {
                type: "primary",
                onClick: openNewContract
              }, {
                default: withCtx(() => [..._cache[13] || (_cache[13] = [
                  createTextVNode("新建合同", -1)
                ])]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(unref(NCard), null, {
            default: withCtx(() => [
              createVNode(unref(_sfc_main$2), {
                columns: contractColumns,
                data: unref(contractStore).list,
                loading: unref(contractStore).loading,
                pagination: { pageSize: 15 }
              }, null, 8, ["data", "loading"])
            ]),
            _: 1
          }),
          createVNode(unref(NModal), {
            show: showContractModal.value,
            "onUpdate:show": _cache[11] || (_cache[11] = ($event) => showContractModal.value = $event),
            title: "新建合同",
            preset: "card",
            style: { "width": "560px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[10] || (_cache[10] = ($event) => showContractModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[15] || (_cache[15] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveContract
                  }, {
                    default: withCtx(() => [..._cache[16] || (_cache[16] = [
                      createTextVNode("签署合同", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: contractForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), { label: "合同编号" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: contractForm.value.contract_no,
                        "onUpdate:value": _cache[0] || (_cache[0] = ($event) => contractForm.value.contract_no = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "老人",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: contractForm.value.elderly_id,
                        "onUpdate:value": _cache[1] || (_cache[1] = ($event) => contractForm.value.elderly_id = $event),
                        options: elderlyOptions.value,
                        filterable: ""
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "签订日期" }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        value: contractForm.value.sign_date,
                        "onUpdate:value": _cache[2] || (_cache[2] = ($event) => contractForm.value.sign_date = $event),
                        type: "date",
                        style: { "width": "100%" }
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "开始日期",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        value: contractForm.value.start_date,
                        "onUpdate:value": _cache[3] || (_cache[3] = ($event) => contractForm.value.start_date = $event),
                        type: "date",
                        style: { "width": "100%" }
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "结束日期",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        value: contractForm.value.end_date,
                        "onUpdate:value": _cache[4] || (_cache[4] = ($event) => contractForm.value.end_date = $event),
                        type: "date",
                        style: { "width": "100%" }
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "月费用(元)" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: contractForm.value.monthly_amount,
                        "onUpdate:value": _cache[5] || (_cache[5] = ($event) => contractForm.value.monthly_amount = $event),
                        min: 0,
                        precision: 2
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "自动续签" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: contractForm.value.auto_renew,
                        "onUpdate:value": _cache[6] || (_cache[6] = ($event) => contractForm.value.auto_renew = $event),
                        options: [{ label: "否", value: 0 }, { label: "是", value: 1 }]
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  contractForm.value.auto_renew ? (openBlock(), createBlock(unref(NFormItem), {
                    key: 0,
                    label: "续签月数"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: contractForm.value.renew_months,
                        "onUpdate:value": _cache[7] || (_cache[7] = ($event) => contractForm.value.renew_months = $event),
                        min: 1
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  createVNode(unref(NFormItem), { label: "合同扫描件" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSpace), { align: "center" }, {
                        default: withCtx(() => [
                          createVNode(unref(Button), {
                            size: "small",
                            onClick: selectAttachment
                          }, {
                            default: withCtx(() => [..._cache[14] || (_cache[14] = [
                              createTextVNode("选择文件", -1)
                            ])]),
                            _: 1
                          }),
                          contractForm.value.file_path ? (openBlock(), createBlock(unref(Button), {
                            key: 0,
                            text: "",
                            type: "primary",
                            size: "small",
                            onClick: _cache[8] || (_cache[8] = ($event) => openAttachment(contractForm.value.file_path))
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(attachmentName.value || "查看已选择文件"), 1)
                            ]),
                            _: 1
                          })) : (openBlock(), createElementBlock("span", _hoisted_1, "支持 PDF、JPG、PNG、WebP"))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: contractForm.value.remark,
                        "onUpdate:value": _cache[9] || (_cache[9] = ($event) => contractForm.value.remark = $event),
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
