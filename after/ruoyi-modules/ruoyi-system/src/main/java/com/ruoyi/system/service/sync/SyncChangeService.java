package com.ruoyi.system.service.sync;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ruoyi.system.domain.sync.SyncChange;
import com.ruoyi.system.domain.sync.SyncChangeLog;
import com.ruoyi.system.domain.sync.SyncDownloadRequest;
import com.ruoyi.system.domain.sync.SyncUploadRequest;
import com.ruoyi.system.mapper.SyncChangeLogMapper;

@Service
public class SyncChangeService
{
    private static final int MAX_BATCH_SIZE = 500;

    private static final Set<String> ALLOWED_TABLES = Set.of(
            "elderly", "family_contact", "health_profile", "vital_signs", "medication_order", "medication_record",
            "medical_visit", "admission", "leave_record", "discharge", "care_assessment", "care_plan", "care_record",
            "fee_item", "deposit_record", "monthly_bill", "bill_detail", "payment_record", "meal_menu", "meal_record",
            "nutrition_plan", "activity", "activity_attendance", "contract", "building", "room", "bed", "task_reminder",
            "iot_device_alert", "announcement");

    private static final Set<String> ALLOWED_OPERATIONS = Set.of("INSERT", "UPDATE", "DELETE");

    private final SyncChangeLogMapper syncChangeLogMapper;
    private final ObjectMapper objectMapper;

    public SyncChangeService(SyncChangeLogMapper syncChangeLogMapper, ObjectMapper objectMapper)
    {
        this.syncChangeLogMapper = syncChangeLogMapper;
        this.objectMapper = objectMapper;
    }

    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> upload(SyncUploadRequest request, Long ownerUserId)
    {
        validateOwnerUserId(ownerUserId);
        validateDeviceId(request.deviceId());
        List<SyncChange> changes = request.changes() == null ? List.of() : request.changes();
        if (changes.size() > MAX_BATCH_SIZE)
        {
            throw new IllegalArgumentException("单次同步最多上传 " + MAX_BATCH_SIZE + " 条变更");
        }

        List<String> acceptedIds = new ArrayList<>();
        Map<String, String> rejected = new HashMap<>();
        for (SyncChange change : changes)
        {
            String reason = validateChange(change);
            if (reason != null)
            {
                rejected.put(change == null ? "unknown" : String.valueOf(change.id()), reason);
                continue;
            }

            if (syncChangeLogMapper.countByOwnerAndChangeId(ownerUserId, change.id()) > 0)
            {
                acceptedIds.add(change.id());
                continue;
            }

            SyncChangeLog log = new SyncChangeLog();
            log.setChangeId(change.id());
            log.setOwnerUserId(ownerUserId);
            log.setSourceDeviceId(request.deviceId());
            log.setTableName(change.tableName());
            log.setRecordId(change.recordId());
            log.setOperation(change.operation());
            log.setPayload(writePayload(change.payload()));
            log.setCreatedAt(change.createdAt() == null ? System.currentTimeMillis() : change.createdAt());
            log.setReceivedAt(System.currentTimeMillis());
            syncChangeLogMapper.insert(log);
            acceptedIds.add(change.id());
        }

        Map<String, Object> result = new HashMap<>();
        result.put("received", acceptedIds.size());
        result.put("acceptedIds", acceptedIds);
        result.put("rejected", rejected);
        result.put("changes", List.of());
        return result;
    }

    public Map<String, Object> download(SyncDownloadRequest request, Long ownerUserId)
    {
        validateOwnerUserId(ownerUserId);
        validateDeviceId(request.deviceId());
        long cutoff = System.currentTimeMillis();
        long lastSyncCursor = request.lastSyncCursor() == null ? 0L : Math.max(0L, request.lastSyncCursor());
        List<SyncChangeLog> logs = syncChangeLogMapper.selectAfter(ownerUserId, lastSyncCursor, request.deviceId(), MAX_BATCH_SIZE);
        List<SyncChange> changes = logs.stream().map(this::toSyncChange).toList();

        Map<String, Object> result = new HashMap<>();
        result.put("received", 0);
        result.put("changes", changes);
        result.put("nextSyncAt", cutoff);
        result.put("nextSyncCursor", logs.isEmpty() ? lastSyncCursor : logs.get(logs.size() - 1).getSyncId());
        return result;
    }

    private SyncChange toSyncChange(SyncChangeLog log)
    {
        try
        {
            return new SyncChange(log.getChangeId(), log.getTableName(), log.getRecordId(), log.getOperation(),
                    objectMapper.readValue(log.getPayload(), new TypeReference<Map<String, Object>>() { }), log.getCreatedAt(),
                    log.getReceivedAt());
        }
        catch (JsonProcessingException exception)
        {
            throw new IllegalStateException("同步变更数据格式错误: " + log.getChangeId(), exception);
        }
    }

    private String writePayload(Map<String, Object> payload)
    {
        try
        {
            return objectMapper.writeValueAsString(payload);
        }
        catch (JsonProcessingException exception)
        {
            throw new IllegalArgumentException("同步数据无法序列化", exception);
        }
    }

    private void validateDeviceId(String deviceId)
    {
        if (deviceId == null || deviceId.isBlank() || deviceId.length() > 64)
        {
            throw new IllegalArgumentException("deviceId 不能为空且长度不能超过 64");
        }
    }

    private void validateOwnerUserId(Long ownerUserId)
    {
        if (ownerUserId == null || ownerUserId <= 0)
        {
            throw new IllegalArgumentException("未获取到有效的登录用户");
        }
    }

    private String validateChange(SyncChange change)
    {
        if (change == null || change.id() == null || change.id().isBlank() || change.id().length() > 64)
        {
            return "变更 ID 不合法";
        }
        if (!ALLOWED_TABLES.contains(change.tableName()))
        {
            return "不允许同步该数据表";
        }
        if (change.recordId() == null || change.recordId().isBlank() || change.recordId().length() > 64)
        {
            return "记录 ID 不合法";
        }
        if (!ALLOWED_OPERATIONS.contains(change.operation()))
        {
            return "不支持的变更操作";
        }
        if (change.payload() == null)
        {
            return "变更内容不能为空";
        }
        return null;
    }
}
