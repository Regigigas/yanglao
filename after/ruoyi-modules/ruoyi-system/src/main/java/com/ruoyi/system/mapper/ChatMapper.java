package com.ruoyi.system.mapper;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Param;
import com.ruoyi.system.domain.chat.ChatConversation;
import com.ruoyi.system.domain.chat.ChatMessage;
import com.ruoyi.system.api.domain.SysUser;

public interface ChatMapper
{
    List<Map<String, Object>> selectContacts(@Param("scope") SysUser scope,
            @Param("userId") Long userId, @Param("keyword") String keyword);

    int countActiveUsers(@Param("scope") SysUser scope, @Param("userIds") List<Long> userIds);

    int countActiveUser(@Param("scope") SysUser scope, @Param("userId") Long userId);

    List<Map<String, Object>> selectConversations(@Param("userId") Long userId);

    Long selectDirectConversationId(@Param("directKey") String directKey);

    int insertConversation(ChatConversation conversation);

    int insertMember(@Param("conversationId") Long conversationId, @Param("userId") Long userId,
            @Param("role") String role);

    int countMembership(@Param("conversationId") Long conversationId, @Param("userId") Long userId);

    List<Map<String, Object>> selectMessages(@Param("conversationId") Long conversationId,
            @Param("userId") Long userId, @Param("afterMessageId") Long afterMessageId,
            @Param("beforeMessageId") Long beforeMessageId, @Param("limit") int limit);

    Map<String, Object> selectMessage(@Param("messageId") Long messageId, @Param("userId") Long userId);

    ChatMessage selectMessageByClientId(@Param("senderUserId") Long senderUserId,
            @Param("clientMessageId") String clientMessageId);

    int insertMessage(ChatMessage message);

    int updateConversationLastMessage(@Param("conversationId") Long conversationId,
            @Param("messageId") Long messageId, @Param("preview") String preview);

    int countConversationMessage(@Param("conversationId") Long conversationId,
            @Param("messageId") Long messageId);

    int markRead(@Param("conversationId") Long conversationId, @Param("userId") Long userId,
            @Param("messageId") Long messageId);
}
