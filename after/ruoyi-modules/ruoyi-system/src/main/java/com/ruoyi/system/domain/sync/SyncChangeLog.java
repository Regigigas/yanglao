package com.ruoyi.system.domain.sync;

public class SyncChangeLog
{
    private Long syncId;
    private String changeId;
    private Long ownerUserId;
    private String sourceDeviceId;
    private String tableName;
    private String recordId;
    private String operation;
    private String payload;
    private Long createdAt;
    private Long receivedAt;

    public Long getSyncId()
    {
        return syncId;
    }

    public void setSyncId(Long syncId)
    {
        this.syncId = syncId;
    }

    public String getChangeId()
    {
        return changeId;
    }

    public void setChangeId(String changeId)
    {
        this.changeId = changeId;
    }

    public Long getOwnerUserId()
    {
        return ownerUserId;
    }

    public void setOwnerUserId(Long ownerUserId)
    {
        this.ownerUserId = ownerUserId;
    }

    public String getSourceDeviceId()
    {
        return sourceDeviceId;
    }

    public void setSourceDeviceId(String sourceDeviceId)
    {
        this.sourceDeviceId = sourceDeviceId;
    }

    public String getTableName()
    {
        return tableName;
    }

    public void setTableName(String tableName)
    {
        this.tableName = tableName;
    }

    public String getRecordId()
    {
        return recordId;
    }

    public void setRecordId(String recordId)
    {
        this.recordId = recordId;
    }

    public String getOperation()
    {
        return operation;
    }

    public void setOperation(String operation)
    {
        this.operation = operation;
    }

    public String getPayload()
    {
        return payload;
    }

    public void setPayload(String payload)
    {
        this.payload = payload;
    }

    public Long getCreatedAt()
    {
        return createdAt;
    }

    public void setCreatedAt(Long createdAt)
    {
        this.createdAt = createdAt;
    }

    public Long getReceivedAt()
    {
        return receivedAt;
    }

    public void setReceivedAt(Long receivedAt)
    {
        this.receivedAt = receivedAt;
    }
}
