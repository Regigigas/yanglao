import { _ as _sfc_main$2 } from "./BaseTable.vue_vue_type_script_setup_true_lang-vD6Hc9gq.js";
import "./vendor-echarts-DEbY5nl3.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-CnaIdrBG.js";
import { u as useAuthStore } from "./index-qSxYm2OB.js";
import { f as formatDateTime } from "./validators-BfKhytEl.js";
import { u as useElderlyStore } from "./elderly.store-isfnimJX.js";
import { u as useMessage, M as NGridItem, g as NCard, O as NStatistic, P as NGrid, a1 as NSteps, a2 as NStep, U as NTabPane, B as Button, V as NTabs, j as NForm, k as NFormItem, l as NInput, J as NSelect, v as NSpace, h as NModal, o as NTag } from "./vendor-naive-DqQyyJr8.js";
import { l as defineComponent, o as onMounted, w as watch, r as ref, U as createBlock, W as withCtx, u as unref, c as computed, V as openBlock, X as createVNode, a1 as createElementBlock, a6 as renderList, F as Fragment, k as createTextVNode, q as h, a3 as createBaseVNode, a8 as toDisplayString } from "./vendor-vue-Hc3ejqjp.js";
import "./vendor-query-CFvMrhIw.js";
import "./vendor-utils-DD6FGs_H.js";
const _hoisted_1 = { class: "text-sm text-gray-500 dark:text-gray-300" };
const STORAGE_KEY = "yanglao-service-loop-v1";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "ServiceLoop" },
  __name: "ServiceLoopView",
  setup(__props) {
    const message = useMessage();
    const elderlyStore = useElderlyStore();
    const authStore = useAuthStore();
    const receptions = ref([]);
    const tickets = ref([]);
    const patrols = ref([]);
    const followUps = ref([]);
    const retrofits = ref([]);
    const currentStaff = computed(
      () => authStore.currentUser?.real_name || authStore.currentUser?.username || "当前人员"
    );
    const nowText = () => formatDateTime(Date.now());
    const todayText = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const makeId = (prefix) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const elderlyOptions = computed(
      () => elderlyStore.list.filter((elderly) => elderly.status === "active").map((elderly) => ({ label: elderly.name, value: elderly.id }))
    );
    const elderlyName = (id) => id ? elderlyStore.list.find((elderly) => elderly.id === id)?.name || "已删除老人" : "公共/未入住";
    const receptionStageOptions = [
      { label: "咨询登记", value: "consult" },
      { label: "预约参观", value: "visit" },
      { label: "试住体验", value: "trial" },
      { label: "入住评估", value: "assessment" },
      { label: "已入住", value: "admitted" },
      { label: "流失", value: "lost" }
    ];
    const ticketStatusOptions = [
      { label: "待派单", value: "pending" },
      { label: "处理中", value: "processing" },
      { label: "已完成", value: "done" },
      { label: "已取消", value: "cancelled" }
    ];
    const priorityOptions = [
      { label: "一般", value: "normal" },
      { label: "紧急", value: "urgent" },
      { label: "危急", value: "critical" }
    ];
    const patrolResultOptions = [
      { label: "正常", value: "normal" },
      { label: "需关注", value: "attention" },
      { label: "异常", value: "abnormal" }
    ];
    const retrofitStatusOptions = [
      { label: "待评估", value: "todo" },
      { label: "已报价", value: "quoted" },
      { label: "已排期", value: "scheduled" },
      { label: "已完成", value: "finished" }
    ];
    const statusTag = (status) => ({
      consult: "default",
      visit: "info",
      trial: "warning",
      assessment: "warning",
      admitted: "success",
      lost: "default",
      pending: "warning",
      processing: "info",
      done: "success",
      cancelled: "default",
      normal: "success",
      attention: "warning",
      abnormal: "error",
      critical: "error",
      urgent: "warning",
      todo: "warning",
      quoted: "info",
      scheduled: "info",
      finished: "success"
    })[status] ?? "default";
    const labelOf = (options, value) => options.find((item) => item.value === value)?.label ?? value ?? "—";
    const renderTag = (options) => (row) => {
      const value = row.stage ?? row.status ?? row.priority ?? row.result ?? "";
      return h(
        NTag,
        { type: statusTag(value) },
        () => labelOf(options, value)
      );
    };
    function loadLocalData() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          receptions.value = parsed.receptions ?? [];
          tickets.value = parsed.tickets ?? [];
          patrols.value = parsed.patrols ?? [];
          followUps.value = parsed.followUps ?? [];
          retrofits.value = parsed.retrofits ?? [];
          return;
        } catch {
        }
      }
      seedData();
    }
    function seedData() {
      receptions.value = [
        {
          id: makeId("lead"),
          elder_name: "张桂兰",
          contact_name: "张女士",
          phone: "13800000001",
          source: "电话咨询",
          stage: "visit",
          next_follow_at: `${todayText()} 15:00`,
          demand: "半自理，重点关注认知训练和慢病用药。",
          owner: currentStaff.value,
          created_at: Date.now()
        },
        {
          id: makeId("lead"),
          elder_name: "李建国",
          contact_name: "李先生",
          phone: "13800000002",
          source: "社区转介",
          stage: "assessment",
          next_follow_at: `${todayText()} 10:30`,
          demand: "需评估跌倒风险，家属关心康复护理。",
          owner: currentStaff.value,
          created_at: Date.now()
        }
      ];
      tickets.value = [
        {
          id: makeId("ticket"),
          elderly_id: null,
          category: "维修",
          priority: "urgent",
          content: "三楼公共浴室防滑垫翘边，需要尽快处理。",
          assignee: "后勤",
          status: "processing",
          due_at: `${todayText()} 18:00`,
          created_at: Date.now(),
          closed_at: null
        }
      ];
      patrols.value = [
        {
          id: makeId("patrol"),
          area: "二楼东区",
          elderly_id: null,
          patrol_at: nowText(),
          staff: currentStaff.value,
          result: "attention",
          finding: "夜间照明偏暗，203 门口扶手略松。",
          action: "已登记后勤工单，晚班加强巡视。",
          created_at: Date.now()
        }
      ];
      followUps.value = [];
      retrofits.value = [];
    }
    function persistLocalData() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          receptions: receptions.value,
          tickets: tickets.value,
          patrols: patrols.value,
          followUps: followUps.value,
          retrofits: retrofits.value
        })
      );
    }
    onMounted(async () => {
      await elderlyStore.fetchList();
      loadLocalData();
    });
    watch([receptions, tickets, patrols, followUps, retrofits], persistLocalData, {
      deep: true
    });
    const pendingTickets = computed(
      () => tickets.value.filter((item) => item.status !== "done").length
    );
    const abnormalPatrols = computed(
      () => patrols.value.filter((item) => item.result !== "normal").length
    );
    const activeLeads = computed(
      () => receptions.value.filter(
        (item) => !["admitted", "lost"].includes(item.stage)
      ).length
    );
    const openRetrofits = computed(
      () => retrofits.value.filter((item) => item.status !== "finished").length
    );
    const leadModal = ref(false);
    const leadForm = ref({
      elder_name: "",
      contact_name: "",
      phone: "",
      source: "电话咨询",
      stage: "consult",
      next_follow_at: `${todayText()} 09:00`,
      demand: ""
    });
    function openLead() {
      leadForm.value = {
        elder_name: "",
        contact_name: "",
        phone: "",
        source: "电话咨询",
        stage: "consult",
        next_follow_at: `${todayText()} 09:00`,
        demand: ""
      };
      leadModal.value = true;
    }
    function saveLead() {
      if (!leadForm.value.elder_name.trim() || !leadForm.value.phone.trim()) {
        message.error("请填写老人姓名和联系电话");
        return;
      }
      receptions.value.unshift({
        id: makeId("lead"),
        ...leadForm.value,
        elder_name: leadForm.value.elder_name.trim(),
        contact_name: leadForm.value.contact_name.trim() || "家属",
        phone: leadForm.value.phone.trim(),
        demand: leadForm.value.demand.trim(),
        owner: currentStaff.value,
        created_at: Date.now()
      });
      leadModal.value = false;
      message.success("接待线索已登记");
    }
    const ticketModal = ref(false);
    const ticketForm = ref({
      elderly_id: null,
      category: "生活服务",
      priority: "normal",
      content: "",
      assignee: "",
      due_at: `${todayText()} 18:00`
    });
    function openTicket() {
      ticketForm.value = {
        elderly_id: null,
        category: "生活服务",
        priority: "normal",
        content: "",
        assignee: currentStaff.value,
        due_at: `${todayText()} 18:00`
      };
      ticketModal.value = true;
    }
    function saveTicket() {
      if (!ticketForm.value.content.trim()) {
        message.error("请填写服务内容");
        return;
      }
      tickets.value.unshift({
        id: makeId("ticket"),
        ...ticketForm.value,
        content: ticketForm.value.content.trim(),
        assignee: ticketForm.value.assignee.trim() || currentStaff.value,
        status: "pending",
        created_at: Date.now(),
        closed_at: null
      });
      ticketModal.value = false;
      message.success("服务工单已创建");
    }
    function advanceTicket(row) {
      if (row.status === "pending") row.status = "processing";
      else if (row.status === "processing") {
        row.status = "done";
        row.closed_at = Date.now();
      }
      message.success("工单状态已更新");
    }
    const patrolModal = ref(false);
    const patrolForm = ref({
      area: "",
      elderly_id: null,
      patrol_at: nowText(),
      result: "normal",
      finding: "",
      action: ""
    });
    function openPatrol() {
      patrolForm.value = {
        area: "",
        elderly_id: null,
        patrol_at: nowText(),
        result: "normal",
        finding: "",
        action: ""
      };
      patrolModal.value = true;
    }
    function savePatrol() {
      if (!patrolForm.value.area.trim()) {
        message.error("请填写巡查区域");
        return;
      }
      patrols.value.unshift({
        id: makeId("patrol"),
        ...patrolForm.value,
        area: patrolForm.value.area.trim(),
        finding: patrolForm.value.finding.trim() || "无异常",
        action: patrolForm.value.action.trim(),
        staff: currentStaff.value,
        created_at: Date.now()
      });
      patrolModal.value = false;
      message.success("巡房记录已保存");
    }
    const followModal = ref(false);
    const followForm = ref({
      elderly_id: null,
      contact_name: "",
      channel: "电话",
      follow_at: nowText(),
      satisfaction: "满意",
      feedback: "",
      next_action: ""
    });
    function openFollow() {
      followForm.value = {
        elderly_id: null,
        contact_name: "",
        channel: "电话",
        follow_at: nowText(),
        satisfaction: "满意",
        feedback: "",
        next_action: ""
      };
      followModal.value = true;
    }
    function saveFollow() {
      if (!followForm.value.contact_name.trim() || !followForm.value.feedback.trim()) {
        message.error("请填写联系人和回访内容");
        return;
      }
      followUps.value.unshift({
        id: makeId("follow"),
        ...followForm.value,
        contact_name: followForm.value.contact_name.trim(),
        feedback: followForm.value.feedback.trim(),
        next_action: followForm.value.next_action.trim(),
        created_at: Date.now()
      });
      followModal.value = false;
      message.success("家属回访已记录");
    }
    const retrofitModal = ref(false);
    const retrofitForm = ref({
      elderly_id: null,
      scene: "居室",
      risk_points: "",
      suggestion: "",
      budget: "",
      status: "todo"
    });
    function openRetrofit() {
      retrofitForm.value = {
        elderly_id: null,
        scene: "居室",
        risk_points: "",
        suggestion: "",
        budget: "",
        status: "todo"
      };
      retrofitModal.value = true;
    }
    function saveRetrofit() {
      if (!retrofitForm.value.risk_points.trim()) {
        message.error("请填写风险点");
        return;
      }
      retrofits.value.unshift({
        id: makeId("retrofit"),
        ...retrofitForm.value,
        risk_points: retrofitForm.value.risk_points.trim(),
        suggestion: retrofitForm.value.suggestion.trim(),
        budget: retrofitForm.value.budget.trim(),
        owner: currentStaff.value,
        created_at: Date.now()
      });
      retrofitModal.value = false;
      message.success("适老化评估已记录");
    }
    const receptionColumns = [
      { title: "老人", key: "elder_name", width: 100 },
      { title: "联系人", key: "contact_name", width: 100 },
      { title: "电话", key: "phone", width: 130 },
      { title: "来源", key: "source", width: 100 },
      {
        title: "阶段",
        key: "stage",
        width: 100,
        render: renderTag(receptionStageOptions)
      },
      { title: "下次跟进", key: "next_follow_at", width: 150 },
      { title: "需求摘要", key: "demand", ellipsis: { tooltip: true } },
      { title: "负责人", key: "owner", width: 100 }
    ];
    const ticketColumns = [
      {
        title: "老人",
        key: "elderly_id",
        width: 110,
        render: (row) => elderlyName(row.elderly_id)
      },
      { title: "类别", key: "category", width: 100 },
      {
        title: "级别",
        key: "priority",
        width: 90,
        render: renderTag(priorityOptions)
      },
      { title: "内容", key: "content", ellipsis: { tooltip: true } },
      { title: "处理人", key: "assignee", width: 100 },
      { title: "截止", key: "due_at", width: 145 },
      {
        title: "状态",
        key: "status",
        width: 90,
        render: renderTag(ticketStatusOptions)
      },
      {
        title: "操作",
        key: "actions",
        width: 120,
        render: (row) => row.status === "done" || row.status === "cancelled" ? "—" : h(
          Button,
          { size: "small", type: "primary", onClick: () => advanceTicket(row) },
          () => row.status === "pending" ? "开始处理" : "完成"
        )
      }
    ];
    const patrolColumns = [
      { title: "区域", key: "area", width: 120 },
      {
        title: "关联老人",
        key: "elderly_id",
        width: 110,
        render: (row) => elderlyName(row.elderly_id)
      },
      { title: "巡查时间", key: "patrol_at", width: 155 },
      { title: "人员", key: "staff", width: 100 },
      {
        title: "结果",
        key: "result",
        width: 90,
        render: renderTag(patrolResultOptions)
      },
      { title: "发现问题", key: "finding", ellipsis: { tooltip: true } },
      { title: "处置", key: "action", ellipsis: { tooltip: true } }
    ];
    const followColumns = [
      {
        title: "老人",
        key: "elderly_id",
        width: 110,
        render: (row) => elderlyName(row.elderly_id)
      },
      { title: "联系人", key: "contact_name", width: 100 },
      { title: "渠道", key: "channel", width: 90 },
      { title: "回访时间", key: "follow_at", width: 155 },
      { title: "满意度", key: "satisfaction", width: 90 },
      { title: "反馈", key: "feedback", ellipsis: { tooltip: true } },
      { title: "下一步", key: "next_action", ellipsis: { tooltip: true } }
    ];
    const retrofitColumns = [
      {
        title: "老人",
        key: "elderly_id",
        width: 110,
        render: (row) => elderlyName(row.elderly_id)
      },
      { title: "场景", key: "scene", width: 90 },
      { title: "风险点", key: "risk_points", ellipsis: { tooltip: true } },
      { title: "建议", key: "suggestion", ellipsis: { tooltip: true } },
      { title: "预算", key: "budget", width: 100 },
      {
        title: "状态",
        key: "status",
        width: 90,
        render: renderTag(retrofitStatusOptions)
      },
      { title: "负责人", key: "owner", width: 100 }
    ];
    const benchmarkModules = [
      {
        title: "接待转化",
        desc: "咨询、参观、试住、评估、入住形成一条线，减少前台线索丢失。",
        status: "已补入口"
      },
      {
        title: "服务工单",
        desc: "生活服务、维修、投诉、代办统一派单，并可追踪时效。",
        status: "已补入口"
      },
      {
        title: "巡房闭环",
        desc: "楼层巡查、异常发现、现场处置和后续跟进沉淀为记录。",
        status: "已补入口"
      },
      {
        title: "家属体验",
        desc: "探视、沟通、回访、满意度和投诉建议形成家属端雏形。",
        status: "已补入口"
      },
      {
        title: "适老化评估",
        desc: "居室、卫浴、通道、防跌倒等改造建议与预算先进入台账。",
        status: "已补入口"
      },
      {
        title: "后续可做深",
        desc: "对接真实后台同步、家属小程序、医保/支付、门禁一卡通、AI 预警。",
        status: "待深做"
      }
    ];
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "服务闭环" }, {
        "header-extra": withCtx(() => [
          createVNode(unref(NSpace), null, {
            default: withCtx(() => [
              createVNode(unref(Button), {
                size: "small",
                onClick: openPatrol
              }, {
                default: withCtx(() => [..._cache[42] || (_cache[42] = [
                  createTextVNode("+ 巡房", -1)
                ])]),
                _: 1
              }),
              createVNode(unref(Button), {
                size: "small",
                onClick: openTicket
              }, {
                default: withCtx(() => [..._cache[43] || (_cache[43] = [
                  createTextVNode("+ 工单", -1)
                ])]),
                _: 1
              }),
              createVNode(unref(Button), {
                type: "primary",
                size: "small",
                onClick: openLead
              }, {
                default: withCtx(() => [..._cache[44] || (_cache[44] = [
                  createTextVNode("+ 接待线索", -1)
                ])]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        default: withCtx(() => [
          createVNode(unref(NGrid), {
            cols: 4,
            "x-gap": 16,
            "y-gap": 16,
            responsive: "screen"
          }, {
            default: withCtx(() => [
              createVNode(unref(NGridItem), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "在跟进线索",
                        value: activeLeads.value
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NGridItem), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "未完成工单",
                        value: pendingTickets.value
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NGridItem), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "巡房关注/异常",
                        value: abnormalPatrols.value
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NGridItem), null, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    default: withCtx(() => [
                      createVNode(unref(NStatistic), {
                        label: "适老化待办",
                        value: openRetrofits.value
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
          createVNode(unref(NCard), {
            class: "mt-4",
            title: "对标成熟养老系统后的闭环补齐"
          }, {
            default: withCtx(() => [
              createVNode(unref(NSteps), {
                size: "small",
                current: 4,
                status: "process"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NStep), {
                    title: "接待",
                    description: "咨询 / 参观 / 试住"
                  }),
                  createVNode(unref(NStep), {
                    title: "评估",
                    description: "能力 / 风险 / 适老化"
                  }),
                  createVNode(unref(NStep), {
                    title: "执行",
                    description: "护理 / 工单 / 巡房"
                  }),
                  createVNode(unref(NStep), {
                    title: "反馈",
                    description: "家属回访 / 质控改进"
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NGrid), {
                class: "mt-4",
                cols: 3,
                "x-gap": 12,
                "y-gap": 12,
                responsive: "screen"
              }, {
                default: withCtx(() => [
                  (openBlock(), createElementBlock(Fragment, null, renderList(benchmarkModules, (item) => {
                    return createVNode(unref(NGridItem), {
                      key: item.title
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NCard), { size: "small" }, {
                          header: withCtx(() => [
                            createVNode(unref(NSpace), { align: "center" }, {
                              default: withCtx(() => [
                                createBaseVNode("span", null, toDisplayString(item.title), 1),
                                createVNode(unref(NTag), {
                                  size: "small",
                                  type: item.status === "已补入口" ? "success" : "warning"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(item.status), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["type"])
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          default: withCtx(() => [
                            createBaseVNode("div", _hoisted_1, toDisplayString(item.desc), 1)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, 1024);
                  }), 64))
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(unref(NTabs), {
            class: "mt-4",
            type: "line",
            animated: ""
          }, {
            default: withCtx(() => [
              createVNode(unref(NTabPane), {
                name: "reception",
                tab: "预约接待"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    "header-extra": withCtx(() => [
                      createVNode(unref(Button), {
                        size: "small",
                        type: "primary",
                        onClick: openLead
                      }, {
                        default: withCtx(() => [..._cache[45] || (_cache[45] = [
                          createTextVNode("+ 新增线索", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: receptionColumns,
                        data: receptions.value,
                        pagination: { pageSize: 10 }
                      }, null, 8, ["data"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NTabPane), {
                name: "ticket",
                tab: "服务工单"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    "header-extra": withCtx(() => [
                      createVNode(unref(Button), {
                        size: "small",
                        type: "primary",
                        onClick: openTicket
                      }, {
                        default: withCtx(() => [..._cache[46] || (_cache[46] = [
                          createTextVNode("+ 新建工单", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: ticketColumns,
                        data: tickets.value,
                        pagination: { pageSize: 10 }
                      }, null, 8, ["data"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NTabPane), {
                name: "patrol",
                tab: "巡房记录"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    "header-extra": withCtx(() => [
                      createVNode(unref(Button), {
                        size: "small",
                        type: "primary",
                        onClick: openPatrol
                      }, {
                        default: withCtx(() => [..._cache[47] || (_cache[47] = [
                          createTextVNode("+ 记录巡房", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: patrolColumns,
                        data: patrols.value,
                        pagination: { pageSize: 10 }
                      }, null, 8, ["data"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NTabPane), {
                name: "follow",
                tab: "家属回访"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    "header-extra": withCtx(() => [
                      createVNode(unref(Button), {
                        size: "small",
                        type: "primary",
                        onClick: openFollow
                      }, {
                        default: withCtx(() => [..._cache[48] || (_cache[48] = [
                          createTextVNode("+ 回访记录", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: followColumns,
                        data: followUps.value,
                        pagination: { pageSize: 10 }
                      }, null, 8, ["data"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NTabPane), {
                name: "retrofit",
                tab: "适老化评估"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), null, {
                    "header-extra": withCtx(() => [
                      createVNode(unref(Button), {
                        size: "small",
                        type: "primary",
                        onClick: openRetrofit
                      }, {
                        default: withCtx(() => [..._cache[49] || (_cache[49] = [
                          createTextVNode("+ 评估记录", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), {
                        columns: retrofitColumns,
                        data: retrofits.value,
                        pagination: { pageSize: 10 }
                      }, null, 8, ["data"])
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
            show: leadModal.value,
            "onUpdate:show": _cache[8] || (_cache[8] = ($event) => leadModal.value = $event),
            preset: "card",
            title: "接待线索",
            style: { "width": "620px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[7] || (_cache[7] = ($event) => leadModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[50] || (_cache[50] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveLead
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
                model: leadForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "老人姓名",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: leadForm.value.elder_name,
                        "onUpdate:value": _cache[0] || (_cache[0] = ($event) => leadForm.value.elder_name = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "联系人" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: leadForm.value.contact_name,
                        "onUpdate:value": _cache[1] || (_cache[1] = ($event) => leadForm.value.contact_name = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "联系电话",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: leadForm.value.phone,
                        "onUpdate:value": _cache[2] || (_cache[2] = ($event) => leadForm.value.phone = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "线索来源" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: leadForm.value.source,
                        "onUpdate:value": _cache[3] || (_cache[3] = ($event) => leadForm.value.source = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "当前阶段" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: leadForm.value.stage,
                        "onUpdate:value": _cache[4] || (_cache[4] = ($event) => leadForm.value.stage = $event),
                        options: receptionStageOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "下次跟进" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: leadForm.value.next_follow_at,
                        "onUpdate:value": _cache[5] || (_cache[5] = ($event) => leadForm.value.next_follow_at = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "需求摘要" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: leadForm.value.demand,
                        "onUpdate:value": _cache[6] || (_cache[6] = ($event) => leadForm.value.demand = $event),
                        type: "textarea",
                        rows: 3
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
            show: ticketModal.value,
            "onUpdate:show": _cache[16] || (_cache[16] = ($event) => ticketModal.value = $event),
            preset: "card",
            title: "服务工单",
            style: { "width": "620px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[15] || (_cache[15] = ($event) => ticketModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[52] || (_cache[52] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveTicket
                  }, {
                    default: withCtx(() => [..._cache[53] || (_cache[53] = [
                      createTextVNode("创建工单", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: ticketForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), { label: "关联老人" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: ticketForm.value.elderly_id,
                        "onUpdate:value": _cache[9] || (_cache[9] = ($event) => ticketForm.value.elderly_id = $event),
                        options: elderlyOptions.value,
                        clearable: "",
                        filterable: ""
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "服务类别" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: ticketForm.value.category,
                        "onUpdate:value": _cache[10] || (_cache[10] = ($event) => ticketForm.value.category = $event),
                        placeholder: "生活服务 / 维修 / 投诉 / 代办"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "优先级" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: ticketForm.value.priority,
                        "onUpdate:value": _cache[11] || (_cache[11] = ($event) => ticketForm.value.priority = $event),
                        options: priorityOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "服务内容",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: ticketForm.value.content,
                        "onUpdate:value": _cache[12] || (_cache[12] = ($event) => ticketForm.value.content = $event),
                        type: "textarea",
                        rows: 3
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "处理人" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: ticketForm.value.assignee,
                        "onUpdate:value": _cache[13] || (_cache[13] = ($event) => ticketForm.value.assignee = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "截止时间" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: ticketForm.value.due_at,
                        "onUpdate:value": _cache[14] || (_cache[14] = ($event) => ticketForm.value.due_at = $event)
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
            show: patrolModal.value,
            "onUpdate:show": _cache[24] || (_cache[24] = ($event) => patrolModal.value = $event),
            preset: "card",
            title: "巡房记录",
            style: { "width": "620px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[23] || (_cache[23] = ($event) => patrolModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[54] || (_cache[54] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: savePatrol
                  }, {
                    default: withCtx(() => [..._cache[55] || (_cache[55] = [
                      createTextVNode("保存巡房", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: patrolForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "巡查区域",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: patrolForm.value.area,
                        "onUpdate:value": _cache[17] || (_cache[17] = ($event) => patrolForm.value.area = $event),
                        placeholder: "如：二楼东区 / 康复室 / 公共卫浴"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "关联老人" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: patrolForm.value.elderly_id,
                        "onUpdate:value": _cache[18] || (_cache[18] = ($event) => patrolForm.value.elderly_id = $event),
                        options: elderlyOptions.value,
                        clearable: "",
                        filterable: ""
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "巡查时间" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: patrolForm.value.patrol_at,
                        "onUpdate:value": _cache[19] || (_cache[19] = ($event) => patrolForm.value.patrol_at = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "巡查结果" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: patrolForm.value.result,
                        "onUpdate:value": _cache[20] || (_cache[20] = ($event) => patrolForm.value.result = $event),
                        options: patrolResultOptions
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "发现问题" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: patrolForm.value.finding,
                        "onUpdate:value": _cache[21] || (_cache[21] = ($event) => patrolForm.value.finding = $event),
                        type: "textarea",
                        rows: 3
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "现场处置" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: patrolForm.value.action,
                        "onUpdate:value": _cache[22] || (_cache[22] = ($event) => patrolForm.value.action = $event),
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
          }, 8, ["show"]),
          createVNode(unref(NModal), {
            show: followModal.value,
            "onUpdate:show": _cache[33] || (_cache[33] = ($event) => followModal.value = $event),
            preset: "card",
            title: "家属回访",
            style: { "width": "620px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[32] || (_cache[32] = ($event) => followModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[56] || (_cache[56] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveFollow
                  }, {
                    default: withCtx(() => [..._cache[57] || (_cache[57] = [
                      createTextVNode("保存回访", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: followForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), { label: "关联老人" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: followForm.value.elderly_id,
                        "onUpdate:value": _cache[25] || (_cache[25] = ($event) => followForm.value.elderly_id = $event),
                        options: elderlyOptions.value,
                        clearable: "",
                        filterable: ""
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "联系人",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: followForm.value.contact_name,
                        "onUpdate:value": _cache[26] || (_cache[26] = ($event) => followForm.value.contact_name = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "渠道" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: followForm.value.channel,
                        "onUpdate:value": _cache[27] || (_cache[27] = ($event) => followForm.value.channel = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "回访时间" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: followForm.value.follow_at,
                        "onUpdate:value": _cache[28] || (_cache[28] = ($event) => followForm.value.follow_at = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "满意度" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: followForm.value.satisfaction,
                        "onUpdate:value": _cache[29] || (_cache[29] = ($event) => followForm.value.satisfaction = $event),
                        options: [{ label: "满意", value: "满意" }, { label: "一般", value: "一般" }, { label: "不满意", value: "不满意" }]
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "反馈内容",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: followForm.value.feedback,
                        "onUpdate:value": _cache[30] || (_cache[30] = ($event) => followForm.value.feedback = $event),
                        type: "textarea",
                        rows: 3
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "下一步" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: followForm.value.next_action,
                        "onUpdate:value": _cache[31] || (_cache[31] = ($event) => followForm.value.next_action = $event),
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
          }, 8, ["show"]),
          createVNode(unref(NModal), {
            show: retrofitModal.value,
            "onUpdate:show": _cache[41] || (_cache[41] = ($event) => retrofitModal.value = $event),
            preset: "card",
            title: "适老化评估",
            style: { "width": "620px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[40] || (_cache[40] = ($event) => retrofitModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[58] || (_cache[58] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: saveRetrofit
                  }, {
                    default: withCtx(() => [..._cache[59] || (_cache[59] = [
                      createTextVNode("保存评估", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: retrofitForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), { label: "关联老人" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: retrofitForm.value.elderly_id,
                        "onUpdate:value": _cache[34] || (_cache[34] = ($event) => retrofitForm.value.elderly_id = $event),
                        options: elderlyOptions.value,
                        clearable: "",
                        filterable: ""
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "评估场景" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: retrofitForm.value.scene,
                        "onUpdate:value": _cache[35] || (_cache[35] = ($event) => retrofitForm.value.scene = $event),
                        placeholder: "居室 / 卫浴 / 通道 / 公共区"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "风险点",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: retrofitForm.value.risk_points,
                        "onUpdate:value": _cache[36] || (_cache[36] = ($event) => retrofitForm.value.risk_points = $event),
                        type: "textarea",
                        rows: 3
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "改造建议" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: retrofitForm.value.suggestion,
                        "onUpdate:value": _cache[37] || (_cache[37] = ($event) => retrofitForm.value.suggestion = $event),
                        type: "textarea",
                        rows: 3
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "预算" }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: retrofitForm.value.budget,
                        "onUpdate:value": _cache[38] || (_cache[38] = ($event) => retrofitForm.value.budget = $event)
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), { label: "状态" }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: retrofitForm.value.status,
                        "onUpdate:value": _cache[39] || (_cache[39] = ($event) => retrofitForm.value.status = $event),
                        options: retrofitStatusOptions
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
