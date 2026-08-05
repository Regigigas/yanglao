import axios from 'axios';
import type { AxiosError, AxiosInstance } from 'axios';
import type { IpcMain } from 'electron';
import type {
  ChatGroupInput,
  ChatMessageQuery,
  ChatMode,
  ChatSendInput,
  ChatUserId,
} from '@yanglao/core';
import type { ChatRepo, SyncConfigRepo, UserRepo } from '@yanglao/db';
import { readAppConfig, writeAppConfig } from './db.handler';
import { requireActiveUser, session } from './auth.handler';

interface ApiResponse<T> {
  code: number;
  msg?: string;
  data?: T;
}

function errorMessage(error: unknown): string {
  const response = (error as AxiosError<ApiResponse<unknown>>).response;
  return response?.data?.msg
    ?? (error instanceof Error ? error.message : '聊天服务请求失败');
}

export function registerChatHandlers(
  ipc: IpcMain,
  syncConfigRepo: SyncConfigRepo,
  chatRepo: ChatRepo,
  userRepo: UserRepo,
  appConfigPath: string,
): void {
  let desktopChatSession: { userId: string; token: string } | null = null;
  let onlineIdentityKey = '';

  const getMode = (): ChatMode => readAppConfig(appConfigPath).chatMode === 'online'
    ? 'online'
    : 'local';

  const localToken = (): string => {
    const currentUser = requireActiveUser(userRepo);
    if (desktopChatSession?.userId !== currentUser.id) {
      const issued = chatRepo.createSessionForUser(currentUser.id);
      desktopChatSession = { userId: currentUser.id, token: issued.token };
    }
    return desktopChatSession.token;
  };

  const onlineClient = (): AxiosInstance => {
    requireActiveUser(userRepo);
    const config = syncConfigRepo.get();
    const serverUrl = config.server_url.trim().replace(/\/$/, '');
    const accessToken = config.access_token?.trim();
    if (!serverUrl || !accessToken) {
      throw new Error('请先在数据同步中配置线上服务地址和访问令牌');
    }
    return axios.create({
      baseURL: serverUrl,
      timeout: 15_000,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  };

  const onlineRequest = async <T>(
    run: (http: AxiosInstance) => Promise<{ data: ApiResponse<T> }>,
  ): Promise<T> => {
    try {
      const http = onlineClient();
      const currentUser = requireActiveUser(userRepo);
      const authorization = String(http.defaults.headers.common.Authorization
        ?? http.defaults.headers.Authorization
        ?? '');
      const identityKey = `${currentUser.id}:${currentUser.username}:${http.defaults.baseURL}:${authorization}`;
      if (onlineIdentityKey !== identityKey) {
        const identity = await http.get<ApiResponse<{ userName?: string }>>('/system/chat/me');
        if (identity.data.code !== 200 || identity.data.data?.userName !== currentUser.username) {
          throw new Error('线上聊天令牌与当前桌面账号不匹配，请配置该账号对应的访问令牌');
        }
        onlineIdentityKey = identityKey;
      }
      const response = await run(http);
      if (response.data.code !== 200 || response.data.data === undefined) {
        throw new Error(response.data.msg || '聊天服务返回异常');
      }
      return response.data.data;
    } catch (error) {
      throw new Error(errorMessage(error));
    }
  };

  ipc.handle('chat:mode:get', () => getMode());
  ipc.handle('chat:mode:set', async (_event, mode: ChatMode) => {
    requireActiveUser(userRepo);
    if (mode !== 'local' && mode !== 'online') throw new Error('聊天服务模式无效');
    if (mode === 'online') {
      await onlineRequest((http) => http.get('/system/chat/me'));
    }
    const config = readAppConfig(appConfigPath);
    config.chatMode = mode;
    writeAppConfig(appConfigPath, config);
    return { mode };
  });

  ipc.handle('chat:me', () => getMode() === 'local'
    ? chatRepo.me(localToken())
    : onlineRequest((http) => http.get('/system/chat/me')));
  ipc.handle('chat:contacts', (_event, keyword?: string) => getMode() === 'local'
    ? chatRepo.contacts(localToken(), keyword)
    : onlineRequest((http) => http.get('/system/chat/contacts', { params: { keyword } })));
  ipc.handle('chat:conversations', () => getMode() === 'local'
    ? chatRepo.conversations(localToken())
    : onlineRequest((http) => http.get('/system/chat/conversations')));
  ipc.handle('chat:direct:create', (_event, peerUserId: ChatUserId) => getMode() === 'local'
    ? chatRepo.createDirect(localToken(), peerUserId)
    : onlineRequest((http) => http.post('/system/chat/conversations/direct', { peerUserId })));
  ipc.handle('chat:group:create', (_event, input: ChatGroupInput) => getMode() === 'local'
    ? chatRepo.createGroup(localToken(), input)
    : onlineRequest((http) => http.post('/system/chat/conversations/group', input)));
  ipc.handle('chat:messages', (_event, input: ChatMessageQuery) => getMode() === 'local'
    ? chatRepo.messages(localToken(), input)
    : onlineRequest((http) => http.get(
      `/system/chat/conversations/${input.conversationId}/messages`,
      { params: input },
    )));
  ipc.handle('chat:message:send', (_event, input: ChatSendInput) => getMode() === 'local'
    ? chatRepo.send(localToken(), input)
    : onlineRequest((http) => http.post(
      `/system/chat/conversations/${input.conversationId}/messages`,
      { clientMessageId: input.clientMessageId, messageType: 'text', content: input.content },
    )));
  ipc.handle(
    'chat:read',
    async (_event, input: { conversationId: number; lastReadMessageId: number }) => {
      if (getMode() === 'local') {
        chatRepo.markRead(localToken(), input.conversationId, input.lastReadMessageId);
        return { ok: true };
      }
      return onlineRequest((http) => http.put(
        `/system/chat/conversations/${input.conversationId}/read`,
        { lastReadMessageId: input.lastReadMessageId },
      ));
    },
  );
}
