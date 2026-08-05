package com.ruoyi.system.controller;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.common.core.web.domain.AjaxResult;
import com.ruoyi.common.security.annotation.RequiresPermissions;
import com.ruoyi.common.security.utils.SecurityUtils;
import com.ruoyi.system.api.domain.SysUser;
import com.ruoyi.system.service.ChatService;

@RestController
@RequestMapping("/chat")
public class ChatController
{
    private final ChatService chatService;

    public ChatController(ChatService chatService)
    {
        this.chatService = chatService;
    }

    @GetMapping("/contacts")
    @RequiresPermissions("system:chat")
    public AjaxResult contacts(@RequestParam(required = false) String keyword)
    {
        return AjaxResult.success(chatService.contacts(new SysUser(), SecurityUtils.getUserId(), keyword));
    }

    @GetMapping("/me")
    @RequiresPermissions("system:chat")
    public AjaxResult me()
    {
        return AjaxResult.success(Map.of("userId", SecurityUtils.getUserId(),
                "userName", SecurityUtils.getUsername()));
    }

    @GetMapping("/conversations")
    @RequiresPermissions("system:chat")
    public AjaxResult conversations()
    {
        return AjaxResult.success(chatService.conversations(SecurityUtils.getUserId()));
    }

    @PostMapping("/conversations/direct")
    @RequiresPermissions("system:chat")
    public AjaxResult createDirect(@RequestBody DirectConversationRequest request)
    {
        return AjaxResult.success(chatService.createDirect(new SysUser(), SecurityUtils.getUserId(),
                request.peerUserId()));
    }

    @PostMapping("/conversations/group")
    @RequiresPermissions("system:chat")
    public AjaxResult createGroup(@RequestBody GroupConversationRequest request)
    {
        return AjaxResult.success(chatService.createGroup(new SysUser(), SecurityUtils.getUserId(),
                request.name(), request.memberUserIds()));
    }

    @GetMapping("/conversations/{conversationId}/messages")
    @RequiresPermissions("system:chat")
    public AjaxResult messages(@PathVariable Long conversationId,
            @RequestParam(required = false) Long afterMessageId,
            @RequestParam(required = false) Long beforeMessageId,
            @RequestParam(required = false) Integer limit)
    {
        return AjaxResult.success(chatService.messages(SecurityUtils.getUserId(), conversationId,
                afterMessageId, beforeMessageId, limit));
    }

    @PostMapping("/conversations/{conversationId}/messages")
    @RequiresPermissions("system:chat")
    public AjaxResult send(@PathVariable Long conversationId, @RequestBody SendMessageRequest request)
    {
        return AjaxResult.success(chatService.send(SecurityUtils.getUserId(), conversationId,
                request.clientMessageId(), request.messageType(), request.content()));
    }

    @PutMapping("/conversations/{conversationId}/read")
    @RequiresPermissions("system:chat")
    public AjaxResult markRead(@PathVariable Long conversationId, @RequestBody ReadRequest request)
    {
        chatService.markRead(SecurityUtils.getUserId(), conversationId, request.lastReadMessageId());
        return AjaxResult.success(Map.of("ok", true));
    }

    public record DirectConversationRequest(Long peerUserId) {}

    public record GroupConversationRequest(String name, List<Long> memberUserIds) {}

    public record SendMessageRequest(String clientMessageId, String messageType, String content) {}

    public record ReadRequest(Long lastReadMessageId) {}
}
