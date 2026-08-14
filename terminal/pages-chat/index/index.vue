<template>
  <view :class="['chat-page', settingsStore.pageClass()]">
    <NavBar
      :title="selected ? selected.name : '消息中心'"
      :show-back="Boolean(selected)"
      :manual-back="Boolean(selected)"
      @back="closeConversation"
    >
      <template #right>
        <view v-if="!selected" class="nav-action" @tap="openCreate">
          <text class="iconfont icon-add"></text>
        </view>
      </template>
    </NavBar>

    <view v-if="!selected" class="conversation-pane">
      <view v-if="loading" class="state-panel">
        <text class="iconfont icon-loading state-icon"></text>
        <text>会话加载中...</text>
      </view>
      <template v-else>
        <view v-if="conversationError" class="status-banner">
          <text class="iconfont icon-warning"></text>
          <text class="status-text">{{ conversationError }}</text>
          <view class="retry-link" @tap="initializeChat">重试</view>
        </view>
        <scroll-view scroll-y class="conversation-list">
          <view
            v-for="conversation in conversations"
            :key="conversation.conversationId"
            class="conversation-row"
            @tap="openConversation(conversation)"
          >
            <view class="conversation-avatar">
              <text class="iconfont" :class="conversation.type === 'G' ? 'icon-user-circle' : 'icon-user'"></text>
            </view>
            <view class="conversation-content">
              <view class="conversation-heading">
                <text class="conversation-name">{{ conversation.name }}</text>
                <text class="conversation-time">{{ formatTime(conversation.lastMessageTime) }}</text>
              </view>
              <view class="conversation-heading preview-line">
                <text class="conversation-preview">{{ conversation.lastMessagePreview || '暂无消息' }}</text>
                <text v-if="conversation.unreadCount" class="unread-badge">{{ Math.min(99, conversation.unreadCount) }}</text>
              </view>
            </view>
          </view>
          <view v-if="conversations.length === 0" class="empty-state">
            <text class="iconfont icon-notification"></text>
            <text>{{ conversationError ? '会话暂不可用' : '暂无会话' }}</text>
          </view>
        </scroll-view>
      </template>
    </view>

    <view v-else class="chat-detail">
      <view v-if="messageLoading" class="state-panel">
        <text class="iconfont icon-loading state-icon"></text>
        <text>消息加载中...</text>
      </view>
      <view v-else-if="messageError" class="state-panel error-state">
        <text class="iconfont icon-warning state-icon"></text>
        <text>{{ messageError }}</text>
        <view class="retry-button" @tap="retryMessages">重新加载</view>
      </view>
      <template v-else>
        <view v-if="messageSyncError" class="status-banner compact">
          <text class="iconfont icon-warning"></text>
          <text class="status-text">{{ messageSyncError }}</text>
          <view class="retry-link" @tap="pollMessages">重试</view>
        </view>
        <scroll-view
          scroll-y
          class="message-list"
          :scroll-into-view="scrollTarget"
          :scroll-with-animation="true"
        >
          <view
            v-for="item in messages"
            :id="`message-${item.messageId}`"
            :key="item.messageId"
            class="message-row"
            :class="{ mine: isSameUser(item.senderUserId, currentUserId) }"
          >
            <text class="sender-name">{{ item.senderName }}</text>
            <view class="message-bubble"><text>{{ item.content }}</text></view>
            <text class="message-time">{{ formatTime(item.createTime) }}</text>
          </view>
          <view v-if="messages.length === 0" class="empty-state"><text>暂无消息</text></view>
        </scroll-view>
        <view class="composer">
          <textarea
            v-model="draft"
            class="message-input"
            auto-height
            maxlength="2000"
            confirm-type="send"
            placeholder="输入消息"
            @confirm="submitMessage"
          />
          <button class="send-button" :disabled="sending || !draft.trim()" @tap="submitMessage">
            {{ sending ? '发送中' : '发送' }}
          </button>
        </view>
      </template>
    </view>

    <view v-if="showCreate" class="modal-mask" @tap.self="showCreate = false">
      <view class="create-panel">
        <view class="create-header">
          <text class="create-title">新建会话</text>
          <text class="iconfont icon-close" @tap="showCreate = false"></text>
        </view>
        <view class="mode-tabs">
          <button :class="{ active: createMode === 'direct' }" @tap="createMode = 'direct'">私聊</button>
          <button :class="{ active: createMode === 'group' }" @tap="createMode = 'group'">群聊</button>
        </view>
        <view class="search-row">
          <input v-model="keyword" placeholder="搜索姓名、账号或部门" confirm-type="search" @confirm="loadContacts" />
          <button @tap="loadContacts"><text class="iconfont icon-search"></text></button>
        </view>

        <input v-if="createMode === 'group'" v-model="groupName" class="group-name" maxlength="50" placeholder="群聊名称" />
        <scroll-view scroll-y class="contact-list">
          <view
            v-for="contact in contacts"
            :key="contact.userId"
            class="contact-row"
            @tap="createMode === 'direct' ? startDirect(contact) : toggleMember(contact.userId)"
          >
            <view>
              <text class="contact-name">{{ contact.nickName || contact.userName }}</text>
              <text class="contact-dept">{{ contact.deptName || contact.userName }}</text>
            </view>
            <text v-if="createMode === 'group'" class="select-indicator" :class="{ selected: hasGroupMember(contact.userId) }">
              {{ hasGroupMember(contact.userId) ? '✓' : '' }}
            </text>
          </view>
        </scroll-view>
        <button v-if="createMode === 'group'" class="create-group-button" @tap="startGroup">创建群聊</button>
      </view>
    </view>
  </view>
