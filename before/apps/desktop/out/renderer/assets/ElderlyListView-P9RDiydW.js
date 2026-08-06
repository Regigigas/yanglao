import { _ as _sfc_main$3 } from "./BaseTable.vue_vue_type_script_setup_true_lang-Cd51FqA2.js";
import "./vendor-echarts-DEbY5nl3.js";
import { _ as _sfc_main$2 } from "./BaseEmpty.vue_vue_type_script_setup_true_lang-DeX6H2ap.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-D7sGS98F.js";
import "./index-rYee39mb.js";
import { u as useElderlyStore } from "./elderly.store-isfnimJX.js";
import { l as defineComponent, U as createBlock, W as withCtx, u as unref, V as openBlock, X as createVNode, k as createTextVNode, r as ref, c as computed, q as h, a2 as useRouter } from "./vendor-vue-Hc3ejqjp.js";
import { a as formatDate } from "./validators-BfKhytEl.js";
import { u as usePageRefresh } from "./usePageRefresh-Wnx_lW1d.js";
import { u as useMessage, p as useDialog, v as NSpace, l as NInput, J as NSelect, B as Button, g as NCard, j as NForm, k as NFormItem, H as NDatePicker, h as NModal } from "./vendor-naive-HV2ECLT0.js";
import "./vendor-query-CFvMrhIw.js";
import "./vendor-utils-DD6FGs_H.js";
import "./useAutoRefresh-BeuDS8Br.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ElderlyList" },
  __name: "ElderlyListView",
  setup(__props) {
    const store = useElderlyStore();
    const router = useRouter();
    const message = useMessage();
    const dialog = useDialog();
    const search = ref("");
    const statusFilter = ref(null);
    async function loadData() {
      await store.fetchList();
    }
    const { refresh, refreshing } = usePageRefresh(loadData);
    const showCreateModal = ref(false);
    const creating = ref(false);
    const genderOptions = [
      { label: "男", value: "male" },
      { label: "女", value: "female" }
    ];
    const createForm = ref({
      name: "",
      gender: "male",
      birth_date: null,
      id_card: "",
      phone: "",
      address: "",
      room_no: "",
      remark: ""
    });
    function openCreateModal() {
      createForm.value = { name: "", gender: "male", birth_date: null, id_card: "", phone: "", address: "", room_no: "", remark: "" };
      showCreateModal.value = true;
    }
    async function submitCreate() {
      if (!createForm.value.name) {
        message.error("请填写姓名");
        return;
      }
      if (creating.value) return;
      creating.value = true;
      try {
        const row = await store.create({
          name: createForm.value.name,
          gender: createForm.value.gender,
          birth_date: createForm.value.birth_date || null,
          id_card: createForm.value.id_card || null,
          phone: createForm.value.phone || null,
          address: createForm.value.address || null,
          room_no: createForm.value.room_no || null,
          nation: null,
          marriage: null,
          education: null,
          medicare_no: null,
          remark: createForm.value.remark || null,
          care_level: null,
          bed_id: null,
          admission_date: null,
          photo_path: null,
          status: "inactive"
        });
        message.success("新增老人成功");
        showCreateModal.value = false;
        router.push(`/elderly/${row.id}`);
      } catch (err) {
        console.error("新增老人失败:", err);
        message.error(`新增失败：${err instanceof Error ? err.message : String(err)}`);
      } finally {
        creating.value = false;
      }
    }
    const filtered = computed(() => {
      return store.list.filter((e) => {
        const matchSearch = !search.value || e.name.includes(search.value) || e.phone?.includes(search.value);
        const matchStatus = !statusFilter.value || e.status === statusFilter.value;
        return matchSearch && matchStatus;
      });
    });
    const columns = [
      { title: "姓名", key: "name", width: 100 },
      {
        title: "性别",
        key: "gender",
        width: 70,
        render: (row) => row.gender === "male" ? "男" : "女"
      },
      { title: "出生日期", key: "birth_date", width: 110 },
      { title: "手机号", key: "phone", width: 130 },
      { title: "房间号", key: "room_no", width: 90 },
      {
        title: "状态",
        key: "status",
        width: 90,
        render: (row) => ({ active: "在院", inactive: "暂离", left: "离院" })[row.status] ?? row.status
      },
      {
        title: "入院时间",
        key: "created_at",
        width: 160,
        render: (row) => formatDate(row.created_at)
      },
      {
        title: "操作",
        key: "actions",
        width: 140,
        render: (row) => h(NSpace, null, {
          default: () => [
            h(Button, { size: "small", onClick: () => router.push(`/elderly/${row.id}`) }, () => "详情"),
            h(Button, {
              size: "small",
              type: "error",
              onClick: () => {
                dialog.warning({
                  title: "确认删除",
                  content: `确定要删除 ${row.name} 的记录吗？`,
                  positiveText: "确定",
                  negativeText: "取消",
                  onPositiveClick: async () => {
                    await store.remove(row.id);
                    message.success("删除成功");
                    await refresh();
                  }
                });
              }
            }, () => "删除")
          ]
        })
      }
    ];
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "老人管理" }, {
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
                        placeholder: "搜索姓名/手机号",
                        clearable: "",
                        style: { "width": "220px" }
                      }, null, 8, ["value"]),
                      createVNode(unref(NSelect), {
                        value: statusFilter.value,
                        "onUpdate:value": _cache[1] || (_cache[1] = ($event) => statusFilter.value = $event),
                        clearable: "",
                        placeholder: "状态筛选",
                        options: [
                          { label: "在院", value: "active" },
                          { label: "暂离", value: "inactive" },
                          { label: "离院", value: "left" }
                        ],
                        style: { "width": "130px" }
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: openCreateModal
                  }, {
                    default: withCtx(() => [..._cache[12] || (_cache[12] = [
                      createTextVNode(" + 新增老人 ", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    loading: unref(refreshing),
                    size: "small",
                    onClick: unref(refresh)
                  }, {
                    default: withCtx(() => [..._cache[13] || (_cache[13] = [
                      createTextVNode("刷新", -1)
                    ])]),
                    _: 1
                  }, 8, ["loading", "onClick"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          !unref(store).loading && filtered.value.length === 0 ? (openBlock(), createBlock(unref(_sfc_main$2), {
            key: 0,
            description: "暂无数据，点击右上角新增"
          })) : (openBlock(), createBlock(unref(_sfc_main$3), {
            key: 1,
            columns,
            data: filtered.value,
            loading: unref(store).loading,
            pagination: { pageSize: 15 }
          }, null, 8, ["data", "loading"])),
          createVNode(unref(NModal), {
            show: showCreateModal.value,
            "onUpdate:show": _cache[11] || (_cache[11] = ($event) => showCreateModal.value = $event),
            title: "新增老人",
            preset: "card",
            style: { "width": "480px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[10] || (_cache[10] = ($event) => showCreateModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[14] || (_cache[14] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    loading: creating.value,
                    onClick: submitCreate
                  }, {
                    default: withCtx(() => [..._cache[15] || (_cache[15] = [
                      createTextVNode("确认新增", -1)
                    ])]),
                    _: 1
                  }, 8, ["loading"])
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: createForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "姓名",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: createForm.value.name,
                        "onUpdate:value": _cache[2] || (_cache[2] = ($event) => createForm.value.name = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "性别" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: createForm.value.gender,
                        "onUpdate:value": _cache[3] || (_cache[3] = ($event) => createForm.value.gender = $event),
                        options: genderOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "出生日期" }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": createForm.value.birth_date,
                        "onUpdate:formattedValue": _cache[4] || (_cache[4] = ($event) => createForm.value.birth_date = $event),
                        "value-format": "yyyy-MM-dd",
                        type: "date",
                        clearable: "",
                        placeholder: "请选择出生日期",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "身份证" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: createForm.value.id_card,
                        "onUpdate:value": _cache[5] || (_cache[5] = ($event) => createForm.value.id_card = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "手机号" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: createForm.value.phone,
                        "onUpdate:value": _cache[6] || (_cache[6] = ($event) => createForm.value.phone = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "房间号" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: createForm.value.room_no,
                        "onUpdate:value": _cache[7] || (_cache[7] = ($event) => createForm.value.room_no = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "地址" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: createForm.value.address,
                        "onUpdate:value": _cache[8] || (_cache[8] = ($event) => createForm.value.address = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "备注" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: createForm.value.remark,
                        "onUpdate:value": _cache[9] || (_cache[9] = ($event) => createForm.value.remark = $event),
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
