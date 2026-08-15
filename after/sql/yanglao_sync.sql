-- 养老管理系统同步服务
-- 在导入 ry_config_20260611.sql 后执行；该脚本可重复执行。

CREATE TABLE IF NOT EXISTS `yl_sync_change_log` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `change_id` varchar(64) NOT NULL,
  `owner_user_id` bigint NOT NULL COMMENT '同步数据所属的登录用户',
  `source_device_id` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL,
  `record_id` varchar(64) NOT NULL,
  `operation` varchar(10) NOT NULL,
  `payload` json NOT NULL,
  `created_at` bigint NOT NULL,
  `received_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_yl_sync_owner_change` (`owner_user_id`, `change_id`),
  KEY `idx_yl_sync_owner_cursor` (`owner_user_id`, `id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='终端同步变更日志';

-- 已部署过旧版同步表时，为历史记录标记为未归属（user_id=0），不向任何账号下发。
SET @sync_add_owner_column = (
  SELECT IF(COUNT(*) = 0,
    'ALTER TABLE `yl_sync_change_log` ADD COLUMN `owner_user_id` bigint NOT NULL DEFAULT 0 COMMENT ''同步数据所属的登录用户'' AFTER `change_id`',
    'SELECT 1')
  FROM information_schema.columns
  WHERE table_schema = DATABASE() AND table_name = 'yl_sync_change_log' AND column_name = 'owner_user_id'
);
PREPARE sync_statement FROM @sync_add_owner_column;
EXECUTE sync_statement;
DEALLOCATE PREPARE sync_statement;

SET @sync_drop_legacy_index = (
  SELECT IF(COUNT(*) > 0,
    'ALTER TABLE `yl_sync_change_log` DROP INDEX `uk_yl_sync_change_id`',
    'SELECT 1')
  FROM information_schema.statistics
  WHERE table_schema = DATABASE() AND table_name = 'yl_sync_change_log' AND index_name = 'uk_yl_sync_change_id'
);
PREPARE sync_statement FROM @sync_drop_legacy_index;
EXECUTE sync_statement;
DEALLOCATE PREPARE sync_statement;

SET @sync_add_owner_change_index = (
  SELECT IF(COUNT(*) = 0,
    'ALTER TABLE `yl_sync_change_log` ADD UNIQUE KEY `uk_yl_sync_owner_change` (`owner_user_id`, `change_id`)',
    'SELECT 1')
  FROM information_schema.statistics
  WHERE table_schema = DATABASE() AND table_name = 'yl_sync_change_log' AND index_name = 'uk_yl_sync_owner_change'
);
PREPARE sync_statement FROM @sync_add_owner_change_index;
EXECUTE sync_statement;
DEALLOCATE PREPARE sync_statement;

SET @sync_add_owner_cursor_index = (
  SELECT IF(COUNT(*) = 0,
    'ALTER TABLE `yl_sync_change_log` ADD KEY `idx_yl_sync_owner_cursor` (`owner_user_id`, `id`)',
    'SELECT 1')
  FROM information_schema.statistics
  WHERE table_schema = DATABASE() AND table_name = 'yl_sync_change_log' AND index_name = 'idx_yl_sync_owner_cursor'
);
PREPARE sync_statement FROM @sync_add_owner_cursor_index;
EXECUTE sync_statement;
DEALLOCATE PREPARE sync_statement;

UPDATE `config_info`
SET `content` = REPLACE(
  `content`,
  '            # 文件服务',
  '            # 养老同步服务\n            - id: ruoyi-system-sync\n              uri: lb://ruoyi-system\n              predicates:\n                - Path=/sync/**\n\n            # 文件服务'
)
WHERE `data_id` = 'ruoyi-gateway-dev.yml'
  AND `group_id` = 'DEFAULT_GROUP'
  AND LOCATE('id: ruoyi-system-sync', `content`) = 0;

INSERT IGNORE INTO `sys_menu`
  (`menu_id`, `menu_name`, `parent_id`, `order_num`, `path`, `component`, `query`, `route_name`,
   `is_frame`, `is_cache`, `menu_type`, `visible`, `status`, `perms`, `icon`, `create_by`, `create_time`,
   `update_by`, `update_time`, `remark`)
VALUES
  (2000, '同步上传', 1, 99, '#', '', '', '', 1, 0, 'F', '1', '0', 'system:sync:upload', '#', 'admin', NOW(), '', NULL, '终端同步上传权限'),
  (2001, '同步下载', 1, 100, '#', '', '', '', 1, 0, 'F', '1', '0', 'system:sync:download', '#', 'admin', NOW(), '', NULL, '终端同步下载权限');

INSERT IGNORE INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 2000), (1, 2001);
