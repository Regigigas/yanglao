import "./vendor-echarts-DEbY5nl3.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-CnaIdrBG.js";
import "./index-qSxYm2OB.js";
import { u as useElderlyStore } from "./elderly.store-isfnimJX.js";
import { l as defineComponent, o as onMounted, r as ref, U as createBlock, W as withCtx, u as unref, a7 as useRoute, V as openBlock, X as createVNode, k as createTextVNode, a8 as toDisplayString, a3 as createBaseVNode, a1 as createElementBlock, F as Fragment, a9 as createCommentVNode, a2 as useRouter, c as computed } from "./vendor-vue-Hc3ejqjp.js";
import { f as formatDateTime } from "./validators-BfKhytEl.js";
import { c as calcAge } from "./format-o5PpBUQO.js";
import { u as useMessage, g as NCard, Q as NDescriptions, R as NDescriptionsItem, o as NTag, j as NForm, k as NFormItem, l as NInput, J as NSelect, H as NDatePicker, B as Button, C as NSpin } from "./vendor-naive-DqQyyJr8.js";
import "./vendor-query-CFvMrhIw.js";
import "./vendor-utils-DD6FGs_H.js";
const _hoisted_1 = { class: "flex gap-2 mt-4" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ElderlyDetail" },
  __name: "ElderlyDetailView",
  setup(__props) {
    const store = useElderlyStore();
    const route = useRoute();
    const router = useRouter();
    const message = useMessage();
    const id = route.params.id;
    const loading = ref(false);
    const editing = ref(false);
    onMounted(async () => {
      loading.value = true;
      try {
        await store.fetchById(id);
        if (store.current) {
          Object.assign(form.value, {
            name: store.current.name,
            gender: store.current.gender,
            birth_date: store.current.birth_date?.slice(0, 10) ?? null,
            id_card: store.current.id_card ?? "",
            phone: store.current.phone ?? "",
            address: store.current.address ?? "",
            room_no: store.current.room_no ?? "",
            nation: store.current.nation ?? "",
            marriage: store.current.marriage ?? "",
            education: store.current.education ?? "",
            medicare_no: store.current.medicare_no ?? "",
            remark: store.current.remark ?? ""
          });
        }
      } finally {
        loading.value = false;
      }
    });
    const elderly = computed(() => store.current);
    const age = computed(() => elderly.value?.birth_date ? calcAge(elderly.value.birth_date) : "—");
    const statusMap = {
      active: ["success", "在院"],
      inactive: ["warning", "暂离"],
      left: ["default", "离院"]
    };
    const statusDisplay = computed(() => {
      const s = elderly.value?.status;
      return (s && statusMap[s]) ?? ["default", s ?? "未知"];
    });
    const genderOptions = [
      { label: "男", value: "male" },
      { label: "女", value: "female" }
    ];
    const form = ref({
      name: "",
      gender: "male",
      birth_date: null,
      id_card: "",
      phone: "",
      address: "",
      room_no: "",
      nation: "",
      marriage: "",
      education: "",
      medicare_no: "",
      remark: ""
    });
    async function handleSave() {
      if (!form.value.name) {
        message.error("请填写姓名");
        return;
      }
      await store.update(id, {
        ...form.value,
        birth_date: form.value.birth_date || null,
        id_card: form.value.id_card || null,
        phone: form.value.phone || null,
        address: form.value.address || null,
        room_no: form.value.room_no || null,
        nation: form.value.nation || null,
        marriage: form.value.marriage || null,
        education: form.value.education || null,
        medicare_no: form.value.medicare_no || null,
        remark: form.value.remark || null
      });
      await store.fetchById(id);
      editing.value = false;
      message.success("保存成功");
    }
    function cancelEdit() {
      if (elderly.value) {
        Object.assign(form.value, {
          name: elderly.value.name,
          gender: elderly.value.gender ?? "male",
          birth_date: elderly.value.birth_date?.slice(0, 10) ?? null,
          id_card: elderly.value.id_card ?? "",
          phone: elderly.value.phone ?? "",
          address: elderly.value.address ?? "",
          room_no: elderly.value.room_no ?? "",
          nation: elderly.value.nation ?? "",
          marriage: elderly.value.marriage ?? "",
          education: elderly.value.education ?? "",
          medicare_no: elderly.value.medicare_no ?? "",
          remark: elderly.value.remark ?? ""
        });
      }
      editing.value = false;
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "老人详情" }, {
        default: withCtx(() => [
          createVNode(unref(NSpin), { show: loading.value }, {
            default: withCtx(() => [
              elderly.value ? (openBlock(), createBlock(unref(NCard), { key: 0 }, {
                default: withCtx(() => [
                  !editing.value ? (openBlock(), createBlock(unref(NDescriptions), {
                    key: 0,
                    "label-placement": "left",
                    column: 2,
                    bordered: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NDescriptionsItem), { label: "姓名" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(elderly.value.name), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NDescriptionsItem), { label: "性别" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(elderly.value.gender === "male" ? "男" : "女"), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NDescriptionsItem), { label: "出生日期" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(elderly.value.birth_date ?? "—"), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NDescriptionsItem), { label: "年龄" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(age.value) + " 岁", 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NDescriptionsItem), { label: "身份证" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(elderly.value.id_card ?? "—"), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NDescriptionsItem), { label: "手机号" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(elderly.value.phone ?? "—"), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NDescriptionsItem), { label: "房间号" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(elderly.value.room_no ?? "—"), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NDescriptionsItem), { label: "地址" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(elderly.value.address ?? "—"), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NDescriptionsItem), { label: "民族" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(elderly.value.nation ?? "—"), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NDescriptionsItem), { label: "婚姻状况" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(elderly.value.marriage ?? "—"), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NDescriptionsItem), { label: "文化程度" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(elderly.value.education ?? "—"), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NDescriptionsItem), { label: "医保号" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(elderly.value.medicare_no ?? "—"), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NDescriptionsItem), { label: "状态" }, {
                        default: withCtx(() => [
                          createVNode(unref(NTag), {
                            type: statusDisplay.value[0]
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(statusDisplay.value[1]), 1)
                            ]),
                            _: 1
                          }, 8, ["type"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NDescriptionsItem), { label: "入院日期" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(elderly.value.admission_date ? unref(formatDateTime)(elderly.value.admission_date) : "尚未办理入院"), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NDescriptionsItem), {
                        label: "备注",
                        span: 2
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(elderly.value.remark ?? "—"), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })) : (openBlock(), createBlock(unref(NForm), {
                    key: 1,
                    model: form.value,
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
                            value: form.value.name,
                            "onUpdate:value": _cache[0] || (_cache[0] = ($event) => form.value.name = $event)
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NFormItem), { label: "性别" }, {
                        default: withCtx(() => [
                          createVNode(unref(NSelect), {
                            value: form.value.gender,
                            "onUpdate:value": _cache[1] || (_cache[1] = ($event) => form.value.gender = $event),
                            options: genderOptions
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NFormItem), { label: "出生日期" }, {
                        default: withCtx(() => [
                          createVNode(unref(NDatePicker), {
                            "formatted-value": form.value.birth_date,
                            "onUpdate:formattedValue": _cache[2] || (_cache[2] = ($event) => form.value.birth_date = $event),
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
                            value: form.value.id_card,
                            "onUpdate:value": _cache[3] || (_cache[3] = ($event) => form.value.id_card = $event)
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NFormItem), { label: "手机号" }, {
                        default: withCtx(() => [
                          createVNode(unref(NInput), {
                            value: form.value.phone,
                            "onUpdate:value": _cache[4] || (_cache[4] = ($event) => form.value.phone = $event)
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NFormItem), { label: "房间号" }, {
                        default: withCtx(() => [
                          createVNode(unref(NInput), {
                            value: form.value.room_no,
                            "onUpdate:value": _cache[5] || (_cache[5] = ($event) => form.value.room_no = $event)
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NFormItem), { label: "地址" }, {
                        default: withCtx(() => [
                          createVNode(unref(NInput), {
                            value: form.value.address,
                            "onUpdate:value": _cache[6] || (_cache[6] = ($event) => form.value.address = $event)
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NFormItem), { label: "民族" }, {
                        default: withCtx(() => [
                          createVNode(unref(NInput), {
                            value: form.value.nation,
                            "onUpdate:value": _cache[7] || (_cache[7] = ($event) => form.value.nation = $event)
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NFormItem), { label: "婚姻状况" }, {
                        default: withCtx(() => [
                          createVNode(unref(NInput), {
                            value: form.value.marriage,
                            "onUpdate:value": _cache[8] || (_cache[8] = ($event) => form.value.marriage = $event)
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NFormItem), { label: "文化程度" }, {
                        default: withCtx(() => [
                          createVNode(unref(NInput), {
                            value: form.value.education,
                            "onUpdate:value": _cache[9] || (_cache[9] = ($event) => form.value.education = $event)
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NFormItem), { label: "医保号" }, {
                        default: withCtx(() => [
                          createVNode(unref(NInput), {
                            value: form.value.medicare_no,
                            "onUpdate:value": _cache[10] || (_cache[10] = ($event) => form.value.medicare_no = $event)
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NFormItem), { label: "备注" }, {
                        default: withCtx(() => [
                          createVNode(unref(NInput), {
                            value: form.value.remark,
                            "onUpdate:value": _cache[11] || (_cache[11] = ($event) => form.value.remark = $event),
                            type: "textarea",
                            rows: 2
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["model"])),
                  createBaseVNode("div", _hoisted_1, [
                    editing.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                      createVNode(unref(Button), {
                        type: "primary",
                        onClick: handleSave
                      }, {
                        default: withCtx(() => [..._cache[14] || (_cache[14] = [
                          createTextVNode("保存", -1)
                        ])]),
                        _: 1
                      }),
                      createVNode(unref(Button), { onClick: cancelEdit }, {
                        default: withCtx(() => [..._cache[15] || (_cache[15] = [
                          createTextVNode("取消", -1)
                        ])]),
                        _: 1
                      })
                    ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                      createVNode(unref(Button), {
                        type: "primary",
                        onClick: _cache[12] || (_cache[12] = ($event) => editing.value = true)
                      }, {
                        default: withCtx(() => [..._cache[16] || (_cache[16] = [
                          createTextVNode("编辑", -1)
                        ])]),
                        _: 1
                      }),
                      createVNode(unref(Button), {
                        onClick: _cache[13] || (_cache[13] = ($event) => unref(router).back())
                      }, {
                        default: withCtx(() => [..._cache[17] || (_cache[17] = [
                          createTextVNode("返回列表", -1)
                        ])]),
                        _: 1
                      })
                    ], 64))
                  ])
                ]),
                _: 1
              })) : createCommentVNode("", true)
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