</template>

<script>
import NavBar from '../../components/NavBar.vue'
import { useSettingsStore } from '../../store/settings'
import {
  createDirectConversation,
  createGroupConversation,
  getChatContacts,
  getConversations,
  getCurrentChatUser,
  getMessages,
  markConversationRead,
  sendMessage
} from '../../api/chat'

function clientMessageId() {
  return `app_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`
}

export default {
  name: 'ChatPage',
  components: { NavBar },
  setup() {
    return { settingsStore: useSettingsStore() }
  },
  data() {
    return {
      loading: false,
      conversationRefreshing: false,
      conversationError: '',
      messageLoading: false,
      messageError: '',
      messageSyncError: '',
      messageRequestId: 0,
      polling: false,
      sending: false,
      conversations: [],
      messages: [],
      contacts: [],
      selected: null,
      currentUserId: '',
      draft: '',
      scrollTarget: '',
      showCreate: false,
      createMode: 'direct',
      keyword: '',
      groupName: '',
      groupMembers: [],
      pollTimer: null,
      conversationTimer: null
    }
  },
  onLoad() {
    this.initializeChat()
  },
  onUnload() {
    clearInterval(this.pollTimer)
    clearInterval(this.conversationTimer)
  },
  methods: {
    isSameUser(left, right) {
      return left !== null && left !== undefined && right !== null && right !== undefined && String(left) === String(right)
    },
    hasGroupMember(userId) {
      return this.groupMembers.some(id => this.isSameUser(id, userId))
    },
    startPolling() {
      clearInterval(this.pollTimer)
      clearInterval(this.conversationTimer)
      this.pollTimer = setInterval(() => this.pollMessages(), 3000)
      this.conversationTimer = setInterval(() => {
        this.loadConversations().catch(() => {})
      }, 10000)
    },
    async initializeChat() {
      if (this.loading) return
      this.loading = true
      this.conversationError = ''
      try {
        const me = await getCurrentChatUser()
        this.currentUserId = String(me.userId ?? '')
        await this.loadConversations()
        this.startPolling()
      } catch (error) {
        this.conversationError = `${error?.message || '聊天服务不可用'}，请检查聊天连接设置`
      } finally {
        this.loading = false
      }
    },
    async loadConversations() {
      if (this.conversationRefreshing) return
      this.conversationRefreshing = true
      try {
        const list = await getConversations()
        this.conversations = list
        this.conversationError = ''
        if (this.selected) {
          this.selected = list.find(item => item.conversationId === this.selected.conversationId) || this.selected
        }
      } catch (error) {
        this.conversationError = `${error?.message || '会话加载失败'}，请检查聊天连接设置`
        throw error
      } finally {
        this.conversationRefreshing = false
      }
    },
    async openConversation(conversation) {
      if (this.messageLoading) return
      const requestId = ++this.messageRequestId
      this.selected = conversation
      this.messageLoading = true
      this.messageError = ''
      this.messageSyncError = ''
      try {
        const messages = await getMessages(conversation.conversationId, { limit: 80 })
        if (requestId !== this.messageRequestId) return
        this.messages = messages
        await this.markLatestRead().catch(() => {})
        this.scrollToLatest()
      } catch (error) {
        if (requestId !== this.messageRequestId) return
        this.messageError = `${error?.message || '消息加载失败'}，请稍后重试`
      } finally {
        if (requestId === this.messageRequestId) this.messageLoading = false
      }
    },
    retryMessages() {
      if (this.selected) this.openConversation(this.selected)
    },
    closeConversation() {
      this.messageRequestId += 1
      this.selected = null
      this.messages = []
      this.draft = ''
      this.messageLoading = false
      this.messageError = ''
      this.messageSyncError = ''
      this.loadConversations().catch(() => {})
    },
    async pollMessages() {
      if (!this.selected || this.messageLoading || this.sending || this.polling) return
      this.polling = true
      const conversationId = this.selected.conversationId
      const latest = this.messages[this.messages.length - 1]
      try {
        const incoming = await getMessages(conversationId, {
          afterMessageId: latest?.messageId,
          limit: 100
        })
        if (!this.selected || !this.isSameUser(this.selected.conversationId, conversationId)) return
        if (incoming.length) {
          const merged = new Map(this.messages.map(item => [item.messageId, item]))
          incoming.forEach(item => merged.set(item.messageId, item))
          this.messages = [...merged.values()].sort((a, b) => a.messageId - b.messageId)
          await this.markLatestRead().catch(() => {})
          this.scrollToLatest()
        }
        this.messageSyncError = ''
      } catch (error) {
        this.messageSyncError = `${error?.message || '消息同步失败'}，请检查网络后重试`
      } finally {
        this.polling = false
      }
    },
    async markLatestRead() {
      const latest = this.messages[this.messages.length - 1]
      if (!this.selected || !latest) return
      await markConversationRead(this.selected.conversationId, latest.messageId)
      this.selected.unreadCount = 0
    },
    scrollToLatest() {
      const latest = this.messages[this.messages.length - 1]
      this.scrollTarget = ''
      this.$nextTick(() => { this.scrollTarget = latest ? `message-${latest.messageId}` : '' })
    },
    async submitMessage() {
      const content = this.draft.trim()
      if (!this.selected || !content || this.sending) return
      this.sending = true
      try {
        const sent = await sendMessage(this.selected.conversationId, clientMessageId(), content)
        if (sent) this.messages.push(sent)
        this.draft = ''
        this.scrollToLatest()
        this.loadConversations().catch(() => {})
      } catch (error) {
        uni.showToast({ title: `${error.message || '消息发送失败'}，请检查聊天连接设置`, icon: 'none' })
      } finally {
        this.sending = false
      }
    },
    async openCreate() {
      this.showCreate = true
      this.createMode = 'direct'
      this.keyword = ''
      this.groupName = ''
      this.groupMembers = []
      await this.loadContacts()
    },
    async loadContacts() {
      try {
        this.contacts = await getChatContacts(this.keyword.trim())
      } catch (error) {
        uni.showToast({ title: `${error.message || '联系人加载失败'}，请检查聊天连接设置`, icon: 'none' })
      }
    },
    async startDirect(contact) {
      try {
        const conversationId = await createDirectConversation(contact.userId)
        this.showCreate = false
        await this.loadConversations()
        const conversation = this.conversations.find(item => item.conversationId === conversationId)
        if (conversation) await this.openConversation(conversation)
      } catch (error) {
        uni.showToast({ title: `${error.message || '创建私聊失败'}，请检查聊天连接设置`, icon: 'none' })
      }
    },
    toggleMember(userId) {
      this.groupMembers = this.hasGroupMember(userId)
        ? this.groupMembers.filter(id => !this.isSameUser(id, userId))
        : [...this.groupMembers, userId]
    },
    async startGroup() {
      if (!this.groupName.trim()) return uni.showToast({ title: '请输入群聊名称', icon: 'none' })
      if (this.groupMembers.length < 2) return uni.showToast({ title: '请至少选择两位群成员', icon: 'none' })
      try {
        const conversationId = await createGroupConversation(this.groupName.trim(), this.groupMembers)
        this.showCreate = false
        await this.loadConversations()
        const conversation = this.conversations.find(item => item.conversationId === conversationId)
        if (conversation) await this.openConversation(conversation)
      } catch (error) {
        uni.showToast({ title: `${error.message || '创建群聊失败'}，请检查聊天连接设置`, icon: 'none' })
      }
    },
    formatTime(value) {
      if (!value) return ''
      const date = new Date(value)
      return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }
  }
}
</script>

