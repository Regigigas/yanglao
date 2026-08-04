import { _ as _sfc_main$2 } from "./BaseTable.vue_vue_type_script_setup_true_lang-Kf6svQhn.js";
import "./vendor-echarts-DEbY5nl3.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-CoKRdyPV.js";
import "./index-77IpmxCe.js";
import { u as useFeeStore } from "./fee.store-hhm9SzRA.js";
import { u as useElderlyStore } from "./elderly.store-isfnimJX.js";
import { f as formatDateTime } from "./validators-BfKhytEl.js";
import { u as usePageRefresh } from "./usePageRefresh-Wnx_lW1d.js";
import { u as useMessage, T as NTabPane, g as NCard, v as NSpace, B as Button, P as NGrid, M as NGi, O as NStatistic, H as NDatePicker, W as NDivider, J as NSelect, o as NTag, U as NTabs, j as NForm, k as NFormItem, l as NInput, S as NInputNumber, h as NModal } from "./vendor-naive-sdNTCZPI.js";
import { l as defineComponent, r as ref, U as createBlock, W as withCtx, u as unref, V as openBlock, X as createVNode, k as createTextVNode, a9 as createCommentVNode, q as h, a1 as createElementBlock, a6 as renderList, F as Fragment, a8 as toDisplayString, c as computed } from "./vendor-vue-Hc3ejqjp.js";
import "./vendor-query-CFvMrhIw.js";
import "./vendor-utils-DD6FGs_H.js";
import "./useAutoRefresh-BeuDS8Br.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "Fee" },
  __name: "FeeView",
  setup(__props) {
    const feeStore = useFeeStore();
    const elderlyStore = useElderlyStore();
    const message = useMessage();
    const selectedElderlyId = ref(null);
    const elderlyOptions = computed(
      () => elderlyStore.list.filter((e) => e.status === "active").map((e) => ({ label: e.name, value: e.id }))
    );
    const statMonth = ref((/* @__PURE__ */ new Date()).toISOString().slice(0, 7));
    const feeStats = ref({ total_billed: 0, total_paid: 0, overdue: 0 });
    async function refreshFinancialStats() {
      feeStats.value = await feeStore.getStats(statMonth.value);
    }
    async function loadData() {
      await Promise.all([
        feeStore.fetchFeeItems(),
        feeStore.fetchBills(),
        feeStore.fetchPayments(),
        elderlyStore.fetchList(),
        refreshFinancialStats()
      ]);
    }
    const { refresh, refreshing } = usePageRefresh(loadData);
    async function onElderlyChange(id) {
      selectedElderlyId.value = id;
      if (id) {
        await Promise.all([feeStore.fetchBills(id), feeStore.fetchDeposits(id), feeStore.fetchPayments(id)]);
      } else {
        feeStore.clearElderlyScopedData();
        await Promise.all([feeStore.fetchBills(), feeStore.fetchPayments()]);
      }
    }
    const showFeeItemModal = ref(false);
    const feeItemForm = ref({ name: "", category: "other", unit_price: 0, unit: "月", is_required: 0, status: "active", remark: "" });
    const categoryOptions = [
      { label: "床位费", value: "bed" },
      { label: "护理费", value: "care" },
      { label: "餐饮费", value: "meal" },
      { label: "医疗费", value: "medical" },
      { label: "其他", value: "other" }
    ];
    async function saveFeeItem() {
      if (!feeItemForm.value.name) return message.error("请填写费用名称");
      await feeStore.createFeeItem({ ...feeItemForm.value, remark: feeItemForm.value.remark || null });
      showFeeItemModal.value = false;
      message.success("保存成功");
      await feeStore.fetchFeeItems();
    }
    function openFeeItemModal() {
      feeItemForm.value = { name: "", category: "other", unit_price: 0, unit: "月", is_required: 0, status: "active", remark: "" };
      showFeeItemModal.value = true;
    }
    const feeItemColumns = [
      { title: "名称", key: "name", width: 130 },
      { title: "分类", key: "category", width: 90, render: (r) => ({ bed: "床位费", care: "护理费", meal: "餐饮费", medical: "医疗费", other: "其他" })[r.category] ?? r.category },
      { title: "单价", key: "unit_price", width: 100, render: (r) => `¥${r.unit_price}/${r.unit}` },
      { title: "状态", key: "status", width: 80, render: (r) => h(NTag, { type: r.status === "active" ? "success" : "default" }, () => r.status === "active" ? "启用" : "禁用") },
      { title: "操作", key: "actions", width: 120, render: (r) => h(NSpace, null, { default: () => [
        h(Button, { size: "small", onClick: async () => {
          await feeStore.updateFeeItem(r.id, { status: r.status === "active" ? "inactive" : "active" });
          message.success("更新成功");
          await feeStore.fetchFeeItems();
        } }, r.status === "active" ? "禁用" : "启用"),
        h(Button, { size: "small", type: "error", onClick: async () => {
          await feeStore.deleteFeeItem(r.id);
          message.success("删除成功");
          await feeStore.fetchFeeItems();
        } }, "删除")
      ] }) }
    ];
    const showDepositModal = ref(false);
    const depositForm = ref({ elderly_id: "", amount: 0, type: "deposit", pay_method: "cash", pay_date: formatDateTime(Date.now()), operator: "", remark: "" });
    const depositBalance = computed(() => feeStore.deposits.reduce((sum, record) => sum + (record.type === "deposit" ? record.amount : -record.amount), 0));
    const payMethodOptions = [
      { label: "现金", value: "cash" },
      { label: "微信", value: "wechat" },
      { label: "支付宝", value: "alipay" },
      { label: "银行转账", value: "bank" },
      { label: "其他", value: "other" }
    ];
    async function saveDeposit() {
      if (!depositForm.value.elderly_id || !depositForm.value.amount) return message.error("请填写必填项");
      if (depositForm.value.type === "refund" && selectedElderlyId.value === depositForm.value.elderly_id && depositForm.value.amount > depositBalance.value) return message.error("退款金额不能超过当前押金余额");
      await feeStore.createDeposit({ ...depositForm.value, operator: depositForm.value.operator || null, remark: depositForm.value.remark || null });
      showDepositModal.value = false;
      message.success("押金记录已保存");
      if (selectedElderlyId.value) await feeStore.fetchDeposits(selectedElderlyId.value);
    }
    function openDepositModal() {
      depositForm.value = { elderly_id: selectedElderlyId.value ?? "", amount: 0, type: "deposit", pay_method: "cash", pay_date: formatDateTime(Date.now()), operator: "", remark: "" };
      showDepositModal.value = true;
    }
    const showBillModal = ref(false);
    const billForm = ref({ elderly_id: "", bill_month: (/* @__PURE__ */ new Date()).toISOString().slice(0, 7), remark: "" });
    const billDetailDrafts = ref([]);
    const billTotal = computed(() => Number(billDetailDrafts.value.reduce((sum, detail) => sum + detail.quantity * detail.unit_price, 0).toFixed(2)));
    const activeFeeItemOptions = computed(() => feeStore.feeItems.filter((item) => item.status === "active").map((item) => ({ label: `${item.name} (¥${item.unit_price}/${item.unit})`, value: item.id })));
    function createEmptyBillDetail() {
      return { fee_item_id: null, item_name: "", quantity: 1, unit_price: 0, remark: "" };
    }
    function openBillModal() {
      billForm.value = { elderly_id: selectedElderlyId.value ?? "", bill_month: (/* @__PURE__ */ new Date()).toISOString().slice(0, 7), remark: "" };
      const requiredItems = feeStore.feeItems.filter((item) => item.status === "active" && item.is_required === 1);
      billDetailDrafts.value = requiredItems.length ? requiredItems.map((item) => ({ fee_item_id: item.id, item_name: item.name, quantity: 1, unit_price: item.unit_price, remark: "" })) : [createEmptyBillDetail()];
      showBillModal.value = true;
    }
    function applyFeeItem(index, feeItemId) {
      const detail = billDetailDrafts.value[index];
      detail.fee_item_id = feeItemId;
      const feeItem = feeStore.feeItems.find((item) => item.id === feeItemId);
      if (feeItem) {
        detail.item_name = feeItem.name;
        detail.unit_price = feeItem.unit_price;
      }
    }
    async function saveBill() {
      if (!billForm.value.elderly_id || !billForm.value.bill_month) return message.error("请填写必填项");
      if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(billForm.value.bill_month)) return message.error("账期格式应为 YYYY-MM");
      if (!billDetailDrafts.value.length || billDetailDrafts.value.some((detail) => !detail.item_name || detail.quantity <= 0 || detail.unit_price < 0)) return message.error("请完整填写账单明细");
      const existing = await feeStore.getBill(billForm.value.elderly_id, billForm.value.bill_month);
      if (existing) return message.error(`${billForm.value.bill_month} 账单已存在`);
      try {
        await feeStore.createBillWithDetails(
          { ...billForm.value, remark: billForm.value.remark || null },
          billDetailDrafts.value.map((detail) => ({ ...detail, amount: Number((detail.quantity * detail.unit_price).toFixed(2)), remark: detail.remark || null }))
        );
        showBillModal.value = false;
        message.success(`账单已生成，应收 ¥${billTotal.value}`);
        await Promise.all([feeStore.fetchBills(selectedElderlyId.value ?? void 0), refreshFinancialStats()]);
      } catch (error) {
        message.error(error instanceof Error ? error.message : "账单生成失败");
      }
    }
    const showPayModal = ref(false);
    const payForm = ref({ elderly_id: "", bill_id: "", amount: 0, pay_method: "cash", pay_date: formatDateTime(Date.now()), operator: "", receipt_no: "", remark: "" });
    function openPay(bill) {
      payForm.value = { elderly_id: bill.elderly_id, bill_id: bill.id, amount: Number((bill.total - bill.paid).toFixed(2)), pay_method: "cash", pay_date: formatDateTime(Date.now()), operator: "", receipt_no: "", remark: "" };
      showPayModal.value = true;
    }
    async function savePay() {
      if (!payForm.value.amount) return message.error("请填写收款金额");
      const bill = feeStore.bills.find((item) => item.id === payForm.value.bill_id);
      if (bill && payForm.value.amount > bill.total - bill.paid) return message.error("收款金额不能超过未收金额");
      try {
        await feeStore.createPayment({ ...payForm.value, operator: payForm.value.operator || null, receipt_no: payForm.value.receipt_no || null, remark: payForm.value.remark || null });
        await Promise.all([feeStore.fetchBills(selectedElderlyId.value ?? void 0), feeStore.fetchPayments(selectedElderlyId.value ?? void 0), refreshFinancialStats()]);
        showPayModal.value = false;
        message.success("收款成功");
      } catch (error) {
        message.error(error instanceof Error ? error.message : "收款失败");
      }
    }
    const showBillDetailModal = ref(false);
    const selectedBill = ref(null);
    const detailPayments = ref([]);
    async function openBillDetail(bill) {
      selectedBill.value = bill;
      await Promise.all([
        feeStore.fetchBillDetails(bill.id),
        window.api.fee.payment.list(void 0, bill.id).then((rows) => {
          detailPayments.value = rows;
        })
      ]);
      showBillDetailModal.value = true;
    }
    const billColumns = [
      { title: "账期", key: "bill_month", width: 100 },
      { title: "老人", key: "elderly_id", width: 90, render: (r) => elderlyStore.list.find((e) => e.id === r.elderly_id)?.name ?? r.elderly_id },
      { title: "账单金额", key: "total", width: 100, render: (r) => `¥${r.total}` },
      { title: "已收", key: "paid", width: 90, render: (r) => `¥${r.paid}` },
      { title: "欠费", key: "owe", width: 90, render: (r) => {
        const owe = r.total - r.paid;
        return h(NTag, { type: owe > 0 ? "error" : "success" }, () => owe > 0 ? `¥${owe}` : "已结清");
      } },
      { title: "状态", key: "status", width: 80, render: (r) => {
        const map = { unpaid: ["error", "未收"], partial: ["warning", "部分"], paid: ["success", "已收"] };
        const [type, label] = map[r.status] ?? ["default", r.status];
        return h(NTag, { type }, () => label);
      } },
      { title: "操作", key: "actions", width: 150, render: (r) => h(NSpace, null, { default: () => [
        h(Button, { size: "small", onClick: () => openBillDetail(r) }, "明细"),
        h(Button, { size: "small", type: "primary", disabled: r.status === "paid", onClick: () => openPay(r) }, "收款")
      ] }) }
    ];
    const billDetailColumns = [
      { title: "费用项目", key: "item_name", minWidth: 130 },
      { title: "数量", key: "quantity", width: 80 },
      { title: "单价", key: "unit_price", width: 100, render: (r) => `¥${r.unit_price}` },
      { title: "金额", key: "amount", width: 100, render: (r) => `¥${r.amount}` },
      { title: "备注", key: "remark", minWidth: 120, render: (r) => r.remark || "—" }
    ];
    const paymentColumns = [
      { title: "日期", key: "pay_date", width: 165, render: (r) => formatDateTime(r.pay_date) },
      { title: "老人", key: "elderly_id", width: 90, render: (r) => elderlyStore.list.find((e) => e.id === r.elderly_id)?.name ?? r.elderly_id },
      { title: "账期", key: "bill_id", width: 90, render: (r) => feeStore.bills.find((bill) => bill.id === r.bill_id)?.bill_month ?? "非账单收款" },
      { title: "金额", key: "amount", width: 100, render: (r) => `¥${r.amount}` },
      { title: "方式", key: "pay_method", width: 90, render: (r) => ({ cash: "现金", wechat: "微信", alipay: "支付宝", bank: "银行转账", other: "其他" })[r.pay_method] ?? r.pay_method },
      { title: "收据号", key: "receipt_no", width: 120, render: (r) => r.receipt_no || "—" },
      { title: "经办人", key: "operator", width: 90, render: (r) => r.operator || "—" }
    ];
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "费用管理" }, {
        default: withCtx(() => [
          createVNode(unref(NTabs), {
            type: "line",
            animated: ""
          }, {
            default: withCtx(() => [
              createVNode(unref(NTabPane), {
                name: "items",
                tab: "费用项目配置"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    "header-extra": withCtx(() => [
                      createVNode(unref(NSpace), null, {
                        default: withCtx(() => [
                          createVNode(unref(Button), {
                            loading: unref(refreshing),
                            size: "small",
                            onClick: unref(refresh)
                          }, {
                            default: withCtx(() => [..._cache[36] || (_cache[36] = [
                              createTextVNode("刷新", -1)
                            ])]),
                            _: 1
                          }, 8, ["loading", "onClick"]),
                          createVNode(unref(Button), {
                            type: "primary",
                            size: "small",
                            onClick: openFeeItemModal
                          }, {
                            default: withCtx(() => [..._cache[37] || (_cache[37] = [
                              createTextVNode("+ 新增项目", -1)
                            ])]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: feeItemColumns,
                        data: unref(feeStore).feeItems,
                        pagination: false
                      }, null, 8, ["data"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NTabPane), {
                name: "bills",
                tab: "月度账单"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), { class: "mb-3" }, {
                    default: withCtx(() => [
                      createVNode(unref(NGrid), {
                        cols: 4,
                        "x-gap": 24,
                        "y-gap": 16,
                        responsive: "screen"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NGi), null, {
                            default: withCtx(() => [
                              createVNode(unref(NStatistic), {
                                label: "本月应收",
                                value: feeStats.value.total_billed,
                                precision: 2,
                                prefix: "¥"
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(NGi), null, {
                            default: withCtx(() => [
                              createVNode(unref(NStatistic), {
                                label: "本月实收",
                                value: feeStats.value.total_paid,
                                precision: 2,
                                prefix: "¥"
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(NGi), null, {
                            default: withCtx(() => [
                              createVNode(unref(NStatistic), {
                                label: "本月欠费",
                                value: feeStats.value.overdue,
                                precision: 2,
                                prefix: "¥"
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(NGi), null, {
                            default: withCtx(() => [
                              createVNode(unref(NDatePicker), {
                                "formatted-value": statMonth.value,
                                "onUpdate:formattedValue": [
                                  _cache[0] || (_cache[0] = ($event) => statMonth.value = $event),
                                  _cache[1] || (_cache[1] = () => refreshFinancialStats())
                                ],
                                "value-format": "yyyy-MM",
                                clearable: false,
                                style: { "width": "100%" }
                              }, null, 8, ["formatted-value"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NDivider)),
                      createVNode(unref(NSpace), null, {
                        default: withCtx(() => [
                          createVNode(unref(NSelect), {
                            value: selectedElderlyId.value,
                            "onUpdate:value": [
                              _cache[2] || (_cache[2] = ($event) => selectedElderlyId.value = $event),
                              onElderlyChange
                            ],
                            options: elderlyOptions.value,
                            filterable: "",
                            clearable: "",
                            placeholder: "筛选老人",
                            style: { "width": "180px" }
                          }, null, 8, ["value", "options"]),
                          createVNode(unref(Button), {
                            type: "primary",
                            onClick: openBillModal
                          }, {
                            default: withCtx(() => [..._cache[38] || (_cache[38] = [
                              createTextVNode("+ 生成账单", -1)
                            ])]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: billColumns,
                        data: unref(feeStore).bills,
                        loading: unref(feeStore).loading,
                        pagination: { pageSize: 15 }
                      }, null, 8, ["data", "loading"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NTabPane), {
                name: "deposit",
                tab: "押金管理"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    "header-extra": withCtx(() => [
                      createVNode(unref(NSpace), null, {
                        default: withCtx(() => [
                          createVNode(unref(NSelect), {
                            value: selectedElderlyId.value,
                            "onUpdate:value": [
                              _cache[3] || (_cache[3] = ($event) => selectedElderlyId.value = $event),
                              onElderlyChange
                            ],
                            options: elderlyOptions.value,
                            filterable: "",
                            clearable: "",
                            placeholder: "选择老人",
                            style: { "width": "180px" }
                          }, null, 8, ["value", "options"]),
                          createVNode(unref(Button), {
                            type: "primary",
                            size: "small",
                            onClick: openDepositModal
                          }, {
                            default: withCtx(() => [..._cache[39] || (_cache[39] = [
                              createTextVNode("+ 押金登记", -1)
                            ])]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      selectedElderlyId.value ? (openBlock(), createBlock(unref(NStatistic), {
                        key: 0,
                        label: "当前押金余额",
                        value: depositBalance.value,
                        precision: 2,
                        prefix: "¥",
                        class: "mb-3"
                      }, null, 8, ["value"])) : createCommentVNode("", true),
                      createVNode(unref(_sfc_main$2), {
                        columns: [
                          { title: "老人", key: "elderly_id", width: 90, render: (r) => unref(elderlyStore).list.find((e) => e.id === r.elderly_id)?.name ?? r.elderly_id },
                          { title: "类型", key: "type", width: 80, render: (r) => h(unref(NTag), { type: r.type === "deposit" ? "success" : "error" }, () => r.type === "deposit" ? "收押金" : "退押金") },
                          { title: "金额", key: "amount", width: 100, render: (r) => `¥${r.amount}` },
                          { title: "日期", key: "pay_date", width: 160, render: (r) => unref(formatDateTime)(r.pay_date) },
                          { title: "经办人", key: "operator", width: 90 }
                        ],
                        data: unref(feeStore).deposits,
                        pagination: { pageSize: 15 }
                      }, null, 8, ["columns", "data"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NTabPane), {
                name: "payments",
                tab: "收款记录"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    "header-extra": withCtx(() => [
                      createVNode(unref(NSpace), null, {
                        default: withCtx(() => [
                          createVNode(unref(NSelect), {
                            value: selectedElderlyId.value,
                            "onUpdate:value": [
                              _cache[4] || (_cache[4] = ($event) => selectedElderlyId.value = $event),
                              onElderlyChange
                            ],
                            options: elderlyOptions.value,
                            filterable: "",
                            clearable: "",
                            placeholder: "筛选老人",
                            style: { "width": "180px" }
                          }, null, 8, ["value", "options"]),
                          createVNode(unref(Button), {
                            loading: unref(refreshing),
                            size: "small",
                            onClick: unref(refresh)
                          }, {
                            default: withCtx(() => [..._cache[40] || (_cache[40] = [
                              createTextVNode("刷新", -1)
                            ])]),
                            _: 1
                          }, 8, ["loading", "onClick"])
                        ]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: paymentColumns,
                        data: unref(feeStore).payments,
                        loading: unref(feeStore).loading,
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
            show: showFeeItemModal.value,
            "onUpdate:show": _cache[11] || (_cache[11] = ($event) => showFeeItemModal.value = $event),
            title: "费用项目",
            preset: "card",
            style: { "width": "440px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[10] || (_cache[10] = ($event) => showFeeItemModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[41] || (_cache[41] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveFeeItem
                  }, {
                    default: withCtx(() => [..._cache[42] || (_cache[42] = [
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
                model: feeItemForm.value,
                "label-placement": "left",
                "label-width": "80"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "项目名称",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: feeItemForm.value.name,
                        "onUpdate:value": _cache[5] || (_cache[5] = ($event) => feeItemForm.value.name = $event),
                        placeholder: "如：护理费"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "分类" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: feeItemForm.value.category,
                        "onUpdate:value": _cache[6] || (_cache[6] = ($event) => feeItemForm.value.category = $event),
                        options: categoryOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "单价(元)" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: feeItemForm.value.unit_price,
                        "onUpdate:value": _cache[7] || (_cache[7] = ($event) => feeItemForm.value.unit_price = $event),
                        min: 0,
                        precision: 2
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "计费单位" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: feeItemForm.value.unit,
                        "onUpdate:value": _cache[8] || (_cache[8] = ($event) => feeItemForm.value.unit = $event),
                        placeholder: "如：月、次"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: feeItemForm.value.remark,
                        "onUpdate:value": _cache[9] || (_cache[9] = ($event) => feeItemForm.value.remark = $event)
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
            show: showBillModal.value,
            "onUpdate:show": _cache[17] || (_cache[17] = ($event) => showBillModal.value = $event),
            title: "生成月度账单",
            preset: "card",
            style: { "width": "440px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[16] || (_cache[16] = ($event) => showBillModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[46] || (_cache[46] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveBill
                  }, {
                    default: withCtx(() => [..._cache[47] || (_cache[47] = [
                      createTextVNode("生成", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: billForm.value,
                "label-placement": "left",
                "label-width": "80"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "老人",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: billForm.value.elderly_id,
                        "onUpdate:value": _cache[12] || (_cache[12] = ($event) => billForm.value.elderly_id = $event),
                        options: elderlyOptions.value,
                        filterable: ""
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "账期",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: billForm.value.bill_month,
                        "onUpdate:value": _cache[13] || (_cache[13] = ($event) => billForm.value.bill_month = $event),
                        placeholder: "YYYY-MM"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NDivider), null, {
                    default: withCtx(() => [..._cache[43] || (_cache[43] = [
                      createTextVNode("账单明细", -1)
                    ])]),
                    _: 1
                  }),
                  (openBlock(true), createElementBlock(Fragment, null, renderList(billDetailDrafts.value, (detail, index) => {
                    return openBlock(), createElementBlock("div", {
                      key: index,
                      class: "mb-3"
                    }, [
                      createVNode(unref(NSpace), {
                        vertical: "",
                        size: 8
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NSpace), {
                            align: "center",
                            "wrap-item": ""
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NSelect), {
                                value: detail.fee_item_id,
                                options: activeFeeItemOptions.value,
                                clearable: "",
                                placeholder: "选择费用项目",
                                style: { "width": "200px" },
                                "onUpdate:value": (value) => applyFeeItem(index, value)
                              }, null, 8, ["value", "options", "onUpdate:value"]),
                              createVNode(unref(NInput), {
                                value: detail.item_name,
                                "onUpdate:value": ($event) => detail.item_name = $event,
                                placeholder: "费用名称",
                                style: { "width": "150px" }
                              }, null, 8, ["value", "onUpdate:value"]),
                              createVNode(unref(NInputNumber), {
                                value: detail.quantity,
                                "onUpdate:value": ($event) => detail.quantity = $event,
                                min: 0.01,
                                precision: 2,
                                placeholder: "数量",
                                style: { "width": "100px" }
                              }, null, 8, ["value", "onUpdate:value"]),
                              createVNode(unref(NInputNumber), {
                                value: detail.unit_price,
                                "onUpdate:value": ($event) => detail.unit_price = $event,
                                min: 0,
                                precision: 2,
                                placeholder: "单价",
                                style: { "width": "110px" }
                              }, null, 8, ["value", "onUpdate:value"]),
                              billDetailDrafts.value.length > 1 ? (openBlock(), createBlock(unref(Button), {
                                key: 0,
                                size: "small",
                                type: "error",
                                onClick: ($event) => billDetailDrafts.value.splice(index, 1)
                              }, {
                                default: withCtx(() => [..._cache[44] || (_cache[44] = [
                                  createTextVNode("移除", -1)
                                ])]),
                                _: 1
                              }, 8, ["onClick"])) : createCommentVNode("", true)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(NInput), {
                            value: detail.remark,
                            "onUpdate:value": ($event) => detail.remark = $event,
                            placeholder: "该项目备注"
                          }, null, 8, ["value", "onUpdate:value"])
                        ]),
                        _: 2
                      }, 1024)
                    ]);
                  }), 128)),
                  createVNode(unref(NSpace), {
                    justify: "space-between",
                    align: "center",
                    class: "mb-3"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(Button), {
                        size: "small",
                        onClick: _cache[14] || (_cache[14] = ($event) => billDetailDrafts.value.push(createEmptyBillDetail()))
                      }, {
                        default: withCtx(() => [..._cache[45] || (_cache[45] = [
                          createTextVNode("+ 添加费用项目", -1)
                        ])]),
                        _: 1
                      }),
                      createVNode(unref(NTag), { type: "info" }, {
                        default: withCtx(() => [
                          createTextVNode("账单合计 ¥" + toDisplayString(billTotal.value), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: billForm.value.remark,
                        "onUpdate:value": _cache[15] || (_cache[15] = ($event) => billForm.value.remark = $event)
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
            show: showPayModal.value,
            "onUpdate:show": _cache[25] || (_cache[25] = ($event) => showPayModal.value = $event),
            title: "收款登记",
            preset: "card",
            style: { "width": "440px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[24] || (_cache[24] = ($event) => showPayModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[48] || (_cache[48] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: savePay
                  }, {
                    default: withCtx(() => [..._cache[49] || (_cache[49] = [
                      createTextVNode("确认收款", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: payForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "收款金额",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: payForm.value.amount,
                        "onUpdate:value": _cache[18] || (_cache[18] = ($event) => payForm.value.amount = $event),
                        min: 0.01,
                        precision: 2
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "收款方式" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: payForm.value.pay_method,
                        "onUpdate:value": _cache[19] || (_cache[19] = ($event) => payForm.value.pay_method = $event),
                        options: payMethodOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "收款日期" }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": payForm.value.pay_date,
                        "onUpdate:formattedValue": _cache[20] || (_cache[20] = ($event) => payForm.value.pay_date = $event),
                        "value-format": "yyyy-MM-dd HH:mm:ss",
                        type: "datetime",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "经办人" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: payForm.value.operator,
                        "onUpdate:value": _cache[21] || (_cache[21] = ($event) => payForm.value.operator = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "收据号" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: payForm.value.receipt_no,
                        "onUpdate:value": _cache[22] || (_cache[22] = ($event) => payForm.value.receipt_no = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: payForm.value.remark,
                        "onUpdate:value": _cache[23] || (_cache[23] = ($event) => payForm.value.remark = $event)
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
            show: showDepositModal.value,
            "onUpdate:show": _cache[34] || (_cache[34] = ($event) => showDepositModal.value = $event),
            title: "押金记录",
            preset: "card",
            style: { "width": "440px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[33] || (_cache[33] = ($event) => showDepositModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[50] || (_cache[50] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveDeposit
                  }, {
                    default: withCtx(() => [..._cache[51] || (_cache[51] = [
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
                model: depositForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "老人",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: depositForm.value.elderly_id,
                        "onUpdate:value": _cache[26] || (_cache[26] = ($event) => depositForm.value.elderly_id = $event),
                        options: elderlyOptions.value,
                        filterable: ""
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "类型" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: depositForm.value.type,
                        "onUpdate:value": _cache[27] || (_cache[27] = ($event) => depositForm.value.type = $event),
                        options: [{ label: "收押金", value: "deposit" }, { label: "退押金", value: "refund" }]
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "金额(元)",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInputNumber), {
                        value: depositForm.value.amount,
                        "onUpdate:value": _cache[28] || (_cache[28] = ($event) => depositForm.value.amount = $event),
                        min: 0.01,
                        precision: 2
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "支付方式" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: depositForm.value.pay_method,
                        "onUpdate:value": _cache[29] || (_cache[29] = ($event) => depositForm.value.pay_method = $event),
                        options: payMethodOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "日期" }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": depositForm.value.pay_date,
                        "onUpdate:formattedValue": _cache[30] || (_cache[30] = ($event) => depositForm.value.pay_date = $event),
                        "value-format": "yyyy-MM-dd HH:mm:ss",
                        type: "datetime",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "经办人" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: depositForm.value.operator,
                        "onUpdate:value": _cache[31] || (_cache[31] = ($event) => depositForm.value.operator = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: depositForm.value.remark,
                        "onUpdate:value": _cache[32] || (_cache[32] = ($event) => depositForm.value.remark = $event)
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
            show: showBillDetailModal.value,
            "onUpdate:show": _cache[35] || (_cache[35] = ($event) => showBillDetailModal.value = $event),
            title: "账单明细",
            preset: "card",
            style: { "width": "760px" }
          }, {
            default: withCtx(() => [
              selectedBill.value ? (openBlock(), createBlock(unref(NGrid), {
                key: 0,
                cols: 3,
                "x-gap": 24,
                class: "mb-3"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NGi), null, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "应收金额",
                        value: selectedBill.value.total,
                        precision: 2,
                        prefix: "¥"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NGi), null, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "已收金额",
                        value: selectedBill.value.paid,
                        precision: 2,
                        prefix: "¥"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NGi), null, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "未收金额",
                        value: selectedBill.value.total - selectedBill.value.paid,
                        precision: 2,
                        prefix: "¥"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })) : createCommentVNode("", true),
              createVNode(unref(NDivider), null, {
                default: withCtx(() => [..._cache[52] || (_cache[52] = [
                  createTextVNode("费用项目", -1)
                ])]),
                _: 1
              }),
              createVNode(unref(_sfc_main$2), {
                columns: billDetailColumns,
                data: unref(feeStore).billDetails,
                pagination: false
              }, null, 8, ["data"]),
              createVNode(unref(NDivider), null, {
                default: withCtx(() => [..._cache[53] || (_cache[53] = [
                  createTextVNode("收款记录", -1)
                ])]),
                _: 1
              }),
              createVNode(unref(_sfc_main$2), {
                columns: paymentColumns,
                data: detailPayments.value,
                pagination: false
              }, null, 8, ["data"])
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
