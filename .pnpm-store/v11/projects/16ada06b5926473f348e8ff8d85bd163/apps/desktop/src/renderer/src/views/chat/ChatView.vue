<script setup lang="ts">
  import {
    Add,
    CloudStorage,
    Computer,
    Peoples,
    Search,
    Send,
    User,
  } from '@icon-park/vue-next';
  import { BasePage } from '@yanglao/ui';
  import {
    NBadge,
    NButton,
    NButtonGroup,
    NCheckbox,
    NCheckboxGroup,
    NEmpty,
    NInput,
    NModal,
    NSpin,
    NTabPane,
    NTabs,
    NTag,
    useMessage,
  } from 'naive-ui';
  import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
  import type {
    ChatContact,
    ChatConversation,
    ChatMessage,
    ChatMode,
    ChatUserId,
  } from '@yanglao/core';

  defineOptions({ name: 'Chat' });

  const notice = useMessage();
  const conversations = ref<ChatConversation[]>([]);
  const contacts = ref<ChatContact[]>([]);
  const messages = ref<ChatMessage[]>([]);
  const currentUserId = ref<ChatUserId | null>(null);
  const chatMode = ref<ChatMode>('local');
  const selected = ref<ChatConversation | null>(null);
  const draft = ref('');
  const loading = ref(false);
  const sending = ref(false);
  const showCreate = ref(false);
  const createMode = ref<'direct' | 'group'>('direct');
  const contactKeyword = ref('');
  const groupName = ref('');
  const groupMembers = ref<ChatUserId[]>([]);
  const messageList = ref<HTMLDivElement | null>(null);
  let pollingTimer = 0;
  let conversationTimer = 0;

  function formatTime(value?: string): string {
    if (!value) return '';
    return new Date(value).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  function mergeMessages(incoming: ChatMessage[]): void {
    const byId = new Map(messages.value.map((item) => [item.messageId, item]));
    incoming.forEach((item) => byId.set(item.messageId, item));
    messages.value = [...byId.values()].sort((left, right) => left.messageId - right.messageId);
  }

  async function scrollToBottom(): Promise<void> {
    await nextTick();
    if (messageList.value) messageList.value.scrollTop = messageList.value.scrollHeight;
  }

  async function loadConversations(): Promise<void> {
    const list = await window.api.chat.conversations();
    conversations.value = list;
    if (selected.value) {
      selected.value = list.find((item) => item.conversationId === selected.value?.conversationId)
        ?? selected.value;
    }
  }

  async function initializeChat(): Promise<void> {
    selected.value = null;
    messages.value = [];
    conversations.value = [];
    const me = await window.api.chat.me();
    currentUserId.value = me.userId;
    await loadConversations();
    if (conversations.value[0]) await selectConversation(conversations.value[0]);
  }

  async function switchChatMode(mode: ChatMode): Promise<void> {
    if (mode === chatMode.value || loading.value) return;
    loading.value = true;
    try {
      await window.api.chat.setMode(mode);
      chatMode.value = mode;
      await initializeChat();
      notice.success(mode === 'local' ? '已切换到本地聊天' : '已切换到线上聊天');
    } catch (error) {
      notice.error(error instanceof Error ? error.message : '切换聊天服务失败');
    } finally {
      loading.value = false;
    }
  }

  async function selectConversation(conversation: ChatConversation): Promise<void> {
    selected.value = conversation;
    loading.value = true;
    try {
      messages.value = await window.api.chat.messages({
        conversationId: conversation.conversationId,
        limit: 80,
      });
      await markLatestRead();
      await scrollToBottom();
    } catch (error) {
      notice.error(error instanceof Error ? error.message : '读取消息失败');
    } finally {
      loading.value = false;
    }
  }

  async function pollMessages(): Promise<void> {
    if (!selected.value || loading.value || sending.value) return;
    const latestId = messages.value.at(-1)?.messageId;
    try {
      const incoming = await window.api.chat.messages({
        conversationId: selected.value.conversationId,
        afterMessageId: latestId,
        limit: 100,
      });
      if (incoming.length > 0) {
        mergeMessages(incoming);
        await markLatestRead();
        await scrollToBottom();
      }
    } catch {
      // 短时断网时保留当前消息，下一轮继续增量补拉。
    }
  }

  async function markLatestRead(): Promise<void> {
    const latest = messages.value.at(-1);
    if (!selected.value || !latest) return;
    await window.api.chat.markRead(selected.value.conversationId, latest.messageId);
    selected.value.unreadCount = 0;
  }

  async function sendMessage(): Promise<void> {
    const content = draft.value.trim();
    if (!selected.value || !content || sending.value) return;
    sending.value = true;
    try {
      const sent = await window.api.chat.send({
        conversationId: selected.value.conversationId,
        clientMessageId: crypto.randomUUID().replace(/-/g, ''),
        content,
      });
      draft.value = '';
      mergeMessages([sent]);
      await scrollToBottom();
      await loadConversations();
    } catch (error) {
      notice.error(error instanceof Error ? error.message : '消息发送失败');
    } finally {
      sending.value = false;
    }
  }

  async function openCreateDialog(): Promise<void> {
    showCreate.value = true;
    contactKeyword.value = '';
    groupName.value = '';
    groupMembers.value = [];
    try {
      contacts.value = await window.api.chat.contacts();
    } catch (error) {
      showCreate.value = false;
      notice.error(error instanceof Error ? error.message : '读取联系人失败');
    }
  }

  async function searchContacts(): Promise<void> {
    contacts.value = await window.api.chat.contacts(contactKeyword.value.trim());
  }

  async function createDirect(contact: ChatContact): Promise<void> {
    const conversationId = await window.api.chat.createDirect(contact.userId);
    showCreate.value = false;
    await loadConversations();
    const conversation = conversations.value.find((item) => item.conversationId === conversationId);
    if (conversation) await selectConversation(conversation);
  }

  async function createGroup(): Promise<void> {
    if (!groupName.value.trim()) {
      notice.warning('请输入群聊名称');
      return;
    }
    if (groupMembers.value.length < 2) {
      notice.warning('请至少选择两位群成员');
      return;
    }
    try {
      const conversationId = await window.api.chat.createGroup({
        name: groupName.value.trim(),
        memberUserIds: groupMembers.value,
      });
      showCreate.value = false;
      await loadConversations();
      const conversation = conversations.value.find((item) => item.conversationId === conversationId);
      if (conversation) await selectConversation(conversation);
    } catch (error) {
      notice.error(error instanceof Error ? error.message : '创建群聊失败');
    }
  }

  onMounted(async () => {
    try {
      chatMode.value = await window.api.chat.getMode();
      await initializeChat();
      pollingTimer = window.setInterval(() => void pollMessages(), 3000);
      conversationTimer = window.setInterval(() => void loadConversations(), 10_000);
    } catch (error) {
      notice.error(error instanceof Error ? error.message : '聊天服务不可用');
    }
  });

  onBeforeUnmount(() => {
    window.clearInterval(pollingTimer);
    window.clearInterval(conversationTimer);
  });
</script>

<template>
  <BasePage title="消息中心">
    <div class="chat-mode-bar">
      <NButtonGroup>
        <NButton
          size="small"
          :type="chatMode === 'local' ? 'primary' : 'default'"
          :secondary="chatMode === 'local'"
          @click="switchChatMode('local')"
        >
          <template #icon><Computer class="chat-button-icon" theme="outline" :size="16" :stroke-width="3" /></template>
          本地聊天
        </NButton>
        <NButton
          size="small"
          :type="chatMode === 'online' ? 'primary' : 'default'"
          :secondary="chatMode === 'online'"
          @click="switchChatMode('online')"
        >
          <template #icon><CloudStorage class="chat-button-icon" theme="outline" :size="16" :stroke-width="3" /></template>
          线上聊天
        </NButton>
      </NButtonGroup>
      <NTag size="small" :type="chatMode === 'local' ? 'success' : 'info'">
        {{ chatMode === 'local' ? 'SQLite 本地会话' : '线上服务会话' }}
      </NTag>
    </div>
    <div class="chat-workspace">
      <aside class="conversation-pane">
        <div class="pane-toolbar">
          <strong>会话</strong>
          <NButton circle secondary type="primary" title="新建会话" @click="openCreateDialog">
            <template #icon><Add class="chat-button-icon" theme="outline" :size="16" :stroke-width="3" /></template>
          </NButton>
        </div>
        <div class="conversation-list">
          <button
            v-for="conversation in conversations"
            :key="conversation.conversationId"
            class="conversation-item"
            :class="{ active: selected?.conversationId === conversation.conversationId }"
            @click="selectConversation(conversation)"
          >
            <span class="conversation-avatar">
              <Peoples v-if="conversation.type === 'G'" theme="outline" :size="20" :stroke-width="3" />
              <User v-else theme="outline" :size="20" :stroke-width="3" />
            </span>
            <span class="conversation-copy">
              <span class="conversation-title">{{ conversation.name }}</span>
              <span class="conversation-preview">{{ conversation.lastMessagePreview || '暂无消息' }}</span>
            </span>
            <span class="conversation-meta">
              <time>{{ formatTime(conversation.lastMessageTime) }}</time>
              <NBadge :value="conversation.unreadCount" :max="99" :show="conversation.unreadCount > 0" />
            </span>
          </button>
          <NEmpty v-if="conversations.length === 0" description="暂无会话" class="empty-state" />
        </div>
      </aside>

      <section class="message-pane">
        <template v-if="selected">
          <header class="message-header">
            <strong>{{ selected.name }}</strong>
            <span>{{ selected.type === 'G' ? '群聊' : '私聊' }}</span>
          </header>
          <NSpin :show="loading" class="message-loading">
            <div ref="messageList" class="message-list">
              <div
                v-for="item in messages"
                :key="item.messageId"
                class="message-row"
                :class="{ mine: String(item.senderUserId) === String(currentUserId) }"
              >
                <span class="message-sender">{{ item.senderName }}</span>
                <div class="message-bubble">{{ item.content }}</div>
                <time>{{ formatTime(item.createTime) }}</time>
              </div>
              <NEmpty v-if="messages.length === 0" description="暂无消息" class="empty-state" />
            </div>
          </NSpin>
          <footer class="composer">
            <NInput
              v-model:value="draft"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"
              maxlength="2000"
              show-count
              placeholder="输入消息"
              @keydown.ctrl.enter.prevent="sendMessage"
            />
            <NButton type="primary" :loading="sending" :disabled="!draft.trim()" @click="sendMessage">
              <template #icon><Send class="chat-button-icon" theme="outline" :size="16" :stroke-width="3" /></template>
              发送
            </NButton>
          </footer>
        </template>
        <NEmpty v-else description="选择一个会话开始沟通" class="center-empty" />
      </section>
    </div>

    <NModal v-model:show="showCreate" preset="card" title="新建会话" style="width: 560px">
      <NTabs v-model:value="createMode" type="segment">
        <NTabPane name="direct" tab="私聊">
          <div class="contact-search">
            <NInput v-model:value="contactKeyword" clearable placeholder="搜索姓名、账号或部门" @keyup.enter="searchContacts" />
            <NButton @click="searchContacts"><template #icon><Search class="chat-button-icon" theme="outline" :size="16" :stroke-width="3" /></template></NButton>
          </div>
          <div class="contact-list">
            <button v-for="contact in contacts" :key="contact.userId" @click="createDirect(contact)">
              <strong>{{ contact.nickName || contact.userName }}</strong>
              <span>{{ contact.deptName || contact.userName }}</span>
            </button>
          </div>
        </NTabPane>
        <NTabPane name="group" tab="群聊">
          <NInput v-model:value="groupName" maxlength="50" show-count placeholder="群聊名称" />
          <NCheckboxGroup v-model:value="groupMembers" class="member-list">
            <NCheckbox v-for="contact in contacts" :key="contact.userId" :value="contact.userId">
              {{ contact.nickName || contact.userName }} · {{ contact.deptName || '未分配部门' }}
            </NCheckbox>
          </NCheckboxGroup>
          <NButton type="primary" block @click="createGroup">创建群聊</NButton>
        </NTabPane>
      </NTabs>
    </NModal>
  </BasePage>
</template>

<style scoped>
  .chat-workspace {
    height: calc(100vh - 194px);
    min-height: 500px;
    display: grid;
    grid-template-columns: 300px minmax(0, 1fr);
    overflow: hidden;
    border: 1px solid var(--n-border-color);
    border-radius: 6px;
    background: var(--n-color);
  }

  .chat-mode-bar {
    min-height: 36px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .chat-button-icon,
  .conversation-avatar :deep(svg) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
  }

  .conversation-pane { border-right: 1px solid var(--n-border-color); overflow: hidden; }
  .pane-toolbar,
  .message-header {
    height: 58px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--n-border-color);
  }
  .conversation-list { height: calc(100% - 58px); overflow-y: auto; }
  .conversation-item {
    width: 100%;
    min-height: 74px;
    padding: 11px 12px;
    display: grid;
    grid-template-columns: 42px minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    border: 0;
    border-bottom: 1px solid var(--n-border-color);
    background: transparent;
    color: inherit;
    text-align: left;
    cursor: pointer;
  }
  .conversation-item:hover,
  .conversation-item.active { background: rgba(52, 117, 77, 0.09); }
  .conversation-avatar {
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    border-radius: 6px;
    color: #34754d;
    background: #e8f3ec;
  }
  .conversation-avatar :deep(svg) { width: 20px; height: 20px; }
  .conversation-copy,
  .conversation-title,
  .conversation-preview { min-width: 0; display: block; }
  .conversation-title { overflow: hidden; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
  .conversation-preview { margin-top: 5px; overflow: hidden; color: #7b8781; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
  .conversation-meta { align-self: stretch; display: flex; align-items: flex-end; flex-direction: column; justify-content: space-between; }
  .conversation-meta time { color: #929c97; font-size: 11px; }
  .message-pane { min-width: 0; display: flex; flex-direction: column; }
  .message-header span { color: #7b8781; font-size: 12px; }
  .message-loading { min-height: 0; flex: 1; }
  .message-loading :deep(.n-spin-content) { height: 100%; }
  .message-list { height: 100%; padding: 20px; overflow-y: auto; background: #f5f7f6; }
  .message-row { max-width: 72%; margin: 0 auto 16px 0; display: flex; align-items: flex-start; flex-direction: column; }
  .message-row.mine { margin-right: 0; margin-left: auto; align-items: flex-end; }
  .message-sender,
  .message-row time { color: #7a8680; font-size: 11px; }
  .message-bubble { margin: 4px 0; padding: 10px 12px; border: 1px solid #dfe5e2; border-radius: 6px; background: #fff; line-height: 1.55; overflow-wrap: anywhere; white-space: pre-wrap; }
  .message-row.mine .message-bubble { border-color: #b9d5c4; background: #e4f2e9; }
  .composer { padding: 12px; display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: end; gap: 10px; border-top: 1px solid var(--n-border-color); }
  .center-empty { margin: auto; }
  .empty-state { margin: 40px 0; }
  .contact-search { margin-bottom: 12px; display: grid; grid-template-columns: 1fr auto; gap: 8px; }
  .contact-list { max-height: 360px; overflow-y: auto; border: 1px solid var(--n-border-color); }
  .contact-list button { width: 100%; padding: 12px; display: flex; justify-content: space-between; border: 0; border-bottom: 1px solid var(--n-border-color); background: transparent; color: inherit; cursor: pointer; }
  .contact-list button:hover { background: rgba(52, 117, 77, 0.08); }
  .contact-list span { color: #7b8781; }
  .member-list { max-height: 330px; margin: 12px 0; padding: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; overflow-y: auto; border: 1px solid var(--n-border-color); }

  @media (max-width: 900px) {
    .chat-workspace { grid-template-columns: 240px minmax(0, 1fr); }
    .message-row { max-width: 88%; }
  }
</style>
