SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS chat_conversation (
  conversation_id     bigint(20)    NOT NULL AUTO_INCREMENT COMMENT '会话ID',
  type                char(1)       NOT NULL COMMENT 'D私聊 G群聊',
  direct_key          varchar(64)   DEFAULT NULL COMMENT '私聊双方唯一键',
  name                varchar(50)   DEFAULT NULL COMMENT '群聊名称',
  owner_user_id       bigint(20)    DEFAULT NULL COMMENT '群主用户ID',
  last_message_id     bigint(20)    DEFAULT NULL COMMENT '最后消息ID',
  last_message_preview varchar(200) DEFAULT '' COMMENT '最后消息摘要',
  last_message_time   datetime      DEFAULT NULL COMMENT '最后消息时间',
  status              char(1)       NOT NULL DEFAULT '0' COMMENT '0正常 1停用',
  create_time         datetime      NOT NULL,
  update_time         datetime      NOT NULL,
  PRIMARY KEY (conversation_id),
  UNIQUE KEY uk_chat_direct_key (direct_key),
  KEY idx_chat_last_message (last_message_time, conversation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聊天会话';

CREATE TABLE IF NOT EXISTS chat_conversation_member (
  conversation_id     bigint(20)  NOT NULL,
  user_id             bigint(20)  NOT NULL,
  role                char(1)     NOT NULL DEFAULT 'M' COMMENT 'O群主 A管理员 M成员',
  joined_at           datetime    NOT NULL,
  left_at             datetime    DEFAULT NULL,
  last_read_message_id bigint(20) NOT NULL DEFAULT 0,
  last_read_at        datetime    DEFAULT NULL,
  mute_flag           char(1)     NOT NULL DEFAULT '0',
  PRIMARY KEY (conversation_id, user_id),
  KEY idx_chat_member_user (user_id, left_at, conversation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聊天会话成员';

CREATE TABLE IF NOT EXISTS chat_message (
  message_id       bigint(20)    NOT NULL AUTO_INCREMENT,
  conversation_id bigint(20)    NOT NULL,
  sender_user_id  bigint(20)    NOT NULL,
  client_message_id varchar(64) NOT NULL COMMENT '客户端幂等标识',
  message_type    varchar(20)   NOT NULL DEFAULT 'text',
  content         varchar(2000) NOT NULL,
  create_time     datetime      NOT NULL,
  deleted_flag    char(1)       NOT NULL DEFAULT '0',
  PRIMARY KEY (message_id),
  UNIQUE KEY uk_chat_sender_client (sender_user_id, client_message_id),
  KEY idx_chat_message_cursor (conversation_id, message_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聊天消息';

INSERT IGNORE INTO sys_menu
  (menu_id, menu_name, parent_id, order_num, path, component, query, route_name,
   is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time,
   update_by, update_time, remark)
VALUES
  (2002, '聊天服务', 1, 101, '#', '', '', '', 1, 0, 'F', '1', '0', 'system:chat', '#',
   'admin', NOW(), '', NULL, '终端及桌面线上聊天权限');

INSERT IGNORE INTO sys_role_menu (role_id, menu_id) VALUES (1, 2002);
