import { _ as _sfc_main$3 } from "./BaseTable.vue_vue_type_script_setup_true_lang-vD6Hc9gq.js";
import "./vendor-echarts-DEbY5nl3.js";
import { _ as _sfc_main$2 } from "./BaseEmpty.vue_vue_type_script_setup_true_lang-fNQjxCHs.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-CnaIdrBG.js";
import { M as MENU_GROUPS, B as BUTTON_CATALOG, c as MENU_CATALOG } from "./index-qSxYm2OB.js";
import { u as useRoleStore } from "./role.store-USVCZhNx.js";
import { u as usePermissionGroupStore } from "./permission-group.store-BQM4KYx1.js";
import { u as usePageRefresh } from "./usePageRefresh-Wnx_lW1d.js";
import { u as useMessage, p as useDialog, v as NSpace, l as NInput, B as Button, g as NCard, j as NForm, k as NFormItem, J as NSelect, X as NDivider, $ as NCheckboxGroup, h as NModal, o as NTag, m as NCheckbox } from "./vendor-naive-DqQyyJr8.js";
import { l as defineComponent, U as createBlock, W as withCtx, u as unref, V as openBlock, X as createVNode, m as withDirectives, k as createTextVNode, a1 as createElementBlock, a6 as renderList, F as Fragment, r as ref, c as computed, q as h, ae as resolveDirective, a3 as createBaseVNode, a8 as toDisplayString } from "./vendor-vue-Hc3ejqjp.js";
import "./vendor-query-CFvMrhIw.js";
import "./useAutoRefresh-BeuDS8Br.js";
const _hoisted_1 = { class: "text-xs text-gray-400 mb-1" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "RoleManage" },
  __name: "RoleManageView",
  setup(__props) {
    const roleStore = useRoleStore();
    const permissionGroupStore = usePermissionGroupStore();
    const message = useMessage();
    const dialog = useDialog();
    async function loadData() {
      await Promise.all([roleStore.fetchList(), permissionGroupStore.fetchList()]);
    }
    const { refresh, refreshing } = usePageRefresh(loadData);
    const search = ref("");
    const filtered = computed(() => {
      return roleStore.list.filter((r) => {
        return !search.value || r.name.includes(search.value) || r.code.includes(search.value);
      });
    });
    const showRoleModal = ref(false);
    const editingId = ref(null);
    const roleForm = ref({
      name: "",
      code: "",
      remark: "",
      menuKeys: [],
      buttonKeys: []
    });
    const presetChoice = ref(null);
    function openCreate() {
      editingId.value = null;
      presetChoice.value = null;
      roleForm.value = { name: "", code: "", remark: "", menuKeys: [], buttonKeys: [] };
      showRoleModal.value = true;
    }
    function openEdit(row) {
      editingId.value = row.id;
      presetChoice.value = null;
      roleForm.value = {
        name: row.name,
        code: row.code,
        remark: row.remark ?? "",
        menuKeys: safeParse(row.menu_keys),
        buttonKeys: safeParse(row.button_keys)
      };
      showRoleModal.value = true;
    }
    function safeParse(json) {
      try {
        return JSON.parse(json);
      } catch {
        return [];
      }
    }
    const presetOptions = computed(() => permissionGroupStore.list.map((g) => ({ label: g.name, value: g.id })));
    function applyPreset(id) {
      if (!id) return;
      const preset = permissionGroupStore.list.find((g) => g.id === id);
      if (preset) {
        roleForm.value.menuKeys = safeParse(preset.menu_keys);
        roleForm.value.buttonKeys = safeParse(preset.button_keys);
      }
    }
    async function saveRole() {
      if (!roleForm.value.name || !roleForm.value.code) return message.error("请填写角色名称和编码");
      const payload = {
        name: roleForm.value.name,
        code: roleForm.value.code,
        menu_keys: JSON.stringify(roleForm.value.menuKeys),
        button_keys: JSON.stringify(roleForm.value.buttonKeys),
        remark: roleForm.value.remark || null
      };
      if (editingId.value) {
        const res = await roleStore.update(editingId.value, payload);
        if (!res.ok) return message.error(res.error ?? "保存失败");
        message.success("保存成功");
      } else {
        await roleStore.create(payload);
        message.success("角色创建成功");
      }
      showRoleModal.value = false;
      await refresh();
    }
    function removeRole(row) {
      if (row.user_count > 0) {
        message.error(`该角色下仍有 ${row.user_count} 个账号，请先转移或删除相关账号`);
        return;
      }
      dialog.warning({
        title: "删除角色",
        content: `确定要删除角色"${row.name}"吗？`,
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: async () => {
          const res = await roleStore.remove(row.id);
          if (!res.ok) return message.error(res.error ?? "删除失败");
          message.success("已删除");
          await refresh();
        }
      });
    }
    const columns = [
      { title: "角色名称", key: "name", width: 150 },
      { title: "编码", key: "code", width: 120 },
      { title: "类型", key: "is_system", width: 100, render: (r) => r.is_system ? h(NTag, { type: "warning" }, () => "系统内置") : h(NTag, () => "自定义") },
      { title: "菜单权限数", key: "menu_keys", width: 100, render: (r) => {
        const k = safeParse(r.menu_keys);
        return k.includes("*") ? "全部" : `${k.length} 项`;
      } },
      { title: "关联账号数", key: "user_count", width: 100 },
      { title: "备注", key: "remark", render: (r) => r.remark ?? "—" },
      {
        title: "操作",
        key: "actions",
        width: 160,
        render: (r) => r.is_system ? h(NTag, { type: "default" }, () => "不可修改") : h(NSpace, null, { default: () => [
          h(Button, { size: "small", onClick: () => openEdit(r) }, "编辑"),
          h(Button, { size: "small", type: "error", onClick: () => removeRole(r) }, "删除")
        ] })
      }
    ];
    return (_ctx, _cache) => {
      const _directive_perm = resolveDirective("perm");
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "角色权限" }, {
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
                    placeholder: "搜索角色名称/编码",
                    clearable: "",
                    style: { "width": "240px" }
                  }, null, 8, ["value"]),
                  createVNode(unref(NSpace), null, {
                    default: withCtx(() => [
                      withDirectives((openBlock(), createBlock(unref(Button), {
                        type: "primary",
                        onClick: openCreate
                      }, {
                        default: withCtx(() => [..._cache[9] || (_cache[9] = [
                          createTextVNode("+ 新增角色", -1)
                        ])]),
                        _: 1
                      })), [
                        [_directive_perm, "role:create"]
                      ]),
                      createVNode(unref(Button), {
                        loading: unref(refreshing),
                        size: "small",
                        onClick: unref(refresh)
                      }, {
                        default: withCtx(() => [..._cache[10] || (_cache[10] = [
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
          !unref(roleStore).loading && filtered.value.length === 0 ? (openBlock(), createBlock(unref(_sfc_main$2), {
            key: 0,
            description: "暂无角色，点击右上角新增"
          })) : (openBlock(), createBlock(unref(_sfc_main$3), {
            key: 1,
            columns,
            data: filtered.value,
            loading: unref(roleStore).loading,
            pagination: { pageSize: 15 }
          }, null, 8, ["data", "loading"])),
          createVNode(unref(NModal), {
            show: showRoleModal.value,
            "onUpdate:show": _cache[8] || (_cache[8] = ($event) => showRoleModal.value = $event),
            title: editingId.value ? "编辑角色" : "新增角色",
            preset: "card",
            style: { "width": "640px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[7] || (_cache[7] = ($event) => showRoleModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[13] || (_cache[13] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveRole
                  }, {
                    default: withCtx(() => [..._cache[14] || (_cache[14] = [
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
                model: roleForm.value,
                "label-placement": "left",
                "label-width": "100"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "角色名称",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: roleForm.value.name,
                        "onUpdate:value": _cache[1] || (_cache[1] = ($event) => roleForm.value.name = $event),
                        placeholder: "如：护理人员"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "角色编码",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: roleForm.value.code,
                        "onUpdate:value": _cache[2] || (_cache[2] = ($event) => roleForm.value.code = $event),
                        disabled: !!editingId.value,
                        placeholder: "如：nurse，创建后不可修改"
                      }, null, 8, ["value", "disabled"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "套用权限组" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: presetChoice.value,
                        "onUpdate:value": [
                          _cache[3] || (_cache[3] = ($event) => presetChoice.value = $event),
                          applyPreset
                        ],
                        options: presetOptions.value,
                        clearable: "",
                        placeholder: "可选：选择权限组快速套用菜单+按钮权限，之后仍可手动调整"
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NDivider), { style: { "margin": "8px 0" } }, {
                    default: withCtx(() => [..._cache[11] || (_cache[11] = [
                      createTextVNode("菜单权限（自定义勾选）", -1)
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
                        value: roleForm.value.menuKeys,
                        "onUpdate:value": _cache[4] || (_cache[4] = ($event) => roleForm.value.menuKeys = $event)
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
                    default: withCtx(() => [..._cache[12] || (_cache[12] = [
                      createTextVNode("按钮权限（自定义勾选）", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(NCheckboxGroup), {
                    value: roleForm.value.buttonKeys,
                    "onUpdate:value": _cache[5] || (_cache[5] = ($event) => roleForm.value.buttonKeys = $event)
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
                        value: roleForm.value.remark,
                        "onUpdate:value": _cache[6] || (_cache[6] = ($event) => roleForm.value.remark = $event),
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
