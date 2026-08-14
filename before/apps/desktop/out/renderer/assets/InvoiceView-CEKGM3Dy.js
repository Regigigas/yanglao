import { l as defineComponent, r as ref, o as onMounted, U as createBlock, W as withCtx, u as unref, a8 as useRoute, c as computed, V as openBlock, X as createVNode, k as createTextVNode, q as h } from "./vendor-vue-Ccw0-9Al.js";
import { _ as _sfc_main$2 } from "./BaseTable.vue_vue_type_script_setup_true_lang-EaGqNn2X.js";
import "./vendor-echarts-DKspkz-o.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-Ch3nPAu2.js";
import "./index-CCMxsNzX.js";
import { f as formatDateTime } from "./validators-BfKhytEl.js";
import { u as useElderlyStore } from "./elderly.store-D40oP61q.js";
import { u as useFeeStore } from "./fee.store-CX7j6U37.js";
import { u as useMessage, v as NSpace, J as NSelect, B as Button, g as NCard, j as NForm, k as NFormItem, l as NInput, U as NInputNumber, H as NDatePicker, h as NModal, o as NTag } from "./vendor-naive-B-M0K3Pm.js";
import "./vendor-query-Q9Uykhde.js";
import "./vendor-utils-DD6FGs_H.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "Invoice" },
  __name: "InvoiceView",
  setup(__props) {
    const route = useRoute();
    const message = useMessage();
    const elderlyStore = useElderlyStore();
    const feeStore = useFeeStore();
    const invoices = ref([]);
    const selectedElderlyId = ref(null);
    const loading = ref(false);
    const showModal = ref(false);
    const editingId = ref(null);
    const form = ref({ bill_id: "", elderly_id: "", invoice_no: "", title: "个人", tax_no: "", invoice_type: "normal", amount: 0, invoice_date: formatDateTime(Date.now()), status: "pending", email: "", operator: "", applicant: "", remark: "" });
    const elderlyOptions = computed(() => elderlyStore.list.map((item) => ({ label: item.name, value: item.id })));
    const paidBills = computed(() => feeStore.bills.filter((bill) => bill.status === "paid" && !invoices.value.some((invoice) => invoice.bill_id === bill.id)));
    const billOptions = computed(() => paidBills.value.map((bill) => ({ label: `${elderlyStore.list.find((item) => item.id === bill.elderly_id)?.name ?? bill.elderly_id} / ${bill.bill_month} / ¥${bill.paid}`, value: bill.id })));
    async function loadData() {
      loading.value = true;
      try {
        await Promise.all([elderlyStore.fetchList(), feeStore.fetchBills()]);
        invoices.value = await window.api.invoice.list(selectedElderlyId.value ?? void 0);
      } finally {
        loading.value = false;
      }
    }
    function openCreate(bill) {
      const target = paidBills.value.find((item) => item.id === route.query.billId) ?? paidBills.value[0];
      editingId.value = null;
      form.value = { bill_id: target?.id ?? "", elderly_id: target?.elderly_id ?? "", invoice_no: "", title: "个人", tax_no: "", invoice_type: "normal", amount: target?.paid ?? 0, invoice_date: formatDateTime(Date.now()), status: "pending", email: "", operator: "", applicant: "", remark: "" };
      showModal.value = true;
    }
    function openEdit(row) {
      if (row.status !== "pending") return message.warning("只有待处理发票可以编辑");
      editingId.value = row.id;
      form.value = { bill_id: row.bill_id, elderly_id: row.elderly_id, invoice_no: row.invoice_no, title: row.title, tax_no: row.tax_no ?? "", invoice_type: row.invoice_type, amount: row.amount, invoice_date: row.invoice_date, status: row.status, email: row.email ?? "", operator: row.operator ?? "", applicant: row.applicant ?? "", remark: row.remark ?? "" };
      showModal.value = true;
    }
    function selectBill(billId) {
      const bill = feeStore.bills.find((item) => item.id === billId);
      if (!bill) return;
      form.value.elderly_id = bill.elderly_id;
      form.value.amount = bill.paid;
    }
    async function save() {
      if (!form.value.bill_id || !form.value.invoice_no.trim() || !form.value.title.trim()) return message.error("请选择账单并填写发票号码、抬头");
      try {
        if (editingId.value) {
          await window.api.invoice.update(editingId.value, { title: form.value.title, tax_no: form.value.tax_no || null, applicant: form.value.applicant || null, remark: form.value.remark || null });
        } else {
          await window.api.invoice.create({ ...form.value, tax_no: form.value.tax_no || null, email: form.value.email || null, operator: form.value.operator || null, applicant: form.value.applicant || null, remark: form.value.remark || null });
        }
        showModal.value = false;
        message.success("发票已开具并进入同步队列");
        await loadData();
      } catch (error) {
        message.error(error instanceof Error ? error.message : "开票失败");
      }
    }
    async function voidInvoice(row) {
      try {
        await window.api.invoice.void(row.id, "业务作废");
        message.success("发票已作废，状态将同步到其他设备");
        await loadData();
      } catch (error) {
        message.error(error instanceof Error ? error.message : "作废失败");
      }
    }
    async function issueInvoice(row) {
      try {
        await window.api.invoice.issue(row.id);
        message.success("发票已确认开具，财务字段已锁定");
        await loadData();
      } catch (error) {
        message.error(error instanceof Error ? error.message : "确认开具失败");
      }
    }
    const columns = [
      { title: "发票号码", key: "invoice_no", minWidth: 140 },
      { title: "老人", key: "elderly_id", width: 100, render: (row) => elderlyStore.list.find((item) => item.id === row.elderly_id)?.name ?? row.elderly_id },
      { title: "抬头", key: "title", minWidth: 130 },
      { title: "金额", key: "amount", width: 100, render: (row) => `¥${row.amount.toFixed(2)}` },
      { title: "开票日期", key: "invoice_date", width: 165, render: (row) => formatDateTime(row.invoice_date) },
      { title: "状态", key: "status", width: 90, render: (row) => h(NTag, { type: row.status === "issued" ? "success" : row.status === "pending" ? "warning" : "error" }, () => ({ pending: "待处理", issued: "已开具", voided: "已作废" })[row.status]) },
      { title: "操作", key: "actions", width: 220, render: (row) => h(NSpace, null, { default: () => [h(Button, { size: "small", disabled: row.status !== "pending", onClick: () => openEdit(row) }, () => "编辑"), h(Button, { size: "small", type: "success", disabled: row.status !== "pending", onClick: () => issueInvoice(row) }, () => "确认开具"), h(Button, { size: "small", type: "error", disabled: row.status === "voided", onClick: () => voidInvoice(row) }, () => "作废")] }) }
    ];
    onMounted(async () => {
      await loadData();
      if (route.query.billId) openCreate();
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "发票管理" }, {
        default: withCtx(() => [
          createVNode(unref(NCard), { title: "发票列表" }, {
            "header-extra": withCtx(() => [
              createVNode(unref(NSpace), null, {
                default: withCtx(() => [
                  createVNode(unref(NSelect), {
                    value: selectedElderlyId.value,
                    "onUpdate:value": [
                      _cache[0] || (_cache[0] = ($event) => selectedElderlyId.value = $event),
                      loadData
                    ],
                    options: elderlyOptions.value,
                    clearable: "",
                    filterable: "",
                    placeholder: "筛选老人",
                    style: { "width": "180px" }
                  }, null, 8, ["value", "options"]),
                  createVNode(unref(Button), {
                    loading: loading.value,
                    onClick: loadData
                  }, {
                    default: withCtx(() => [..._cache[15] || (_cache[15] = [
                      createTextVNode("刷新", -1)
                    ])]),
                    _: 1
                  }, 8, ["loading"]),
                  createVNode(unref(Button), {
                    type: "primary",
                    disabled: !paidBills.value.length,
                    onClick: _cache[1] || (_cache[1] = ($event) => openCreate())
                  }, {
                    default: withCtx(() => [..._cache[16] || (_cache[16] = [
                      createTextVNode("+ 开具发票", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled"])
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(_sfc_main$2), {
                columns,
                data: invoices.value,
                loading: loading.value,
                pagination: { pageSize: 15 }
              }, null, 8, ["data", "loading"])
            ]),
            _: 1
          }),
          createVNode(unref(NModal), {
            show: showModal.value,
            "onUpdate:show": _cache[14] || (_cache[14] = ($event) => showModal.value = $event),
            title: editingId.value ? "编辑发票申请" : "新增发票申请",
            preset: "card",
            style: { "width": "520px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[13] || (_cache[13] = ($event) => showModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[17] || (_cache[17] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: save
                  }, {
                    default: withCtx(() => [..._cache[18] || (_cache[18] = [
                      createTextVNode("确认开票", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: form.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "已结清账单",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: form.value.bill_id,
                        "onUpdate:value": [
                          _cache[2] || (_cache[2] = ($event) => form.value.bill_id = $event),
                          selectBill
                        ],
                        options: billOptions.value,
                        disabled: !!editingId.value,
                        filterable: ""
                      }, null, 8, ["value", "options", "disabled"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "发票号码",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: form.value.invoice_no,
                        "onUpdate:value": _cache[3] || (_cache[3] = ($event) => form.value.invoice_no = $event),
                        disabled: !!editingId.value
                      }, null, 8, ["value", "disabled"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "发票抬头",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: form.value.title,
                        "onUpdate:value": _cache[4] || (_cache[4] = ($event) => form.value.title = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "税号" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: form.value.tax_no,
                        "onUpdate:value": _cache[5] || (_cache[5] = ($event) => form.value.tax_no = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "发票类型" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: form.value.invoice_type,
                        "onUpdate:value": _cache[6] || (_cache[6] = ($event) => form.value.invoice_type = $event),
                        disabled: !!editingId.value,
                        options: [{ label: "电子普通发票", value: "normal" }, { label: "增值税专用发票", value: "special" }]
                      }, null, 8, ["value", "disabled"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "开票金额" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: form.value.amount,
                        "onUpdate:value": _cache[7] || (_cache[7] = ($event) => form.value.amount = $event),
                        disabled: "",
                        precision: 2
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "开票日期" }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": form.value.invoice_date,
                        "onUpdate:formattedValue": _cache[8] || (_cache[8] = ($event) => form.value.invoice_date = $event),
                        disabled: !!editingId.value,
                        "value-format": "yyyy-MM-dd HH:mm:ss",
                        type: "datetime",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value", "disabled"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "接收邮箱" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: form.value.email,
                        "onUpdate:value": _cache[9] || (_cache[9] = ($event) => form.value.email = $event),
                        disabled: !!editingId.value
                      }, null, 8, ["value", "disabled"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "经办人" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: form.value.operator,
                        "onUpdate:value": _cache[10] || (_cache[10] = ($event) => form.value.operator = $event),
                        disabled: !!editingId.value
                      }, null, 8, ["value", "disabled"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "申请人" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: form.value.applicant,
                        "onUpdate:value": _cache[11] || (_cache[11] = ($event) => form.value.applicant = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: form.value.remark,
                        "onUpdate:value": _cache[12] || (_cache[12] = ($event) => form.value.remark = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["model"])
            ]),
            _: 1
          }, 8, ["show", "title"])
        ]),
        _: 1
      });
    };
  }
});
export {
  _sfc_main as default
};
