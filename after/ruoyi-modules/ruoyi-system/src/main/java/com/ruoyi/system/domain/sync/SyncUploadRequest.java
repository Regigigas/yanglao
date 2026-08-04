package com.ruoyi.system.domain.sync;

import java.util.List;

public record SyncUploadRequest(String deviceId, Long clientTime, List<SyncChange> changes)
{
}