<style scoped lang="scss">
.chat-page { height: 100vh; min-height: 0; overflow: hidden; display: flex; flex-direction: column; background: var(--bg-page); color: var(--text-primary); }
.nav-action { min-width: 44px; min-height: 44px; display: flex; align-items: center; justify-content: center; .iconfont { color: #fff; font-size: 38rpx; } }
.conversation-pane, .chat-detail { min-height: 0; flex: 1; display: flex; flex-direction: column; }
.conversation-list { height: 0; min-height: 0; flex: 1; }
.conversation-row { min-height: 126rpx; margin: 0 24rpx; padding: 20rpx 0; display: flex; align-items: center; border-bottom: 1rpx solid var(--divider-color); }
.conversation-avatar { width: 82rpx; height: 82rpx; flex: none; display: flex; align-items: center; justify-content: center; border-radius: 12rpx; background: var(--primary-light); color: var(--primary-color); .iconfont { font-size: 44rpx; } }
.conversation-content { min-width: 0; margin-left: 20rpx; flex: 1; }
.conversation-heading { display: flex; align-items: center; justify-content: space-between; gap: 16rpx; }
.conversation-name { overflow: hidden; font-size: 28rpx; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.conversation-time { flex: none; color: var(--text-secondary); font-size: 20rpx; }
.preview-line { margin-top: 10rpx; }
.conversation-preview { min-width: 0; overflow: hidden; color: var(--text-secondary); font-size: 22rpx; text-overflow: ellipsis; white-space: nowrap; }
.unread-badge { min-width: 30rpx; height: 30rpx; padding: 0 7rpx; border-radius: 15rpx; background: #f56c6c; color: #fff; font-size: 18rpx; line-height: 30rpx; text-align: center; }
.message-list { width: 100%; height: 0; min-height: 0; padding: 24rpx; flex: 1; box-sizing: border-box; }
.message-row { max-width: 78%; margin: 0 auto 28rpx 0; display: flex; align-items: flex-start; flex-direction: column; }
.message-row.mine { margin-right: 0; margin-left: auto; align-items: flex-end; }
.sender-name, .message-time { color: var(--text-secondary); font-size: 19rpx; }
.message-bubble { margin: 7rpx 0; padding: 18rpx 22rpx; border: 1rpx solid var(--border-color); border-radius: 10rpx; background: var(--bg-card); font-size: 25rpx; line-height: 1.6; word-break: break-all; }
.message-row.mine .message-bubble { border-color: rgba(74, 144, 217, .35); background: var(--primary-light); }
.composer { flex: none; min-height: 60px; padding: 8px 10px calc(8px + env(safe-area-inset-bottom)); box-sizing: border-box; display: flex; align-items: flex-end; gap: 8px; border-top: 1rpx solid var(--divider-color); background: var(--bg-card); }
.message-input { min-height: 44px; max-height: 120px; padding: 10px; flex: 1; box-sizing: border-box; border: 1rpx solid var(--border-color); border-radius: 8rpx; background: var(--bg-page); font-size: var(--font-sm, 24rpx); }
.send-button { width: auto; min-width: 64px; height: 44px; padding: 0 12px; margin: 0; border-radius: 8rpx; background: var(--primary-color); color: #fff; font-size: var(--font-sm, 24rpx); line-height: 44px; }
.send-button[disabled] { background: #aeb9b3; }
.empty-state { padding-top: 180rpx; display: flex; align-items: center; flex-direction: column; gap: 18rpx; color: var(--text-secondary); .iconfont { font-size: 74rpx; } }
.state-panel { min-height: 0; padding: 48rpx 32rpx; flex: 1; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 20rpx; color: var(--text-secondary); text-align: center; font-size: var(--font-sm, 24rpx); }
.state-icon { font-size: 72rpx; }
.error-state .state-icon { color: #b42318; }
.retry-button { min-height: 44px; padding: 0 32rpx; display: flex; align-items: center; justify-content: center; border-radius: 8rpx; background: var(--primary-color); color: #fff; font-weight: 600; }
.status-banner { flex: none; margin: 16rpx 24rpx 0; padding: 12rpx 16rpx; display: flex; align-items: center; gap: 12rpx; border: 1rpx solid #f5c2c2; border-radius: 8rpx; background: #fff4f4; color: #b42318; }
.status-banner.compact { margin-bottom: 0; }
.status-banner > .iconfont { flex: none; font-size: 28rpx; }
.status-text { min-width: 0; flex: 1; overflow-wrap: anywhere; font-size: var(--font-xs, 20rpx); }
.retry-link { min-width: 44px; min-height: 44px; display: flex; align-items: center; justify-content: center; color: var(--primary-color); font-size: var(--font-sm, 24rpx); font-weight: 600; }
.modal-mask { position: fixed; inset: 0; z-index: 2000; display: flex; align-items: flex-end; background: rgba(0, 0, 0, .45); }
.create-panel { width: 100%; max-height: 82vh; padding: 28rpx 28rpx calc(30rpx + env(safe-area-inset-bottom)); box-sizing: border-box; border-radius: 24rpx 24rpx 0 0; background: var(--bg-card); }
.create-header { display: flex; align-items: center; justify-content: space-between; }
.create-title { font-size: 30rpx; font-weight: 600; }
.create-header .iconfont { padding: 8rpx; color: var(--text-secondary); }
.mode-tabs { height: 72rpx; margin-top: 22rpx; padding: 4rpx; display: grid; grid-template-columns: 1fr 1fr; border-radius: 8rpx; background: var(--bg-page); }
.mode-tabs button { height: 64rpx; margin: 0; border-radius: 6rpx; background: transparent; color: var(--text-secondary); font-size: 24rpx; line-height: 64rpx; }
.mode-tabs button.active { background: var(--bg-card); color: var(--primary-color); font-weight: 600; }
.search-row { margin-top: 20rpx; display: flex; gap: 12rpx; }
.search-row input, .group-name { height: 76rpx; padding: 0 18rpx; flex: 1; border: 1rpx solid var(--border-color); border-radius: 8rpx; background: var(--bg-page); font-size: 24rpx; }
.search-row button { width: 76rpx; height: 76rpx; margin: 0; padding: 0; color: var(--primary-color); line-height: 76rpx; }
.group-name { width: 100%; margin-top: 16rpx; box-sizing: border-box; }
.contact-list { max-height: 46vh; margin-top: 14rpx; }
.contact-row { min-height: 88rpx; padding: 12rpx 4rpx; display: flex; align-items: center; justify-content: space-between; border-bottom: 1rpx solid var(--divider-color); }
.contact-name, .contact-dept { display: block; }
.contact-name { font-size: 26rpx; font-weight: 600; }
.contact-dept { margin-top: 5rpx; color: var(--text-secondary); font-size: 20rpx; }
.select-indicator { width: 36rpx; height: 36rpx; border: 2rpx solid var(--border-color); border-radius: 6rpx; color: #fff; line-height: 34rpx; text-align: center; }
.select-indicator.selected { border-color: var(--primary-color); background: var(--primary-color); }
.create-group-button { height: 78rpx; margin-top: 20rpx; border-radius: 8rpx; background: var(--primary-color); color: #fff; font-size: 25rpx; line-height: 78rpx; }
</style>
