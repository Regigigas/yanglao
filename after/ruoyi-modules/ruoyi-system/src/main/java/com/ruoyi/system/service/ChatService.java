package com.ruoyi.system.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ruoyi.common.core.exception.ServiceException;
import com.ruoyi.common.datascope.annotation.DataScope;
import com.ruoyi.system.api.domain.SysUser;
import com.ruoyi.system.domain.chat.ChatConversation;
import com.ruoyi.system.domain.chat.ChatMessage;
import com.ruoyi.system.mapper.ChatMapper;

@Service
public class ChatService
{
    private final ChatMapper chatMapper;

    public ChatService(ChatMapper chatMapper)
    {
        this.chatMapper = chatMapper;
    }

    @DataScope(deptAlias = "d", userAlias = "u", permission = "system:chat")
    public List<Map<String, Object>> contacts(SysUser scope, Long userId, String keyword)
    {
        String search = keyword == null ? "" : keyword.trim();
        if (search.length() > 50)
        {
            throw new ServiceException("搜索内容不能超过50个字符");
        }
        return chatMapper.selectContacts(scope, userId, search);
    }

    public List<Map<String, Object>> conversations(Long userId)
    {
        return chatMapper.selectConversations(userId);
    }

    @Transactional(rollbackFor = Exception.class)
    @DataScope(deptAlias = "d", userAlias = "u", permission = "system:chat")
    public Long createDirect(SysUser scope, Long userId, Long peerUserId)
    {
        if (peerUserId == null || peerUserId <= 0 || peerUserId.equals(userId))
        {
            throw new ServiceException("私聊联系人无效");
        }
        if (chatMapper.countActiveUser(scope, peerUserId) != 1)
        {
            throw new ServiceException("联系人不存在或已停用");
        }
        String directKey = Math.min(userId, peerUserId) + ":" + Math.max(userId, peerUserId);
        Long conversationId = chatMapper.selectDirectConversationId(directKey);
        if (conversationId == null)
        {
            ChatConversation conversation = new ChatConversation();
            conversation.setType("D");
            conversation.setDirectKey(directKey);
            conversation.setCreateTime(new Date());
            chatMapper.insertConversation(conversation);
            conversationId = conversation.getConversationId();
        }
        chatMapper.insertMember(conversationId, userId, "M");
        chatMapper.insertMember(conversationId, peerUserId, "M");
        return conversationId;
    }

    @Transactional(rollbackFor = Exception.class)
    @DataScope(deptAlias = "d", userAlias = "u", permission = "system:chat")
    public Long createGroup(SysUser scope, Long userId, String requestedName, List<Long> requestedMemberUserIds)
    {
        String name = requestedName == null ? "" : requestedName.trim();
        if (name.isEmpty() || name.length() > 50)
        {
            throw new ServiceException("群聊名称长度应为1到50个字符");
        }
        Set<Long> distinctMembers = new LinkedHashSet<>();
        distinctMembers.add(userId);
        if (requestedMemberUserIds != null)
        {
            for (Long memberId : requestedMemberUserIds)
            {
                if (memberId != null && memberId > 0)
                {
                    distinctMembers.add(memberId);
                }
            }
        }
        if (distinctMembers.size() < 3 || distinctMembers.size() > 100)
        {
            throw new ServiceException("群聊成员数量应为3到100人");
        }
        List<Long> memberIds = new ArrayList<>(distinctMembers);
        if (chatMapper.countActiveUsers(scope, memberIds) != memberIds.size())
        {
            throw new ServiceException("群聊包含不存在或已停用的用户");
        }

        ChatConversation conversation = new ChatConversation();
        conversation.setType("G");
        conversation.setName(name);
        conversation.setOwnerUserId(userId);
        conversation.setCreateTime(new Date());
        chatMapper.insertConversation(conversation);
        for (Long memberId : memberIds)
        {
            chatMapper.insertMember(conversation.getConversationId(), memberId,
                    memberId.equals(userId) ? "O" : "M");
        }
        return conversation.getConversationId();
    }

    public List<Map<String, Object>> messages(Long userId, Long conversationId, Long afterMessageId,
            Long beforeMessageId, Integer requestedLimit)
    {
        int limit = Math.max(1, Math.min(requestedLimit == null ? 50 : requestedLimit, 100));
        List<Map<String, Object>> messages = chatMapper.selectMessages(conversationId, userId,
                positive(afterMessageId), positive(beforeMessageId), limit);
        if (positive(afterMessageId) == null)
        {
            Collections.reverse(messages);
        }
        return messages;
    }

    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> send(Long userId, Long conversationId, String clientMessageId,
            String messageType, String requestedContent)
    {
        if (conversationId == null || chatMapper.countMembership(conversationId, userId) != 1)
        {
            throw new ServiceException("会话不存在或您不是会话成员");
        }
        if (clientMessageId == null || !clientMessageId.matches("[A-Za-z0-9_-]{8,64}"))
        {
            throw new ServiceException("客户端消息标识无效");
        }
        String type = messageType == null ? "text" : messageType.trim();
        if (!"text".equals(type))
        {
            throw new ServiceException("当前仅支持文本消息");
        }
        String content = requestedContent == null ? "" : requestedContent.trim();
        if (content.isEmpty() || content.length() > 2000)
        {
            throw new ServiceException("消息内容长度应为1到2000个字符");
        }

        ChatMessage existing = chatMapper.selectMessageByClientId(userId, clientMessageId);
        if (existing != null)
        {
            if (!conversationId.equals(existing.getConversationId()))
            {
                throw new ServiceException("客户端消息标识已用于其他会话");
            }
            return chatMapper.selectMessage(existing.getMessageId(), userId);
        }

        ChatMessage message = new ChatMessage();
        message.setConversationId(conversationId);
        message.setSenderUserId(userId);
        message.setClientMessageId(clientMessageId);
        message.setMessageType(type);
        message.setContent(content);
        chatMapper.insertMessage(message);
        chatMapper.updateConversationLastMessage(conversationId, message.getMessageId(), preview(content));
        return chatMapper.selectMessage(message.getMessageId(), userId);
    }

    @Transactional(rollbackFor = Exception.class)
    public void markRead(Long userId, Long conversationId, Long messageId)
    {
        if (conversationId == null || messageId == null
                || chatMapper.countMembership(conversationId, userId) != 1
                || chatMapper.countConversationMessage(conversationId, messageId) != 1)
        {
            throw new ServiceException("已读位置无效");
        }
        chatMapper.markRead(conversationId, userId, messageId);
    }

    private Long positive(Long value)
    {
        return value != null && value > 0 ? value : null;
    }

    private String preview(String content)
    {
        String normalized = content.replaceAll("\\s+", " ");
        return normalized.length() <= 200 ? normalized : normalized.substring(0, 200);
    }
}
