package com.ruoyi.system.domain.sync;

public record SyncDownloadRequest(String deviceId, Long lastSyncAt, Long lastSyncCursor)
{
}
