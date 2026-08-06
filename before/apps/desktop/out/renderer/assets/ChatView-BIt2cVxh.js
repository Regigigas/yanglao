import { l as defineComponent, o as onMounted, b as onBeforeUnmount, U as createBlock, W as withCtx, u as unref, r as ref, n as nextTick, V as openBlock, a3 as createBaseVNode, X as createVNode, k as createTextVNode, a8 as toDisplayString, a1 as createElementBlock, a6 as renderList, F as Fragment, a9 as createCommentVNode, a4 as withKeys, a5 as withModifiers, J as normalizeClass } from "./vendor-vue-Hc3ejqjp.js";
import { I as Icon } from "./iconify-DIn4WxPo.js";
import "./vendor-echarts-DEbY5nl3.js";
import { _ as _sfc_main$1 } from "./BasePage.vue_vue_type_script_setup_true_lang-D7sGS98F.js";
import "./index-rYee39mb.js";
import { u as useMessage, B as Button, S as NButtonGroup, o as NTag, D as NEmpty, C as NSpin, l as NInput, V as NTabs, U as NTabPane, $ as NCheckboxGroup, h as NModal, x as NBadge, m as NCheckbox } from "./vendor-naive-HV2ECLT0.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./vendor-query-CFvMrhIw.js";
const _hoisted_1 = { class: "chat-mode-bar" };
const _hoisted_2 = { class: "chat-workspace" };
const _hoisted_3 = { class: "conversation-pane" };
const _hoisted_4 = { class: "pane-toolbar" };
const _hoisted_5 = { class: "conversation-list" };
const _hoisted_6 = ["onClick"];
const _hoisted_7 = { class: "conversation-avatar" };
const _hoisted_8 = { class: "conversation-copy" };
const _hoisted_9 = { class: "conversation-title" };
const _hoisted_10 = { class: "conversation-preview" };
const _hoisted_11 = { class: "conversation-meta" };
const _hoisted_12 = { class: "message-pane" };
const _hoisted_13 = { class: "message-header" };
const _hoisted_14 = { class: "message-sender" };
const _hoisted_15 = { class: "message-bubble" };
const _hoisted_16 = { class: "composer" };
const _hoisted_17 = { class: "contact-search" };
const _hoisted_18 = { class: "contact-list" };
const _hoisted_19 = ["onClick"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "Chat" },
  __name: "ChatView",
  setup(__props) {
    const notice = useMessage();
    const conversations = ref([]);
    const contacts = ref([]);
    const messages = ref([]);
    const currentUserId = ref(null);
    const chatMode = ref("local");
    const selected = ref(null);
    const draft = ref("");
    const loading = ref(false);
    const sending = ref(false);
    const showCreate = ref(false);
    const createMode = ref("direct");
    const contactKeyword = ref("");
    const groupName = ref("");
    const groupMembers = ref([]);
    const messageList = ref(null);
    let pollingTimer = 0;
    let conversationTimer = 0;
    function formatTime(value) {
      if (!value) return "";
      return new Date(value).toLocaleString("zh-CN", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
    }
    function mergeMessages(incoming) {
      const byId = new Map(messages.value.map((item) => [item.messageId, item]));
      incoming.forEach((item) => byId.set(item.messageId, item));
      messages.value = [...byId.values()].sort((left, right) => left.messageId - right.messageId);
    }
    async function scrollToBottom() {
      await nextTick();
      if (messageList.value) messageList.value.scrollTop = messageList.value.scrollHeight;
    }
    async function loadConversations() {
      const list = await window.api.chat.conversations();
      conversations.value = list;
      if (selected.value) {
        selected.value = list.find((item) => item.conversationId === selected.value?.conversationId) ?? selected.value;
      }
    }
    async function initializeChat() {
      selected.value = null;
      messages.value = [];
      conversations.value = [];
      const me = await window.api.chat.me();
      currentUserId.value = me.userId;
      await loadConversations();
      if (conversations.value[0]) await selectConversation(conversations.value[0]);
    }
    async function switchChatMode(mode) {
      if (mode === chatMode.value || loading.value) return;
      loading.value = true;
      try {
        await window.api.chat.setMode(mode);
        chatMode.value = mode;
        await initializeChat();
        notice.success(mode === "local" ? "已切换到本地聊天" : "已切换到线上聊天");
      } catch (error) {
        notice.error(error instanceof Error ? error.message : "切换聊天服务失败");
      } finally {
        loading.value = false;
      }
    }
    async function selectConversation(conversation) {
      selected.value = conversation;
      loading.value = true;
      try {
        messages.value = await window.api.chat.messages({
          conversationId: conversation.conversationId,
          limit: 80
        });
        await markLatestRead();
        await scrollToBottom();
      } catch (error) {
        notice.error(error instanceof Error ? error.message : "读取消息失败");
      } finally {
        loading.value = false;
      }
    }
    async function pollMessages() {
      if (!selected.value || loading.value || sending.value) return;
      const latestId = messages.value.at(-1)?.messageId;
      try {
        const incoming = await window.api.chat.messages({
          conversationId: selected.value.conversationId,
          afterMessageId: latestId,
          limit: 100
        });
        if (incoming.length > 0) {
          mergeMessages(incoming);
          await markLatestRead();
          await scrollToBottom();
        }
      } catch {
      }
    }
    async function markLatestRead() {
      const latest = messages.value.at(-1);
      if (!selected.value || !latest) return;
      await window.api.chat.markRead(selected.value.conversationId, latest.messageId);
      selected.value.unreadCount = 0;
    }
    async function sendMessage() {
      const content = draft.value.trim();
      if (!selected.value || !content || sending.value) return;
      sending.value = true;
      try {
        const sent = await window.api.chat.send({
          conversationId: selected.value.conversationId,
          clientMessageId: crypto.randomUUID().replace(/-/g, ""),
          content
        });
        draft.value = "";
        mergeMessages([sent]);
        await scrollToBottom();
        await loadConversations();
      } catch (error) {
        notice.error(error instanceof Error ? error.message : "消息发送失败");
      } finally {
        sending.value = false;
      }
    }
    async function openCreateDialog() {
      showCreate.value = true;
      contactKeyword.value = "";
      groupName.value = "";
      groupMembers.value = [];
      try {
        contacts.value = await window.api.chat.contacts();
      } catch (error) {
        showCreate.value = false;
        notice.error(error instanceof Error ? error.message : "读取联系人失败");
      }
    }
    async function searchContacts() {
      contacts.value = await window.api.chat.contacts(contactKeyword.value.trim());
    }
    async function createDirect(contact) {
      const conversationId = await window.api.chat.createDirect(contact.userId);
      showCreate.value = false;
      await loadConversations();
      const conversation = conversations.value.find((item) => item.conversationId === conversationId);
      if (conversation) await selectConversation(conversation);
    }
    async function createGroup() {
      if (!groupName.value.trim()) {
        notice.warning("请输入群聊名称");
        return;
      }
      if (groupMembers.value.length < 2) {
        notice.warning("请至少选择两位群成员");
        return;
      }
      try {
        const conversationId = await window.api.chat.createGroup({
          name: groupName.value.trim(),
          memberUserIds: groupMembers.value
        });
        showCreate.value = false;
        await loadConversations();
        const conversation = conversations.value.find((item) => item.conversationId === conversationId);
        if (conversation) await selectConversation(conversation);
      } catch (error) {
        notice.error(error instanceof Error ? error.message : "创建群聊失败");
      }
    }
    onMounted(async () => {
      try {
        chatMode.value = await window.api.chat.getMode();
        await initializeChat();
        pollingTimer = window.setInterval(() => void pollMessages(), 3e3);
        conversationTimer = window.setInterval(() => void loadConversations(), 1e4);
      } catch (error) {
        notice.error(error instanceof Error ? error.message : "聊天服务不可用");
      }
    });
    onBeforeUnmount(() => {
      window.clearInterval(pollingTimer);
      window.clearInterval(conversationTimer);
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(_sfc_main$1), { title: "消息中心" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createVNode(unref(NButtonGroup), null, {
              default: withCtx(() => [
                createVNode(unref(Button), {
                  size: "small",
                  type: chatMode.value === "local" ? "primary" : "default",
                  secondary: chatMode.value === "local",
                  onClick: _cache[0] || (_cache[0] = ($event) => switchChatMode("local"))
                }, {
                  icon: withCtx(() => [
                    createVNode(unref(Icon), { icon: "ion:desktop-outline" })
                  ]),
                  default: withCtx(() => [
                    _cache[8] || (_cache[8] = createTextVNode(" 本地聊天 ", -1))
                  ]),
                  _: 1
                }, 8, ["type", "secondary"]),
                createVNode(unref(Button), {
                  size: "small",
                  type: chatMode.value === "online" ? "primary" : "default",
                  secondary: chatMode.value === "online",
                  onClick: _cache[1] || (_cache[1] = ($event) => switchChatMode("online"))
                }, {
                  icon: withCtx(() => [
                    createVNode(unref(Icon), { icon: "ion:cloud-outline" })
                  ]),
                  default: withCtx(() => [
                    _cache[9] || (_cache[9] = createTextVNode(" 线上聊天 ", -1))
                  ]),
                  _: 1
                }, 8, ["type", "secondary"])
              ]),
              _: 1
            }),
            createVNode(unref(NTag), {
              size: "small",
              type: chatMode.value === "local" ? "success" : "info"
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(chatMode.value === "local" ? "SQLite 本地会话" : "线上服务会话"), 1)
              ]),
              _: 1
            }, 8, ["type"])
          ]),
          createBaseVNode("div", _hoisted_2, [
            createBaseVNode("aside", _hoisted_3, [
              createBaseVNode("div", _hoisted_4, [
                _cache[10] || (_cache[10] = createBaseVNode("strong", null, "会话", -1)),
                createVNode(unref(Button), {
                  circle: "",
                  secondary: "",
                  type: "primary",
                  title: "新建会话",
                  onClick: openCreateDialog
                }, {
                  icon: withCtx(() => [
                    createVNode(unref(Icon), { icon: "ion:add" })
                  ]),
                  _: 1
                })
              ]),
              createBaseVNode("div", _hoisted_5, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(conversations.value, (conversation) => {
                  return openBlock(), createElementBlock("button", {
                    key: conversation.conversationId,
                    class: normalizeClass(["conversation-item", { active: selected.value?.conversationId === conversation.conversationId }]),
                    onClick: ($event) => selectConversation(conversation)
                  }, [
                    createBaseVNode("span", _hoisted_7, [
                      createVNode(unref(Icon), {
                        icon: conversation.type === "G" ? "ion:people" : "ion:person"
                      }, null, 8, ["icon"])
                    ]),
                    createBaseVNode("span", _hoisted_8, [
                      createBaseVNode("span", _hoisted_9, toDisplayString(conversation.name), 1),
                      createBaseVNode("span", _hoisted_10, toDisplayString(conversation.lastMessagePreview || "暂无消息"), 1)
                    ]),
                    createBaseVNode("span", _hoisted_11, [
                      createBaseVNode("time", null, toDisplayString(formatTime(conversation.lastMessageTime)), 1),
                      createVNode(unref(NBadge), {
                        value: conversation.unreadCount,
                        max: 99,
                        show: conversation.unreadCount > 0
                      }, null, 8, ["value", "show"])
                    ])
                  ], 10, _hoisted_6);
                }), 128)),
                conversations.value.length === 0 ? (openBlock(), createBlock(unref(NEmpty), {
                  key: 0,
                  description: "暂无会话",
                  class: "empty-state"
                })) : createCommentVNode("", true)
              ])
            ]),
            createBaseVNode("section", _hoisted_12, [
              selected.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                createBaseVNode("header", _hoisted_13, [
                  createBaseVNode("strong", null, toDisplayString(selected.value.name), 1),
                  createBaseVNode("span", null, toDisplayString(selected.value.type === "G" ? "群聊" : "私聊"), 1)
                ]),
                createVNode(unref(NSpin), {
                  show: loading.value,
                  class: "message-loading"
                }, {
                  default: withCtx(() => [
                    createBaseVNode("div", {
                      ref_key: "messageList",
                      ref: messageList,
                      class: "message-list"
                    }, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(messages.value, (item) => {
                        return openBlock(), createElementBlock("div", {
                          key: item.messageId,
                          class: normalizeClass(["message-row", { mine: String(item.senderUserId) === String(currentUserId.value) }])
                        }, [
                          createBaseVNode("span", _hoisted_14, toDisplayString(item.senderName), 1),
                          createBaseVNode("div", _hoisted_15, toDisplayString(item.content), 1),
                          createBaseVNode("time", null, toDisplayString(formatTime(item.createTime)), 1)
                        ], 2);
                      }), 128)),
                      messages.value.length === 0 ? (openBlock(), createBlock(unref(NEmpty), {
                        key: 0,
                        description: "暂无消息",
                        class: "empty-state"
                      })) : createCommentVNode("", true)
                    ], 512)
                  ]),
                  _: 1
                }, 8, ["show"]),
                createBaseVNode("footer", _hoisted_16, [
                  createVNode(unref(NInput), {
                    value: draft.value,
                    "onUpdate:value": _cache[2] || (_cache[2] = ($event) => draft.value = $event),
                    type: "textarea",
                    autosize: { minRows: 2, maxRows: 5 },
                    maxlength: "2000",
                    "show-count": "",
                    placeholder: "输入消息",
                    onKeydown: withKeys(withModifiers(sendMessage, ["ctrl", "prevent"]), ["enter"])
                  }, null, 8, ["value", "onKeydown"]),
                  createVNode(unref(Button), {
                    type: "primary",
                    loading: sending.value,
                    disabled: !draft.value.trim(),
                    onClick: sendMessage
                  }, {
                    icon: withCtx(() => [
                      createVNode(unref(Icon), { icon: "ion:send" })
                    ]),
                    default: withCtx(() => [
                      _cache[11] || (_cache[11] = createTextVNode(" 发送 ", -1))
                    ]),
                    _: 1
                  }, 8, ["loading", "disabled"])
                ])
              ], 64)) : (openBlock(), createBlock(unref(NEmpty), {
                key: 1,
                description: "选择一个会话开始沟通",
                class: "center-empty"
              }))
            ])
          ]),
          createVNode(unref(NModal), {
            show: showCreate.value,
            "onUpdate:show": _cache[7] || (_cache[7] = ($event) => showCreate.value = $event),
            preset: "card",
            title: "新建会话",
            style: { "width": "560px" }
          }, {
            default: withCtx(() => [
              createVNode(unref(NTabs), {
                value: createMode.value,
                "onUpdate:value": _cache[6] || (_cache[6] = ($event) => createMode.value = $event),
                type: "segment"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NTabPane), {
                    name: "direct",
                    tab: "私聊"
                  }, {
                    default: withCtx(() => [
                      createBaseVNode("div", _hoisted_17, [
                        createVNode(unref(NInput), {
                          value: contactKeyword.value,
                          "onUpdate:value": _cache[3] || (_cache[3] = ($event) => contactKeyword.value = $event),
                          clearable: "",
                          placeholder: "搜索姓名、账号或部门",
                          onKeyup: withKeys(searchContacts, ["enter"])
                        }, null, 8, ["value"]),
                        createVNode(unref(Button), { onClick: searchContacts }, {
                          icon: withCtx(() => [
                            createVNode(unref(Icon), { icon: "ion:search" })
                          ]),
                          _: 1
                        })
                      ]),
                      createBaseVNode("div", _hoisted_18, [
                        (openBlock(true), createElementBlock(Fragment, null, renderList(contacts.value, (contact) => {
                          return openBlock(), createElementBlock("button", {
                            key: contact.userId,
                            onClick: ($event) => createDirect(contact)
                          }, [
                            createBaseVNode("strong", null, toDisplayString(contact.nickName || contact.userName), 1),
                            createBaseVNode("span", null, toDisplayString(contact.deptName || contact.userName), 1)
                          ], 8, _hoisted_19);
                        }), 128))
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NTabPane), {
                    name: "group",
                    tab: "群聊"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: groupName.value,
                        "onUpdate:value": _cache[4] || (_cache[4] = ($event) => groupName.value = $event),
                        maxlength: "50",
                        "show-count": "",
                        placeholder: "群聊名称"
                      }, null, 8, ["value"]),
                      createVNode(unref(NCheckboxGroup), {
                        value: groupMembers.value,
                        "onUpdate:value": _cache[5] || (_cache[5] = ($event) => groupMembers.value = $event),
                        class: "member-list"
                      }, {
                        default: withCtx(() => [
                          (openBlock(true), createElementBlock(Fragment, null, renderList(contacts.value, (contact) => {
                            return openBlock(), createBlock(unref(NCheckbox), {
                              key: contact.userId,
                              value: contact.userId
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(contact.nickName || contact.userName) + " · " + toDisplayString(contact.deptName || "未分配部门"), 1)
                              ]),
                              _: 2
                            }, 1032, ["value"]);
                          }), 128))
                        ]),
                        _: 1
                      }, 8, ["value"]),
                      createVNode(unref(Button), {
                        type: "primary",
                        block: "",
                        onClick: createGroup
                      }, {
                        default: withCtx(() => [..._cache[12] || (_cache[12] = [
                          createTextVNode("创建群聊", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["value"])
            ]),
            _: 1
          }, 8, ["show"])
        ]),
        _: 1
      });
    };
  }
});
const ChatView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-35315fe2"]]);
export {
  ChatView as default
};
