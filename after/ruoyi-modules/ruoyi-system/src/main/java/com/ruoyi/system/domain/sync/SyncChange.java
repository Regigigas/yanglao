package com.ruoyi.system.domain.sync;

import java.util.Map;

public record SyncChange(
        String id,
        String tableName,
        String recordId,
        String operation,
        Map<String, Object> payload,
        Long createdAt,
        Long receivedAt)
{
}
