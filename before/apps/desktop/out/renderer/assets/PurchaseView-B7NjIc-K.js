import { _ as _sfc_main$2 } from "./BaseTable.vue_vue_type_script_setup_true_lang-vD6Hc9gq.js";
import "./vendor-echarts-DEbY5nl3.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-CnaIdrBG.js";
import "./index-qSxYm2OB.js";
import { S as defineStore, r as ref, l as defineComponent, U as createBlock, W as withCtx, u as unref, V as openBlock, X as createVNode, k as createTextVNode, a1 as createElementBlock, a6 as renderList, F as Fragment, a8 as toDisplayString, c as computed, q as h, a9 as createCommentVNode } from "./vendor-vue-Hc3ejqjp.js";
import { f as formatDateTime } from "./validators-BfKhytEl.js";
import { u as usePageRefresh } from "./usePageRefresh-Wnx_lW1d.js";
import { u as useMessage, P as NGrid, M as NGridItem, O as NStatistic, g as NCard, U as NTabPane, v as NSpace, J as NSelect, B as Button, V as NTabs, j as NForm, k as NFormItem, H as NDatePicker, l as NInput, X as NDivider, o as NTag, h as NModal, a0 as NPopconfirm, T as NInputNumber } from "./vendor-naive-DqQyyJr8.js";
import "./vendor-query-CFvMrhIw.js";
import "./vendor-utils-DD6FGs_H.js";
import "./useAutoRefresh-BeuDS8Br.js";
const usePurchaseStore = defineStore("purchase", () => {
  const suppliers = ref([]);
  const orders = ref([]);
  const orderItems = ref([]);
  const loading = ref(false);
  async function fetchSuppliers() {
    loading.value = true;
    try {
      suppliers.value = await window.api.purchase.supplier.list();
    } finally {
      loading.value = false;
    }
  }
  async function createSupplier(data) {
    const row = await window.api.purchase.supplier.create(data);
    suppliers.value.unshift(row);
    return row;
  }
  async function updateSupplier(id, data) {
    await window.api.purchase.supplier.update(id, data);
    const idx = suppliers.value.findIndex((s) => s.id === id);
    if (idx !== -1) suppliers.value[idx] = { ...suppliers.value[idx], ...data };
  }
  async function deleteSupplier(id) {
    await window.api.purchase.supplier.delete(id);
    suppliers.value = suppliers.value.filter((s) => s.id !== id);
  }
  async function fetchOrders(status) {
    loading.value = true;
    try {
      orders.value = await window.api.purchase.order.list(status);
    } finally {
      loading.value = false;
    }
  }
  async function createOrder(order, items) {
    const row = await window.api.purchase.order.create(order, items);
    orders.value.unshift(row);
    return row;
  }
  async function updateOrderStatus(id, status, remark) {
    await window.api.purchase.order.updateStatus(id, status, remark);
    const order = orders.value.find((o) => o.id === id);
    if (order) order.status = status;
  }
  async function fetchOrderItems(orderId) {
    orderItems.value = await window.api.purchase.order.items(orderId);
  }
  async function deleteOrder(id) {
    await window.api.purchase.order.delete(id);
    orders.value = orders.value.filter((o) => o.id !== id);
  }
  async function getStats() {
    return window.api.purchase.order.stats();
  }
  return {
    suppliers,
    orders,
    orderItems,
    loading,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    fetchOrders,
    createOrder,
    updateOrderStatus,
    fetchOrderItems,
    deleteOrder,
    getStats
  };
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "Purchase" },
  __name: "PurchaseView",
  setup(__props) {
    const store = usePurchaseStore();
    const message = useMessage();
    async function loadData() {
      await Promise.all([store.fetchSuppliers(), store.fetchOrders()]);
    }
    const { refresh, refreshing } = usePageRefresh(loadData);
    const stats = ref({ total: 0, draft: 0, pending: 0, approved: 0, received: 0, total_amount: 0 });
    async function refreshStats() {
      stats.value = await store.getStats();
    }
    const showSupplierModal = ref(false);
    const supplierForm = ref({
      name: "",
      contact: "",
      phone: "",
      address: "",
      category: "other",
      tax_no: "",
      status: "active",
      remark: ""
    });
    const editingSupplierIdx = ref(null);
    const categoryOptions = [
      { label: "药品/医疗", value: "medicine" },
      { label: "护理用品", value: "care_supply" },
      { label: "食材/餐饮", value: "food" },
      { label: "设备器械", value: "equipment" },
      { label: "其他", value: "other" }
    ];
    const categoryMap = {
      medicine: "药品/医疗",
      care_supply: "护理用品",
      food: "食材/餐饮",
      equipment: "设备器械",
      other: "其他"
    };
    const supplierOptions = computed(
      () => store.suppliers.filter((s) => s.status === "active").map((s) => ({ label: s.name, value: s.id }))
    );
    function openAddSupplier() {
      editingSupplierIdx.value = null;
      supplierForm.value = { name: "", contact: "", phone: "", address: "", category: "other", tax_no: "", status: "active", remark: "" };
      showSupplierModal.value = true;
    }
    function openEditSupplier(row) {
      editingSupplierIdx.value = store.suppliers.findIndex((s) => s.id === row.id);
      supplierForm.value = { ...row };
      showSupplierModal.value = true;
    }
    async function saveSupplier() {
      if (!supplierForm.value.name) return message.error("请填写供应商名称");
      if (editingSupplierIdx.value !== null) {
        const id = store.suppliers[editingSupplierIdx.value].id;
        await store.updateSupplier(id, supplierForm.value);
      } else {
        await store.createSupplier(supplierForm.value);
      }
      showSupplierModal.value = false;
      message.success("保存成功");
    }
    const supplierColumns = [
      { title: "供应商名称", key: "name", minWidth: 130 },
      { title: "类别", key: "category", width: 100, render: (r) => categoryMap[r.category] ?? r.category },
      { title: "联系人", key: "contact", width: 90 },
      { title: "电话", key: "phone", width: 120 },
      {
        title: "状态",
        key: "status",
        width: 80,
        render: (r) => h(NTag, { type: r.status === "active" ? "success" : "default" }, () => r.status === "active" ? "合作中" : "已停用")
      },
      {
        title: "操作",
        key: "actions",
        width: 130,
        render: (r) => h(NSpace, null, { default: () => [
          h(Button, { size: "small", onClick: () => openEditSupplier(r) }, "编辑"),
          h(NPopconfirm, { onPositiveClick: async () => {
            await store.deleteSupplier(r.id);
            message.success("已删除");
          } }, {
            trigger: () => h(Button, { size: "small", type: "error" }, "删除"),
            default: () => "确定删除该供应商？"
          })
        ] })
      }
    ];
    const showOrderModal = ref(false);
    const showItemsModal = ref(false);
    const activeOrderStatus = ref("");
    const orderForm = ref({
      supplier_id: null,
      supplier_name: "",
      order_date: formatDateTime(Date.now()).slice(0, 10),
      expect_date: "",
      remark: ""
    });
    const itemDrafts = ref([]);
    function createEmptyItem() {
      return { item_name: "", category: "other", specification: "", unit: "件", quantity: 1, unit_price: 0, remark: "" };
    }
    function openAddOrder() {
      orderForm.value = {
        supplier_id: null,
        supplier_name: "",
        order_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
        expect_date: "",
        remark: ""
      };
      itemDrafts.value = [createEmptyItem()];
      showOrderModal.value = true;
    }
    async function saveOrder() {
      if (!itemDrafts.value.length || itemDrafts.value.some((it) => !it.item_name || (it.quantity ?? 0) <= 0))
        return message.error("请完整填写采购明细");
      const items = itemDrafts.value.map((it) => ({
        ...it,
        amount: Number(((it.quantity ?? 0) * (it.unit_price ?? 0)).toFixed(2))
      }));
      await store.createOrder(orderForm.value, items);
      showOrderModal.value = false;
      message.success("采购单已创建");
      await Promise.all([store.fetchOrders(), refreshStats()]);
    }
    async function viewItems(order) {
      await store.fetchOrderItems(order.id);
      showItemsModal.value = true;
    }
    async function approve(order) {
      await store.updateOrderStatus(order.id, "approved");
      message.success("审批通过");
    }
    async function receive(order) {
      await store.updateOrderStatus(order.id, "received");
      message.success("已标记入库");
    }
    async function cancel(order) {
      await store.updateOrderStatus(order.id, "cancelled");
      message.success("已取消");
    }
    const statusMap = {
      draft: { label: "草稿", type: "default" },
      pending: { label: "待审批", type: "warning" },
      approved: { label: "已审批", type: "info" },
      received: { label: "已入库", type: "success" },
      cancelled: { label: "已取消", type: "error" }
    };
    const filteredOrders = computed(
      () => activeOrderStatus.value ? store.orders.filter((o) => o.status === activeOrderStatus.value) : store.orders
    );
    const orderColumns = [
      { title: "单号", key: "order_no", width: 150 },
      { title: "供应商", key: "supplier_name", width: 120, render: (r) => r.supplier_name || "—" },
      { title: "采购日期", key: "order_date", width: 110 },
      { title: "总金额", key: "total_amount", width: 100, render: (r) => `¥${r.total_amount.toFixed(2)}` },
      {
        title: "状态",
        key: "status",
        width: 90,
        render: (r) => {
          const s = statusMap[r.status] ?? { label: r.status, type: "default" };
          return h(NTag, { type: s.type }, () => s.label);
        }
      },
      { title: "申请人", key: "applicant", width: 90, render: (r) => r.applicant || "—" },
      {
        title: "操作",
        key: "actions",
        width: 200,
        render: (r) => h(NSpace, null, { default: () => [
          h(Button, { size: "small", onClick: () => viewItems(r) }, "明细"),
          r.status === "pending" ? h(Button, { size: "small", type: "primary", onClick: () => approve(r) }, "审批") : null,
          r.status === "approved" ? h(Button, { size: "small", type: "success", onClick: () => receive(r) }, "入库") : null,
          ["draft", "pending"].includes(r.status) ? h(NPopconfirm, { onPositiveClick: () => cancel(r) }, {
            trigger: () => h(Button, { size: "small", type: "error" }, "取消"),
            default: () => "确定取消该采购单？"
          }) : null
        ].filter(Boolean) })
      }
    ];
    const itemColumns = [
      { title: "物品名称", key: "item_name", minWidth: 120 },
      { title: "类别", key: "category", width: 100, render: (r) => categoryMap[r.category] ?? r.category },
      { title: "规格", key: "specification", width: 120, render: (r) => r.specification || "—" },
      { title: "单位", key: "unit", width: 60 },
      { title: "数量", key: "quantity", width: 80 },
      { title: "单价", key: "unit_price", width: 90, render: (r) => `¥${r.unit_price}` },
      { title: "金额", key: "amount", width: 100, render: (r) => `¥${r.amount.toFixed(2)}` },
      { title: "已入库", key: "received_qty", width: 80 }
    ];
    const statusFilterOptions = [
      { label: "全部", value: "" },
      { label: "草稿", value: "draft" },
      { label: "待审批", value: "pending" },
      { label: "已审批", value: "approved" },
      { label: "已入库", value: "received" },
      { label: "已取消", value: "cancelled" }
    ];
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "采购管理" }, {
        default: withCtx(() => [
          createVNode(unref(NCard), { class: "mb-3" }, {
            default: withCtx(() => [
              createVNode(unref(NGrid), {
                cols: 5,
                "x-gap": 24
              }, {
                default: withCtx(() => [
                  createVNode(unref(NGridItem), null, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "采购单总数",
                        value: stats.value.total
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NGridItem), null, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "待审批",
                        value: stats.value.pending
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NGridItem), null, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "已审批",
                        value: stats.value.approved
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NGridItem), null, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "已入库",
                        value: stats.value.received
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NGridItem), null, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "采购总额",
                        value: stats.value.total_amount,
                        precision: 2,
                        prefix: "¥"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(unref(NTabs), {
            type: "line",
            animated: ""
          }, {
            default: withCtx(() => [
              createVNode(unref(NTabPane), {
                name: "orders",
                tab: "采购单"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    "header-extra": withCtx(() => [
                      createVNode(unref(NSpace), { align: "center" }, {
                        default: withCtx(() => [
                          createVNode(unref(NSelect), {
                            value: activeOrderStatus.value,
                            "onUpdate:value": _cache[0] || (_cache[0] = ($event) => activeOrderStatus.value = $event),
                            options: statusFilterOptions,
                            style: { "width": "120px" },
                            placeholder: "状态筛选"
                          }, null, 8, ["value"]),
                          createVNode(unref(Button), {
                            loading: unref(refreshing),
                            size: "small",
                            onClick: unref(refresh)
                          }, {
                            default: withCtx(() => [..._cache[23] || (_cache[23] = [
                              createTextVNode("刷新", -1)
                            ])]),
                            _: 1
                          }, 8, ["loading", "onClick"]),
                          createVNode(unref(Button), {
                            type: "primary",
                            size: "small",
                            onClick: openAddOrder
                          }, {
                            default: withCtx(() => [..._cache[24] || (_cache[24] = [
                              createTextVNode("+ 新建采购单", -1)
                            ])]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: orderColumns,
                        data: filteredOrders.value,
                        loading: unref(store).loading,
                        pagination: { pageSize: 15 }
                      }, null, 8, ["data", "loading"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NTabPane), {
                name: "suppliers",
                tab: "供应商管理"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    "header-extra": withCtx(() => [
                      createVNode(unref(Button), {
                        type: "primary",
                        size: "small",
                        onClick: openAddSupplier
                      }, {
                        default: withCtx(() => [..._cache[25] || (_cache[25] = [
                          createTextVNode("+ 新增供应商", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: supplierColumns,
                        data: unref(store).suppliers,
                        loading: unref(store).loading,
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
            show: showOrderModal.value,
            "onUpdate:show": _cache[10] || (_cache[10] = ($event) => showOrderModal.value = $event),
            title: "新建采购单",
            preset: "card",
            style: { "width": "680px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[7] || (_cache[7] = ($event) => showOrderModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[29] || (_cache[29] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    onClick: _cache[8] || (_cache[8] = async () => {
                      orderForm.value.status = "draft";
                      await saveOrder();
                    })
                  }, {
                    default: withCtx(() => [..._cache[30] || (_cache[30] = [
                      createTextVNode("存草稿", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: _cache[9] || (_cache[9] = async () => {
                      orderForm.value.status = "pending";
                      await saveOrder();
                    })
                  }, {
                    default: withCtx(() => [..._cache[31] || (_cache[31] = [
                      createTextVNode("提交审批", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: orderForm.value,
                "label-placement": "left",
                "label-width": "80"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NGrid), {
                    cols: 2,
                    "x-gap": 16
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          createVNode(unref(NFormItem), { label: "供应商" }, {
                            default: withCtx(() => [
                              createVNode(unref(NSelect), {
                                value: orderForm.value.supplier_id,
                                "onUpdate:value": [
                                  _cache[1] || (_cache[1] = ($event) => orderForm.value.supplier_id = $event),
                                  _cache[2] || (_cache[2] = (v) => {
                                    orderForm.value.supplier_name = unref(store).suppliers.find((s) => s.id === v)?.name || "";
                                  })
                                ],
                                options: supplierOptions.value,
                                filterable: "",
                                clearable: "",
                                placeholder: "选择供应商"
                              }, null, 8, ["value", "options"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          createVNode(unref(NFormItem), {
                            label: "采购日期",
                            required: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NDatePicker), {
                                "formatted-value": orderForm.value.order_date,
                                "onUpdate:formattedValue": _cache[3] || (_cache[3] = ($event) => orderForm.value.order_date = $event),
                                "value-format": "yyyy-MM-dd",
                                style: { "width": "100%" }
                              }, null, 8, ["formatted-value"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          createVNode(unref(NFormItem), { label: "预计到货" }, {
                            default: withCtx(() => [
                              createVNode(unref(NDatePicker), {
                                "formatted-value": orderForm.value.expect_date,
                                "onUpdate:formattedValue": _cache[4] || (_cache[4] = ($event) => orderForm.value.expect_date = $event),
                                "value-format": "yyyy-MM-dd",
                                clearable: "",
                                style: { "width": "100%" }
                              }, null, 8, ["formatted-value"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NGridItem), null, {
                        default: withCtx(() => [
                          createVNode(unref(NFormItem), { label: "备注" }, {
                            default: withCtx(() => [
                              createVNode(unref(NInput), {
                                value: orderForm.value.remark,
                                "onUpdate:value": _cache[5] || (_cache[5] = ($event) => orderForm.value.remark = $event)
                              }, null, 8, ["value"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NDivider), null, {
                    default: withCtx(() => [..._cache[26] || (_cache[26] = [
                      createTextVNode("采购明细", -1)
                    ])]),
                    _: 1
                  }),
                  (openBlock(true), createElementBlock(Fragment, null, renderList(itemDrafts.value, (item, idx) => {
                    return openBlock(), createElementBlock("div", {
                      key: idx,
                      class: "mb-3"
                    }, [
                      createVNode(unref(NSpace), {
                        align: "center",
                        wrap: ""
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NInput), {
                            value: item.item_name,
                            "onUpdate:value": ($event) => item.item_name = $event,
                            placeholder: "物品名称*",
                            style: { "width": "130px" }
                          }, null, 8, ["value", "onUpdate:value"]),
                          createVNode(unref(NSelect), {
                            value: item.category,
                            "onUpdate:value": ($event) => item.category = $event,
                            options: categoryOptions,
                            style: { "width": "110px" }
                          }, null, 8, ["value", "onUpdate:value"]),
                          createVNode(unref(NInput), {
                            value: item.specification,
                            "onUpdate:value": ($event) => item.specification = $event,
                            placeholder: "规格",
                            style: { "width": "100px" }
                          }, null, 8, ["value", "onUpdate:value"]),
                          createVNode(unref(NInput), {
                            value: item.unit,
                            "onUpdate:value": ($event) => item.unit = $event,
                            placeholder: "单位",
                            style: { "width": "60px" }
                          }, null, 8, ["value", "onUpdate:value"]),
                          createVNode(unref(NInputNumber), {
                            value: item.quantity,
                            "onUpdate:value": ($event) => item.quantity = $event,
                            min: 0.01,
                            precision: 2,
                            placeholder: "数量",
                            style: { "width": "90px" }
                          }, null, 8, ["value", "onUpdate:value"]),
                          createVNode(unref(NInputNumber), {
                            value: item.unit_price,
                            "onUpdate:value": ($event) => item.unit_price = $event,
                            min: 0,
                            precision: 2,
                            placeholder: "单价",
                            style: { "width": "100px" }
                          }, null, 8, ["value", "onUpdate:value"]),
                          createVNode(unref(NTag), { type: "info" }, {
                            default: withCtx(() => [
                              createTextVNode("¥" + toDisplayString(((item.quantity || 0) * (item.unit_price || 0)).toFixed(2)), 1)
                            ]),
                            _: 2
                          }, 1024),
                          itemDrafts.value.length > 1 ? (openBlock(), createBlock(unref(Button), {
                            key: 0,
                            size: "small",
                            type: "error",
                            onClick: ($event) => itemDrafts.value.splice(idx, 1)
                          }, {
                            default: withCtx(() => [..._cache[27] || (_cache[27] = [
                              createTextVNode("×", -1)
                            ])]),
                            _: 1
                          }, 8, ["onClick"])) : createCommentVNode("", true)
                        ]),
                        _: 2
                      }, 1024)
                    ]);
                  }), 128)),
                  createVNode(unref(NSpace), {
                    justify: "space-between",
                    align: "center"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(Button), {
                        size: "small",
                        onClick: _cache[6] || (_cache[6] = ($event) => itemDrafts.value.push(createEmptyItem()))
                      }, {
                        default: withCtx(() => [..._cache[28] || (_cache[28] = [
                          createTextVNode("+ 添加明细", -1)
                        ])]),
                        _: 1
                      }),
                      createVNode(unref(NTag), { type: "warning" }, {
                        default: withCtx(() => [
                          createTextVNode(" 合计 ¥" + toDisplayString(itemDrafts.value.reduce((s, it) => s + (it.quantity || 0) * (it.unit_price || 0), 0).toFixed(2)), 1)
                        ]),
                        _: 1
                      })
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
            show: showSupplierModal.value,
            "onUpdate:show": _cache[21] || (_cache[21] = ($event) => showSupplierModal.value = $event),
            title: "供应商信息",
            preset: "card",
            style: { "width": "500px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[20] || (_cache[20] = ($event) => showSupplierModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[32] || (_cache[32] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveSupplier
                  }, {
                    default: withCtx(() => [..._cache[33] || (_cache[33] = [
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
                model: supplierForm.value,
                "label-placement": "left",
                "label-width": "80"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "名称",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: supplierForm.value.name,
                        "onUpdate:value": _cache[11] || (_cache[11] = ($event) => supplierForm.value.name = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "类别" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: supplierForm.value.category,
                        "onUpdate:value": _cache[12] || (_cache[12] = ($event) => supplierForm.value.category = $event),
                        options: categoryOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "联系人" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: supplierForm.value.contact,
                        "onUpdate:value": _cache[13] || (_cache[13] = ($event) => supplierForm.value.contact = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "电话" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: supplierForm.value.phone,
                        "onUpdate:value": _cache[14] || (_cache[14] = ($event) => supplierForm.value.phone = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "地址" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: supplierForm.value.address,
                        "onUpdate:value": _cache[15] || (_cache[15] = ($event) => supplierForm.value.address = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "税号" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: supplierForm.value.tax_no,
                        "onUpdate:value": _cache[16] || (_cache[16] = ($event) => supplierForm.value.tax_no = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "开户行" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: supplierForm.value.bank_name,
                        "onUpdate:value": _cache[17] || (_cache[17] = ($event) => supplierForm.value.bank_name = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "银行账号" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: supplierForm.value.bank_account,
                        "onUpdate:value": _cache[18] || (_cache[18] = ($event) => supplierForm.value.bank_account = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: supplierForm.value.remark,
                        "onUpdate:value": _cache[19] || (_cache[19] = ($event) => supplierForm.value.remark = $event)
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
            show: showItemsModal.value,
            "onUpdate:show": _cache[22] || (_cache[22] = ($event) => showItemsModal.value = $event),
            title: "采购明细",
            preset: "card",
            style: { "width": "760px" }
          }, {
            default: withCtx(() => [
              createVNode(unref(_sfc_main$2), {
                columns: itemColumns,
                data: unref(store).orderItems,
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
