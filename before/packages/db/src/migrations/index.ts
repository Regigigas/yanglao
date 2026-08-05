// packages/db/src/migrations/index.ts
// 轻量级迁移系统（无需外部 ORM）
// 每个迁移为一个对象 { version, up }，按版本顺序执行

import type { Database } from 'better-sqlite3';
import { nanoid } from 'nanoid';
import { hashPassword } from '../utils/password';

export interface Migration {
  version: number;
  description: string;
  up: (db: Database) => void;
}

/** 所有迁移，按 version 升序排列 */
export const migrations: Migration[] = [
  {
    version: 1,
    description: '初始化基础表结构',
    up: (db) => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS _migrations (
          version     INTEGER PRIMARY KEY,
          description TEXT    NOT NULL,
          applied_at  INTEGER NOT NULL
        );
      `);
    },
  },
  {
    version: 2,
    description: '创建变更日志、同步配置、同步历史表',
    up: (db) => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS change_log (
          id           TEXT    PRIMARY KEY,
          table_name   TEXT    NOT NULL,
          record_id    TEXT    NOT NULL,
          operation    TEXT    NOT NULL,
          payload      TEXT    NOT NULL,
          created_at   INTEGER NOT NULL,
          synced       INTEGER NOT NULL DEFAULT 0,
          synced_at    INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_change_log_synced   ON change_log(synced);
        CREATE INDEX IF NOT EXISTS idx_change_log_table    ON change_log(table_name);
        CREATE INDEX IF NOT EXISTS idx_change_log_created  ON change_log(created_at DESC);

        CREATE TABLE IF NOT EXISTS sync_config (
          id                 INTEGER PRIMARY KEY,
          enabled            INTEGER NOT NULL DEFAULT 0,
          trigger            TEXT    NOT NULL DEFAULT 'manual',
          interval_ms        INTEGER NOT NULL DEFAULT 300000,
          cron_expression    TEXT,
          fixed_times        TEXT,
          server_url         TEXT    NOT NULL DEFAULT '',
          direction          TEXT    NOT NULL DEFAULT 'both',
          last_sync_at       INTEGER,
          last_sync_status   TEXT,
          last_sync_message  TEXT
        );
        INSERT OR IGNORE INTO sync_config (id) VALUES (1);

        CREATE TABLE IF NOT EXISTS sync_history (
          id           TEXT    PRIMARY KEY,
          trigger      TEXT    NOT NULL,
          status       TEXT    NOT NULL,
          direction    TEXT    NOT NULL,
          started_at   INTEGER NOT NULL,
          finished_at  INTEGER,
          duration_ms  INTEGER,
          records_sent INTEGER NOT NULL DEFAULT 0,
          records_recv INTEGER NOT NULL DEFAULT 0,
          error_msg    TEXT
        );
      `);
    },
  },
  {
    version: 3,
    description: '创建老人信息表',
    up: (db) => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS elderly (
          id           TEXT    PRIMARY KEY,
          name         TEXT    NOT NULL,
          gender       TEXT,
          birth_date   TEXT,
          id_card      TEXT,
          phone        TEXT,
          address      TEXT,
          room_no      TEXT,
          status       TEXT    NOT NULL DEFAULT 'active',
          created_at   INTEGER NOT NULL,
          updated_at   INTEGER NOT NULL,
          deleted_at   INTEGER
        );
      `);
    },
  },
  {
    version: 4,
    description: '创建床位管理表（楼栋/楼层/房间/床位）',
    up: (db) => {
      db.exec(`
        -- 楼栋
        CREATE TABLE IF NOT EXISTS building (
          id          TEXT PRIMARY KEY,
          name        TEXT NOT NULL,
          floors      INTEGER NOT NULL DEFAULT 1,
          remark      TEXT,
          sort_order  INTEGER NOT NULL DEFAULT 0,
          created_at  INTEGER NOT NULL,
          updated_at  INTEGER NOT NULL,
          deleted_at  INTEGER
        );

        -- 房间
        CREATE TABLE IF NOT EXISTS room (
          id          TEXT PRIMARY KEY,
          building_id TEXT NOT NULL,
          floor       INTEGER NOT NULL,
          room_no     TEXT NOT NULL,
          room_type   TEXT NOT NULL DEFAULT 'single',
          capacity    INTEGER NOT NULL DEFAULT 1,
          price       REAL NOT NULL DEFAULT 0,
          status      TEXT NOT NULL DEFAULT 'available',
          remark      TEXT,
          created_at  INTEGER NOT NULL,
          updated_at  INTEGER NOT NULL,
          deleted_at  INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_room_building ON room(building_id);

        -- 床位
        CREATE TABLE IF NOT EXISTS bed (
          id          TEXT PRIMARY KEY,
          room_id     TEXT NOT NULL,
          bed_no      TEXT NOT NULL,
          status      TEXT NOT NULL DEFAULT 'available',
          elderly_id  TEXT,
          remark      TEXT,
          created_at  INTEGER NOT NULL,
          updated_at  INTEGER NOT NULL,
          deleted_at  INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_bed_room     ON bed(room_id);
        CREATE INDEX IF NOT EXISTS idx_bed_elderly  ON bed(elderly_id);
      `);
    },
  },
  {
    version: 5,
    description: '创建家属/紧急联系人表',
    up: (db) => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS family_contact (
          id          TEXT PRIMARY KEY,
          elderly_id  TEXT NOT NULL,
          name        TEXT NOT NULL,
          relation    TEXT NOT NULL,
          phone       TEXT NOT NULL,
          phone2      TEXT,
          id_card     TEXT,
          address     TEXT,
          is_emergency INTEGER NOT NULL DEFAULT 0,
          is_guardian  INTEGER NOT NULL DEFAULT 0,
          remark      TEXT,
          created_at  INTEGER NOT NULL,
          updated_at  INTEGER NOT NULL,
          deleted_at  INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_family_elderly ON family_contact(elderly_id);
      `);
    },
  },
  {
    version: 6,
    description: '扩展老人信息表（民族/婚姻/学历/医保/备注）',
    up: (db) => {
      db.exec(`
        ALTER TABLE elderly ADD COLUMN nation       TEXT;
        ALTER TABLE elderly ADD COLUMN marriage     TEXT;
        ALTER TABLE elderly ADD COLUMN education    TEXT;
        ALTER TABLE elderly ADD COLUMN medicare_no  TEXT;
        ALTER TABLE elderly ADD COLUMN care_level   TEXT;
        ALTER TABLE elderly ADD COLUMN bed_id       TEXT;
        ALTER TABLE elderly ADD COLUMN admission_date TEXT;
        ALTER TABLE elderly ADD COLUMN remark       TEXT;
        ALTER TABLE elderly ADD COLUMN photo_path   TEXT;
      `);
    },
  },
  {
    version: 7,
    description: '创建老人健康档案表（慢性病/过敏/手术史）',
    up: (db) => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS health_profile (
          id              TEXT PRIMARY KEY,
          elderly_id      TEXT NOT NULL UNIQUE,
          blood_type      TEXT,
          allergy         TEXT,
          chronic_disease TEXT,
          surgery_history TEXT,
          family_history  TEXT,
          disability      TEXT,
          diet_require    TEXT,
          remark          TEXT,
          created_at      INTEGER NOT NULL,
          updated_at      INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_health_elderly ON health_profile(elderly_id);
      `);
    },
  },
  {
    version: 8,
    description: '创建入住/暂离/离院记录表',
    up: (db) => {
      db.exec(`
        -- 入院记录
        CREATE TABLE IF NOT EXISTS admission (
          id            TEXT PRIMARY KEY,
          elderly_id    TEXT NOT NULL,
          bed_id        TEXT,
          admission_date TEXT NOT NULL,
          care_level    TEXT NOT NULL DEFAULT 'level1',
          deposit       REAL NOT NULL DEFAULT 0,
          monthly_fee   REAL NOT NULL DEFAULT 0,
          status        TEXT NOT NULL DEFAULT 'active',
          remark        TEXT,
          created_by    TEXT,
          created_at    INTEGER NOT NULL,
          updated_at    INTEGER NOT NULL,
          deleted_at    INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_admission_elderly ON admission(elderly_id);

        -- 暂离记录
        CREATE TABLE IF NOT EXISTS leave_record (
          id            TEXT PRIMARY KEY,
          elderly_id    TEXT NOT NULL,
          leave_date    TEXT NOT NULL,
          expect_return TEXT,
          actual_return TEXT,
          reason        TEXT,
          contact_phone TEXT,
          status        TEXT NOT NULL DEFAULT 'out',
          created_by    TEXT,
          created_at    INTEGER NOT NULL,
          updated_at    INTEGER NOT NULL,
          deleted_at    INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_leave_elderly ON leave_record(elderly_id);

        -- 离院记录
        CREATE TABLE IF NOT EXISTS discharge (
          id            TEXT PRIMARY KEY,
          elderly_id    TEXT NOT NULL,
          admission_id  TEXT,
          discharge_date TEXT NOT NULL,
          reason        TEXT NOT NULL,
          refund_amount REAL NOT NULL DEFAULT 0,
          remark        TEXT,
          created_by    TEXT,
          created_at    INTEGER NOT NULL,
          updated_at    INTEGER NOT NULL,
          deleted_at    INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_discharge_elderly ON discharge(elderly_id);
      `);
    },
  },
  {
    version: 9,
    description: '创建护理评估与护理计划表',
    up: (db) => {
      db.exec(`
        -- 护理评估（ADL/Barthel量表）
        CREATE TABLE IF NOT EXISTS care_assessment (
          id           TEXT PRIMARY KEY,
          elderly_id   TEXT NOT NULL,
          assess_date  TEXT NOT NULL,
          assessor     TEXT,
          eating       INTEGER NOT NULL DEFAULT 0,
          bathing      INTEGER NOT NULL DEFAULT 0,
          grooming     INTEGER NOT NULL DEFAULT 0,
          dressing     INTEGER NOT NULL DEFAULT 0,
          bowel        INTEGER NOT NULL DEFAULT 0,
          bladder      INTEGER NOT NULL DEFAULT 0,
          toilet       INTEGER NOT NULL DEFAULT 0,
          transfer     INTEGER NOT NULL DEFAULT 0,
          mobility     INTEGER NOT NULL DEFAULT 0,
          stairs       INTEGER NOT NULL DEFAULT 0,
          total_score  INTEGER NOT NULL DEFAULT 0,
          care_level   TEXT NOT NULL DEFAULT 'level1',
          remark       TEXT,
          created_at   INTEGER NOT NULL,
          updated_at   INTEGER NOT NULL,
          deleted_at   INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_assess_elderly ON care_assessment(elderly_id);

        -- 护理计划
        CREATE TABLE IF NOT EXISTS care_plan (
          id           TEXT PRIMARY KEY,
          elderly_id   TEXT NOT NULL,
          care_level   TEXT NOT NULL DEFAULT 'level1',
          start_date   TEXT NOT NULL,
          end_date     TEXT,
          status       TEXT NOT NULL DEFAULT 'active',
          content      TEXT,
          created_by   TEXT,
          created_at   INTEGER NOT NULL,
          updated_at   INTEGER NOT NULL,
          deleted_at   INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_plan_elderly ON care_plan(elderly_id);

        -- 护理记录（日常执行）
        CREATE TABLE IF NOT EXISTS care_record (
          id           TEXT PRIMARY KEY,
          elderly_id   TEXT NOT NULL,
          plan_id      TEXT,
          record_date  TEXT NOT NULL,
          shift        TEXT NOT NULL DEFAULT 'day',
          care_type    TEXT NOT NULL,
          content      TEXT NOT NULL,
          executor     TEXT,
          status       TEXT NOT NULL DEFAULT 'done',
          remark       TEXT,
          created_at   INTEGER NOT NULL,
          updated_at   INTEGER NOT NULL,
          deleted_at   INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_care_rec_elderly ON care_record(elderly_id);
        CREATE INDEX IF NOT EXISTS idx_care_rec_date    ON care_record(record_date);
      `);
    },
  },
  {
    version: 10,
    description: '创建生命体征与用药管理表',
    up: (db) => {
      db.exec(`
        -- 生命体征记录
        CREATE TABLE IF NOT EXISTS vital_signs (
          id              TEXT PRIMARY KEY,
          elderly_id      TEXT NOT NULL,
          record_date     TEXT NOT NULL,
          record_time     TEXT NOT NULL,
          temperature     REAL,
          pulse           INTEGER,
          respiration     INTEGER,
          systolic_bp     INTEGER,
          diastolic_bp    INTEGER,
          blood_sugar     REAL,
          weight          REAL,
          spo2            INTEGER,
          recorder        TEXT,
          remark          TEXT,
          created_at      INTEGER NOT NULL,
          updated_at      INTEGER NOT NULL,
          deleted_at      INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_vital_elderly ON vital_signs(elderly_id);
        CREATE INDEX IF NOT EXISTS idx_vital_date    ON vital_signs(record_date);

        -- 用药医嘱
        CREATE TABLE IF NOT EXISTS medication_order (
          id              TEXT PRIMARY KEY,
          elderly_id      TEXT NOT NULL,
          drug_name       TEXT NOT NULL,
          drug_spec       TEXT,
          dosage          TEXT NOT NULL,
          frequency       TEXT NOT NULL,
          route           TEXT NOT NULL DEFAULT 'oral',
          start_date      TEXT NOT NULL,
          end_date        TEXT,
          prescriber      TEXT,
          status          TEXT NOT NULL DEFAULT 'active',
          remark          TEXT,
          created_at      INTEGER NOT NULL,
          updated_at      INTEGER NOT NULL,
          deleted_at      INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_med_order_elderly ON medication_order(elderly_id);

        -- 服药记录
        CREATE TABLE IF NOT EXISTS medication_record (
          id              TEXT PRIMARY KEY,
          elderly_id      TEXT NOT NULL,
          order_id        TEXT NOT NULL,
          take_date       TEXT NOT NULL,
          take_time       TEXT NOT NULL,
          shift           TEXT NOT NULL DEFAULT 'morning',
          status          TEXT NOT NULL DEFAULT 'taken',
          executor        TEXT,
          remark          TEXT,
          created_at      INTEGER NOT NULL,
          updated_at      INTEGER NOT NULL,
          deleted_at      INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_med_rec_elderly ON medication_record(elderly_id);
        CREATE INDEX IF NOT EXISTS idx_med_rec_date    ON medication_record(take_date);

        -- 就医/转诊记录
        CREATE TABLE IF NOT EXISTS medical_visit (
          id              TEXT PRIMARY KEY,
          elderly_id      TEXT NOT NULL,
          visit_date      TEXT NOT NULL,
          hospital        TEXT,
          department      TEXT,
          doctor          TEXT,
          diagnosis       TEXT,
          treatment       TEXT,
          cost            REAL,
          escort          TEXT,
          remark          TEXT,
          created_at      INTEGER NOT NULL,
          updated_at      INTEGER NOT NULL,
          deleted_at      INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_visit_elderly ON medical_visit(elderly_id);
      `);
    },
  },
  {
    version: 11,
    description: '创建费用管理表（项目/押金/账单/收款）',
    up: (db) => {
      db.exec(`
        -- 费用项目配置
        CREATE TABLE IF NOT EXISTS fee_item (
          id          TEXT PRIMARY KEY,
          name        TEXT NOT NULL,
          category    TEXT NOT NULL DEFAULT 'other',
          unit_price  REAL NOT NULL DEFAULT 0,
          unit        TEXT NOT NULL DEFAULT '月',
          is_required INTEGER NOT NULL DEFAULT 0,
          status      TEXT NOT NULL DEFAULT 'active',
          remark      TEXT,
          created_at  INTEGER NOT NULL,
          updated_at  INTEGER NOT NULL,
          deleted_at  INTEGER
        );

        -- 押金记录
        CREATE TABLE IF NOT EXISTS deposit_record (
          id          TEXT PRIMARY KEY,
          elderly_id  TEXT NOT NULL,
          amount      REAL NOT NULL,
          type        TEXT NOT NULL DEFAULT 'deposit',
          pay_method  TEXT NOT NULL DEFAULT 'cash',
          pay_date    TEXT NOT NULL,
          operator    TEXT,
          remark      TEXT,
          created_at  INTEGER NOT NULL,
          updated_at  INTEGER NOT NULL,
          deleted_at  INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_deposit_elderly ON deposit_record(elderly_id);

        -- 月度账单
        CREATE TABLE IF NOT EXISTS monthly_bill (
          id          TEXT PRIMARY KEY,
          elderly_id  TEXT NOT NULL,
          bill_month  TEXT NOT NULL,
          total       REAL NOT NULL DEFAULT 0,
          paid        REAL NOT NULL DEFAULT 0,
          status      TEXT NOT NULL DEFAULT 'unpaid',
          remark      TEXT,
          created_at  INTEGER NOT NULL,
          updated_at  INTEGER NOT NULL,
          deleted_at  INTEGER
        );
        CREATE UNIQUE INDEX IF NOT EXISTS idx_bill_month ON monthly_bill(elderly_id, bill_month);
        CREATE INDEX IF NOT EXISTS idx_bill_elderly ON monthly_bill(elderly_id);

        -- 账单明细
        CREATE TABLE IF NOT EXISTS bill_detail (
          id          TEXT PRIMARY KEY,
          bill_id     TEXT NOT NULL,
          elderly_id  TEXT NOT NULL,
          fee_item_id TEXT,
          item_name   TEXT NOT NULL,
          quantity    REAL NOT NULL DEFAULT 1,
          unit_price  REAL NOT NULL DEFAULT 0,
          amount      REAL NOT NULL DEFAULT 0,
          remark      TEXT,
          created_at  INTEGER NOT NULL,
          updated_at  INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_bill_detail_bill ON bill_detail(bill_id);

        -- 收款记录
        CREATE TABLE IF NOT EXISTS payment_record (
          id          TEXT PRIMARY KEY,
          elderly_id  TEXT NOT NULL,
          bill_id     TEXT,
          amount      REAL NOT NULL,
          pay_method  TEXT NOT NULL DEFAULT 'cash',
          pay_date    TEXT NOT NULL,
          operator    TEXT,
          receipt_no  TEXT,
          remark      TEXT,
          created_at  INTEGER NOT NULL,
          updated_at  INTEGER NOT NULL,
          deleted_at  INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_payment_elderly ON payment_record(elderly_id);
        CREATE INDEX IF NOT EXISTS idx_payment_bill    ON payment_record(bill_id);
      `);
    },
  },
  {
    version: 12,
    description: '创建餐饮管理表（菜单/用餐记录）',
    up: (db) => {
      db.exec(`
        -- 食谱/菜单
        CREATE TABLE IF NOT EXISTS meal_menu (
          id          TEXT PRIMARY KEY,
          menu_date   TEXT NOT NULL,
          meal_type   TEXT NOT NULL DEFAULT 'lunch',
          dishes      TEXT NOT NULL DEFAULT '[]',
          calories    INTEGER,
          remark      TEXT,
          created_by  TEXT,
          created_at  INTEGER NOT NULL,
          updated_at  INTEGER NOT NULL,
          deleted_at  INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_menu_date ON meal_menu(menu_date);

        -- 用餐记录
        CREATE TABLE IF NOT EXISTS meal_record (
          id          TEXT PRIMARY KEY,
          elderly_id  TEXT NOT NULL,
          record_date TEXT NOT NULL,
          meal_type   TEXT NOT NULL DEFAULT 'lunch',
          status      TEXT NOT NULL DEFAULT 'normal',
          intake_rate INTEGER NOT NULL DEFAULT 100,
          remark      TEXT,
          recorder    TEXT,
          created_at  INTEGER NOT NULL,
          updated_at  INTEGER NOT NULL,
          deleted_at  INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_meal_rec_elderly ON meal_record(elderly_id);
        CREATE INDEX IF NOT EXISTS idx_meal_rec_date    ON meal_record(record_date);
      `);
    },
  },
  {
    version: 13,
    description: '创建活动管理表',
    up: (db) => {
      db.exec(`
        -- 活动计划
        CREATE TABLE IF NOT EXISTS activity (
          id           TEXT PRIMARY KEY,
          title        TEXT NOT NULL,
          category     TEXT NOT NULL DEFAULT 'entertainment',
          activity_date TEXT NOT NULL,
          start_time   TEXT,
          end_time     TEXT,
          location     TEXT,
          organizer    TEXT,
          max_capacity INTEGER,
          description  TEXT,
          status       TEXT NOT NULL DEFAULT 'planned',
          created_by   TEXT,
          created_at   INTEGER NOT NULL,
          updated_at   INTEGER NOT NULL,
          deleted_at   INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_activity_date ON activity(activity_date);

        -- 活动签到
        CREATE TABLE IF NOT EXISTS activity_attendance (
          id           TEXT PRIMARY KEY,
          activity_id  TEXT NOT NULL,
          elderly_id   TEXT NOT NULL,
          check_in_at  INTEGER,
          status       TEXT NOT NULL DEFAULT 'registered',
          remark       TEXT,
          created_at   INTEGER NOT NULL,
          updated_at   INTEGER NOT NULL
        );
        CREATE UNIQUE INDEX IF NOT EXISTS idx_att_unique ON activity_attendance(activity_id, elderly_id);
        CREATE INDEX IF NOT EXISTS idx_att_activity  ON activity_attendance(activity_id);
        CREATE INDEX IF NOT EXISTS idx_att_elderly   ON activity_attendance(elderly_id);
      `);
    },
  },
  {
    version: 14,
    description: '创建合同管理表',
    up: (db) => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS contract (
          id              TEXT PRIMARY KEY,
          elderly_id      TEXT NOT NULL,
          contract_no     TEXT NOT NULL UNIQUE,
          sign_date       TEXT NOT NULL,
          start_date      TEXT NOT NULL,
          end_date        TEXT NOT NULL,
          auto_renew      INTEGER NOT NULL DEFAULT 0,
          renew_months    INTEGER NOT NULL DEFAULT 12,
          monthly_amount  REAL NOT NULL DEFAULT 0,
          status          TEXT NOT NULL DEFAULT 'active',
          file_path       TEXT,
          remark          TEXT,
          created_by      TEXT,
          created_at      INTEGER NOT NULL,
          updated_at      INTEGER NOT NULL,
          deleted_at      INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_contract_elderly ON contract(elderly_id);
        CREATE INDEX IF NOT EXISTS idx_contract_end     ON contract(end_date);
      `);
    },
  },
  {
    version: 15,
    description: '创建系统通知表',
    up: (db) => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS notification (
          id          TEXT PRIMARY KEY,
          type        TEXT NOT NULL,
          title       TEXT NOT NULL,
          content     TEXT NOT NULL,
          elderly_id  TEXT,
          is_read     INTEGER NOT NULL DEFAULT 0,
          read_at     INTEGER,
          created_at  INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_notify_read    ON notification(is_read);
        CREATE INDEX IF NOT EXISTS idx_notify_created ON notification(created_at DESC);
      `);
    },
  },
  {
    version: 16,
    description: '创建局域网主机配置表',
    up: (db) => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS lan_config (
          id          INTEGER PRIMARY KEY,   -- 固定为 1
          enabled     INTEGER NOT NULL DEFAULT 0,
          port        INTEGER NOT NULL DEFAULT 7788,
          allow_write INTEGER NOT NULL DEFAULT 1,  -- 是否允许客户端写入
          secret      TEXT,                        -- 可选访问密钥
          updated_at  INTEGER NOT NULL DEFAULT 0
        );
        INSERT OR IGNORE INTO lan_config (id, updated_at) VALUES (1, 0);
      `);
    },
  },
  {
    version: 17,
    description:
      '创建用户/角色/权限/考勤（打卡+排班+请假）相关表，并写入初始角色与管理员账号',
    up: (db) => {
      db.exec(`
        -- 角色（含菜单权限、按钮权限，均以 JSON 数组字符串存储 key 列表）
        CREATE TABLE IF NOT EXISTS sys_role (
          id          TEXT PRIMARY KEY,
          name        TEXT NOT NULL,
          code        TEXT NOT NULL UNIQUE,
          menu_keys   TEXT NOT NULL DEFAULT '[]',   -- 可访问的菜单 key 列表（JSON 数组）
          button_keys TEXT NOT NULL DEFAULT '[]',   -- 可操作的按钮权限 key 列表（JSON 数组）
          is_system   INTEGER NOT NULL DEFAULT 0,   -- 系统内置角色（超级管理员）不可删除/禁用
          remark      TEXT,
          created_at  INTEGER NOT NULL,
          updated_at  INTEGER NOT NULL,
          deleted_at  INTEGER
        );

        -- 用户（系统操作人账号）
        CREATE TABLE IF NOT EXISTS sys_user (
          id              TEXT PRIMARY KEY,
          username        TEXT NOT NULL UNIQUE,
          password_hash   TEXT NOT NULL,
          password_salt   TEXT NOT NULL,
          real_name       TEXT NOT NULL,
          phone           TEXT,
          role_id         TEXT NOT NULL,
          status          TEXT NOT NULL DEFAULT 'active',  -- active | disabled
          must_change_pw  INTEGER NOT NULL DEFAULT 0,      -- 下次登录强制改密
          last_login_at   INTEGER,
          remark          TEXT,
          created_at      INTEGER NOT NULL,
          updated_at      INTEGER NOT NULL,
          deleted_at      INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_sys_user_role ON sys_user(role_id);

        -- 班次定义（用于排班）
        CREATE TABLE IF NOT EXISTS sys_shift (
          id          TEXT PRIMARY KEY,
          name        TEXT NOT NULL,
          start_time  TEXT NOT NULL,   -- HH:mm
          end_time    TEXT NOT NULL,   -- HH:mm
          remark      TEXT,
          created_at  INTEGER NOT NULL,
          updated_at  INTEGER NOT NULL,
          deleted_at  INTEGER
        );

        -- 排班记录
        CREATE TABLE IF NOT EXISTS sys_schedule (
          id          TEXT PRIMARY KEY,
          user_id     TEXT NOT NULL,
          shift_id    TEXT NOT NULL,
          work_date   TEXT NOT NULL,   -- YYYY-MM-DD
          remark      TEXT,
          created_at  INTEGER NOT NULL,
          updated_at  INTEGER NOT NULL,
          deleted_at  INTEGER
        );
        CREATE UNIQUE INDEX IF NOT EXISTS idx_schedule_unique ON sys_schedule(user_id, work_date, shift_id);
        CREATE INDEX IF NOT EXISTS idx_schedule_user ON sys_schedule(user_id);
        CREATE INDEX IF NOT EXISTS idx_schedule_date ON sys_schedule(work_date);

        -- 打卡记录（上班/下班各一条，clock_date 为归属日期，便于按天查询与统计）
        CREATE TABLE IF NOT EXISTS sys_attendance (
          id           TEXT PRIMARY KEY,
          user_id      TEXT NOT NULL,
          clock_date   TEXT NOT NULL,      -- YYYY-MM-DD，归属打卡日
          clock_type   TEXT NOT NULL,      -- clock_in | clock_out
          clock_at     TEXT NOT NULL,      -- 实际打卡时间 YYYY-MM-DD HH:mm:ss
          status       TEXT NOT NULL DEFAULT 'normal',  -- normal | late | early_leave | absent
          remark       TEXT,
          created_at   INTEGER NOT NULL,
          updated_at   INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_attendance_user ON sys_attendance(user_id);
        CREATE INDEX IF NOT EXISTS idx_attendance_date ON sys_attendance(clock_date);

        -- 请假申请
        CREATE TABLE IF NOT EXISTS sys_leave (
          id             TEXT PRIMARY KEY,
          user_id        TEXT NOT NULL,
          leave_type     TEXT NOT NULL DEFAULT 'other',  -- sick | annual | personal | other
          start_date     TEXT NOT NULL,   -- YYYY-MM-DD HH:mm:ss
          end_date       TEXT NOT NULL,   -- YYYY-MM-DD HH:mm:ss
          reason         TEXT,
          status         TEXT NOT NULL DEFAULT 'pending', -- pending | approved | rejected
          approver_id    TEXT,
          approve_remark TEXT,
          created_at     INTEGER NOT NULL,
          updated_at     INTEGER NOT NULL,
          deleted_at     INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_leave_user ON sys_leave(user_id);
        CREATE INDEX IF NOT EXISTS idx_leave_status ON sys_leave(status);

        -- 内置角色：超级管理员（拥有全部菜单与按钮权限，menu_keys 用 "*" 代表全部，不受角色管理页删改）
        INSERT OR IGNORE INTO sys_role (id, name, code, menu_keys, button_keys, is_system, remark, created_at, updated_at)
        VALUES ('role-admin', '超级管理员', 'admin', '["*"]', '["*"]', 1, '系统内置，拥有全部权限', ${Date.now()}, ${Date.now()});
      `);

      // 密码哈希需要实际计算（pbkdf2 + 随机 salt），不能写死在 SQL 字符串里，
      // 因此内置管理员账号在此用 JS 层参数化插入。
      const { salt, hash } = hashPassword('admin123');
      const now = Date.now();
      db.prepare(
        `INSERT OR IGNORE INTO sys_user
           (id, username, password_hash, password_salt, real_name, role_id, status, must_change_pw, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        'user-admin',
        'admin',
        hash,
        salt,
        '系统管理员',
        'role-admin',
        'active',
        1,
        now,
        now,
      );
    },
  },
  {
    version: 18,
    description:
      '用户扩展职位/部门字段；排班表扩展任务分配字段；新增物联网设备与体检预约/结果表',
    up: (db) => {
      db.exec(`
        -- 用户扩展：职位/部门（纯展示属性，不影响权限，权限仍由角色决定）
        ALTER TABLE sys_user ADD COLUMN position TEXT;
        ALTER TABLE sys_user ADD COLUMN department TEXT;

        -- 排班表扩展：任务分配（某天某班次具体负责的老人/区域，留空表示不指定）
        ALTER TABLE sys_schedule ADD COLUMN task_type TEXT;      -- 如：巡房、护理、餐饮、活动等
        ALTER TABLE sys_schedule ADD COLUMN task_target TEXT;    -- 负责的区域/床位范围描述，纯文本

        -- ─── 物联网设备 ──────────────────────────────────────
        -- 设备注册表：局域网内 WiFi 智能硬件（如智能体征手环/血压计/体重秤），通过 HTTP/WebSocket 上报数据；
        -- 蓝牙设备因需要硬件网关/原生蓝牙栈支持，此处先做设备档案登记，接入方式标记为 bluetooth 但数据上报接口留空。
        CREATE TABLE IF NOT EXISTS iot_device (
          id            TEXT PRIMARY KEY,
          name          TEXT NOT NULL,
          device_type   TEXT NOT NULL DEFAULT 'other',   -- vital_monitor | wristband | scale | blood_pressure | other
          conn_type     TEXT NOT NULL DEFAULT 'wifi',    -- wifi | bluetooth
          ip_address    TEXT,        -- WiFi 设备局域网地址，如 192.168.1.20
          port          INTEGER,     -- WiFi 设备端口
          mac_address   TEXT,        -- 蓝牙设备 MAC / 通用设备标识
          elderly_id    TEXT,        -- 绑定的老人（可选，未绑定表示公共设备）
          status        TEXT NOT NULL DEFAULT 'offline', -- online | offline
          last_seen_at  INTEGER,     -- 最近一次收到数据上报的时间
          remark        TEXT,
          created_at    INTEGER NOT NULL,
          updated_at    INTEGER NOT NULL,
          deleted_at    INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_iot_device_elderly ON iot_device(elderly_id);

        -- 设备数据上报记录（WiFi 设备通过接口上传的原始读数，如体温/心率/血压/体重等，用 JSON 存储便于不同设备类型复用）
        CREATE TABLE IF NOT EXISTS iot_device_data (
          id           TEXT PRIMARY KEY,
          device_id    TEXT NOT NULL,
          elderly_id   TEXT,
          data         TEXT NOT NULL,   -- JSON，如 {"heart_rate":78,"temperature":36.5}
          reported_at  INTEGER NOT NULL,
          created_at   INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_iot_data_device ON iot_device_data(device_id);
        CREATE INDEX IF NOT EXISTS idx_iot_data_elderly ON iot_device_data(elderly_id);
        CREATE INDEX IF NOT EXISTS idx_iot_data_time ON iot_device_data(reported_at DESC);

        -- ─── 体检预约与结果 ──────────────────────────────────
        CREATE TABLE IF NOT EXISTS health_exam_appointment (
          id            TEXT PRIMARY KEY,
          elderly_id    TEXT NOT NULL,
          exam_date     TEXT NOT NULL,   -- 预约体检时间 YYYY-MM-DD HH:mm:ss
          institution   TEXT,            -- 体检机构/医院
          exam_items    TEXT,            -- 体检项目说明
          status        TEXT NOT NULL DEFAULT 'pending',  -- pending | completed | cancelled
          remark        TEXT,
          created_by    TEXT,
          created_at    INTEGER NOT NULL,
          updated_at    INTEGER NOT NULL,
          deleted_at    INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_exam_appt_elderly ON health_exam_appointment(elderly_id);
        CREATE INDEX IF NOT EXISTS idx_exam_appt_date ON health_exam_appointment(exam_date);

        -- 体检结果（关联预约记录，支持无预约直接补录结果）
        CREATE TABLE IF NOT EXISTS health_exam_result (
          id              TEXT PRIMARY KEY,
          elderly_id      TEXT NOT NULL,
          appointment_id  TEXT,
          exam_date       TEXT NOT NULL,   -- 实际体检日期 YYYY-MM-DD HH:mm:ss
          institution     TEXT,
          items           TEXT NOT NULL DEFAULT '[]',  -- JSON数组：[{"name":"血压","value":"130/85","unit":"mmHg","abnormal":0}]
          conclusion      TEXT,            -- 体检结论/医生建议
          attachment_path TEXT,            -- 报告附件路径（可选）
          created_by      TEXT,
          created_at      INTEGER NOT NULL,
          updated_at      INTEGER NOT NULL,
          deleted_at      INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_exam_result_elderly ON health_exam_result(elderly_id);
        CREATE INDEX IF NOT EXISTS idx_exam_result_date ON health_exam_result(exam_date);
      `);
    },
  },
  {
    version: 19,
    description:
      '创建权限组表（角色管理页可一键套用的预设权限集合），并写入内置预设权限组',
    up: (db) => {
      db.exec(`
        -- 权限组：预设的菜单权限+按钮权限集合。创建/编辑角色时可一键套用（套用即拷贝值到角色，
        -- 非外键绑定关系），因此删除或修改权限组不会影响已经套用过它的角色。
        CREATE TABLE IF NOT EXISTS sys_permission_group (
          id          TEXT PRIMARY KEY,
          name        TEXT NOT NULL,
          code        TEXT NOT NULL UNIQUE,
          menu_keys   TEXT NOT NULL DEFAULT '[]',   -- 菜单 key 列表（JSON 数组）
          button_keys TEXT NOT NULL DEFAULT '[]',   -- 按钮权限 key 列表（JSON 数组）
          remark      TEXT,
          created_at  INTEGER NOT NULL,
          updated_at  INTEGER NOT NULL,
          deleted_at  INTEGER
        );
      `);

      // 内置预设权限组（原先硬编码在前端 PRESET_MENU_GROUPS 里的角色模板，迁移为可在界面管理的数据）
      const now = Date.now();
      const insert = db.prepare(
        `INSERT OR IGNORE INTO sys_permission_group (id, name, code, menu_keys, button_keys, remark, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      );
      insert.run(
        'pg-front-desk',
        '前台收费',
        'front_desk',
        JSON.stringify([
          'elderly',
          'bed',
          'admission',
          'contract',
          'fee',
          'report',
          'clock',
          'leave',
        ]),
        '[]',
        '入住、费用、合同相关权限',
        now,
        now,
      );
      insert.run(
        'pg-nurse',
        '护理人员',
        'nurse',
        JSON.stringify([
          'elderly',
          'care',
          'health',
          'meal',
          'nutrition',
          'activity',
          'exam',
          'clock',
          'schedule',
          'leave',
        ]),
        '[]',
        '护理、健康、活动、餐饮、体检相关权限',
        now,
        now,
      );
      insert.run(
        'pg-logistics',
        '后勤餐饮',
        'logistics',
        JSON.stringify(['meal', 'nutrition', 'activity', 'clock', 'leave']),
        '[]',
        '餐饮、活动相关权限',
        now,
        now,
      );
      insert.run(
        'pg-attendance',
        '考勤专员',
        'attendance',
        JSON.stringify(['clock', 'schedule', 'leave', 'attendance-report']),
        '[]',
        '排班、打卡、请假审批相关权限',
        now,
        now,
      );
    },
  },
  {
    version: 20,
    description:
      '创建任务提醒表（闹钟式提醒，支持重复规则与上级任务分配，接入 change_log 同步）',
    up: (db) => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS task_reminder (
          id                  TEXT    PRIMARY KEY,
          title               TEXT    NOT NULL,
          description         TEXT,
          remind_at           TEXT    NOT NULL,   -- HH:mm，当天触发时间
          remind_date         TEXT    NOT NULL,   -- YYYY-MM-DD，首次/单次触发日期
          repeat_type         TEXT    NOT NULL DEFAULT 'none',  -- none | daily | weekly | monthly
          repeat_days         TEXT,               -- JSON 数组：weekly=[0-6]，monthly=[1-31]，none/daily=null
          creator_id          TEXT    NOT NULL,   -- 创建人 user_id
          assignee_id         TEXT    NOT NULL,   -- 负责人 user_id
          status              TEXT    NOT NULL DEFAULT 'active', -- active | done | cancelled
          last_triggered_at   INTEGER,            -- 上次触发时间戳（ms），防重复触发
          created_at          INTEGER NOT NULL,
          updated_at          INTEGER NOT NULL,
          deleted_at          INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_task_reminder_assignee ON task_reminder(assignee_id);
        CREATE INDEX IF NOT EXISTS idx_task_reminder_status   ON task_reminder(status);
        CREATE INDEX IF NOT EXISTS idx_task_reminder_date     ON task_reminder(remind_date);
      `);
    },
  },
  {
    version: 21,
    description:
      'task_reminder 新增 schedule_id 关联字段（排班内联提醒与排班记录关联）',
    up: (db) => {
      db.exec(`
        ALTER TABLE task_reminder ADD COLUMN schedule_id TEXT;
        CREATE INDEX IF NOT EXISTS idx_task_reminder_schedule ON task_reminder(schedule_id);
      `);
    },
  },
  {
    version: 22,
    description: '创建个性化营养搭配方案表',
    up: (db) => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS nutrition_plan (
          id              TEXT PRIMARY KEY,
          elderly_id      TEXT NOT NULL,
          diet_type       TEXT NOT NULL DEFAULT 'normal',
          allergies       TEXT,
          avoid_foods     TEXT,
          daily_calories  INTEGER,
          protein_target  REAL,
          meal_advice     TEXT,
          effective_date  TEXT NOT NULL,
          expiry_date     TEXT,
          status          TEXT NOT NULL DEFAULT 'active',
          remark          TEXT,
          created_by      TEXT,
          created_at      INTEGER NOT NULL,
          updated_at      INTEGER NOT NULL,
          deleted_at      INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_nutrition_plan_elderly ON nutrition_plan(elderly_id);
        CREATE INDEX IF NOT EXISTS idx_nutrition_plan_status ON nutrition_plan(status);

        UPDATE sys_permission_group
        SET menu_keys = json_insert(menu_keys, '$[#]', 'nutrition')
        WHERE code IN ('nurse', 'logistics') AND instr(menu_keys, '"nutrition"') = 0;
      `);
    },
  },
  {
    version: 23,
    description: '创建全员公告与公告阅读记录表',
    up: (db) => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS announcement (
          id           TEXT    PRIMARY KEY,
          title        TEXT    NOT NULL,
          content      TEXT    NOT NULL,
          level        TEXT    NOT NULL DEFAULT 'normal', -- normal | important | urgent
          status       TEXT    NOT NULL DEFAULT 'draft',  -- draft | published | withdrawn
          is_pinned    INTEGER NOT NULL DEFAULT 0,
          publish_at   INTEGER NOT NULL,
          expire_at    INTEGER,
          created_by   TEXT    NOT NULL,
          published_by TEXT,
          created_at   INTEGER NOT NULL,
          updated_at   INTEGER NOT NULL,
          deleted_at   INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_announcement_visible
          ON announcement(status, publish_at, expire_at, is_pinned);

        CREATE TABLE IF NOT EXISTS announcement_read (
          announcement_id TEXT    NOT NULL,
          user_id         TEXT    NOT NULL,
          read_at         INTEGER NOT NULL,
          PRIMARY KEY (announcement_id, user_id)
        );
        CREATE INDEX IF NOT EXISTS idx_announcement_read_user ON announcement_read(user_id);
      `);
    },
  },
  {
    version: 24,
    description: '创建物联设备电路与网络异常维修提醒表',
    up: (db) => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS iot_device_alert (
          id               TEXT    PRIMARY KEY,
          device_id        TEXT    NOT NULL,
          alert_type       TEXT    NOT NULL, -- circuit | network
          severity         TEXT    NOT NULL DEFAULT 'warning', -- warning | critical
          title            TEXT    NOT NULL,
          content          TEXT    NOT NULL,
          status           TEXT    NOT NULL DEFAULT 'pending', -- pending | processing | resolved
          opened_at        INTEGER NOT NULL,
          last_detected_at INTEGER NOT NULL,
          resolved_at      INTEGER
        );
        CREATE INDEX IF NOT EXISTS idx_iot_alert_open
          ON iot_device_alert(status, last_detected_at DESC);
        CREATE INDEX IF NOT EXISTS idx_iot_alert_device
          ON iot_device_alert(device_id, alert_type, status);
      `);
    },
  },
  {
    version: 25,
    description: '维修事项支持人工登记、同步队列与任务提醒关联',
    up: (db) => {
      db.exec(`
        ALTER TABLE iot_device_alert ADD COLUMN source TEXT NOT NULL DEFAULT 'auto';
        ALTER TABLE task_reminder ADD COLUMN maintenance_alert_id TEXT;
        CREATE UNIQUE INDEX IF NOT EXISTS idx_task_reminder_maintenance_alert
          ON task_reminder(maintenance_alert_id)
          WHERE maintenance_alert_id IS NOT NULL;
      `);
    },
  },
  {
    version: 26,
    description: '为物联设备补充唯一业务编号',
    up: (db) => {
      db.exec(`
        ALTER TABLE iot_device ADD COLUMN device_no TEXT;
        UPDATE iot_device SET device_no = 'DEV-' || printf('%04d', rowid) WHERE device_no IS NULL;
        CREATE UNIQUE INDEX IF NOT EXISTS idx_iot_device_device_no ON iot_device(device_no);
      `);
    },
  },
  {
    version: 27,
    description: '创建交接班、事件、探视、家属沟通、库存、文书与健康预警闭环表',
    up: (db) => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS care_handover (
          id TEXT PRIMARY KEY, handover_date TEXT NOT NULL, shift TEXT NOT NULL,
          outgoing_staff TEXT NOT NULL, incoming_staff TEXT, resident_summary TEXT,
          abnormal_summary TEXT, pending_items TEXT, status TEXT NOT NULL DEFAULT 'pending',
          acknowledged_at INTEGER, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_care_handover_date ON care_handover(handover_date DESC, shift);

        CREATE TABLE IF NOT EXISTS care_incident (
          id TEXT PRIMARY KEY, elderly_id TEXT, incident_type TEXT NOT NULL, severity TEXT NOT NULL,
          occurred_at TEXT NOT NULL, location TEXT, description TEXT NOT NULL, immediate_action TEXT,
          responsible TEXT, family_notified_at INTEGER, status TEXT NOT NULL DEFAULT 'reported',
          close_note TEXT, closed_at INTEGER, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_care_incident_status ON care_incident(status, occurred_at DESC);
        CREATE INDEX IF NOT EXISTS idx_care_incident_elderly ON care_incident(elderly_id, occurred_at DESC);

        CREATE TABLE IF NOT EXISTS visitor_record (
          id TEXT PRIMARY KEY, elderly_id TEXT NOT NULL, visitor_name TEXT NOT NULL, relation TEXT,
          phone TEXT, visit_at TEXT NOT NULL, leave_at TEXT, purpose TEXT,
          status TEXT NOT NULL DEFAULT 'scheduled', approved_by TEXT, remark TEXT,
          created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_visitor_record_date ON visitor_record(visit_at DESC, status);

        CREATE TABLE IF NOT EXISTS family_communication (
          id TEXT PRIMARY KEY, elderly_id TEXT NOT NULL, contact_name TEXT NOT NULL, channel TEXT NOT NULL,
          communicated_at TEXT NOT NULL, content TEXT NOT NULL, follow_up TEXT, communicator TEXT,
          status TEXT NOT NULL DEFAULT 'open', closed_at INTEGER, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_family_communication_elderly ON family_communication(elderly_id, communicated_at DESC);
        CREATE INDEX IF NOT EXISTS idx_family_communication_status ON family_communication(status, communicated_at DESC);

        CREATE TABLE IF NOT EXISTS inventory_item (
          id TEXT PRIMARY KEY, category TEXT NOT NULL, name TEXT NOT NULL, specification TEXT, unit TEXT NOT NULL,
          quantity REAL NOT NULL DEFAULT 0, min_quantity REAL NOT NULL DEFAULT 0, expiry_date TEXT,
          supplier TEXT, status TEXT NOT NULL DEFAULT 'active', remark TEXT,
          created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_inventory_item_category ON inventory_item(category, status);
        CREATE INDEX IF NOT EXISTS idx_inventory_item_expiry ON inventory_item(expiry_date);
        CREATE TABLE IF NOT EXISTS inventory_transaction (
          id TEXT PRIMARY KEY, item_id TEXT NOT NULL, transaction_type TEXT NOT NULL, quantity REAL NOT NULL,
          occurred_at TEXT NOT NULL, operator TEXT, reference_no TEXT, remark TEXT, created_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_inventory_transaction_item ON inventory_transaction(item_id, occurred_at DESC);

        CREATE TABLE IF NOT EXISTS elderly_document (
          id TEXT PRIMARY KEY, elderly_id TEXT NOT NULL, document_type TEXT NOT NULL, document_name TEXT NOT NULL,
          file_path TEXT, signed_at TEXT, expiry_date TEXT, status TEXT NOT NULL DEFAULT 'valid',
          custodian TEXT, remark TEXT, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_elderly_document_elderly ON elderly_document(elderly_id, expiry_date);
        CREATE INDEX IF NOT EXISTS idx_elderly_document_status ON elderly_document(status, expiry_date);

        CREATE TABLE IF NOT EXISTS health_alert (
          id TEXT PRIMARY KEY, elderly_id TEXT NOT NULL, vital_id TEXT, alert_type TEXT NOT NULL,
          severity TEXT NOT NULL, content TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open',
          opened_at INTEGER NOT NULL, resolved_at INTEGER, resolver TEXT, resolution TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_health_alert_status ON health_alert(status, opened_at DESC);
        CREATE INDEX IF NOT EXISTS idx_health_alert_elderly ON health_alert(elderly_id, opened_at DESC);

        CREATE TABLE IF NOT EXISTS operations_audit_log (
          id TEXT PRIMARY KEY, domain TEXT NOT NULL, record_id TEXT NOT NULL, action TEXT NOT NULL,
          detail TEXT, created_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_operations_audit_record ON operations_audit_log(domain, record_id, created_at DESC);

        UPDATE sys_permission_group
        SET menu_keys = json_insert(menu_keys, '$[#]', 'operations')
        WHERE code IN ('nurse', 'front_desk', 'logistics') AND instr(menu_keys, '"operations"') = 0;
      `);
    },
  },
  {
    version: 28,
    description: '为同步服务配置访问令牌',
    up: (db) => {
      db.exec(`ALTER TABLE sync_config ADD COLUMN access_token TEXT;`);
    },
  },
  {
    version: 29,
    description: '为同步服务保存服务端变更游标',
    up: (db) => {
      db.exec(`ALTER TABLE sync_config ADD COLUMN last_sync_cursor INTEGER;`);
    },
  },
  {
    version: 30,
    description: '为考勤班次增加默认工作时间规则',
    up: (db) => {
      db.exec(`ALTER TABLE sys_shift ADD COLUMN is_default INTEGER NOT NULL DEFAULT 0;`);

      const activeCount = db
        .prepare<[], { count: number }>(
          `SELECT COUNT(*) AS count FROM sys_shift WHERE deleted_at IS NULL`,
        )
        .get()?.count ?? 0;

      if (activeCount === 0) {
        const now = Date.now();
        db.prepare(
          `INSERT INTO sys_shift
             (id,name,start_time,end_time,is_default,remark,created_at,updated_at,deleted_at)
           VALUES (?,?,?,?,1,?,?,?,NULL)`,
        ).run(
          nanoid(),
          '标准班',
          '09:30',
          '17:30',
          '未安排个人排班时使用',
          now,
          now,
        );
      } else {
        db.exec(`
          UPDATE sys_shift
          SET is_default = 1
          WHERE id = (
            SELECT id FROM sys_shift
            WHERE deleted_at IS NULL
            ORDER BY start_time, created_at
            LIMIT 1
          );
        `);
      }

      db.exec(`
        CREATE UNIQUE INDEX idx_shift_single_default
        ON sys_shift(is_default)
        WHERE is_default = 1 AND deleted_at IS NULL;
      `);
    },
  },
  {
    version: 31,
    description: '创建采购管理表（供应商/采购单/采购明细）',
    up: (db) => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS supplier (
          id           TEXT    PRIMARY KEY,
          name         TEXT    NOT NULL,
          contact      TEXT,
          phone        TEXT,
          address      TEXT,
          category     TEXT    NOT NULL DEFAULT 'other',
          tax_no       TEXT,
          bank_account TEXT,
          bank_name    TEXT,
          status       TEXT    NOT NULL DEFAULT 'active',
          remark       TEXT,
          created_at   INTEGER NOT NULL,
          updated_at   INTEGER NOT NULL,
          deleted_at   INTEGER
        );
        CREATE TABLE IF NOT EXISTS purchase_order (
          id             TEXT    PRIMARY KEY,
          order_no       TEXT    NOT NULL UNIQUE,
          supplier_id    TEXT,
          supplier_name  TEXT,
          order_date     TEXT    NOT NULL,
          expect_date    TEXT,
          total_amount   REAL    NOT NULL DEFAULT 0,
          paid_amount    REAL    NOT NULL DEFAULT 0,
          status         TEXT    NOT NULL DEFAULT 'draft',
          applicant      TEXT,
          approver       TEXT,
          approved_at    INTEGER,
          received_at    INTEGER,
          remark         TEXT,
          created_at     INTEGER NOT NULL,
          updated_at     INTEGER NOT NULL,
          deleted_at     INTEGER
        );
        CREATE TABLE IF NOT EXISTS purchase_order_item (
          id            TEXT    PRIMARY KEY,
          order_id      TEXT    NOT NULL,
          item_name     TEXT    NOT NULL,
          category      TEXT    NOT NULL DEFAULT 'other',
          specification TEXT,
          unit          TEXT    NOT NULL DEFAULT '件',
          quantity      REAL    NOT NULL,
          unit_price    REAL    NOT NULL DEFAULT 0,
          amount        REAL    NOT NULL DEFAULT 0,
          received_qty  REAL    NOT NULL DEFAULT 0,
          remark        TEXT,
          created_at    INTEGER NOT NULL,
          updated_at    INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_purchase_order_status   ON purchase_order(status);
        CREATE INDEX IF NOT EXISTS idx_purchase_order_supplier ON purchase_order(supplier_id);
        CREATE INDEX IF NOT EXISTS idx_purchase_item_order     ON purchase_order_item(order_id);
      `);
    },
  },
  {
    version: 32,
    description: '为全部角色与权限组开放消息中心菜单',
    up: (db) => {
      const addChatMenu = (table: 'sys_role' | 'sys_permission_group'): void => {
        const rows = db.prepare(`SELECT id, menu_keys FROM ${table}`).all() as Array<{
          id: string;
          menu_keys: string;
        }>;
        const update = db.prepare(`UPDATE ${table} SET menu_keys = ?, updated_at = ? WHERE id = ?`);
        for (const row of rows) {
          let menuKeys: string[] = [];
          try {
            menuKeys = JSON.parse(row.menu_keys) as string[];
          } catch {
            menuKeys = [];
          }
          if (menuKeys.includes('*') || menuKeys.includes('chat')) continue;
          update.run(JSON.stringify([...menuKeys, 'chat']), Date.now(), row.id);
        }
      };
      addChatMenu('sys_role');
      addChatMenu('sys_permission_group');
    },
  },
  {
    version: 33,
    description: '创建本地聊天会话、成员、消息与会话令牌表',
    up: (db) => {
      db.exec(`
        CREATE TABLE chat_conversation (
          id                   INTEGER PRIMARY KEY AUTOINCREMENT,
          type                 TEXT    NOT NULL CHECK (type IN ('D', 'G')),
          direct_key           TEXT    UNIQUE,
          name                 TEXT,
          owner_user_id        TEXT,
          last_message_id      INTEGER,
          last_message_preview TEXT    NOT NULL DEFAULT '',
          last_message_at      INTEGER,
          status               TEXT    NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
          created_at           INTEGER NOT NULL,
          updated_at           INTEGER NOT NULL,
          FOREIGN KEY (owner_user_id) REFERENCES sys_user(id) ON UPDATE CASCADE ON DELETE RESTRICT,
          CHECK ((type = 'D' AND direct_key IS NOT NULL) OR (type = 'G' AND name IS NOT NULL))
        );

        CREATE TABLE chat_conversation_member (
          conversation_id     INTEGER NOT NULL,
          user_id             TEXT    NOT NULL,
          role                TEXT    NOT NULL DEFAULT 'M' CHECK (role IN ('O', 'A', 'M')),
          joined_at           INTEGER NOT NULL,
          left_at             INTEGER,
          last_read_message_id INTEGER NOT NULL DEFAULT 0,
          last_read_at        INTEGER,
          PRIMARY KEY (conversation_id, user_id),
          FOREIGN KEY (conversation_id) REFERENCES chat_conversation(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES sys_user(id) ON UPDATE CASCADE ON DELETE RESTRICT
        );

        CREATE TABLE chat_message (
          id                INTEGER PRIMARY KEY AUTOINCREMENT,
          conversation_id   INTEGER NOT NULL,
          sender_user_id    TEXT    NOT NULL,
          client_message_id TEXT    NOT NULL,
          message_type      TEXT    NOT NULL DEFAULT 'text' CHECK (message_type = 'text'),
          content           TEXT    NOT NULL,
          created_at        INTEGER NOT NULL,
          deleted_at        INTEGER,
          FOREIGN KEY (conversation_id) REFERENCES chat_conversation(id) ON DELETE CASCADE,
          FOREIGN KEY (sender_user_id) REFERENCES sys_user(id) ON UPDATE CASCADE ON DELETE RESTRICT,
          UNIQUE (sender_user_id, client_message_id)
        );

        CREATE TABLE chat_session_token (
          token_hash   TEXT    PRIMARY KEY,
          user_id      TEXT    NOT NULL,
          expires_at   INTEGER NOT NULL,
          created_at   INTEGER NOT NULL,
          last_used_at INTEGER NOT NULL,
          FOREIGN KEY (user_id) REFERENCES sys_user(id) ON UPDATE CASCADE ON DELETE CASCADE
        );

        CREATE INDEX idx_chat_conversation_last
          ON chat_conversation(last_message_at DESC, id DESC);
        CREATE INDEX idx_chat_member_user
          ON chat_conversation_member(user_id, left_at, conversation_id);
        CREATE INDEX idx_chat_message_cursor
          ON chat_message(conversation_id, id);
        CREATE INDEX idx_chat_token_user
          ON chat_session_token(user_id, expires_at);
        CREATE INDEX idx_chat_token_expiry
          ON chat_session_token(expires_at);
      `);
    },
  },
];

/**
 * 运行所有待执行的迁移
 * 使用事务保证每个迁移的原子性
 */
export function runMigrations(db: Database): void {
  // 确保迁移记录表存在
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      version     INTEGER PRIMARY KEY,
      description TEXT    NOT NULL,
      applied_at  INTEGER NOT NULL
    );
  `);

  const getApplied = db.prepare<[], { version: number }>(
    `SELECT version FROM _migrations ORDER BY version`,
  );
  const insertRecord = db.prepare(
    `INSERT INTO _migrations (version, description, applied_at) VALUES (?, ?, ?)`,
  );

  const appliedVersions = new Set(getApplied.all().map((r) => r.version));

  for (const migration of migrations) {
    if (appliedVersions.has(migration.version)) continue;

    const transaction = db.transaction(() => {
      migration.up(db);
      insertRecord.run(migration.version, migration.description, Date.now());
    });

    transaction();
    console.info(
      `[DB Migration] v${migration.version}: ${migration.description}`,
    );
  }
}
