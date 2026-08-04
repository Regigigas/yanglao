import { _ as _sfc_main$3 } from "./BaseTable.vue_vue_type_script_setup_true_lang-Kf6svQhn.js";
import "./vendor-echarts-DEbY5nl3.js";
import { _ as _sfc_main$2 } from "./BaseEmpty.vue_vue_type_script_setup_true_lang-DsPzI4fz.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-CoKRdyPV.js";
import { M as MENU_GROUPS, B as BUTTON_CATALOG, c as MENU_CATALOG } from "./index-77IpmxCe.js";
import { u as usePermissionGroupStore } from "./permission-group.store-BQM4KYx1.js";
import { u as usePageRefresh } from "./usePageRefresh-Wnx_lW1d.js";
import { u as useMessage, p as useDialog, v as NSpace, l as NInput, B as Button, g as NCard, j as NForm, k as NFormItem, W as NDivider, _ as NCheckboxGroup, h as NModal, m as NCheckbox } from "./vendor-naive-sdNTCZPI.js";
import { l as defineComponent, U as createBlock, W as withCtx, u as unref, V as openBlock, X as createVNode, m as withDirectives, k as createTextVNode, a1 as createElementBlock, a6 as renderList, F as Fragment, r as ref, c as computed, q as h, ae as resolveDirective, a3 as createBaseVNode, a8 as toDisplayString } from "./vendor-vue-Hc3ejqjp.js";
import "./vendor-query-CFvMrhIw.js";
import "./useAutoRefresh-BeuDS8Br.js";
const _hoisted_1 = { class: "text-xs text-gray-400 mb-1" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "PermissionGroupManage" },
  __name: "PermissionGroupManageView",
  setup(__props) {
    const store = usePermissionGroupStore();
    const message = useMessage();
    const dialog = useDialog();
    async function loadData() {
      await store.fetchList();
    }
    const { refresh, refreshing } = usePageRefresh(loadData);
    const search = ref("");
    function safeParse(json) {
      try {
        return JSON.parse(json);
      } catch {
        return [];
      }
    }
    const filtered = computed(() => {
      return store.list.filter((g) => {
        return !search.value || g.name.includes(search.value) || g.code.includes(search.value);
      });
    });
    const showModal = ref(false);
    const editingId = ref(null);
    const form = ref({
      name: "",
      code: "",
      remark: "",
      menuKeys: [],
      buttonKeys: []
    });
    function openCreate() {
      editingId.value = null;
      form.value = { name: "", code: "", remark: "", menuKeys: [], buttonKeys: [] };
      showModal.value = true;
    }
    function openEdit(row) {
      editingId.value = row.id;
      form.value = {
        name: row.name,
        code: row.code,
        remark: row.remark ?? "",
        menuKeys: safeParse(row.menu_keys),
        buttonKeys: safeParse(row.button_keys)
      };
      showModal.value = true;
    }
    async function save() {
      if (!form.value.name || !form.value.code) return message.error("请填写权限组名称和编码");
      const payload = {
        name: form.value.name,
        code: form.value.code,
        menu_keys: JSON.stringify(form.value.menuKeys),
        button_keys: JSON.stringify(form.value.buttonKeys),
        remark: form.value.remark || null
      };
      if (editingId.value) {
        const res = await store.update(editingId.value, payload);
        if (!res.ok) return message.error(res.error ?? "保存失败");
        message.success("保存成功");
      } else {
        const res = await store.create(payload);
        if (!res.ok) return message.error(res.error ?? "创建失败");
        message.success("权限组创建成功");
      }
      showModal.value = false;
      await refresh();
    }
    function remove(row) {
      dialog.warning({
        title: "删除权限组",
        content: `确定要删除权限组"${row.name}"吗？已套用过该权限组的角色不受影响。`,
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: async () => {
          const res = await store.remove(row.id);
          if (!res.ok) return message.error(res.error ?? "删除失败");
          message.success("已删除");
          await refresh();
        }
      });
    }
    const columns = [
      { title: "权限组名称", key: "name", width: 150 },
      { title: "编码", key: "code", width: 120 },
      { title: "菜单权限数", key: "menu_keys", width: 100, render: (r) => {
        const k = safeParse(r.menu_keys);
        return k.includes("*") ? "全部" : `${k.length} 项`;
      } },
      { title: "按钮权限数", key: "button_keys", width: 100, render: (r) => {
        const k = safeParse(r.button_keys);
        return k.includes("*") ? "全部" : `${k.length} 项`;
      } },
      { title: "备注", key: "remark", render: (r) => r.remark ?? "—" },
      {
        title: "操作",
        key: "actions",
        width: 160,
        render: (r) => h(NSpace, null, { default: () => [
          h(Button, { size: "small", onClick: () => openEdit(r) }, "编辑"),
          h(Button, { size: "small", type: "error", onClick: () => remove(r) }, "删除")
        ] })
      }
    ];
    return (_ctx, _cache) => {
      const _directive_perm = resolveDirective("perm");
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "权限组管理" }, {
        default: withCtx(() => [
          createVNode(unref(NCard), { class: "mb-4" }, {
            default: withCtx(() => [
              createVNode(unref(NSpace), {
                align: "center",
                justify: "space-between"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NInput), {
                    value: search.value,
                    "onUpdate:value": _cache[0] || (_cache[0] = ($event) => search.value = $event),
                    placeholder: "搜索权限组名称/编码",
                    clearable: "",
                    style: { "width": "240px" }
                  }, null, 8, ["value"]),
                  createVNode(unref(NSpace), null, {
                    default: withCtx(() => [
                      withDirectives((openBlock(), createBlock(unref(Button), {
                        type: "primary",
                        onClick: openCreate
                      }, {
                        default: withCtx(() => [..._cache[8] || (_cache[8] = [
                          createTextVNode("+ 新增权限组", -1)
                        ])]),
                        _: 1
                      })), [
                        [_directive_perm, "permission-group:create"]
                      ]),
                      createVNode(unref(Button), {
                        loading: unref(refreshing),
                        size: "small",
                        onClick: unref(refresh)
                      }, {
                        default: withCtx(() => [..._cache[9] || (_cache[9] = [
                          createTextVNode("刷新", -1)
                        ])]),
                        _: 1
                      }, 8, ["loading", "onClick"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          !unref(store).loading && filtered.value.length === 0 ? (openBlock(), createBlock(unref(_sfc_main$2), {
            key: 0,
            description: "暂无权限组，点击右上角新增"
          })) : (openBlock(), createBlock(unref(_sfc_main$3), {
            key: 1,
            columns,
            data: filtered.value,
            loading: unref(store).loading,
            pagination: { pageSize: 15 }
          }, null, 8, ["data", "loading"])),
          createVNode(unref(NModal), {
            show: showModal.value,
            "onUpdate:show": _cache[7] || (_cache[7] = ($event) => showModal.value = $event),
            title: editingId.value ? "编辑权限组" : "新增权限组",
            preset: "card",
            style: { "width": "640px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[6] || (_cache[6] = ($event) => showModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[12] || (_cache[12] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: save
                  }, {
                    default: withCtx(() => [..._cache[13] || (_cache[13] = [
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
                model: form.value,
                "label-placement": "left",
                "label-width": "100"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "权限组名称",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: form.value.name,
                        "onUpdate:value": _cache[1] || (_cache[1] = ($event) => form.value.name = $event),
                        placeholder: "如：护理人员"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "权限组编码",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: form.value.code,
                        "onUpdate:value": _cache[2] || (_cache[2] = ($event) => form.value.code = $event),
                        disabled: !!editingId.value,
                        placeholder: "如：nurse，创建后不可修改"
                      }, null, 8, ["value", "disabled"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NDivider), { style: { "margin": "8px 0" } }, {
                    default: withCtx(() => [..._cache[10] || (_cache[10] = [
                      createTextVNode("菜单权限", -1)
                    ])]),
                    _: 1
                  }),
                  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(MENU_GROUPS), (group) => {
                    return openBlock(), createElementBlock("div", {
                      key: group.key,
                      class: "mb-2"
                    }, [
                      createBaseVNode("div", _hoisted_1, toDisplayString(group.label), 1),
                      createVNode(unref(NCheckboxGroup), {
                        value: form.value.menuKeys,
                        "onUpdate:value": _cache[3] || (_cache[3] = ($event) => form.value.menuKeys = $event)
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NSpace), null, {
                            default: withCtx(() => [
                              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(MENU_CATALOG).filter((m) => m.group === group.key), (item) => {
                                return openBlock(), createBlock(unref(NCheckbox), {
                                  key: item.key,
                                  value: item.key,
                                  label: item.label
                                }, null, 8, ["value", "label"]);
                              }), 128))
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1032, ["value"])
                    ]);
                  }), 128)),
                  createVNode(unref(NDivider), { style: { "margin": "8px 0" } }, {
                    default: withCtx(() => [..._cache[11] || (_cache[11] = [
                      createTextVNode("按钮权限", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(NCheckboxGroup), {
                    value: form.value.buttonKeys,
                    "onUpdate:value": _cache[4] || (_cache[4] = ($event) => form.value.buttonKeys = $event)
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSpace), null, {
                        default: withCtx(() => [
                          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(BUTTON_CATALOG), (btn) => {
                            return openBlock(), createBlock(unref(NCheckbox), {
                              key: btn.key,
                              value: btn.key,
                              label: btn.label
                            }, null, 8, ["value", "label"]);
                          }), 128))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["value"]),
                  createVNode(unref(NFormItem), {
                    label: "备注",
                    class: "mt-3"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: form.value.remark,
                        "onUpdate:value": _cache[5] || (_cache[5] = ($event) => form.value.remark = $event),
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
