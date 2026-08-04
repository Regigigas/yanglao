package com.ruoyi.system.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import com.ruoyi.system.domain.sync.SyncChangeLog;

@Mapper
public interface SyncChangeLogMapper
{
    @Select("SELECT COUNT(1) FROM yl_sync_change_log WHERE owner_user_id = #{ownerUserId} AND change_id = #{changeId}")
    int countByOwnerAndChangeId(@Param("ownerUserId") long ownerUserId, @Param("changeId") String changeId);

    @Insert("INSERT IGNORE INTO yl_sync_change_log "
            + "(change_id, owner_user_id, source_device_id, table_name, record_id, operation, payload, created_at, received_at) "
            + "VALUES (#{changeId}, #{ownerUserId}, #{sourceDeviceId}, #{tableName}, #{recordId}, #{operation}, #{payload}, #{createdAt}, #{receivedAt})")
    int insert(SyncChangeLog change);

    @Select("SELECT id AS syncId, change_id AS changeId, owner_user_id AS ownerUserId, source_device_id AS sourceDeviceId, table_name AS tableName, "
            + "record_id AS recordId, operation, payload, created_at AS createdAt, received_at AS receivedAt "
            + "FROM yl_sync_change_log WHERE owner_user_id = #{ownerUserId} AND id > #{lastSyncCursor} AND source_device_id <> #{deviceId} "
            + "ORDER BY id ASC LIMIT #{limit}")
    List<SyncChangeLog> selectAfter(@Param("ownerUserId") long ownerUserId, @Param("lastSyncCursor") long lastSyncCursor,
            @Param("deviceId") String deviceId, @Param("limit") int limit);
}
