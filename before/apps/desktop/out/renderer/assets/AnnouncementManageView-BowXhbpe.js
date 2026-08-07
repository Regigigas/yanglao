import { _ as _sfc_main$2 } from "./BaseTable.vue_vue_type_script_setup_true_lang-vD6Hc9gq.js";
import "./vendor-echarts-DEbY5nl3.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-CnaIdrBG.js";
import { u as useAuthStore } from "./index-qSxYm2OB.js";
import { f as formatDateTime } from "./validators-BfKhytEl.js";
import { u as useAnnouncementStore } from "./announcement.store-bGZtKrzW.js";
import { u as usePageRefresh } from "./usePageRefresh-Wnx_lW1d.js";
import { u as useMessage, p as useDialog, l as NInput, J as NSelect, j as NForm, k as NFormItem, H as NDatePicker, _ as NSwitch, v as NSpace, B as Button, h as NModal, o as NTag } from "./vendor-naive-DqQyyJr8.js";
import { l as defineComponent, h as onActivated, j as onDeactivated, I as onUnmounted, U as createBlock, W as withCtx, u as unref, V as openBlock, a3 as createBaseVNode, X as createVNode, k as createTextVNode, a9 as createCommentVNode, a8 as toDisplayString, c as computed, r as ref, q as h } from "./vendor-vue-Hc3ejqjp.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./vendor-query-CFvMrhIw.js";
import "./vendor-utils-DD6FGs_H.js";
import "./useAutoRefresh-BeuDS8Br.js";
const _hoisted_1 = { class: "flex gap-3 mb-4" };
const _hoisted_2 = { class: "read-summary mb-4" };
const _hoisted_3 = { class: "text-green-600" };
const _hoisted_4 = { class: "text-orange-500" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "AnnouncementManage" },
  __name: "AnnouncementManageView",
  setup(__props) {
    const announcementStore = useAnnouncementStore();
    const authStore = useAuthStore();
    const message = useMessage();
    const dialog = useDialog();
    async function loadData() {
      await announcementStore.fetchAll();
    }
    const { refresh, refreshing } = usePageRefresh(loadData);
    let refreshTimer = null;
    function startAutoRefresh() {
      if (refreshTimer) return;
      refreshTimer = setInterval(refresh, 6e4);
    }
    function stopAutoRefresh() {
      if (!refreshTimer) return;
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
    onActivated(() => {
      void refresh();
      startAutoRefresh();
    });
    onDeactivated(stopAutoRefresh);
    onUnmounted(stopAutoRefresh);
    const canEdit = computed(() => authStore.canUseButton("announcement:edit"));
    const canPublish = computed(
      () => authStore.canUseButton("announcement:publish")
    );
    const canDelete = computed(
      () => authStore.canUseButton("announcement:delete")
    );
    const canSaveDraft = computed(() => !editingRow.value || canEdit.value);
    const keyword = ref("");
    const statusFilter = ref(null);
    const filteredList = computed(
      () => announcementStore.list.filter((row) => {
        const status = displayStatus(row).key;
        const matchesKeyword = !keyword.value.trim() || `${row.title} ${row.content}`.toLowerCase().includes(keyword.value.trim().toLowerCase());
        return matchesKeyword && (!statusFilter.value || status === statusFilter.value);
      })
    );
    const levelOptions = [
      { label: "普通公告", value: "normal" },
      { label: "重要公告", value: "important" },
      { label: "紧急公告", value: "urgent" }
    ];
    const statusOptions = [
      { label: "草稿", value: "draft" },
      { label: "待发布", value: "scheduled" },
      { label: "发布中", value: "published" },
      { label: "已失效", value: "expired" },
      { label: "已撤回", value: "withdrawn" }
    ];
    function levelLabel(level) {
      return { normal: "普通", important: "重要", urgent: "紧急" }[level];
    }
    function levelType(level) {
      return { normal: "default", important: "warning", urgent: "error" }[level];
    }
    function displayStatus(row) {
      if (row.status === "draft")
        return { key: "draft", label: "草稿", type: "default" };
      if (row.status === "withdrawn")
        return { key: "withdrawn", label: "已撤回", type: "default" };
      if (row.publish_at > Date.now())
        return { key: "scheduled", label: "待发布", type: "info" };
      if (row.expire_at && row.expire_at <= Date.now())
        return { key: "expired", label: "已失效", type: "default" };
      return { key: "published", label: "发布中", type: "success" };
    }
    const showEditor = ref(false);
    const saving = ref(false);
    const editingRow = ref(null);
    const form = ref({
      title: "",
      content: "",
      level: "normal",
      is_pinned: false,
      publish_at: Date.now(),
      expire_at: null
    });
    function resetForm(row) {
      editingRow.value = row ?? null;
      form.value = row ? {
        title: row.title,
        content: row.content,
        level: row.level,
        is_pinned: row.is_pinned === 1,
        publish_at: row.publish_at,
        expire_at: row.expire_at
      } : {
        title: "",
        content: "",
        level: "normal",
        is_pinned: false,
        publish_at: Date.now(),
        expire_at: null
      };
      showEditor.value = true;
    }
    async function save(publish) {
      const title = form.value.title.trim();
      const content = form.value.content.trim();
      if (!title || !content) return message.error("请填写公告标题和正文");
      if (form.value.expire_at && form.value.expire_at <= form.value.publish_at) {
        return message.error("失效时间必须晚于发布时间");
      }
      const userId = authStore.currentUser?.id;
      if (!userId) return message.error("当前登录信息失效，请重新登录");
      saving.value = true;
      try {
        const payload = {
          title,
          content,
          level: form.value.level,
          is_pinned: form.value.is_pinned ? 1 : 0,
          publish_at: form.value.publish_at,
          expire_at: form.value.expire_at
        };
        if (editingRow.value) {
          await window.api.announcement.update(editingRow.value.id, {
            ...payload,
            status: publish ? "published" : editingRow.value.status
          });
        } else {
          await window.api.announcement.create({
            ...payload,
            status: publish ? "published" : "draft",
            created_by: userId
          });
        }
        message.success(
          publish ? form.value.publish_at > Date.now() ? "公告已定时发布" : "公告已发布" : "草稿已保存"
        );
        showEditor.value = false;
        await refresh();
      } finally {
        saving.value = false;
      }
    }
    async function publishNow(row) {
      const userId = authStore.currentUser?.id;
      if (!userId) return;
      await window.api.announcement.publish(row.id, userId);
      message.success("公告已立即发布");
      await refresh();
    }
    function withdraw(row) {
      dialog.warning({
        title: "撤回公告",
        content: `撤回后“${row.title}”将立即从全局滚动栏移除，确定继续吗？`,
        positiveText: "撤回",
        negativeText: "取消",
        onPositiveClick: async () => {
          await window.api.announcement.withdraw(row.id);
          message.success("公告已撤回");
          await refresh();
        }
      });
    }
    function remove(row) {
      dialog.error({
        title: "删除公告",
        content: `删除后不可恢复，确定删除“${row.title}”吗？`,
        positiveText: "删除",
        negativeText: "取消",
        onPositiveClick: async () => {
          await window.api.announcement.delete(row.id);
          message.success("公告已删除");
          await refresh();
        }
      });
    }
    const showReadModal = ref(false);
    const readingRow = ref(null);
    const readStats = ref({
      total: 0,
      read: 0,
      unread: 0
    });
    const readUsers = ref([]);
    async function openReadReport(row) {
      readingRow.value = row;
      const [stats, users] = await Promise.all([
        window.api.announcement.readStats(row.id),
        window.api.announcement.readUsers(row.id)
      ]);
      readStats.value = stats;
      readUsers.value = users;
      showReadModal.value = true;
    }
    const columns = [
      {
        title: "公告标题",
        key: "title",
        width: 220,
        ellipsis: { tooltip: true }
      },
      {
        title: "级别",
        key: "level",
        width: 90,
        render: (row) => h(
          NTag,
          { type: levelType(row.level), size: "small" },
          () => levelLabel(row.level)
        )
      },
      {
        title: "状态",
        key: "status",
        width: 100,
        render: (row) => {
          const status = displayStatus(row);
          return h(
            NTag,
            { type: status.type, size: "small" },
            () => status.label
          );
        }
      },
      {
        title: "置顶",
        key: "is_pinned",
        width: 70,
        render: (row) => row.is_pinned ? "是" : "否"
      },
      {
        title: "发布时间",
        key: "publish_at",
        width: 170,
        render: (row) => formatDateTime(row.publish_at)
      },
      {
        title: "有效至",
        key: "expire_at",
        width: 170,
        render: (row) => row.expire_at ? formatDateTime(row.expire_at) : "长期有效"
      },
      {
        title: "操作",
        key: "actions",
        width: 300,
        render: (row) => h(
          NSpace,
          { size: 4 },
          {
            default: () => [
              ...canEdit.value ? [
                h(
                  Button,
                  { size: "small", onClick: () => resetForm(row) },
                  () => "编辑"
                )
              ] : [],
              h(
                Button,
                { size: "small", onClick: () => openReadReport(row) },
                () => "阅读情况"
              ),
              ...canPublish.value && row.status === "draft" ? [
                h(
                  Button,
                  {
                    size: "small",
                    type: "primary",
                    onClick: () => publishNow(row)
                  },
                  () => "立即发布"
                )
              ] : [],
              ...canPublish.value && row.status === "published" ? [
                h(
                  Button,
                  {
                    size: "small",
                    type: "warning",
                    onClick: () => withdraw(row)
                  },
                  () => "撤回"
                )
              ] : [],
              ...canDelete.value ? [
                h(
                  Button,
                  {
                    size: "small",
                    type: "error",
                    onClick: () => remove(row)
                  },
                  () => "删除"
                )
              ] : []
            ]
          }
        )
      }
    ];
    const readColumns = [
      { title: "姓名", key: "real_name", width: 130 },
      { title: "账号", key: "username", width: 140 },
      {
        title: "阅读时间",
        key: "read_at",
        render: (row) => formatDateTime(row.read_at)
      }
    ];
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "公告管理" }, {
        "header-extra": withCtx(() => [
          createVNode(unref(NSpace), null, {
            default: withCtx(() => [
              createVNode(unref(Button), {
                loading: unref(refreshing),
                size: "small",
                onClick: unref(refresh)
              }, {
                default: withCtx(() => [..._cache[15] || (_cache[15] = [
                  createTextVNode("刷新", -1)
                ])]),
                _: 1
              }, 8, ["loading", "onClick"]),
              createVNode(unref(Button), {
                type: "primary",
                onClick: _cache[0] || (_cache[0] = ($event) => resetForm())
              }, {
                default: withCtx(() => [..._cache[16] || (_cache[16] = [
                  createTextVNode("+ 添加公告", -1)
                ])]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createVNode(unref(NInput), {
              value: keyword.value,
              "onUpdate:value": _cache[1] || (_cache[1] = ($event) => keyword.value = $event),
              clearable: "",
              placeholder: "搜索标题或正文",
              style: { "width": "260px" }
            }, null, 8, ["value"]),
            createVNode(unref(NSelect), {
              value: statusFilter.value,
              "onUpdate:value": _cache[2] || (_cache[2] = ($event) => statusFilter.value = $event),
              options: statusOptions,
              clearable: "",
              placeholder: "全部状态",
              style: { "width": "150px" }
            }, null, 8, ["value"])
          ]),
          createVNode(unref(_sfc_main$2), {
            columns,
            data: filteredList.value,
            loading: unref(announcementStore).loading,
            pagination: { pageSize: 12 }
          }, null, 8, ["data", "loading"]),
          createVNode(unref(NModal), {
            show: showEditor.value,
            "onUpdate:show": _cache[12] || (_cache[12] = ($event) => showEditor.value = $event),
            preset: "card",
            title: editingRow.value ? "编辑公告" : "添加公告",
            style: { "width": "680px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[9] || (_cache[9] = ($event) => showEditor.value = false)
                  }, {
                    default: withCtx(() => [..._cache[19] || (_cache[19] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  canSaveDraft.value ? (openBlock(), createBlock(unref(Button), {
                    key: 0,
                    loading: saving.value,
                    onClick: _cache[10] || (_cache[10] = ($event) => save(false))
                  }, {
                    default: withCtx(() => [..._cache[20] || (_cache[20] = [
                      createTextVNode("保存草稿", -1)
                    ])]),
                    _: 1
                  }, 8, ["loading"])) : createCommentVNode("", true),
                  !editingRow.value || canPublish.value ? (openBlock(), createBlock(unref(Button), {
                    key: 1,
                    type: "primary",
                    loading: saving.value,
                    onClick: _cache[11] || (_cache[11] = ($event) => save(true))
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(form.value.publish_at > Date.now() ? "定时发布" : "发布"), 1)
                    ]),
                    _: 1
                  }, 8, ["loading"])) : createCommentVNode("", true)
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
                    label: "公告标题",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: form.value.title,
                        "onUpdate:value": _cache[3] || (_cache[3] = ($event) => form.value.title = $event),
                        maxlength: "60",
                        "show-count": "",
                        placeholder: "简明描述需传达的事项"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "公告级别" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: form.value.level,
                        "onUpdate:value": _cache[4] || (_cache[4] = ($event) => form.value.level = $event),
                        options: levelOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "公告正文",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: form.value.content,
                        "onUpdate:value": _cache[5] || (_cache[5] = ($event) => form.value.content = $event),
                        type: "textarea",
                        rows: 7,
                        maxlength: "2000",
                        "show-count": "",
                        placeholder: "填写公告详情、执行要求或注意事项"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "发布时间" }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        value: form.value.publish_at,
                        "onUpdate:value": _cache[6] || (_cache[6] = ($event) => form.value.publish_at = $event),
                        type: "datetime",
                        clearable: "",
                        style: { "width": "100%" }
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "失效时间" }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        value: form.value.expire_at,
                        "onUpdate:value": _cache[7] || (_cache[7] = ($event) => form.value.expire_at = $event),
                        type: "datetime",
                        clearable: "",
                        style: { "width": "100%" }
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "置顶显示" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSwitch), {
                        value: form.value.is_pinned,
                        "onUpdate:value": _cache[8] || (_cache[8] = ($event) => form.value.is_pinned = $event)
                      }, {
                        checked: withCtx(() => [..._cache[17] || (_cache[17] = [
                          createTextVNode("置顶", -1)
                        ])]),
                        unchecked: withCtx(() => [..._cache[18] || (_cache[18] = [
                          createTextVNode("普通", -1)
                        ])]),
                        _: 1
                      }, 8, ["value"])
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
            show: showReadModal.value,
            "onUpdate:show": _cache[14] || (_cache[14] = ($event) => showReadModal.value = $event),
            preset: "card",
            title: `${readingRow.value?.title ?? ""} - 阅读情况`,
            style: { "width": "680px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(Button), {
                onClick: _cache[13] || (_cache[13] = ($event) => showReadModal.value = false)
              }, {
                default: withCtx(() => [..._cache[21] || (_cache[21] = [
                  createTextVNode("关闭", -1)
                ])]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createBaseVNode("div", _hoisted_2, [
                createBaseVNode("span", null, "应读 " + toDisplayString(readStats.value.total) + " 人", 1),
                createBaseVNode("span", _hoisted_3, "已读 " + toDisplayString(readStats.value.read) + " 人", 1),
                createBaseVNode("span", _hoisted_4, "未读 " + toDisplayString(readStats.value.unread) + " 人", 1)
              ]),
              createVNode(unref(_sfc_main$2), {
                columns: readColumns,
                data: readUsers.value,
                pagination: { pageSize: 8 }
              }, null, 8, ["data"])
            ]),
            _: 1
          }, 8, ["show", "title"])
        ]),
        _: 1
      });
    };
  }
});
const AnnouncementManageView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-82c57bd8"]]);
export {
  AnnouncementManageView as default
};
