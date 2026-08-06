import { _ as _sfc_main$3 } from "./BaseTable.vue_vue_type_script_setup_true_lang-Cd51FqA2.js";
import "./vendor-echarts-DEbY5nl3.js";
import { _ as _sfc_main$2 } from "./BaseEmpty.vue_vue_type_script_setup_true_lang-DeX6H2ap.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-D7sGS98F.js";
import "./index-rYee39mb.js";
import { u as useUserStore } from "./user.store-CgFXZFBa.js";
import { u as useRoleStore } from "./role.store-USVCZhNx.js";
import { f as formatDateTime } from "./validators-BfKhytEl.js";
import { u as usePageRefresh } from "./usePageRefresh-Wnx_lW1d.js";
import { u as useMessage, p as useDialog, v as NSpace, l as NInput, J as NSelect, B as Button, g as NCard, j as NForm, k as NFormItem, h as NModal, _ as NSwitch } from "./vendor-naive-HV2ECLT0.js";
import { l as defineComponent, U as createBlock, W as withCtx, u as unref, V as openBlock, X as createVNode, k as createTextVNode, m as withDirectives, a9 as createCommentVNode, c as computed, r as ref, q as h, ae as resolveDirective } from "./vendor-vue-Hc3ejqjp.js";
import "./vendor-query-CFvMrhIw.js";
import "./vendor-utils-DD6FGs_H.js";
import "./useAutoRefresh-BeuDS8Br.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "UserManage" },
  __name: "UserManageView",
  setup(__props) {
    const userStore = useUserStore();
    const roleStore = useRoleStore();
    const message = useMessage();
    const dialog = useDialog();
    async function loadData() {
      await Promise.all([userStore.fetchList(), roleStore.fetchList()]);
    }
    const { refresh, refreshing } = usePageRefresh(loadData);
    const roleOptions = computed(
      () => roleStore.list.map((r) => ({ label: r.name, value: r.id }))
    );
    function roleName(roleId) {
      return roleStore.list.find((r) => r.id === roleId)?.name ?? "—";
    }
    const search = ref("");
    const roleFilter = ref(null);
    const statusFilter = ref(null);
    const filtered = computed(() => {
      return userStore.list.filter((u) => {
        const matchSearch = !search.value || u.username.includes(search.value) || u.real_name.includes(search.value) || u.phone?.includes(search.value);
        const matchRole = !roleFilter.value || u.role_id === roleFilter.value;
        const matchStatus = !statusFilter.value || u.status === statusFilter.value;
        return matchSearch && matchRole && matchStatus;
      });
    });
    async function toggleStatus(row, val) {
      if (row.username === "admin" && !val) {
        message.error("内置管理员账号不允许禁用");
        return;
      }
      await userStore.update(row.id, { status: val ? "active" : "disabled" });
      message.success(val ? "已启用" : "已禁用");
      await userStore.fetchList();
    }
    const showUserModal = ref(false);
    const editingId = ref(null);
    const userForm = ref({
      username: "",
      password: "",
      real_name: "",
      phone: "",
      role_id: "",
      status: "active",
      position: "",
      department: "",
      remark: ""
    });
    const positionOptions = [
      { label: "护士", value: "护士" },
      { label: "护理员", value: "护理员" },
      { label: "前台", value: "前台" },
      { label: "后勤", value: "后勤" },
      { label: "厨师", value: "厨师" },
      { label: "管理员", value: "管理员" }
    ];
    const departmentOptions = [
      { label: "护理部", value: "护理部" },
      { label: "前台", value: "前台" },
      { label: "后勤部", value: "后勤部" },
      { label: "行政部", value: "行政部" }
    ];
    function openCreate() {
      editingId.value = null;
      userForm.value = {
        username: "",
        password: "",
        real_name: "",
        phone: "",
        role_id: roleStore.list[0]?.id ?? "",
        status: "active",
        position: "",
        department: "",
        remark: ""
      };
      showUserModal.value = true;
    }
    function openEdit(row) {
      editingId.value = row.id;
      userForm.value = {
        username: row.username,
        password: "",
        real_name: row.real_name,
        phone: row.phone ?? "",
        role_id: row.role_id,
        status: row.status,
        position: row.position ?? "",
        department: row.department ?? "",
        remark: row.remark ?? ""
      };
      showUserModal.value = true;
    }
    async function saveUser() {
      if (!userForm.value.real_name || !userForm.value.role_id) return message.error("请填写姓名并选择角色");
      if (editingId.value) {
        const res = await userStore.update(editingId.value, {
          real_name: userForm.value.real_name,
          phone: userForm.value.phone || null,
          role_id: userForm.value.role_id,
          status: userForm.value.status,
          position: userForm.value.position || null,
          department: userForm.value.department || null,
          remark: userForm.value.remark || null
        });
        if (!res.ok) return message.error(res.error ?? "保存失败");
        showUserModal.value = false;
        message.success("保存成功");
        await refresh();
      } else {
        if (!userForm.value.username || !userForm.value.password) return message.error("请填写用户名和初始密码");
        if (userForm.value.password.length < 6) return message.error("密码至少6位");
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
          remark: userForm.value.remark || null
        });
        if (!res.ok) return message.error(res.error ?? "创建失败");
        showUserModal.value = false;
        message.success("账号创建成功");
        await refresh();
      }
    }
    const showResetModal = ref(false);
    const resetUserId = ref(null);
    const resetPassword = ref("");
    function openReset(row) {
      resetUserId.value = row.id;
      resetPassword.value = "";
      showResetModal.value = true;
    }
    async function confirmReset() {
      if (!resetUserId.value || resetPassword.value.length < 6) return message.error("新密码至少6位");
      const res = await userStore.resetPassword(resetUserId.value, resetPassword.value);
      if (!res.ok) return message.error(res.error ?? "重置失败");
      showResetModal.value = false;
      message.success("密码已重置，用户下次登录需修改密码");
      await refresh();
    }
    const statusOptions = [
      { label: "启用", value: "active" },
      { label: "禁用", value: "disabled" }
    ];
    const columns = [
      { title: "用户名", key: "username", width: 120 },
      { title: "姓名", key: "real_name", width: 100 },
      { title: "手机号", key: "phone", width: 130, render: (r) => r.phone ?? "—" },
      { title: "职位", key: "position", width: 100, render: (r) => r.position ?? "—" },
      { title: "部门", key: "department", width: 100, render: (r) => r.department ?? "—" },
      { title: "角色", key: "role_id", width: 130, render: (r) => roleName(r.role_id) },
      {
        title: "状态",
        key: "status",
        width: 80,
        render: (r) => h(NSwitch, {
          value: r.status === "active",
          disabled: r.username === "admin",
          onUpdateValue: (val) => toggleStatus(r, val)
        })
      },
      { title: "最后登录", key: "last_login_at", width: 160, render: (r) => r.last_login_at ? formatDateTime(r.last_login_at) : "尚未登录" },
      {
        title: "操作",
        key: "actions",
        width: 200,
        render: (r) => h(NSpace, null, { default: () => [
          h(Button, { size: "small", onClick: () => openEdit(r) }, "编辑"),
          h(Button, { size: "small", onClick: () => openReset(r) }, "重置密码"),
          r.username !== "admin" ? h(Button, { size: "small", type: "error", onClick: () => {
            dialog.warning({
              title: "删除账号",
              content: `确定要删除账号 ${r.username} 吗？`,
              positiveText: "确定",
              negativeText: "取消",
              onPositiveClick: async () => {
                const res = await userStore.remove(r.id);
                if (!res.ok) return message.error(res.error ?? "删除失败");
                message.success("已删除");
                await refresh();
              }
            });
          } }, "删除") : null
        ] })
      }
    ];
    return (_ctx, _cache) => {
      const _directive_perm = resolveDirective("perm");
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "账号管理" }, {
        default: withCtx(() => [
          createVNode(unref(NCard), { class: "mb-4" }, {
            default: withCtx(() => [
              createVNode(unref(NSpace), {
                align: "center",
                justify: "space-between"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NSpace), null, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: search.value,
                        "onUpdate:value": _cache[0] || (_cache[0] = ($event) => search.value = $event),
                        placeholder: "搜索用户名/姓名/手机号",
                        clearable: "",
                        style: { "width": "220px" }
                      }, null, 8, ["value"]),
                      createVNode(unref(NSelect), {
                        value: roleFilter.value,
                        "onUpdate:value": _cache[1] || (_cache[1] = ($event) => roleFilter.value = $event),
                        clearable: "",
                        placeholder: "角色筛选",
                        options: roleOptions.value,
                        style: { "width": "140px" }
                      }, null, 8, ["value", "options"]),
                      createVNode(unref(NSelect), {
                        value: statusFilter.value,
                        "onUpdate:value": _cache[2] || (_cache[2] = ($event) => statusFilter.value = $event),
                        clearable: "",
                        placeholder: "状态筛选",
                        options: statusOptions,
                        style: { "width": "120px" }
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NSpace), null, {
                    default: withCtx(() => [
                      createVNode(unref(Button), {
                        loading: unref(refreshing),
                        size: "small",
                        onClick: unref(refresh)
                      }, {
                        default: withCtx(() => [..._cache[17] || (_cache[17] = [
                          createTextVNode("刷新", -1)
                        ])]),
                        _: 1
                      }, 8, ["loading", "onClick"]),
                      withDirectives((openBlock(), createBlock(unref(Button), {
                        type: "primary",
                        onClick: openCreate
                      }, {
                        default: withCtx(() => [..._cache[18] || (_cache[18] = [
                          createTextVNode("+ 新增账号", -1)
                        ])]),
                        _: 1
                      })), [
                        [_directive_perm, "user:create"]
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          !unref(userStore).loading && filtered.value.length === 0 ? (openBlock(), createBlock(unref(_sfc_main$2), {
            key: 0,
            description: "暂无账号，点击右上角新增"
          })) : (openBlock(), createBlock(unref(_sfc_main$3), {
            key: 1,
            columns,
            data: filtered.value,
            loading: unref(userStore).loading,
            pagination: { pageSize: 15 }
          }, null, 8, ["data", "loading"])),
          createVNode(unref(NModal), {
            show: showUserModal.value,
            "onUpdate:show": _cache[13] || (_cache[13] = ($event) => showUserModal.value = $event),
            title: editingId.value ? "编辑账号" : "新增账号",
            preset: "card",
            style: { "width": "480px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[12] || (_cache[12] = ($event) => showUserModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[19] || (_cache[19] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveUser
                  }, {
                    default: withCtx(() => [..._cache[20] || (_cache[20] = [
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
                model: userForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "用户名",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: userForm.value.username,
                        "onUpdate:value": _cache[3] || (_cache[3] = ($event) => userForm.value.username = $event),
                        disabled: !!editingId.value,
                        placeholder: "登录用户名，创建后不可修改"
                      }, null, 8, ["value", "disabled"])
                    ]),
                    _: 1
                  }),
                  !editingId.value ? (openBlock(), createBlock(unref(NFormItem), {
                    key: 0,
                    label: "初始密码",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: userForm.value.password,
                        "onUpdate:value": _cache[4] || (_cache[4] = ($event) => userForm.value.password = $event),
                        type: "password",
                        "show-password-on": "click",
                        placeholder: "至少6位"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  createVNode(unref(NFormItem), {
                    label: "姓名",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: userForm.value.real_name,
                        "onUpdate:value": _cache[5] || (_cache[5] = ($event) => userForm.value.real_name = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "手机号" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: userForm.value.phone,
                        "onUpdate:value": _cache[6] || (_cache[6] = ($event) => userForm.value.phone = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "职位" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: userForm.value.position,
                        "onUpdate:value": _cache[7] || (_cache[7] = ($event) => userForm.value.position = $event),
                        options: positionOptions,
                        filterable: "",
                        tag: "",
                        placeholder: "选择或输入职位",
                        clearable: ""
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "部门" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: userForm.value.department,
                        "onUpdate:value": _cache[8] || (_cache[8] = ($event) => userForm.value.department = $event),
                        options: departmentOptions,
                        filterable: "",
                        tag: "",
                        placeholder: "选择或输入部门",
                        clearable: ""
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "角色",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: userForm.value.role_id,
                        "onUpdate:value": _cache[9] || (_cache[9] = ($event) => userForm.value.role_id = $event),
                        options: roleOptions.value
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "状态" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: userForm.value.status,
                        "onUpdate:value": _cache[10] || (_cache[10] = ($event) => userForm.value.status = $event),
                        options: statusOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: userForm.value.remark,
                        "onUpdate:value": _cache[11] || (_cache[11] = ($event) => userForm.value.remark = $event),
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
            show: showResetModal.value,
            "onUpdate:show": _cache[16] || (_cache[16] = ($event) => showResetModal.value = $event),
            title: "重置密码",
            preset: "card",
            style: { "width": "400px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[15] || (_cache[15] = ($event) => showResetModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[21] || (_cache[21] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: confirmReset
                  }, {
                    default: withCtx(() => [..._cache[22] || (_cache[22] = [
                      createTextVNode("确认重置", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "新密码",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: resetPassword.value,
                        "onUpdate:value": _cache[14] || (_cache[14] = ($event) => resetPassword.value = $event),
                        type: "password",
                        "show-password-on": "click",
                        placeholder: "至少6位，重置后用户下次登录需修改密码"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
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
