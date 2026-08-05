package com.ruoyi.system.domain.chat;

import java.util.Date;

public class ChatConversation
{
    private Long conversationId;
    private String type;
    private String directKey;
    private String name;
    private Long ownerUserId;
    private Date createTime;

    public Long getConversationId()
    {
        return conversationId;
    }

    public void setConversationId(Long conversationId)
    {
        this.conversationId = conversationId;
    }

    public String getType()
    {
        return type;
    }

    public void setType(String type)
    {
        this.type = type;
    }

    public String getDirectKey()
    {
        return directKey;
    }

    public void setDirectKey(String directKey)
    {
        this.directKey = directKey;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public Long getOwnerUserId()
    {
        return ownerUserId;
    }

    public void setOwnerUserId(Long ownerUserId)
    {
        this.ownerUserId = ownerUserId;
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
