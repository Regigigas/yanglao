package com.ruoyi.system.domain.chat;

import java.util.Date;

public class ChatMessage
{
    private Long messageId;
    private Long conversationId;
    private Long senderUserId;
    private String clientMessageId;
    private String messageType;
    private String content;
    private Date createTime;

    public Long getMessageId()
    {
        return messageId;
    }

    public void setMessageId(Long messageId)
    {
        this.messageId = messageId;
    }

    public Long getConversationId()
    {
        return conversationId;
    }

    public void setConversationId(Long conversationId)
    {
        this.conversationId = conversationId;
    }

    public Long getSenderUserId()
    {
        return senderUserId;
    }

    public void setSenderUserId(Long senderUserId)
    {
        this.senderUserId = senderUserId;
    }

    public String getClientMessageId()
    {
        return clientMessageId;
    }

    public void setClientMessageId(String clientMessageId)
    {
        this.clientMessageId = clientMessageId;
    }

    public String getMessageType()
    {
        return messageType;
    }

    public void setMessageType(String messageType)
    {
        this.messageType = messageType;
    }

    public String getContent()
    {
        return content;
    }

    public void setContent(String content)
    {
        this.content = content;
    }

    public Date getCreateTime()
    {
        return createTime;
    }

    public void setCreateTime(Date createTime)
    {
        this.createTime = createTime;
    }
}
