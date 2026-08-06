"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const log = require("electron-log");
const electronUpdater = require("electron-updater");
const Database = require("better-sqlite3");
const nanoid$1 = require("nanoid");
const crypto = require("crypto");
const fs = require("fs");
const axios = require("axios");
const cron = require("node-cron");
const node_crypto = require("node:crypto");
const promises = require("node:fs/promises");
const node_path = require("node:path");
const http = require("http");
const os = require("os");
const ITERATIONS = 1e5;
const KEY_LENGTH = 64;
const DIGEST = "sha512";
function hashPassword(plain) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(plain, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
  return { salt, hash };
}
function verifyPassword(plain, salt, expectedHash) {
  const actual = crypto.pbkdf2Sync(plain, salt, ITERATIONS, KEY_LENGTH, DIGEST);
  const expected = Buffer.from(expectedHash, "hex");
  if (actual.length !== expected.length) return false;
  return crypto.timingSafeEqual(actual, expected);
}
const migrations = [
  {
    version: 1,
    description: "初始化基础表结构",
    up: (db2) => {
      db2.exec(`
        CREATE TABLE IF NOT EXISTS _migrations (
          version     INTEGER PRIMARY KEY,
          description TEXT    NOT NULL,
          applied_at  INTEGER NOT NULL
        );
      `);
    }
  },
  {
    version: 2,
    description: "创建变更日志、同步配置、同步历史表",
    up: (db2) => {
      db2.exec(`
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
    }
  },
  {
    version: 3,
    description: "创建老人信息表",
    up: (db2) => {
      db2.exec(`
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
    }
  },
  {
    version: 4,
    description: "创建床位管理表（楼栋/楼层/房间/床位）",
    up: (db2) => {
      db2.exec(`
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
    }
  },
  {
    version: 5,
    description: "创建家属/紧急联系人表",
    up: (db2) => {
      db2.exec(`
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
    }
  },
  {
    version: 6,
    description: "扩展老人信息表（民族/婚姻/学历/医保/备注）",
    up: (db2) => {
      db2.exec(`
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
    }
  },
  {
    version: 7,
    description: "创建老人健康档案表（慢性病/过敏/手术史）",
    up: (db2) => {
      db2.exec(`
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
    }
  },
  {
    version: 8,
    description: "创建入住/暂离/离院记录表",
    up: (db2) => {
      db2.exec(`
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
    }
  },
  {
    version: 9,
    description: "创建护理评估与护理计划表",
    up: (db2) => {
      db2.exec(`
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
    }
  },
  {
    version: 10,
    description: "创建生命体征与用药管理表",
    up: (db2) => {
      db2.exec(`
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
    }
  },
  {
    version: 11,
    description: "创建费用管理表（项目/押金/账单/收款）",
    up: (db2) => {
      db2.exec(`
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
    }
  },
  {
    version: 12,
    description: "创建餐饮管理表（菜单/用餐记录）",
    up: (db2) => {
      db2.exec(`
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
    }
  },
  {
    version: 13,
    description: "创建活动管理表",
    up: (db2) => {
      db2.exec(`
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
    }
  },
  {
    version: 14,
    description: "创建合同管理表",
    up: (db2) => {
      db2.exec(`
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
    }
  },
  {
    version: 15,
    description: "创建系统通知表",
    up: (db2) => {
      db2.exec(`
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
    }
  },
  {
    version: 16,
    description: "创建局域网主机配置表",
    up: (db2) => {
      db2.exec(`
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
    }
  },
  {
    version: 17,
    description: "创建用户/角色/权限/考勤（打卡+排班+请假）相关表，并写入初始角色与管理员账号",
    up: (db2) => {
      db2.exec(`
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
      const { salt, hash } = hashPassword("admin123");
      const now = Date.now();
      db2.prepare(
        `INSERT OR IGNORE INTO sys_user
           (id, username, password_hash, password_salt, real_name, role_id, status, must_change_pw, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        "user-admin",
        "admin",
        hash,
        salt,
        "系统管理员",
        "role-admin",
        "active",
        1,
        now,
        now
      );
    }
  },
  {
    version: 18,
    description: "用户扩展职位/部门字段；排班表扩展任务分配字段；新增物联网设备与体检预约/结果表",
    up: (db2) => {
      db2.exec(`
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
    }
  },
  {
    version: 19,
    description: "创建权限组表（角色管理页可一键套用的预设权限集合），并写入内置预设权限组",
    up: (db2) => {
      db2.exec(`
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
      const now = Date.now();
      const insert = db2.prepare(
        `INSERT OR IGNORE INTO sys_permission_group (id, name, code, menu_keys, button_keys, remark, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      );
      insert.run(
        "pg-front-desk",
        "前台收费",
        "front_desk",
        JSON.stringify([
          "elderly",
          "bed",
          "admission",
          "contract",
          "fee",
          "report",
          "clock",
          "leave"
        ]),
        "[]",
        "入住、费用、合同相关权限",
        now,
        now
      );
      insert.run(
        "pg-nurse",
        "护理人员",
        "nurse",
        JSON.stringify([
          "elderly",
          "care",
          "health",
          "meal",
          "nutrition",
          "activity",
          "exam",
          "clock",
          "schedule",
          "leave"
        ]),
        "[]",
        "护理、健康、活动、餐饮、体检相关权限",
        now,
        now
      );
      insert.run(
        "pg-logistics",
        "后勤餐饮",
        "logistics",
        JSON.stringify(["meal", "nutrition", "activity", "clock", "leave"]),
        "[]",
        "餐饮、活动相关权限",
        now,
        now
      );
      insert.run(
        "pg-attendance",
        "考勤专员",
        "attendance",
        JSON.stringify(["clock", "schedule", "leave", "attendance-report"]),
        "[]",
        "排班、打卡、请假审批相关权限",
        now,
        now
      );
    }
  },
  {
    version: 20,
    description: "创建任务提醒表（闹钟式提醒，支持重复规则与上级任务分配，接入 change_log 同步）",
    up: (db2) => {
      db2.exec(`
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
    }
  },
  {
    version: 21,
    description: "task_reminder 新增 schedule_id 关联字段（排班内联提醒与排班记录关联）",
    up: (db2) => {
      db2.exec(`
        ALTER TABLE task_reminder ADD COLUMN schedule_id TEXT;
        CREATE INDEX IF NOT EXISTS idx_task_reminder_schedule ON task_reminder(schedule_id);
      `);
    }
  },
  {
    version: 22,
    description: "创建个性化营养搭配方案表",
    up: (db2) => {
      db2.exec(`
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
    }
  },
  {
    version: 23,
    description: "创建全员公告与公告阅读记录表",
    up: (db2) => {
      db2.exec(`
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
    }
  },
  {
    version: 24,
    description: "创建物联设备电路与网络异常维修提醒表",
    up: (db2) => {
      db2.exec(`
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
    }
  },
  {
    version: 25,
    description: "维修事项支持人工登记、同步队列与任务提醒关联",
    up: (db2) => {
      db2.exec(`
        ALTER TABLE iot_device_alert ADD COLUMN source TEXT NOT NULL DEFAULT 'auto';
        ALTER TABLE task_reminder ADD COLUMN maintenance_alert_id TEXT;
        CREATE UNIQUE INDEX IF NOT EXISTS idx_task_reminder_maintenance_alert
          ON task_reminder(maintenance_alert_id)
          WHERE maintenance_alert_id IS NOT NULL;
      `);
    }
  },
  {
    version: 26,
    description: "为物联设备补充唯一业务编号",
    up: (db2) => {
      db2.exec(`
        ALTER TABLE iot_device ADD COLUMN device_no TEXT;
        UPDATE iot_device SET device_no = 'DEV-' || printf('%04d', rowid) WHERE device_no IS NULL;
        CREATE UNIQUE INDEX IF NOT EXISTS idx_iot_device_device_no ON iot_device(device_no);
      `);
    }
  },
  {
    version: 27,
    description: "创建交接班、事件、探视、家属沟通、库存、文书与健康预警闭环表",
    up: (db2) => {
      db2.exec(`
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
    }
  },
  {
    version: 28,
    description: "为同步服务配置访问令牌",
    up: (db2) => {
      db2.exec(`ALTER TABLE sync_config ADD COLUMN access_token TEXT;`);
    }
  },
  {
    version: 29,
    description: "为同步服务保存服务端变更游标",
    up: (db2) => {
      db2.exec(`ALTER TABLE sync_config ADD COLUMN last_sync_cursor INTEGER;`);
    }
  },
  {
    version: 30,
    description: "为考勤班次增加默认工作时间规则",
    up: (db2) => {
      db2.exec(`ALTER TABLE sys_shift ADD COLUMN is_default INTEGER NOT NULL DEFAULT 0;`);
      const activeCount = db2.prepare(
        `SELECT COUNT(*) AS count FROM sys_shift WHERE deleted_at IS NULL`
      ).get()?.count ?? 0;
      if (activeCount === 0) {
        const now = Date.now();
        db2.prepare(
          `INSERT INTO sys_shift
             (id,name,start_time,end_time,is_default,remark,created_at,updated_at,deleted_at)
           VALUES (?,?,?,?,1,?,?,?,NULL)`
        ).run(
          nanoid$1.nanoid(),
          "标准班",
          "09:30",
          "17:30",
          "未安排个人排班时使用",
          now,
          now
        );
      } else {
        db2.exec(`
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
      db2.exec(`
        CREATE UNIQUE INDEX idx_shift_single_default
        ON sys_shift(is_default)
        WHERE is_default = 1 AND deleted_at IS NULL;
      `);
    }
  },
  {
    version: 31,
    description: "创建采购管理表（供应商/采购单/采购明细）",
    up: (db2) => {
      db2.exec(`
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
    }
  },
  {
    version: 32,
    description: "为全部角色与权限组开放消息中心菜单",
    up: (db2) => {
      const addChatMenu = (table) => {
        const rows = db2.prepare(`SELECT id, menu_keys FROM ${table}`).all();
        const update = db2.prepare(`UPDATE ${table} SET menu_keys = ?, updated_at = ? WHERE id = ?`);
        for (const row of rows) {
          let menuKeys = [];
          try {
            menuKeys = JSON.parse(row.menu_keys);
          } catch {
            menuKeys = [];
          }
          if (menuKeys.includes("*") || menuKeys.includes("chat")) continue;
          update.run(JSON.stringify([...menuKeys, "chat"]), Date.now(), row.id);
        }
      };
      addChatMenu("sys_role");
      addChatMenu("sys_permission_group");
    }
  },
  {
    version: 33,
    description: "创建本地聊天会话、成员、消息与会话令牌表",
    up: (db2) => {
      db2.exec(`
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
    }
  }
];
function runMigrations(db2) {
  db2.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      version     INTEGER PRIMARY KEY,
      description TEXT    NOT NULL,
      applied_at  INTEGER NOT NULL
    );
  `);
  const getApplied = db2.prepare(
    `SELECT version FROM _migrations ORDER BY version`
  );
  const insertRecord = db2.prepare(
    `INSERT INTO _migrations (version, description, applied_at) VALUES (?, ?, ?)`
  );
  const appliedVersions = new Set(getApplied.all().map((r) => r.version));
  for (const migration of migrations) {
    if (appliedVersions.has(migration.version)) continue;
    const transaction = db2.transaction(() => {
      migration.up(db2);
      insertRecord.run(migration.version, migration.description, Date.now());
    });
    transaction();
    console.info(
      `[DB Migration] v${migration.version}: ${migration.description}`
    );
  }
}
class ChangeLogRepo {
  constructor(db2) {
    this.db = db2;
  }
  db;
  /**
   * 记录一条变更（INSERT / UPDATE / DELETE）
   * 由业务层在数据写操作后调用，或通过触发器自动插入
   */
  insert(params) {
    const id = nanoid$1.nanoid();
    this.db.prepare(
      `INSERT INTO change_log (id, table_name, record_id, operation, payload, created_at, synced)
         VALUES (?, ?, ?, ?, ?, ?, 0)`
    ).run(id, params.table_name, params.record_id, params.operation, params.payload, Date.now());
    return id;
  }
  /**
   * 查询所有未同步的变更（按创建时间升序，限制条数）
   * @param limit 最多拉取条数，默认 500
   */
  getUnsynced(limit = 500) {
    return this.db.prepare(
      `SELECT * FROM change_log WHERE synced=0 ORDER BY created_at ASC LIMIT ?`
    ).all(limit);
  }
  /** 批量标记为已同步 */
  markSynced(ids) {
    if (ids.length === 0) return;
    const now = Date.now();
    const placeholders = ids.map(() => "?").join(",");
    this.db.prepare(
      `UPDATE change_log SET synced=1, synced_at=? WHERE id IN (${placeholders})`
    ).run(now, ...ids);
  }
  /** 查询未同步条数 */
  countUnsynced() {
    const row = this.db.prepare(`SELECT COUNT(*) as cnt FROM change_log WHERE synced=0`).get();
    return row?.cnt ?? 0;
  }
  /** 清理已同步的历史变更（保留最近 N ms 内的记录，默认保留 7 天） */
  cleanup(retainMs = 7 * 24 * 60 * 60 * 1e3) {
    const before = Date.now() - retainMs;
    const result = this.db.prepare(`DELETE FROM change_log WHERE synced=1 AND synced_at < ?`).run(before);
    return result.changes;
  }
}
class SyncConfigRepo {
  constructor(db2) {
    this.db = db2;
  }
  db;
  get() {
    const row = this.db.prepare(`SELECT * FROM sync_config WHERE id=1`).get();
    if (!row) throw new Error("sync_config 初始数据缺失，请检查迁移脚本");
    return row;
  }
  /** 将 SyncConfig（业务层类型）映射并持久化 */
  save(cfg) {
    this.db.prepare(
      `UPDATE sync_config SET
          enabled=?,
          trigger=?,
          interval_ms=?,
          cron_expression=?,
          fixed_times=?,
          server_url=?,
          access_token=?,
          direction=?
         WHERE id=1`
    ).run(
      cfg.enabled ? 1 : 0,
      cfg.trigger,
      cfg.intervalMs,
      cfg.cronExpression ?? null,
      cfg.fixedTimes ? JSON.stringify(cfg.fixedTimes) : null,
      cfg.serverUrl,
      cfg.accessToken?.trim() || null,
      cfg.direction
    );
  }
  updateLastSync(status, message, syncedAt = Date.now(), syncCursor) {
    this.db.prepare(
      `UPDATE sync_config SET last_sync_at=?, last_sync_cursor=COALESCE(?, last_sync_cursor), last_sync_status=?, last_sync_message=? WHERE id=1`
    ).run(syncedAt, syncCursor ?? null, status, message ?? null);
  }
  /** 将数据库行转为业务层类型 */
  toSyncConfig(row) {
    return {
      enabled: row.enabled === 1,
      trigger: row.trigger,
      intervalMs: row.interval_ms,
      cronExpression: row.cron_expression ?? void 0,
      fixedTimes: row.fixed_times ? JSON.parse(row.fixed_times) : void 0,
      serverUrl: row.server_url,
      accessToken: row.access_token ?? void 0,
      direction: row.direction,
      lastSyncAt: row.last_sync_at ?? void 0,
      lastSyncCursor: row.last_sync_cursor ?? void 0
    };
  }
}
class ElderlyRepo {
  constructor(db2) {
    this.db = db2;
    this.changeLog = new ChangeLogRepo(db2);
  }
  db;
  changeLog;
  findAll(includeDeleted = false) {
    const sql = includeDeleted ? `SELECT * FROM elderly ORDER BY created_at DESC` : `SELECT * FROM elderly WHERE deleted_at IS NULL ORDER BY created_at DESC`;
    return this.db.prepare(sql).all();
  }
  findById(id) {
    return this.db.prepare(`SELECT * FROM elderly WHERE id=?`).get(id) ?? null;
  }
  insert(data) {
    const now = Date.now();
    const id = nanoid$1.nanoid();
    const row = {
      ...data,
      id,
      created_at: now,
      updated_at: now,
      deleted_at: null
    };
    this.db.prepare(
      `INSERT INTO elderly (id,name,gender,birth_date,id_card,phone,address,room_no,status,created_at,updated_at,deleted_at)
         VALUES (@id,@name,@gender,@birth_date,@id_card,@phone,@address,@room_no,@status,@created_at,@updated_at,@deleted_at)`
    ).run(row);
    this.changeLog.insert({
      table_name: "elderly",
      record_id: id,
      operation: "INSERT",
      payload: JSON.stringify(row)
    });
    return row;
  }
  update(id, data) {
    const now = Date.now();
    const fields = Object.keys(data).filter((k) => k !== "updated_at");
    if (fields.length === 0) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    this.db.prepare(`UPDATE elderly SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id });
    this.changeLog.insert({
      table_name: "elderly",
      record_id: id,
      operation: "UPDATE",
      payload: JSON.stringify({ id, ...data, updated_at: now })
    });
  }
  /** 软删除 */
  softDelete(id) {
    const now = Date.now();
    this.db.prepare(`UPDATE elderly SET deleted_at=?, updated_at=? WHERE id=?`).run(now, now, id);
    this.changeLog.insert({
      table_name: "elderly",
      record_id: id,
      operation: "DELETE",
      payload: JSON.stringify({ id, deleted_at: now })
    });
  }
}
class BuildingRepo {
  constructor(db2) {
    this.db = db2;
  }
  db;
  // ─── 楼栋 ─────────────────────────────────────────────────
  findAllBuildings() {
    return this.db.prepare(`SELECT * FROM building WHERE deleted_at IS NULL ORDER BY sort_order, name`).all();
  }
  findBuildingById(id) {
    return this.db.prepare(`SELECT * FROM building WHERE id=?`).get(id) ?? null;
  }
  insertBuilding(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(`INSERT INTO building (id,name,floors,remark,sort_order,created_at,updated_at,deleted_at)
      VALUES (@id,@name,@floors,@remark,@sort_order,@created_at,@updated_at,@deleted_at)`).run(row);
    return row;
  }
  updateBuilding(id, data) {
    const now = Date.now();
    const fields = Object.keys(data);
    if (!fields.length) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    this.db.prepare(`UPDATE building SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id });
  }
  deleteBuilding(id) {
    this.db.prepare(`UPDATE building SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
  }
  // ─── 房间 ─────────────────────────────────────────────────
  findAllRooms(buildingId) {
    if (buildingId) {
      return this.db.prepare(`SELECT * FROM room WHERE deleted_at IS NULL AND building_id=? ORDER BY floor, room_no`).all(buildingId);
    }
    return this.db.prepare(`SELECT * FROM room WHERE deleted_at IS NULL ORDER BY building_id, floor, room_no`).all();
  }
  findRoomById(id) {
    return this.db.prepare(`SELECT * FROM room WHERE id=?`).get(id) ?? null;
  }
  insertRoom(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(`INSERT INTO room (id,building_id,floor,room_no,room_type,capacity,price,status,remark,created_at,updated_at,deleted_at)
      VALUES (@id,@building_id,@floor,@room_no,@room_type,@capacity,@price,@status,@remark,@created_at,@updated_at,@deleted_at)`).run(row);
    return row;
  }
  updateRoom(id, data) {
    const now = Date.now();
    const fields = Object.keys(data);
    if (!fields.length) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    this.db.prepare(`UPDATE room SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id });
  }
  deleteRoom(id) {
    this.db.prepare(`UPDATE room SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
  }
  // ─── 床位 ─────────────────────────────────────────────────
  findAllBeds(roomId) {
    if (roomId) {
      return this.db.prepare(`SELECT * FROM bed WHERE deleted_at IS NULL AND room_id=? ORDER BY bed_no`).all(roomId);
    }
    return this.db.prepare(`SELECT * FROM bed WHERE deleted_at IS NULL ORDER BY room_id, bed_no`).all();
  }
  findBedById(id) {
    return this.db.prepare(`SELECT * FROM bed WHERE id=?`).get(id) ?? null;
  }
  findAvailableBeds() {
    return this.db.prepare(`SELECT * FROM bed WHERE deleted_at IS NULL AND status='available' ORDER BY room_id, bed_no`).all();
  }
  insertBed(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(`INSERT INTO bed (id,room_id,bed_no,status,elderly_id,remark,created_at,updated_at,deleted_at)
      VALUES (@id,@room_id,@bed_no,@status,@elderly_id,@remark,@created_at,@updated_at,@deleted_at)`).run(row);
    return row;
  }
  updateBed(id, data) {
    const now = Date.now();
    const fields = Object.keys(data);
    if (!fields.length) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    this.db.prepare(`UPDATE bed SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id });
  }
  deleteBed(id) {
    this.db.prepare(`UPDATE bed SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
  }
  /** 床位统计 */
  getBedStats() {
    const row = this.db.prepare(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status='available'   THEN 1 ELSE 0 END) AS available,
        SUM(CASE WHEN status='occupied'    THEN 1 ELSE 0 END) AS occupied,
        SUM(CASE WHEN status='maintenance' THEN 1 ELSE 0 END) AS maintenance
      FROM bed WHERE deleted_at IS NULL
    `).get();
    return row;
  }
}
class FamilyContactRepo {
  constructor(db2) {
    this.db = db2;
  }
  db;
  findByElderly(elderlyId) {
    return this.db.prepare(
      `SELECT * FROM family_contact WHERE elderly_id=? AND deleted_at IS NULL ORDER BY is_guardian DESC, is_emergency DESC, created_at`
    ).all(elderlyId);
  }
  findById(id) {
    return this.db.prepare(`SELECT * FROM family_contact WHERE id=?`).get(id) ?? null;
  }
  insert(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(
      `INSERT INTO family_contact (id,elderly_id,name,relation,phone,phone2,id_card,address,is_emergency,is_guardian,remark,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@name,@relation,@phone,@phone2,@id_card,@address,@is_emergency,@is_guardian,@remark,@created_at,@updated_at,@deleted_at)`
    ).run(row);
    return row;
  }
  update(id, data) {
    const now = Date.now();
    const fields = Object.keys(data);
    if (!fields.length) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    this.db.prepare(`UPDATE family_contact SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id });
  }
  softDelete(id) {
    this.db.prepare(`UPDATE family_contact SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
  }
}
class HealthRepo {
  constructor(db2) {
    this.db = db2;
  }
  db;
  // ─── 健康档案 ──────────────────────────────────────────────
  findProfile(elderlyId) {
    return this.db.prepare(`SELECT * FROM health_profile WHERE elderly_id=?`).get(elderlyId) ?? null;
  }
  upsertProfile(elderlyId, data) {
    const now = Date.now();
    const existing = this.findProfile(elderlyId);
    if (existing) {
      const fields = Object.keys(data);
      if (fields.length) {
        const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
        this.db.prepare(`UPDATE health_profile SET ${sets} WHERE elderly_id=@elderly_id`).run({ ...data, updated_at: now, elderly_id: elderlyId });
      }
      return { ...existing, ...data, updated_at: now };
    }
    const row = { ...data, id: nanoid$1.nanoid(), elderly_id: elderlyId, created_at: now, updated_at: now };
    this.db.prepare(
      `INSERT INTO health_profile (id,elderly_id,blood_type,allergy,chronic_disease,surgery_history,family_history,disability,diet_require,remark,created_at,updated_at)
         VALUES (@id,@elderly_id,@blood_type,@allergy,@chronic_disease,@surgery_history,@family_history,@disability,@diet_require,@remark,@created_at,@updated_at)`
    ).run(row);
    return row;
  }
  // ─── 生命体征 ──────────────────────────────────────────────
  findVitalSigns(elderlyId, limit = 30) {
    return this.db.prepare(
      `SELECT * FROM vital_signs WHERE elderly_id=? AND deleted_at IS NULL ORDER BY record_date DESC, record_time DESC LIMIT ?`
    ).all(elderlyId, limit);
  }
  insertVitalSigns(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(
      `INSERT INTO vital_signs (id,elderly_id,record_date,record_time,temperature,pulse,respiration,systolic_bp,diastolic_bp,blood_sugar,weight,spo2,recorder,remark,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@record_date,@record_time,@temperature,@pulse,@respiration,@systolic_bp,@diastolic_bp,@blood_sugar,@weight,@spo2,@recorder,@remark,@created_at,@updated_at,@deleted_at)`
    ).run(row);
    this.createVitalAlerts(row);
    return row;
  }
  /** 将明显异常的体征写入独立预警队列，后续必须由工作人员处置并关闭。 */
  createVitalAlerts(vital) {
    const alerts = [];
    if (vital.temperature != null && (vital.temperature >= 37.5 || vital.temperature < 35)) {
      alerts.push({ type: "temperature", severity: vital.temperature >= 38.5 || vital.temperature < 35 ? "critical" : "warning", content: `体温异常：${vital.temperature}℃` });
    }
    if (vital.systolic_bp != null && vital.systolic_bp >= 140) {
      alerts.push({ type: "blood_pressure", severity: vital.systolic_bp >= 180 ? "critical" : "warning", content: `收缩压偏高：${vital.systolic_bp} mmHg` });
    }
    if (vital.diastolic_bp != null && vital.diastolic_bp >= 90) {
      alerts.push({ type: "blood_pressure", severity: vital.diastolic_bp >= 110 ? "critical" : "warning", content: `舒张压偏高：${vital.diastolic_bp} mmHg` });
    }
    if (vital.spo2 != null && vital.spo2 < 95) {
      alerts.push({ type: "spo2", severity: vital.spo2 < 90 ? "critical" : "warning", content: `血氧饱和度偏低：${vital.spo2}%` });
    }
    if (vital.blood_sugar != null && (vital.blood_sugar <= 3.9 || vital.blood_sugar >= 11.1)) {
      alerts.push({ type: "blood_sugar", severity: vital.blood_sugar <= 3 || vital.blood_sugar >= 16.7 ? "critical" : "warning", content: `血糖异常：${vital.blood_sugar} mmol/L` });
    }
    if (!alerts.length) return;
    const insert = this.db.prepare(
      `INSERT INTO health_alert (id,elderly_id,vital_id,alert_type,severity,content,status,opened_at,resolved_at,resolver,resolution)
       VALUES (@id,@elderly_id,@vital_id,@alert_type,@severity,@content,'open',@opened_at,NULL,NULL,NULL)`
    );
    const now = Date.now();
    const write = this.db.transaction(() => {
      for (const alert of alerts) {
        insert.run({ id: nanoid$1.nanoid(), elderly_id: vital.elderly_id, vital_id: vital.id, ...alert, opened_at: now });
      }
    });
    write();
  }
  deleteVitalSigns(id) {
    this.db.prepare(`UPDATE vital_signs SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
  }
  // ─── 用药医嘱 ──────────────────────────────────────────────
  findMedOrders(elderlyId, activeOnly = false) {
    const sql = activeOnly ? `SELECT * FROM medication_order WHERE elderly_id=? AND deleted_at IS NULL AND status='active' ORDER BY created_at DESC` : `SELECT * FROM medication_order WHERE elderly_id=? AND deleted_at IS NULL ORDER BY created_at DESC`;
    return this.db.prepare(sql).all(elderlyId);
  }
  insertMedOrder(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(
      `INSERT INTO medication_order (id,elderly_id,drug_name,drug_spec,dosage,frequency,route,start_date,end_date,prescriber,status,remark,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@drug_name,@drug_spec,@dosage,@frequency,@route,@start_date,@end_date,@prescriber,@status,@remark,@created_at,@updated_at,@deleted_at)`
    ).run(row);
    return row;
  }
  updateMedOrder(id, data) {
    const now = Date.now();
    const fields = Object.keys(data);
    if (!fields.length) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    this.db.prepare(`UPDATE medication_order SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id });
  }
  deleteMedOrder(id) {
    this.db.prepare(`UPDATE medication_order SET deleted_at=?, updated_at=?, status='stopped' WHERE id=?`).run(Date.now(), Date.now(), id);
  }
  // ─── 服药记录 ──────────────────────────────────────────────
  // take_date 现在存储为 'YYYY-MM-DD HH:mm:ss'，用 date() 只取日期部分比较
  findMedRecords(elderlyId, date2) {
    if (date2) {
      return this.db.prepare(
        `SELECT * FROM medication_record WHERE elderly_id=? AND date(take_date)=date(?) AND deleted_at IS NULL ORDER BY take_time`
      ).all(elderlyId, date2);
    }
    return this.db.prepare(
      `SELECT * FROM medication_record WHERE elderly_id=? AND deleted_at IS NULL ORDER BY take_date DESC, take_time DESC LIMIT 60`
    ).all(elderlyId);
  }
  insertMedRecord(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(
      `INSERT INTO medication_record (id,elderly_id,order_id,take_date,take_time,shift,status,executor,remark,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@order_id,@take_date,@take_time,@shift,@status,@executor,@remark,@created_at,@updated_at,@deleted_at)`
    ).run(row);
    return row;
  }
  // ─── 就医记录 ──────────────────────────────────────────────
  findMedVisits(elderlyId) {
    return this.db.prepare(
      `SELECT * FROM medical_visit WHERE elderly_id=? AND deleted_at IS NULL ORDER BY visit_date DESC`
    ).all(elderlyId);
  }
  insertMedVisit(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(
      `INSERT INTO medical_visit (id,elderly_id,visit_date,hospital,department,doctor,diagnosis,treatment,cost,escort,remark,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@visit_date,@hospital,@department,@doctor,@diagnosis,@treatment,@cost,@escort,@remark,@created_at,@updated_at,@deleted_at)`
    ).run(row);
    return row;
  }
  deleteMedVisit(id) {
    this.db.prepare(`UPDATE medical_visit SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
  }
  // ─── 体检预约 ──────────────────────────────────────────────
  findExamAppointments(elderlyId) {
    if (elderlyId) {
      return this.db.prepare(
        `SELECT * FROM health_exam_appointment WHERE elderly_id=? AND deleted_at IS NULL ORDER BY exam_date DESC`
      ).all(elderlyId);
    }
    return this.db.prepare(
      `SELECT * FROM health_exam_appointment WHERE deleted_at IS NULL ORDER BY exam_date DESC`
    ).all();
  }
  insertExamAppointment(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), status: "pending", created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(
      `INSERT INTO health_exam_appointment (id,elderly_id,exam_date,institution,exam_items,status,remark,created_by,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@exam_date,@institution,@exam_items,@status,@remark,@created_by,@created_at,@updated_at,@deleted_at)`
    ).run(row);
    return row;
  }
  updateExamAppointment(id, data) {
    const now = Date.now();
    const fields = Object.keys(data);
    if (!fields.length) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    this.db.prepare(`UPDATE health_exam_appointment SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id });
  }
  deleteExamAppointment(id) {
    this.db.prepare(`UPDATE health_exam_appointment SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
  }
  // ─── 体检结果 ──────────────────────────────────────────────
  findExamResults(elderlyId) {
    if (elderlyId) {
      return this.db.prepare(
        `SELECT * FROM health_exam_result WHERE elderly_id=? AND deleted_at IS NULL ORDER BY exam_date DESC`
      ).all(elderlyId);
    }
    return this.db.prepare(
      `SELECT * FROM health_exam_result WHERE deleted_at IS NULL ORDER BY exam_date DESC`
    ).all();
  }
  insertExamResult(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    if (row.appointment_id) {
      const appointment = this.db.prepare(`SELECT * FROM health_exam_appointment WHERE id=? AND deleted_at IS NULL`).get(row.appointment_id);
      if (!appointment || appointment.status !== "pending") throw new Error("该体检预约不可录入结果");
      if (appointment.elderly_id !== row.elderly_id) throw new Error("体检结果与预约老人不一致");
    }
    this.db.prepare(
      `INSERT INTO health_exam_result (id,elderly_id,appointment_id,exam_date,institution,items,conclusion,attachment_path,created_by,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@appointment_id,@exam_date,@institution,@items,@conclusion,@attachment_path,@created_by,@created_at,@updated_at,@deleted_at)`
    ).run(row);
    if (row.appointment_id) {
      this.updateExamAppointment(row.appointment_id, { status: "completed" });
    }
    return row;
  }
  updateExamResult(id, data) {
    const fields = Object.keys(data);
    if (!fields.length) return;
    const now = Date.now();
    const sets = [...fields, "updated_at"].map((field) => `${field}=@${field}`).join(",");
    this.db.prepare(`UPDATE health_exam_result SET ${sets} WHERE id=@id AND deleted_at IS NULL`).run({ ...data, updated_at: now, id });
  }
  deleteExamResult(id) {
    const result = this.db.prepare(`SELECT * FROM health_exam_result WHERE id=? AND deleted_at IS NULL`).get(id);
    if (!result) return;
    const now = Date.now();
    const remove = this.db.transaction(() => {
      this.db.prepare(`UPDATE health_exam_result SET deleted_at=?, updated_at=? WHERE id=?`).run(now, now, id);
      if (result.appointment_id) {
        const remaining = this.db.prepare(
          `SELECT COUNT(*) AS count FROM health_exam_result WHERE appointment_id=? AND deleted_at IS NULL`
        ).get(result.appointment_id);
        if (!remaining?.count) {
          this.db.prepare(`UPDATE health_exam_appointment SET status='pending', updated_at=? WHERE id=? AND status='completed'`).run(now, result.appointment_id);
        }
      }
    });
    remove();
  }
}
class AdmissionRepo {
  constructor(db2) {
    this.db = db2;
  }
  db;
  // ─── 入院记录 ──────────────────────────────────────────────
  findAll() {
    return this.db.prepare(`SELECT * FROM admission WHERE deleted_at IS NULL ORDER BY created_at DESC`).all();
  }
  findByElderly(elderlyId) {
    return this.db.prepare(`SELECT * FROM admission WHERE elderly_id=? AND deleted_at IS NULL ORDER BY created_at DESC`).all(elderlyId);
  }
  findActiveByElderly(elderlyId) {
    return this.db.prepare(`SELECT * FROM admission WHERE elderly_id=? AND status='active' AND deleted_at IS NULL LIMIT 1`).get(elderlyId) ?? null;
  }
  findById(id) {
    return this.db.prepare(`SELECT * FROM admission WHERE id=?`).get(id) ?? null;
  }
  insert(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(
      `INSERT INTO admission (id,elderly_id,bed_id,admission_date,care_level,deposit,monthly_fee,status,remark,created_by,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@bed_id,@admission_date,@care_level,@deposit,@monthly_fee,@status,@remark,@created_by,@created_at,@updated_at,@deleted_at)`
    ).run(row);
    return row;
  }
  update(id, data) {
    const now = Date.now();
    const fields = Object.keys(data);
    if (!fields.length) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    this.db.prepare(`UPDATE admission SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id });
  }
  softDelete(id) {
    this.db.prepare(`UPDATE admission SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
  }
  // ─── 暂离记录 ──────────────────────────────────────────────
  findLeaveByElderly(elderlyId) {
    return this.db.prepare(`SELECT * FROM leave_record WHERE elderly_id=? AND deleted_at IS NULL ORDER BY leave_date DESC`).all(elderlyId);
  }
  findActiveLeave(elderlyId) {
    return this.db.prepare(`SELECT * FROM leave_record WHERE elderly_id=? AND status='out' AND deleted_at IS NULL LIMIT 1`).get(elderlyId) ?? null;
  }
  insertLeave(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(
      `INSERT INTO leave_record (id,elderly_id,leave_date,expect_return,actual_return,reason,contact_phone,status,created_by,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@leave_date,@expect_return,@actual_return,@reason,@contact_phone,@status,@created_by,@created_at,@updated_at,@deleted_at)`
    ).run(row);
    return row;
  }
  updateLeave(id, data) {
    const now = Date.now();
    const fields = Object.keys(data);
    if (!fields.length) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    this.db.prepare(`UPDATE leave_record SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id });
  }
  // ─── 离院记录 ──────────────────────────────────────────────
  findDischargeByElderly(elderlyId) {
    return this.db.prepare(`SELECT * FROM discharge WHERE elderly_id=? AND deleted_at IS NULL ORDER BY discharge_date DESC`).all(elderlyId);
  }
  insertDischarge(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(
      `INSERT INTO discharge (id,elderly_id,admission_id,discharge_date,reason,refund_amount,remark,created_by,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@admission_id,@discharge_date,@reason,@refund_amount,@remark,@created_by,@created_at,@updated_at,@deleted_at)`
    ).run(row);
    return row;
  }
}
class CareRepo {
  constructor(db2) {
    this.db = db2;
  }
  db;
  // ─── 护理评估 ──────────────────────────────────────────────
  findAssessments(elderlyId) {
    return this.db.prepare(
      `SELECT * FROM care_assessment WHERE elderly_id=? AND deleted_at IS NULL ORDER BY assess_date DESC`
    ).all(elderlyId);
  }
  findLatestAssessment(elderlyId) {
    return this.db.prepare(
      `SELECT * FROM care_assessment WHERE elderly_id=? AND deleted_at IS NULL ORDER BY assess_date DESC LIMIT 1`
    ).get(elderlyId) ?? null;
  }
  insertAssessment(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(
      `INSERT INTO care_assessment (id,elderly_id,assess_date,assessor,eating,bathing,grooming,dressing,bowel,bladder,toilet,transfer,mobility,stairs,total_score,care_level,remark,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@assess_date,@assessor,@eating,@bathing,@grooming,@dressing,@bowel,@bladder,@toilet,@transfer,@mobility,@stairs,@total_score,@care_level,@remark,@created_at,@updated_at,@deleted_at)`
    ).run(row);
    return row;
  }
  deleteAssessment(id) {
    this.db.prepare(`UPDATE care_assessment SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
  }
  // ─── 护理计划 ──────────────────────────────────────────────
  findPlans(elderlyId) {
    return this.db.prepare(`SELECT * FROM care_plan WHERE elderly_id=? AND deleted_at IS NULL ORDER BY start_date DESC`).all(elderlyId);
  }
  findActivePlan(elderlyId) {
    return this.db.prepare(
      `SELECT * FROM care_plan WHERE elderly_id=? AND status='active' AND deleted_at IS NULL ORDER BY start_date DESC LIMIT 1`
    ).get(elderlyId) ?? null;
  }
  insertPlan(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(
      `INSERT INTO care_plan (id,elderly_id,care_level,start_date,end_date,status,content,created_by,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@care_level,@start_date,@end_date,@status,@content,@created_by,@created_at,@updated_at,@deleted_at)`
    ).run(row);
    return row;
  }
  updatePlan(id, data) {
    const now = Date.now();
    const fields = Object.keys(data);
    if (!fields.length) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    this.db.prepare(`UPDATE care_plan SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id });
  }
  deletePlan(id) {
    this.db.prepare(`UPDATE care_plan SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
  }
  // ─── 护理记录 ──────────────────────────────────────────────
  // record_date 现在存储为 'YYYY-MM-DD HH:mm:ss'，用 date() 只取日期部分比较，
  // 确保同一天不同时间提交的护理记录仍能按天正确归类查询。
  findRecords(elderlyId, date2) {
    if (date2) {
      return this.db.prepare(
        `SELECT * FROM care_record WHERE elderly_id=? AND date(record_date)=date(?) AND deleted_at IS NULL ORDER BY shift, created_at`
      ).all(elderlyId, date2);
    }
    return this.db.prepare(
      `SELECT * FROM care_record WHERE elderly_id=? AND deleted_at IS NULL ORDER BY record_date DESC, shift LIMIT 60`
    ).all(elderlyId);
  }
  findRecordsByDate(date2) {
    return this.db.prepare(
      `SELECT * FROM care_record WHERE date(record_date)=date(?) AND deleted_at IS NULL ORDER BY elderly_id, shift`
    ).all(date2);
  }
  insertRecord(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(
      `INSERT INTO care_record (id,elderly_id,plan_id,record_date,shift,care_type,content,executor,status,remark,created_at,updated_at,deleted_at)
         VALUES (@id,@elderly_id,@plan_id,@record_date,@shift,@care_type,@content,@executor,@status,@remark,@created_at,@updated_at,@deleted_at)`
    ).run(row);
    return row;
  }
  deleteRecord(id) {
    this.db.prepare(`UPDATE care_record SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
  }
  /** 护理工作量统计 */
  getWorkloadStats(startDate, endDate) {
    return this.db.prepare(
      `SELECT executor, COUNT(*) as count FROM care_record
         WHERE date(record_date) >= date(?) AND date(record_date) <= date(?) AND deleted_at IS NULL AND executor IS NOT NULL
         GROUP BY executor ORDER BY count DESC`
    ).all(startDate, endDate);
  }
}
class FeeRepo {
  constructor(db2) {
    this.db = db2;
  }
  db;
  // ─── 费用项目 ──────────────────────────────────────────────
  findAllFeeItems(activeOnly = false) {
    const sql = activeOnly ? `SELECT * FROM fee_item WHERE deleted_at IS NULL AND status='active' ORDER BY category, name` : `SELECT * FROM fee_item WHERE deleted_at IS NULL ORDER BY category, name`;
    return this.db.prepare(sql).all();
  }
  insertFeeItem(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(`INSERT INTO fee_item (id,name,category,unit_price,unit,is_required,status,remark,created_at,updated_at,deleted_at)
        VALUES (@id,@name,@category,@unit_price,@unit,@is_required,@status,@remark,@created_at,@updated_at,@deleted_at)`).run(row);
    return row;
  }
  updateFeeItem(id, data) {
    const now = Date.now();
    const fields = Object.keys(data);
    if (!fields.length) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    this.db.prepare(`UPDATE fee_item SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id });
  }
  deleteFeeItem(id) {
    this.db.prepare(`UPDATE fee_item SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
  }
  // ─── 押金记录 ──────────────────────────────────────────────
  findDeposits(elderlyId) {
    return this.db.prepare(
      `SELECT * FROM deposit_record WHERE elderly_id=? AND deleted_at IS NULL ORDER BY pay_date DESC`
    ).all(elderlyId);
  }
  getDepositBalance(elderlyId) {
    const row = this.db.prepare(
      `SELECT COALESCE(SUM(CASE WHEN type='deposit' THEN amount ELSE -amount END), 0) AS balance
         FROM deposit_record WHERE elderly_id=? AND deleted_at IS NULL`
    ).get(elderlyId, "deposit", "refund");
    return row?.balance ?? 0;
  }
  insertDeposit(data) {
    if (!Number.isFinite(data.amount) || data.amount <= 0) throw new Error("押金金额必须大于 0");
    if (data.type === "refund" && data.amount > this.getDepositBalance(data.elderly_id) + 1e-6) {
      throw new Error("退款金额不能超过当前押金余额");
    }
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(`INSERT INTO deposit_record (id,elderly_id,amount,type,pay_method,pay_date,operator,remark,created_at,updated_at,deleted_at)
        VALUES (@id,@elderly_id,@amount,@type,@pay_method,@pay_date,@operator,@remark,@created_at,@updated_at,@deleted_at)`).run(row);
    return row;
  }
  // ─── 月度账单 ──────────────────────────────────────────────
  findBills(elderlyId) {
    if (elderlyId) {
      return this.db.prepare(
        `SELECT * FROM monthly_bill WHERE elderly_id=? AND deleted_at IS NULL ORDER BY bill_month DESC`
      ).all(elderlyId);
    }
    return this.db.prepare(`SELECT * FROM monthly_bill WHERE deleted_at IS NULL ORDER BY bill_month DESC, elderly_id`).all();
  }
  findBill(elderlyId, billMonth) {
    return this.db.prepare(
      `SELECT * FROM monthly_bill WHERE elderly_id=? AND bill_month=? AND deleted_at IS NULL`
    ).get(elderlyId, billMonth) ?? null;
  }
  findOverdueBills() {
    return this.db.prepare(
      `SELECT * FROM monthly_bill WHERE deleted_at IS NULL AND status IN ('unpaid','partial') ORDER BY bill_month ASC`
    ).all();
  }
  insertBill(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(`INSERT INTO monthly_bill (id,elderly_id,bill_month,total,paid,status,remark,created_at,updated_at,deleted_at)
        VALUES (@id,@elderly_id,@bill_month,@total,@paid,@status,@remark,@created_at,@updated_at,@deleted_at)`).run(row);
    return row;
  }
  insertBillWithDetails(data, details) {
    if (!details.length) throw new Error("请至少添加一项账单明细");
    const normalizedDetails = details.map((detail) => {
      const quantity = Number(detail.quantity);
      const unitPrice = Number(detail.unit_price);
      if (!detail.item_name.trim() || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(unitPrice) || unitPrice < 0) {
        throw new Error("账单明细填写不完整");
      }
      return { ...detail, quantity, unit_price: unitPrice, amount: Number((quantity * unitPrice).toFixed(2)) };
    });
    const total = Number(normalizedDetails.reduce((sum, detail) => sum + detail.amount, 0).toFixed(2));
    if (!Number.isFinite(total) || total <= 0) throw new Error("账单金额必须大于 0");
    const now = Date.now();
    const bill = {
      ...data,
      id: nanoid$1.nanoid(),
      total,
      paid: 0,
      status: "unpaid",
      created_at: now,
      updated_at: now,
      deleted_at: null
    };
    this.db.transaction(() => {
      this.db.prepare(`INSERT INTO monthly_bill (id,elderly_id,bill_month,total,paid,status,remark,created_at,updated_at,deleted_at)
          VALUES (@id,@elderly_id,@bill_month,@total,@paid,@status,@remark,@created_at,@updated_at,@deleted_at)`).run(bill);
      const insertDetail = this.db.prepare(`INSERT INTO bill_detail (id,bill_id,elderly_id,fee_item_id,item_name,quantity,unit_price,amount,remark,created_at,updated_at)
        VALUES (@id,@bill_id,@elderly_id,@fee_item_id,@item_name,@quantity,@unit_price,@amount,@remark,@created_at,@updated_at)`);
      for (const detail of normalizedDetails) {
        insertDetail.run({
          ...detail,
          id: nanoid$1.nanoid(),
          bill_id: bill.id,
          elderly_id: bill.elderly_id,
          created_at: now,
          updated_at: now
        });
      }
    })();
    return bill;
  }
  updateBill(id, data) {
    const now = Date.now();
    const fields = Object.keys(data);
    if (!fields.length) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    this.db.prepare(`UPDATE monthly_bill SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id });
  }
  // ─── 账单明细 ──────────────────────────────────────────────
  findBillDetails(billId) {
    return this.db.prepare(`SELECT * FROM bill_detail WHERE bill_id=? ORDER BY created_at`).all(billId);
  }
  insertBillDetail(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now };
    this.db.prepare(`INSERT INTO bill_detail (id,bill_id,elderly_id,fee_item_id,item_name,quantity,unit_price,amount,remark,created_at,updated_at)
        VALUES (@id,@bill_id,@elderly_id,@fee_item_id,@item_name,@quantity,@unit_price,@amount,@remark,@created_at,@updated_at)`).run(row);
    return row;
  }
  // ─── 收款记录 ──────────────────────────────────────────────
  findPayments(elderlyId, billId) {
    if (billId) {
      return this.db.prepare(`SELECT * FROM payment_record WHERE bill_id=? AND deleted_at IS NULL ORDER BY pay_date DESC`).all(billId);
    }
    if (elderlyId) {
      return this.db.prepare(
        `SELECT * FROM payment_record WHERE elderly_id=? AND deleted_at IS NULL ORDER BY pay_date DESC`
      ).all(elderlyId);
    }
    return this.db.prepare(`SELECT * FROM payment_record WHERE deleted_at IS NULL ORDER BY pay_date DESC LIMIT 200`).all();
  }
  insertPayment(data) {
    if (!Number.isFinite(data.amount) || data.amount <= 0) throw new Error("收款金额必须大于 0");
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.transaction(() => {
      if (data.bill_id) {
        const bill = this.db.prepare(`SELECT * FROM monthly_bill WHERE id=? AND deleted_at IS NULL`).get(data.bill_id);
        if (!bill) throw new Error("账单不存在或已删除");
        if (bill.elderly_id !== data.elderly_id) throw new Error("收款老人和账单不匹配");
        if (bill.status === "paid" || data.amount > bill.total - bill.paid + 1e-6) throw new Error("收款金额不能超过未收金额");
      }
      this.db.prepare(`INSERT INTO payment_record (id,elderly_id,bill_id,amount,pay_method,pay_date,operator,receipt_no,remark,created_at,updated_at,deleted_at)
          VALUES (@id,@elderly_id,@bill_id,@amount,@pay_method,@pay_date,@operator,@receipt_no,@remark,@created_at,@updated_at,@deleted_at)`).run(row);
      if (data.bill_id) {
        this.db.prepare(`
          UPDATE monthly_bill SET
            paid = (SELECT COALESCE(SUM(amount),0) FROM payment_record WHERE bill_id=? AND deleted_at IS NULL),
            status = CASE
              WHEN (SELECT COALESCE(SUM(amount),0) FROM payment_record WHERE bill_id=? AND deleted_at IS NULL) = 0 THEN 'unpaid'
              WHEN (SELECT COALESCE(SUM(amount),0) FROM payment_record WHERE bill_id=? AND deleted_at IS NULL) >= total THEN 'paid'
              ELSE 'partial'
            END,
            updated_at = ?
          WHERE id=?
        `).run(data.bill_id, data.bill_id, data.bill_id, now, data.bill_id);
      }
    })();
    return row;
  }
  /** 财务汇总统计 */
  getFinancialStats(month) {
    const row = this.db.prepare(
      `SELECT
          COALESCE(SUM(total), 0) AS total_billed,
          COALESCE(SUM(paid), 0) AS total_paid,
          COALESCE(SUM(CASE WHEN status != 'paid' THEN total - paid ELSE 0 END), 0) AS overdue
        FROM monthly_bill WHERE bill_month=? AND deleted_at IS NULL`
    ).get(month);
    return row;
  }
}
class MealRepo {
  constructor(db2) {
    this.db = db2;
  }
  db;
  // ─── 菜单 ──────────────────────────────────────────────────
  // menu_date 现在存储为 'YYYY-MM-DD HH:mm:ss'，用 date() 只取日期部分比较，
  // 确保同一天不同时间录入的菜单仍能按天正确归类查询。
  findMenuByDate(date2) {
    return this.db.prepare(`SELECT * FROM meal_menu WHERE date(menu_date)=date(?) AND deleted_at IS NULL ORDER BY meal_type`).all(date2);
  }
  findMenuByRange(startDate, endDate) {
    return this.db.prepare(
      `SELECT * FROM meal_menu WHERE date(menu_date) >= date(?) AND date(menu_date) <= date(?) AND deleted_at IS NULL ORDER BY menu_date, meal_type`
    ).all(startDate, endDate);
  }
  insertMenu(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(`INSERT INTO meal_menu (id,menu_date,meal_type,dishes,calories,remark,created_by,created_at,updated_at,deleted_at)
        VALUES (@id,@menu_date,@meal_type,@dishes,@calories,@remark,@created_by,@created_at,@updated_at,@deleted_at)`).run(row);
    return row;
  }
  updateMenu(id, data) {
    const now = Date.now();
    const fields = Object.keys(data);
    if (!fields.length) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    this.db.prepare(`UPDATE meal_menu SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id });
  }
  deleteMenu(id) {
    this.db.prepare(`UPDATE meal_menu SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
  }
  // ─── 用餐记录 ──────────────────────────────────────────────
  findMealRecords(elderlyId, limit = 30) {
    return this.db.prepare(
      `SELECT * FROM meal_record WHERE elderly_id=? AND deleted_at IS NULL ORDER BY record_date DESC, meal_type LIMIT ?`
    ).all(elderlyId, limit);
  }
  // record_date 现在存储为 'YYYY-MM-DD HH:mm:ss'，用 date() 只取日期部分比较
  findMealRecordsByDate(date2) {
    return this.db.prepare(
      `SELECT * FROM meal_record WHERE date(record_date)=date(?) AND deleted_at IS NULL ORDER BY meal_type, elderly_id`
    ).all(date2);
  }
  insertMealRecord(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(`INSERT INTO meal_record (id,elderly_id,record_date,meal_type,status,intake_rate,remark,recorder,created_at,updated_at,deleted_at)
        VALUES (@id,@elderly_id,@record_date,@meal_type,@status,@intake_rate,@remark,@recorder,@created_at,@updated_at,@deleted_at)`).run(row);
    return row;
  }
  updateMealRecord(id, data) {
    const now = Date.now();
    const fields = Object.keys(data);
    if (!fields.length) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    this.db.prepare(`UPDATE meal_record SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id });
  }
  deleteMealRecord(id) {
    this.db.prepare(`UPDATE meal_record SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
  }
  // ─── 营养搭配 ────────────────────────────────────────────────
  findNutritionPlans(elderlyId, includeInactive = true) {
    const statusClause = includeInactive ? "" : ` AND status='active'`;
    return this.db.prepare(
      `SELECT * FROM nutrition_plan WHERE elderly_id=? AND deleted_at IS NULL${statusClause} ORDER BY status='active' DESC, effective_date DESC, created_at DESC`
    ).all(elderlyId);
  }
  insertNutritionPlan(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(`INSERT INTO nutrition_plan (id,elderly_id,diet_type,allergies,avoid_foods,daily_calories,protein_target,meal_advice,effective_date,expiry_date,status,remark,created_by,created_at,updated_at,deleted_at)
        VALUES (@id,@elderly_id,@diet_type,@allergies,@avoid_foods,@daily_calories,@protein_target,@meal_advice,@effective_date,@expiry_date,@status,@remark,@created_by,@created_at,@updated_at,@deleted_at)`).run(row);
    return row;
  }
  updateNutritionPlan(id, data) {
    const fields = Object.keys(data);
    if (!fields.length) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    this.db.prepare(`UPDATE nutrition_plan SET ${sets} WHERE id=@id`).run({ ...data, updated_at: Date.now(), id });
  }
  deleteNutritionPlan(id) {
    this.db.prepare(`UPDATE nutrition_plan SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
  }
}
class ActivityRepo {
  constructor(db2) {
    this.db = db2;
  }
  db;
  findAll(status) {
    if (status) {
      return this.db.prepare(`SELECT * FROM activity WHERE deleted_at IS NULL AND status=? ORDER BY activity_date DESC`).all(status);
    }
    return this.db.prepare(`SELECT * FROM activity WHERE deleted_at IS NULL ORDER BY activity_date DESC`).all();
  }
  findById(id) {
    return this.db.prepare(`SELECT * FROM activity WHERE id=?`).get(id) ?? null;
  }
  insert(data) {
    this.validateCapacity(data.max_capacity);
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(`INSERT INTO activity (id,title,category,activity_date,start_time,end_time,location,organizer,max_capacity,description,status,created_by,created_at,updated_at,deleted_at)
        VALUES (@id,@title,@category,@activity_date,@start_time,@end_time,@location,@organizer,@max_capacity,@description,@status,@created_by,@created_at,@updated_at,@deleted_at)`).run(row);
    return row;
  }
  update(id, data) {
    const now = Date.now();
    const fields = Object.keys(data);
    if (!fields.length) return;
    if (data.max_capacity !== void 0) {
      this.validateCapacity(data.max_capacity);
      if (data.max_capacity !== null) {
        const attendanceCount = this.getAttendanceCount(id);
        if (attendanceCount > data.max_capacity) throw new Error("人数上限不能低于当前报名人数");
      }
    }
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    this.db.prepare(`UPDATE activity SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id });
  }
  softDelete(id) {
    this.db.prepare(`UPDATE activity SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
  }
  start(id) {
    this.changeStatus(id, "planned", "ongoing");
  }
  cancel(id) {
    this.changeStatus(id, ["planned", "ongoing"], "cancelled");
  }
  complete(id) {
    const complete = this.db.transaction((activityId) => {
      this.changeStatus(activityId, "ongoing", "completed");
      this.db.prepare(`UPDATE activity_attendance SET status='absent', updated_at=? WHERE activity_id=? AND status='registered'`).run(Date.now(), activityId);
    });
    complete(id);
  }
  changeStatus(id, currentStatus, nextStatus) {
    const acceptedStatuses = Array.isArray(currentStatus) ? currentStatus : [currentStatus];
    const activity = this.findById(id);
    if (!activity || activity.deleted_at) throw new Error("活动不存在或已删除");
    if (!acceptedStatuses.includes(activity.status)) throw new Error("当前活动状态不支持此操作");
    this.update(id, { status: nextStatus });
  }
  validateCapacity(capacity) {
    if (capacity !== null && (!Number.isInteger(capacity) || capacity < 1)) {
      throw new Error("人数上限必须为大于零的整数");
    }
  }
  getAttendanceCount(activityId) {
    return this.db.prepare(`SELECT COUNT(*) AS count FROM activity_attendance WHERE activity_id=?`).get(activityId)?.count ?? 0;
  }
  // ─── 签到 ──────────────────────────────────────────────────
  findAttendance(activityId) {
    return this.db.prepare(`SELECT * FROM activity_attendance WHERE activity_id=? ORDER BY created_at`).all(activityId);
  }
  findElderlyActivities(elderlyId) {
    return this.db.prepare(`SELECT * FROM activity_attendance WHERE elderly_id=? ORDER BY created_at DESC`).all(elderlyId);
  }
  registerAttendance(activityId, elderlyId) {
    const activity = this.findById(activityId);
    if (!activity || activity.deleted_at) throw new Error("活动不存在或已删除");
    if (activity.status !== "planned" && activity.status !== "ongoing") throw new Error("当前活动不可报名");
    const existing = this.db.prepare(`SELECT * FROM activity_attendance WHERE activity_id=? AND elderly_id=?`).get(activityId, elderlyId);
    if (existing) throw new Error("该老人已报名此活动");
    if (activity.max_capacity !== null) {
      const count = this.getAttendanceCount(activityId);
      if (count >= activity.max_capacity) throw new Error("活动报名人数已满");
    }
    const now = Date.now();
    const row = {
      id: nanoid$1.nanoid(),
      activity_id: activityId,
      elderly_id: elderlyId,
      check_in_at: null,
      status: "registered",
      remark: null,
      created_at: now,
      updated_at: now
    };
    this.db.prepare(`INSERT INTO activity_attendance (id,activity_id,elderly_id,check_in_at,status,remark,created_at,updated_at)
        VALUES (@id,@activity_id,@elderly_id,@check_in_at,@status,@remark,@created_at,@updated_at)`).run(row);
    return row;
  }
  checkIn(activityId, elderlyId) {
    this.ensureOngoing(activityId);
    const now = Date.now();
    const result = this.db.prepare(`UPDATE activity_attendance SET status='attended', check_in_at=?, updated_at=? WHERE activity_id=? AND elderly_id=? AND status='registered'`).run(now, now, activityId, elderlyId);
    if (!result.changes) throw new Error("该报名记录不能签到");
  }
  markAbsent(activityId, elderlyId) {
    this.ensureOngoing(activityId);
    const result = this.db.prepare(`UPDATE activity_attendance SET status='absent', updated_at=? WHERE activity_id=? AND elderly_id=? AND status='registered'`).run(Date.now(), activityId, elderlyId);
    if (!result.changes) throw new Error("该报名记录不能标记为缺席");
  }
  removeAttendance(activityId, elderlyId) {
    const activity = this.findById(activityId);
    if (!activity || activity.deleted_at || activity.status !== "planned" && activity.status !== "ongoing") {
      throw new Error("当前活动不可移除参与者");
    }
    const result = this.db.prepare(`DELETE FROM activity_attendance WHERE activity_id=? AND elderly_id=? AND status='registered'`).run(activityId, elderlyId);
    if (!result.changes) throw new Error("该报名记录不能移除");
  }
  ensureOngoing(activityId) {
    const activity = this.findById(activityId);
    if (!activity || activity.deleted_at || activity.status !== "ongoing") throw new Error("活动尚未开始或已结束");
  }
}
class ContractRepo {
  constructor(db2) {
    this.db = db2;
  }
  db;
  findAll() {
    return this.db.prepare(`SELECT * FROM contract WHERE deleted_at IS NULL ORDER BY created_at DESC`).all();
  }
  findByElderly(elderlyId) {
    return this.db.prepare(`SELECT * FROM contract WHERE elderly_id=? AND deleted_at IS NULL ORDER BY sign_date DESC`).all(elderlyId);
  }
  findActiveByElderly(elderlyId) {
    return this.db.prepare(`SELECT * FROM contract WHERE elderly_id=? AND status='active' AND deleted_at IS NULL LIMIT 1`).get(elderlyId) ?? null;
  }
  findById(id) {
    return this.db.prepare(`SELECT * FROM contract WHERE id=?`).get(id) ?? null;
  }
  /** 查询即将到期的合同（指定天数内）
   *  end_date 现在存储为 'YYYY-MM-DD HH:mm:ss'，用 SQLite date() 函数只取日期部分参与比较，
   *  避免因为带时间戳字符串比 10 位日期字符串"更大"而导致边界判断失真（漏掉临期合同）。 */
  findExpiringSoon(days = 30) {
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const limit = new Date(Date.now() + days * 864e5).toISOString().slice(0, 10);
    return this.db.prepare(
      `SELECT * FROM contract WHERE deleted_at IS NULL AND status='active' AND date(end_date) >= date(?) AND date(end_date) <= date(?) ORDER BY end_date`
    ).all(today, limit);
  }
  insert(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(`INSERT INTO contract (id,elderly_id,contract_no,sign_date,start_date,end_date,auto_renew,renew_months,monthly_amount,status,file_path,remark,created_by,created_at,updated_at,deleted_at)
        VALUES (@id,@elderly_id,@contract_no,@sign_date,@start_date,@end_date,@auto_renew,@renew_months,@monthly_amount,@status,@file_path,@remark,@created_by,@created_at,@updated_at,@deleted_at)`).run(row);
    return row;
  }
  update(id, data) {
    const now = Date.now();
    const fields = Object.keys(data);
    if (!fields.length) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    this.db.prepare(`UPDATE contract SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id });
  }
  softDelete(id) {
    this.db.prepare(`UPDATE contract SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
  }
  /** 生成唯一合同编号 */
  generateContractNo() {
    const date2 = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "");
    const count = this.db.prepare(`SELECT COUNT(*) AS cnt FROM contract`).get()?.cnt ?? 0;
    return `HT${date2}${String(count + 1).padStart(4, "0")}`;
  }
}
class NotificationRepo {
  constructor(db2) {
    this.db = db2;
  }
  db;
  findAll(unreadOnly = false) {
    if (unreadOnly) {
      return this.db.prepare(`SELECT * FROM notification WHERE is_read=0 ORDER BY created_at DESC`).all();
    }
    return this.db.prepare(`SELECT * FROM notification ORDER BY created_at DESC LIMIT 100`).all();
  }
  getUnreadCount() {
    const row = this.db.prepare(`SELECT COUNT(*) AS cnt FROM notification WHERE is_read=0`).get();
    return row?.cnt ?? 0;
  }
  insert(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now };
    this.db.prepare(`INSERT INTO notification (id,type,title,content,elderly_id,is_read,read_at,created_at)
        VALUES (@id,@type,@title,@content,@elderly_id,@is_read,@read_at,@created_at)`).run(row);
    return row;
  }
  markRead(id) {
    this.db.prepare(`UPDATE notification SET is_read=1, read_at=? WHERE id=?`).run(Date.now(), id);
  }
  markUnread(id) {
    this.db.prepare(`UPDATE notification SET is_read=0, read_at=NULL WHERE id=?`).run(id);
  }
  markAllRead() {
    this.db.prepare(`UPDATE notification SET is_read=1, read_at=? WHERE is_read=0`).run(Date.now());
  }
  delete(id) {
    this.db.prepare(`DELETE FROM notification WHERE id=?`).run(id);
  }
  /** 生成生日提醒（今日/近7天生日的老人） */
  generateBirthdayReminders(db2) {
    const today = /* @__PURE__ */ new Date();
    const mmdd = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const rows = db2.prepare(
      `SELECT id, name, birth_date FROM elderly WHERE deleted_at IS NULL AND status='active'
       AND birth_date IS NOT NULL AND substr(birth_date,6,5) = ?`
    ).all(mmdd);
    for (const row of rows) {
      const existsToday = db2.prepare(
        `SELECT COUNT(*) AS cnt FROM notification WHERE elderly_id=? AND type='birthday' AND created_at > ?`
      ).get(row.id, Date.now() - 864e5);
      if (!existsToday?.cnt) {
        this.insert({
          type: "birthday",
          title: "生日提醒",
          content: `${row.name} 今天生日，请记得送上祝福！`,
          elderly_id: row.id,
          is_read: 0,
          read_at: null
        });
      }
    }
  }
}
const ROLE_UPDATE_FIELDS = /* @__PURE__ */ new Set(["name", "code", "menu_keys", "button_keys", "remark"]);
const USER_UPDATE_FIELDS = /* @__PURE__ */ new Set(["real_name", "phone", "role_id", "status", "must_change_pw", "remark"]);
class UserRepo {
  constructor(db2) {
    this.db = db2;
  }
  db;
  // ─── 角色 ─────────────────────────────────────────────────
  /** 角色列表，附带 user_count（该角色当前关联的账号数，供角色管理页展示/删除前提示） */
  findAllRoles() {
    return this.db.prepare(
      `SELECT r.*, (
           SELECT COUNT(*) FROM sys_user u WHERE u.role_id = r.id AND u.deleted_at IS NULL
         ) as user_count
         FROM sys_role r
         WHERE r.deleted_at IS NULL
         ORDER BY r.is_system DESC, r.created_at`
    ).all();
  }
  findRoleById(id) {
    return this.db.prepare(`SELECT * FROM sys_role WHERE id=?`).get(id) ?? null;
  }
  insertRole(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), is_system: 0, created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(
      `INSERT INTO sys_role (id,name,code,menu_keys,button_keys,is_system,remark,created_at,updated_at,deleted_at)
         VALUES (@id,@name,@code,@menu_keys,@button_keys,@is_system,@remark,@created_at,@updated_at,@deleted_at)`
    ).run(row);
    return row;
  }
  updateRole(id, data) {
    const role = this.findRoleById(id);
    if (role?.is_system) throw new Error("系统内置角色不允许修改");
    const now = Date.now();
    const fields = Object.keys(data).filter((field) => ROLE_UPDATE_FIELDS.has(field));
    if (!fields.length) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    const values = Object.fromEntries(fields.map((field) => [field, data[field]]));
    this.db.prepare(`UPDATE sys_role SET ${sets} WHERE id=@id`).run({ ...values, updated_at: now, id });
  }
  deleteRole(id) {
    const role = this.findRoleById(id);
    if (role?.is_system) throw new Error("系统内置角色不允许删除");
    const inUse = this.db.prepare(`SELECT COUNT(*) as cnt FROM sys_user WHERE role_id=? AND deleted_at IS NULL`).get(id);
    if (inUse && inUse.cnt > 0) throw new Error("该角色下仍有账号，请先转移或删除相关账号");
    this.db.prepare(`UPDATE sys_role SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
  }
  // ─── 用户 ─────────────────────────────────────────────────
  findAllUsers() {
    return this.db.prepare(`SELECT * FROM sys_user WHERE deleted_at IS NULL ORDER BY created_at DESC`).all();
  }
  findUserById(id) {
    return this.db.prepare(`SELECT * FROM sys_user WHERE id=?`).get(id) ?? null;
  }
  findUserByUsername(username) {
    return this.db.prepare(`SELECT * FROM sys_user WHERE username=? AND deleted_at IS NULL`).get(username) ?? null;
  }
  /** 新增用户，密码由此方法内部哈希，调用方只传明文密码 */
  insertUser(data) {
    const existing = this.findUserByUsername(data.username);
    if (existing) throw new Error("用户名已存在");
    const now = Date.now();
    const { password, ...rest } = data;
    const { salt, hash } = hashPassword(password);
    const row = {
      ...rest,
      id: nanoid$1.nanoid(),
      password_hash: hash,
      password_salt: salt,
      last_login_at: null,
      created_at: now,
      updated_at: now,
      deleted_at: null
    };
    this.db.prepare(
      `INSERT INTO sys_user (id,username,password_hash,password_salt,real_name,phone,role_id,status,must_change_pw,last_login_at,remark,created_at,updated_at,deleted_at)
         VALUES (@id,@username,@password_hash,@password_salt,@real_name,@phone,@role_id,@status,@must_change_pw,@last_login_at,@remark,@created_at,@updated_at,@deleted_at)`
    ).run(row);
    return row;
  }
  /** 更新用户基础信息（不含密码）。内置管理员账号禁止被禁用或改绑其他角色，避免系统无人可管理 */
  updateUser(id, data) {
    const user = this.findUserById(id);
    if (user?.username === "admin") {
      if (data.status === "disabled") throw new Error("内置管理员账号不允许禁用");
      if (data.role_id && data.role_id !== user.role_id) throw new Error("内置管理员账号不允许更换角色");
    }
    const now = Date.now();
    const fields = Object.keys(data).filter((field) => USER_UPDATE_FIELDS.has(field));
    if (!fields.length) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    const values = Object.fromEntries(fields.map((field) => [field, data[field]]));
    this.db.prepare(`UPDATE sys_user SET ${sets} WHERE id=@id`).run({ ...values, updated_at: now, id });
  }
  /** 重置/修改密码（管理员重置或用户自己改密均走此方法） */
  setPassword(id, newPassword, mustChangePw = false) {
    const now = Date.now();
    const { salt, hash } = hashPassword(newPassword);
    this.db.prepare(`UPDATE sys_user SET password_hash=?, password_salt=?, must_change_pw=?, updated_at=? WHERE id=?`).run(hash, salt, mustChangePw ? 1 : 0, now, id);
  }
  softDeleteUser(id) {
    const user = this.findUserById(id);
    if (user?.username === "admin") throw new Error("内置管理员账号不允许删除");
    this.db.prepare(`UPDATE sys_user SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
  }
  /** 登录校验：用户名+密码匹配则返回用户行，否则返回 null */
  verifyLogin(username, password) {
    const user = this.findUserByUsername(username);
    if (!user || user.status !== "active") return null;
    const ok = verifyPassword(password, user.password_salt, user.password_hash);
    return ok ? user : null;
  }
  recordLogin(id) {
    this.db.prepare(`UPDATE sys_user SET last_login_at=? WHERE id=?`).run(Date.now(), id);
  }
}
class AttendanceRepo {
  constructor(db2) {
    this.db = db2;
  }
  db;
  // ─── 班次 ─────────────────────────────────────────────────
  findAllShifts() {
    return this.db.prepare(`SELECT * FROM sys_shift WHERE deleted_at IS NULL ORDER BY start_time`).all();
  }
  insertShift(data) {
    const now = Date.now();
    const hasActiveShift = (this.db.prepare(`SELECT COUNT(*) AS count FROM sys_shift WHERE deleted_at IS NULL`).get()?.count ?? 0) > 0;
    const row = {
      ...data,
      id: nanoid$1.nanoid(),
      is_default: hasActiveShift ? 0 : 1,
      created_at: now,
      updated_at: now,
      deleted_at: null
    };
    this.db.prepare(
      `INSERT INTO sys_shift (id,name,start_time,end_time,is_default,remark,created_at,updated_at,deleted_at)
         VALUES (@id,@name,@start_time,@end_time,@is_default,@remark,@created_at,@updated_at,@deleted_at)`
    ).run(row);
    return row;
  }
  updateShift(id, data) {
    const now = Date.now();
    const fields = Object.keys(data);
    if (!fields.length) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    this.db.prepare(`UPDATE sys_shift SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id });
  }
  setDefaultShift(id) {
    const shift = this.db.prepare(`SELECT * FROM sys_shift WHERE id=? AND deleted_at IS NULL`).get(id);
    if (!shift) throw new Error("班次不存在或已删除");
    this.db.transaction(() => {
      const now = Date.now();
      this.db.prepare(`UPDATE sys_shift SET is_default=0, updated_at=? WHERE is_default=1 AND deleted_at IS NULL`).run(now);
      this.db.prepare(`UPDATE sys_shift SET is_default=1, updated_at=? WHERE id=?`).run(now, id);
    })();
  }
  deleteShift(id) {
    const shift = this.db.prepare(`SELECT * FROM sys_shift WHERE id=? AND deleted_at IS NULL`).get(id);
    if (!shift) return;
    const activeCount = this.db.prepare(`SELECT COUNT(*) AS count FROM sys_shift WHERE deleted_at IS NULL`).get()?.count ?? 0;
    if (activeCount <= 1) throw new Error("至少需要保留一个班次作为默认上班时间");
    this.db.transaction(() => {
      const now = Date.now();
      this.db.prepare(`UPDATE sys_shift SET deleted_at=?, updated_at=? WHERE id=?`).run(now, now, id);
      if (shift.is_default) {
        const next = this.db.prepare(`SELECT * FROM sys_shift WHERE deleted_at IS NULL ORDER BY start_time, created_at LIMIT 1`).get();
        if (next) this.db.prepare(`UPDATE sys_shift SET is_default=1, updated_at=? WHERE id=?`).run(now, next.id);
      }
    })();
  }
  resolveWorkShift(userId, workDate) {
    const scheduledShift = this.db.prepare(
      `SELECT shift.*
         FROM sys_schedule schedule
         JOIN sys_shift shift ON shift.id = schedule.shift_id AND shift.deleted_at IS NULL
         WHERE schedule.user_id=? AND schedule.work_date=? AND schedule.deleted_at IS NULL
         ORDER BY shift.start_time, schedule.created_at
         LIMIT 1`
    ).get(userId, workDate);
    if (scheduledShift) return { shift: scheduledShift, source: "schedule" };
    const defaultShift = this.db.prepare(
      `SELECT * FROM sys_shift
         WHERE deleted_at IS NULL
         ORDER BY is_default DESC, start_time, created_at
         LIMIT 1`
    ).get();
    return defaultShift ? { shift: defaultShift, source: "default" } : null;
  }
  // ─── 排班 ─────────────────────────────────────────────────
  findSchedules(startDate, endDate, userId) {
    if (userId) {
      return this.db.prepare(
        `SELECT * FROM sys_schedule WHERE deleted_at IS NULL AND user_id=? AND date(work_date) >= date(?) AND date(work_date) <= date(?) ORDER BY work_date`
      ).all(userId, startDate, endDate);
    }
    return this.db.prepare(
      `SELECT * FROM sys_schedule WHERE deleted_at IS NULL AND date(work_date) >= date(?) AND date(work_date) <= date(?) ORDER BY work_date, user_id`
    ).all(startDate, endDate);
  }
  insertSchedule(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(
      `INSERT INTO sys_schedule (id,user_id,shift_id,work_date,remark,task_type,task_target,created_at,updated_at,deleted_at)
         VALUES (@id,@user_id,@shift_id,@work_date,@remark,@task_type,@task_target,@created_at,@updated_at,@deleted_at)`
    ).run(row);
    return row;
  }
  updateSchedule(id, data) {
    const now = Date.now();
    const fields = Object.keys(data);
    if (!fields.length) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    this.db.prepare(`UPDATE sys_schedule SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id });
  }
  findScheduleById(id) {
    return this.db.prepare(`SELECT * FROM sys_schedule WHERE id=?`).get(id) ?? null;
  }
  deleteSchedule(id) {
    this.db.prepare(`UPDATE sys_schedule SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
  }
  // ─── 打卡 ─────────────────────────────────────────────────
  /** 查询某用户某天的打卡记录（用于判断今天是否已上/下班打卡） */
  findTodayAttendance(userId, date2) {
    return this.db.prepare(
      `SELECT * FROM sys_attendance WHERE user_id=? AND clock_date=? ORDER BY clock_at`
    ).all(userId, date2);
  }
  findAttendanceByRange(startDate, endDate, userId) {
    if (userId) {
      return this.db.prepare(
        `SELECT * FROM sys_attendance WHERE user_id=? AND date(clock_date) >= date(?) AND date(clock_date) <= date(?) ORDER BY clock_date, clock_at`
      ).all(userId, startDate, endDate);
    }
    return this.db.prepare(
      `SELECT * FROM sys_attendance WHERE date(clock_date) >= date(?) AND date(clock_date) <= date(?) ORDER BY clock_date, user_id, clock_at`
    ).all(startDate, endDate);
  }
  insertAttendance(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now };
    this.db.prepare(
      `INSERT INTO sys_attendance (id,user_id,clock_date,clock_type,clock_at,status,remark,created_at,updated_at)
         VALUES (@id,@user_id,@clock_date,@clock_type,@clock_at,@status,@remark,@created_at,@updated_at)`
    ).run(row);
    return row;
  }
  // ─── 请假 ─────────────────────────────────────────────────
  findLeaves(userId, status) {
    const conditions = ["deleted_at IS NULL"];
    const params = [];
    if (userId) {
      conditions.push("user_id=?");
      params.push(userId);
    }
    if (status) {
      conditions.push("status=?");
      params.push(status);
    }
    return this.db.prepare(
      `SELECT * FROM sys_leave WHERE ${conditions.join(" AND ")} ORDER BY created_at DESC`
    ).all(...params);
  }
  insertLeave(data) {
    const now = Date.now();
    const row = {
      ...data,
      id: nanoid$1.nanoid(),
      status: "pending",
      approver_id: null,
      approve_remark: null,
      created_at: now,
      updated_at: now,
      deleted_at: null
    };
    this.db.prepare(
      `INSERT INTO sys_leave (id,user_id,leave_type,start_date,end_date,reason,status,approver_id,approve_remark,created_at,updated_at,deleted_at)
         VALUES (@id,@user_id,@leave_type,@start_date,@end_date,@reason,@status,@approver_id,@approve_remark,@created_at,@updated_at,@deleted_at)`
    ).run(row);
    return row;
  }
  approveLeave(id, approverId, approved, remark) {
    const now = Date.now();
    this.db.prepare(`UPDATE sys_leave SET status=?, approver_id=?, approve_remark=?, updated_at=? WHERE id=?`).run(approved ? "approved" : "rejected", approverId, remark ?? null, now, id);
  }
}
const OFFLINE_AFTER_MS = 10 * 60 * 1e3;
const DEFAULT_DEVICE_PREFIX = "DEV";
function isFault(value) {
  return value === false || value === 0 || ["false", "offline", "down", "abnormal", "fault"].includes(String(value).toLowerCase());
}
function asNumber(value) {
  const result = Number(value);
  return Number.isFinite(result) ? result : null;
}
class IotRepo {
  constructor(db2) {
    this.db = db2;
    this.changeLog = new ChangeLogRepo(db2);
  }
  db;
  changeLog;
  // ─── 设备 ─────────────────────────────────────────────────
  findAllDevices() {
    return this.db.prepare(`SELECT * FROM iot_device WHERE deleted_at IS NULL ORDER BY created_at DESC`).all();
  }
  findDeviceById(id) {
    return this.db.prepare(`SELECT * FROM iot_device WHERE id=?`).get(id) ?? null;
  }
  /** 按 IP+端口 或 MAC 查找设备，供设备主动上报数据时匹配已注册设备 */
  findDeviceByAddress(ipAddress, port, macAddress) {
    if (macAddress) {
      const row = this.db.prepare(`SELECT * FROM iot_device WHERE mac_address=? AND deleted_at IS NULL`).get(macAddress);
      if (row) return row;
    }
    if (ipAddress && port) {
      const row = this.db.prepare(`SELECT * FROM iot_device WHERE ip_address=? AND port=? AND deleted_at IS NULL`).get(ipAddress, port);
      if (row) return row;
    }
    return null;
  }
  generateDeviceNo(prefix) {
    const prefixWithSeparator = `${prefix}-`;
    const deviceNumbers = this.db.prepare(`SELECT device_no FROM iot_device`).all();
    const maxSequence = deviceNumbers.reduce((max, { device_no }) => {
      if (!device_no.startsWith(prefixWithSeparator)) return max;
      const sequence = Number(device_no.slice(prefixWithSeparator.length));
      return Number.isInteger(sequence) && sequence > max ? sequence : max;
    }, 0);
    return `${prefixWithSeparator}${String(maxSequence + 1).padStart(4, "0")}`;
  }
  insertDevice(data) {
    const { device_prefix, ...device } = data;
    const prefix = typeof device_prefix === "string" && device_prefix.trim() ? device_prefix.trim() : DEFAULT_DEVICE_PREFIX;
    if (prefix.length > 20 || /\s/.test(prefix)) throw new Error("设备编号前缀不能包含空白字符，且最多 20 个字符");
    const now = Date.now();
    const row = {
      ...device,
      id: nanoid$1.nanoid(),
      device_no: this.generateDeviceNo(prefix),
      status: "offline",
      last_seen_at: null,
      created_at: now,
      updated_at: now,
      deleted_at: null
    };
    this.db.prepare(
      `INSERT INTO iot_device (id,device_no,name,device_type,conn_type,ip_address,port,mac_address,elderly_id,status,last_seen_at,remark,created_at,updated_at,deleted_at)
         VALUES (@id,@device_no,@name,@device_type,@conn_type,@ip_address,@port,@mac_address,@elderly_id,@status,@last_seen_at,@remark,@created_at,@updated_at,@deleted_at)`
    ).run(row);
    return row;
  }
  updateDevice(id, data) {
    const now = Date.now();
    const fields = Object.keys(data);
    if (!fields.length) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    this.db.prepare(`UPDATE iot_device SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id });
  }
  deleteDevice(id) {
    this.db.prepare(`UPDATE iot_device SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
  }
  markOnline(id) {
    const now = Date.now();
    this.db.prepare(`UPDATE iot_device SET status='online', last_seen_at=?, updated_at=? WHERE id=?`).run(now, now, id);
  }
  /** 将超过 offlineAfterMs 未上报数据的设备标记为离线（供定时任务调用） */
  markStaleOffline(offlineAfterMs = 5 * 60 * 1e3) {
    const threshold = Date.now() - offlineAfterMs;
    this.db.prepare(`UPDATE iot_device SET status='offline' WHERE status='online' AND (last_seen_at IS NULL OR last_seen_at < ?)`).run(threshold);
  }
  // ─── 电路 / 网络巡检与维修提醒 ─────────────────────────────
  findAlerts(includeResolved = false) {
    const where = includeResolved ? "" : `WHERE a.status != 'resolved'`;
    return this.db.prepare(`
      SELECT a.*, d.name AS device_name
      FROM iot_device_alert a
      LEFT JOIN iot_device d ON d.id = a.device_id
      ${where}
      ORDER BY CASE a.severity WHEN 'critical' THEN 0 ELSE 1 END, a.last_detected_at DESC
    `).all();
  }
  findAlertById(id) {
    return this.db.prepare(`
      SELECT a.*, d.name AS device_name
      FROM iot_device_alert a
      LEFT JOIN iot_device d ON d.id = a.device_id
      WHERE a.id=?
    `).get(id) ?? null;
  }
  /** 人工登记无法由设备上报识别的网络或电路维修事项。 */
  createManualAlert(data) {
    const device = this.findDeviceById(data.device_id);
    if (!device) throw new Error("设备不存在");
    const now = Date.now();
    const row = {
      id: nanoid$1.nanoid(),
      ...data,
      source: "manual",
      status: "pending",
      opened_at: now,
      last_detected_at: now,
      resolved_at: null,
      device_name: device.name
    };
    this.db.prepare(`
      INSERT INTO iot_device_alert (id,device_id,alert_type,source,severity,title,content,status,opened_at,last_detected_at,resolved_at)
      VALUES (@id,@device_id,@alert_type,@source,@severity,@title,@content,@status,@opened_at,@last_detected_at,@resolved_at)
    `).run(row);
    this.logAlertChange("INSERT", row);
    return row;
  }
  startAlertRepair(id) {
    const alert = this.findAlertById(id);
    if (!alert || alert.status !== "pending") return;
    this.db.prepare(`UPDATE iot_device_alert SET status='processing' WHERE id=?`).run(id);
    this.logAlertChange("UPDATE", { ...alert, status: "processing" });
  }
  resolveAlert(id) {
    const alert = this.findAlertById(id);
    if (!alert || alert.status === "resolved") return;
    const resolvedAt = Date.now();
    this.db.prepare(`UPDATE iot_device_alert SET status='resolved', resolved_at=? WHERE id=?`).run(resolvedAt, id);
    this.logAlertChange("UPDATE", { ...alert, status: "resolved", resolved_at: resolvedAt });
  }
  /**
   * 根据设备最近一次上报自动识别电路和网络异常。
   * 网络：未上报超过 10 分钟、network_status 异常、信号低于 -85dBm 或丢包高于 5%。
   * 电路：circuit_status/power_status 异常，或 voltage 不在 198-242V 区间。
   */
  checkHealth(offlineAfterMs = OFFLINE_AFTER_MS) {
    const now = Date.now();
    const opened = [];
    this.markStaleOffline(offlineAfterMs);
    for (const device of this.findAllDevices()) {
      const latest = this.findDeviceData(device.id, 1)[0];
      const data = latest ? this.parseData(latest.data) : {};
      const networkReason = this.getNetworkReason(device, data, now, offlineAfterMs);
      const circuitReason = this.getCircuitReason(data);
      if (networkReason) {
        const alert = this.openAlert(device.id, "network", networkReason.title, networkReason.content, networkReason.severity);
        if (alert.opened) opened.push(alert.row);
      } else {
        this.resolveOpenAlert(device.id, "network");
      }
      if (circuitReason) {
        const alert = this.openAlert(device.id, "circuit", circuitReason.title, circuitReason.content, circuitReason.severity);
        if (alert.opened) opened.push(alert.row);
      } else {
        this.resolveOpenAlert(device.id, "circuit");
      }
    }
    return { opened, alerts: this.findAlerts() };
  }
  parseData(data) {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  getNetworkReason(device, data, now, offlineAfterMs) {
    if (device.last_seen_at && now - device.last_seen_at > offlineAfterMs) {
      return { title: "网络通讯中断", content: `${device.name} 已超过 10 分钟未上报，请检查网络、供电及设备连接。`, severity: "critical" };
    }
    const signal = asNumber(data.signal_strength);
    const packetLoss = asNumber(data.packet_loss);
    if (isFault(data.network_status) || isFault(data.link_status)) {
      return { title: "网络连接异常", content: `${device.name} 上报网络连接异常，请安排网络检修。`, severity: "critical" };
    }
    if (signal !== null && signal < -85) {
      return { title: "网络信号较弱", content: `${device.name} 当前信号强度 ${signal}dBm，低于 -85dBm 阈值，请检查网络覆盖。`, severity: "warning" };
    }
    if (packetLoss !== null && packetLoss > 5) {
      return { title: "网络丢包异常", content: `${device.name} 当前丢包率 ${packetLoss}%，超过 5% 阈值，请检查网络链路。`, severity: "warning" };
    }
    return null;
  }
  getCircuitReason(data) {
    const voltage = asNumber(data.voltage);
    if (isFault(data.circuit_status) || isFault(data.power_status)) {
      return { title: "电路状态异常", content: "设备上报供电或线路异常，请安排电路维修。", severity: "critical" };
    }
    if (voltage !== null && (voltage < 198 || voltage > 242)) {
      return { title: "电压异常", content: `设备当前电压 ${voltage}V，不在 198-242V 安全监测区间，请安排电路检查。`, severity: "critical" };
    }
    return null;
  }
  openAlert(deviceId2, type, title, content, severity) {
    const now = Date.now();
    const existing = this.db.prepare(`
      SELECT * FROM iot_device_alert
      WHERE device_id=? AND alert_type=? AND source='auto' AND status != 'resolved'
      ORDER BY opened_at DESC LIMIT 1
    `).get(deviceId2, type);
    if (existing) {
      this.db.prepare(`UPDATE iot_device_alert SET title=?, content=?, severity=?, last_detected_at=? WHERE id=?`).run(title, content, severity, now, existing.id);
      return { opened: false, row: { ...existing, title, content, severity, last_detected_at: now } };
    }
    const row = {
      id: nanoid$1.nanoid(),
      device_id: deviceId2,
      alert_type: type,
      source: "auto",
      severity,
      title,
      content,
      status: "pending",
      opened_at: now,
      last_detected_at: now,
      resolved_at: null
    };
    this.db.prepare(`
      INSERT INTO iot_device_alert (id,device_id,alert_type,source,severity,title,content,status,opened_at,last_detected_at,resolved_at)
      VALUES (@id,@device_id,@alert_type,@source,@severity,@title,@content,@status,@opened_at,@last_detected_at,@resolved_at)
    `).run(row);
    this.logAlertChange("INSERT", row);
    return { opened: true, row };
  }
  resolveOpenAlert(deviceId2, type) {
    const alerts = this.db.prepare(`
      SELECT * FROM iot_device_alert
      WHERE device_id=? AND alert_type=? AND source='auto' AND status != 'resolved'
    `).all(deviceId2, type);
    if (!alerts.length) return;
    const resolvedAt = Date.now();
    this.db.prepare(`
      UPDATE iot_device_alert SET status='resolved', resolved_at=?
      WHERE device_id=? AND alert_type=? AND source='auto' AND status != 'resolved'
    `).run(resolvedAt, deviceId2, type);
    for (const alert of alerts) {
      this.logAlertChange("UPDATE", { ...alert, status: "resolved", resolved_at: resolvedAt });
    }
  }
  logAlertChange(operation, alert) {
    const { device_name: _deviceName, ...payload } = alert;
    this.changeLog.insert({
      table_name: "iot_device_alert",
      record_id: alert.id,
      operation,
      payload: JSON.stringify(payload)
    });
  }
  // ─── 数据上报 ──────────────────────────────────────────────
  insertDeviceData(data) {
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now };
    this.db.prepare(
      `INSERT INTO iot_device_data (id,device_id,elderly_id,data,reported_at,created_at)
         VALUES (@id,@device_id,@elderly_id,@data,@reported_at,@created_at)`
    ).run(row);
    this.markOnline(data.device_id);
    return row;
  }
  findDeviceData(deviceId2, limit = 50) {
    return this.db.prepare(
      `SELECT * FROM iot_device_data WHERE device_id=? ORDER BY reported_at DESC LIMIT ?`
    ).all(deviceId2, limit);
  }
  findDeviceDataByElderly(elderlyId, limit = 50) {
    return this.db.prepare(
      `SELECT * FROM iot_device_data WHERE elderly_id=? ORDER BY reported_at DESC LIMIT ?`
    ).all(elderlyId, limit);
  }
}
class PermissionGroupRepo {
  constructor(db2) {
    this.db = db2;
  }
  db;
  findAll() {
    return this.db.prepare(`SELECT * FROM sys_permission_group WHERE deleted_at IS NULL ORDER BY created_at`).all();
  }
  findById(id) {
    return this.db.prepare(`SELECT * FROM sys_permission_group WHERE id=?`).get(id) ?? null;
  }
  findByCode(code) {
    return this.db.prepare(`SELECT * FROM sys_permission_group WHERE code=? AND deleted_at IS NULL`).get(code) ?? null;
  }
  insert(data) {
    const existing = this.findByCode(data.code);
    if (existing) throw new Error("权限组编码已存在");
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now, deleted_at: null };
    this.db.prepare(
      `INSERT INTO sys_permission_group (id,name,code,menu_keys,button_keys,remark,created_at,updated_at,deleted_at)
         VALUES (@id,@name,@code,@menu_keys,@button_keys,@remark,@created_at,@updated_at,@deleted_at)`
    ).run(row);
    return row;
  }
  update(id, data) {
    const now = Date.now();
    const fields = Object.keys(data);
    if (!fields.length) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    this.db.prepare(`UPDATE sys_permission_group SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id });
  }
  softDelete(id) {
    this.db.prepare(`UPDATE sys_permission_group SET deleted_at=?, updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
  }
}
class TaskReminderRepo {
  constructor(db2) {
    this.db = db2;
    this.changeLog = new ChangeLogRepo(db2);
  }
  db;
  changeLog;
  /** 查询某用户负责的全部提醒（含自己创建给自己的），默认不含已取消 */
  findByAssignee(userId, includeInactive = false) {
    const sql = includeInactive ? `SELECT * FROM task_reminder WHERE assignee_id=? AND deleted_at IS NULL ORDER BY remind_date DESC, remind_at DESC` : `SELECT * FROM task_reminder WHERE assignee_id=? AND deleted_at IS NULL AND status='active' ORDER BY remind_date DESC, remind_at DESC`;
    return this.db.prepare(sql).all(userId);
  }
  /** 查询某用户创建的全部提醒（用于"我分配的任务"列表） */
  findByCreator(userId) {
    return this.db.prepare(
      `SELECT * FROM task_reminder WHERE creator_id=? AND deleted_at IS NULL ORDER BY created_at DESC`
    ).all(userId);
  }
  findById(id) {
    return this.db.prepare(`SELECT * FROM task_reminder WHERE id=?`).get(id) ?? null;
  }
  /** 查询关联某维修事项的提醒，用于保证维修同步时不会重复建任务。 */
  findByMaintenanceAlertId(alertId) {
    return this.db.prepare(
      `SELECT * FROM task_reminder WHERE maintenance_alert_id=? AND deleted_at IS NULL LIMIT 1`
    ).get(alertId) ?? null;
  }
  /** 所有活跃状态的提醒（供主进程定时扫描到期提醒使用，跨用户） */
  findAllActive() {
    return this.db.prepare(
      `SELECT * FROM task_reminder WHERE deleted_at IS NULL AND status='active' ORDER BY remind_at`
    ).all();
  }
  /** 根据排班 ID 查找关联的活跃提醒（用于排班列表显示铃铛图标） */
  findByScheduleId(scheduleId) {
    return this.db.prepare(
      `SELECT * FROM task_reminder WHERE schedule_id=? AND deleted_at IS NULL AND status='active' LIMIT 1`
    ).get(scheduleId) ?? null;
  }
  /** 根据多个排班 ID 批量查找关联的提醒，返回 map<scheduleId, reminder> */
  findByScheduleIds(scheduleIds) {
    if (!scheduleIds.length) return /* @__PURE__ */ new Map();
    const placeholders = scheduleIds.map(() => "?").join(",");
    const rows = this.db.prepare(
      `SELECT * FROM task_reminder WHERE schedule_id IN (${placeholders}) AND deleted_at IS NULL AND status='active'`
    ).all(...scheduleIds);
    const map = /* @__PURE__ */ new Map();
    for (const row of rows) {
      if (row.schedule_id) map.set(row.schedule_id, row);
    }
    return map;
  }
  insert(data) {
    const now = Date.now();
    const row = {
      ...data,
      id: nanoid$1.nanoid(),
      maintenance_alert_id: data.maintenance_alert_id ?? null,
      last_triggered_at: null,
      created_at: now,
      updated_at: now,
      deleted_at: null
    };
    this.db.prepare(
      `INSERT INTO task_reminder (id,title,description,remind_at,remind_date,repeat_type,repeat_days,creator_id,assignee_id,status,last_triggered_at,schedule_id,maintenance_alert_id,created_at,updated_at,deleted_at)
         VALUES (@id,@title,@description,@remind_at,@remind_date,@repeat_type,@repeat_days,@creator_id,@assignee_id,@status,@last_triggered_at,@schedule_id,@maintenance_alert_id,@created_at,@updated_at,@deleted_at)`
    ).run(row);
    this.changeLog.insert({
      table_name: "task_reminder",
      record_id: row.id,
      operation: "INSERT",
      payload: JSON.stringify(row)
    });
    return row;
  }
  update(id, data) {
    const now = Date.now();
    const fields = Object.keys(data);
    if (!fields.length) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    this.db.prepare(`UPDATE task_reminder SET ${sets} WHERE id=@id`).run({ ...data, updated_at: now, id });
    this.changeLog.insert({
      table_name: "task_reminder",
      record_id: id,
      operation: "UPDATE",
      payload: JSON.stringify({ id, ...data, updated_at: now })
    });
  }
  /** 记录本次触发时间，避免同一时刻重复弹出提醒 */
  markTriggered(id) {
    const now = Date.now();
    this.db.prepare(`UPDATE task_reminder SET last_triggered_at=?, updated_at=? WHERE id=?`).run(now, now, id);
  }
  /** 标记完成（单次任务标记完成后不再触发；重复任务通常无需标记完成，由用户自行取消） */
  markDone(id) {
    this.update(id, { status: "done" });
  }
  cancel(id) {
    this.update(id, { status: "cancelled" });
  }
  softDelete(id) {
    const now = Date.now();
    this.db.prepare(`UPDATE task_reminder SET deleted_at=?, updated_at=? WHERE id=?`).run(now, now, id);
    this.changeLog.insert({
      table_name: "task_reminder",
      record_id: id,
      operation: "DELETE",
      payload: JSON.stringify({ id, deleted_at: now })
    });
  }
}
class AnnouncementRepo {
  constructor(db2) {
    this.db = db2;
    this.changeLog = new ChangeLogRepo(db2);
  }
  db;
  changeLog;
  findAll() {
    return this.db.prepare(
      `SELECT * FROM announcement WHERE deleted_at IS NULL
       ORDER BY is_pinned DESC, publish_at DESC, created_at DESC`
    ).all();
  }
  /** 仅返回当前应展示给用户的公告，并附带该用户的已读状态。 */
  findVisibleForUser(userId, now = Date.now()) {
    return this.db.prepare(
      `SELECT a.*, CASE WHEN r.user_id IS NULL THEN 0 ELSE 1 END AS is_read, r.read_at
       FROM announcement a
       LEFT JOIN announcement_read r ON r.announcement_id=a.id AND r.user_id=?
       WHERE a.deleted_at IS NULL AND a.status='published' AND a.publish_at<=?
         AND (a.expire_at IS NULL OR a.expire_at>?)
       ORDER BY a.is_pinned DESC, a.level='urgent' DESC, a.publish_at DESC`
    ).all(userId, now, now);
  }
  insert(data) {
    const now = Date.now();
    const row = {
      ...data,
      id: nanoid$1.nanoid(),
      published_by: data.status === "published" ? data.created_by : null,
      created_at: now,
      updated_at: now,
      deleted_at: null
    };
    this.db.prepare(
      `INSERT INTO announcement
       (id,title,content,level,status,is_pinned,publish_at,expire_at,created_by,published_by,created_at,updated_at,deleted_at)
       VALUES (@id,@title,@content,@level,@status,@is_pinned,@publish_at,@expire_at,@created_by,@published_by,@created_at,@updated_at,@deleted_at)`
    ).run(row);
    this.writeChange("INSERT", row.id, row);
    return row;
  }
  update(id, data) {
    const fields = Object.keys(data);
    if (!fields.length) return;
    const updated_at = Date.now();
    const sets = [...fields, "updated_at"].map((field) => `${field}=@${field}`).join(",");
    this.db.prepare(
      `UPDATE announcement SET ${sets} WHERE id=@id AND deleted_at IS NULL`
    ).run({ ...data, id, updated_at });
    this.writeChange("UPDATE", id, { id, ...data, updated_at });
  }
  publish(id, userId) {
    const updated_at = Date.now();
    this.db.prepare(
      `UPDATE announcement SET status='published', publish_at=?, published_by=?, updated_at=?
       WHERE id=? AND deleted_at IS NULL`
    ).run(updated_at, userId, updated_at, id);
    this.writeChange("UPDATE", id, {
      id,
      status: "published",
      publish_at: updated_at,
      published_by: userId,
      updated_at
    });
  }
  withdraw(id) {
    this.update(id, { status: "withdrawn" });
  }
  softDelete(id) {
    const deleted_at = Date.now();
    this.db.prepare(`UPDATE announcement SET deleted_at=?, updated_at=? WHERE id=?`).run(deleted_at, deleted_at, id);
    this.writeChange("DELETE", id, { id, deleted_at });
  }
  markRead(announcementId, userId) {
    this.db.prepare(
      `INSERT OR IGNORE INTO announcement_read (announcement_id,user_id,read_at) VALUES (?,?,?)`
    ).run(announcementId, userId, Date.now());
  }
  getReadStats(announcementId) {
    const row = this.db.prepare(
      `SELECT COUNT(u.id) AS total,
              COUNT(r.user_id) AS read,
              COUNT(u.id) - COUNT(r.user_id) AS unread
       FROM sys_user u
       LEFT JOIN announcement_read r ON r.user_id=u.id AND r.announcement_id=?
       WHERE u.deleted_at IS NULL AND u.status='active'`
    ).get(announcementId);
    return row ?? { total: 0, read: 0, unread: 0 };
  }
  findReadUsers(announcementId) {
    return this.db.prepare(
      `SELECT u.id AS user_id, u.real_name, u.username, r.read_at
       FROM announcement_read r
       JOIN sys_user u ON u.id=r.user_id
       WHERE r.announcement_id=?
       ORDER BY r.read_at DESC`
    ).all(announcementId);
  }
  writeChange(operation, recordId, payload) {
    this.changeLog.insert({
      table_name: "announcement",
      record_id: recordId,
      operation,
      payload: JSON.stringify(payload)
    });
  }
}
class OperationsRepo {
  constructor(db2) {
    this.db = db2;
  }
  db;
  /**
   * 运营中心只读取既有业务表，不复制原始数据。手工台账仍由本仓储的其他方法维护。
   */
  findRiskSummary() {
    return this.db.prepare(`
        SELECT * FROM (
        SELECT 'health:' || ha.id AS id, 'health' AS source, ha.id AS source_id, ha.elderly_id, e.name AS elderly_name,
          '健康预警' AS title, ha.content, ha.severity, ha.status, datetime(ha.opened_at / 1000, 'unixepoch', 'localtime') AS risk_at
        FROM health_alert ha LEFT JOIN elderly e ON e.id=ha.elderly_id
        WHERE ha.status!='resolved'
        UNION ALL
        SELECT 'iot:' || ia.id, 'iot', ia.id, d.elderly_id, e.name,
          '设备告警', ia.title || '：' || ia.content, CASE WHEN ia.severity='critical' THEN 'critical' ELSE 'warning' END, ia.status,
          datetime(ia.last_detected_at / 1000, 'unixepoch', 'localtime')
        FROM iot_device_alert ia JOIN iot_device d ON d.id=ia.device_id LEFT JOIN elderly e ON e.id=d.elderly_id
        WHERE ia.status!='resolved'
        UNION ALL
        SELECT 'medication:' || mr.id, 'medication', mr.id, mr.elderly_id, e.name,
          '用药异常', mo.drug_name || '：' || CASE WHEN mr.status='missed' THEN '漏服' ELSE '拒服' END || COALESCE('（' || mr.remark || '）', ''),
          CASE WHEN mr.status='missed' THEN 'critical' ELSE 'warning' END, mr.status, mr.take_date || ' ' || mr.take_time
        FROM medication_record mr JOIN medication_order mo ON mo.id=mr.order_id LEFT JOIN elderly e ON e.id=mr.elderly_id
        WHERE mr.deleted_at IS NULL AND mr.status IN ('missed','refused') AND date(mr.take_date)>=date('now','-7 days')
        UNION ALL
        SELECT 'care:' || cr.id, 'care', cr.id, cr.elderly_id, e.name,
          '护理未执行', cr.care_type || '：' || cr.content, 'warning', cr.status, cr.record_date
        FROM care_record cr LEFT JOIN elderly e ON e.id=cr.elderly_id
        WHERE cr.deleted_at IS NULL AND cr.status='skipped' AND date(cr.record_date)>=date('now','-7 days')
        UNION ALL
        SELECT 'admission:' || lr.id, 'admission', lr.id, lr.elderly_id, e.name,
          '外出未返院', '预计返院：' || COALESCE(lr.expect_return, '未填写') || COALESCE('；' || lr.reason, ''),
          CASE WHEN lr.expect_return IS NOT NULL AND datetime(lr.expect_return)<datetime('now','localtime') THEN 'critical' ELSE 'warning' END,
          lr.status, lr.leave_date
        FROM leave_record lr LEFT JOIN elderly e ON e.id=lr.elderly_id
        WHERE lr.deleted_at IS NULL AND lr.status='out'
        UNION ALL
        SELECT 'contract:' || c.id, 'contract', c.id, c.elderly_id, e.name,
          '合同临期', c.contract_no || ' 将于 ' || c.end_date || ' 到期', 'warning', c.status, c.end_date
        FROM contract c LEFT JOIN elderly e ON e.id=c.elderly_id
        WHERE c.deleted_at IS NULL AND c.status='active' AND date(c.end_date) BETWEEN date('now') AND date('now','+30 days')
        UNION ALL
        SELECT 'fee:' || b.id, 'fee', b.id, b.elderly_id, e.name,
          '账单待缴', b.bill_month || ' 应收 ' || printf('%.2f', b.total) || '，已收 ' || printf('%.2f', b.paid),
          CASE WHEN b.bill_month<strftime('%Y-%m','now') THEN 'critical' ELSE 'warning' END, b.status, b.bill_month || '-01'
        FROM monthly_bill b LEFT JOIN elderly e ON e.id=b.elderly_id
        WHERE b.deleted_at IS NULL AND b.status IN ('unpaid','partial') AND b.bill_month<=strftime('%Y-%m','now')
        UNION ALL
        SELECT 'inventory:' || i.id, 'inventory', i.id, NULL, NULL,
          CASE WHEN i.quantity<=i.min_quantity THEN '库存不足' ELSE '物资临期' END,
          i.name || '：现存 ' || i.quantity || i.unit || '，预警下限 ' || i.min_quantity || i.unit,
          CASE WHEN i.quantity<=i.min_quantity THEN 'critical' ELSE 'warning' END, 'open', COALESCE(i.expiry_date, datetime(i.updated_at / 1000, 'unixepoch', 'localtime'))
        FROM inventory_item i
        WHERE i.status='active' AND (i.quantity<=i.min_quantity OR (i.expiry_date IS NOT NULL AND date(i.expiry_date)<=date('now','+30 days')))
        UNION ALL
        SELECT 'document:' || d.id, 'document', d.id, d.elderly_id, e.name,
          '文书临期', d.document_type || '：' || d.document_name || '，有效期至 ' || d.expiry_date,
          CASE WHEN date(d.expiry_date)<date('now') THEN 'critical' ELSE 'warning' END, d.status, d.expiry_date
        FROM elderly_document d LEFT JOIN elderly e ON e.id=d.elderly_id
        WHERE d.expiry_date IS NOT NULL AND date(d.expiry_date)<=date('now','+30 days')
        )
        ORDER BY CASE severity WHEN 'critical' THEN 0 ELSE 1 END, risk_at DESC
      `).all();
  }
  audit(domain, recordId, action, detail = null) {
    this.db.prepare(`INSERT INTO operations_audit_log (id,domain,record_id,action,detail,created_at) VALUES (?,?,?,?,?,?)`).run(nanoid$1.nanoid(), domain, recordId, action, detail, Date.now());
  }
  findHandovers(limit = 100) {
    return this.db.prepare(
      `SELECT * FROM care_handover ORDER BY handover_date DESC, created_at DESC LIMIT ?`
    ).all(limit);
  }
  createHandover(data) {
    const now = Date.now();
    const row = {
      ...data,
      id: nanoid$1.nanoid(),
      status: "pending",
      acknowledged_at: null,
      created_at: now,
      updated_at: now
    };
    this.db.prepare(
      `INSERT INTO care_handover (id,handover_date,shift,outgoing_staff,incoming_staff,resident_summary,abnormal_summary,pending_items,status,acknowledged_at,created_at,updated_at)
         VALUES (@id,@handover_date,@shift,@outgoing_staff,@incoming_staff,@resident_summary,@abnormal_summary,@pending_items,@status,@acknowledged_at,@created_at,@updated_at)`
    ).run(row);
    this.audit("handover", row.id, "create");
    return row;
  }
  acknowledgeHandover(id, incomingStaff) {
    const result = this.db.prepare(
      `UPDATE care_handover SET status='acknowledged', incoming_staff=?, acknowledged_at=?, updated_at=? WHERE id=? AND status='pending'`
    ).run(incomingStaff, Date.now(), Date.now(), id);
    if (!result.changes) throw new Error("该交接班记录已确认或不存在");
    this.audit("handover", id, "acknowledge", incomingStaff);
  }
  findIncidents(includeClosed = true) {
    const sql = includeClosed ? `SELECT * FROM care_incident ORDER BY occurred_at DESC` : `SELECT * FROM care_incident WHERE status!='closed' ORDER BY occurred_at DESC`;
    return this.db.prepare(sql).all();
  }
  createIncident(data) {
    const now = Date.now();
    const row = {
      ...data,
      id: nanoid$1.nanoid(),
      family_notified_at: null,
      status: "reported",
      close_note: null,
      closed_at: null,
      created_at: now,
      updated_at: now
    };
    this.db.prepare(
      `INSERT INTO care_incident (id,elderly_id,incident_type,severity,occurred_at,location,description,immediate_action,responsible,family_notified_at,status,close_note,closed_at,created_at,updated_at)
         VALUES (@id,@elderly_id,@incident_type,@severity,@occurred_at,@location,@description,@immediate_action,@responsible,@family_notified_at,@status,@close_note,@closed_at,@created_at,@updated_at)`
    ).run(row);
    this.audit("incident", row.id, "report", row.description);
    return row;
  }
  startIncident(id, responsible) {
    const result = this.db.prepare(
      `UPDATE care_incident SET status='processing', responsible=COALESCE(?, responsible), updated_at=? WHERE id=? AND status='reported'`
    ).run(responsible, Date.now(), id);
    if (!result.changes) throw new Error("仅“已上报”事件可进入处理中");
    this.audit("incident", id, "start", responsible);
  }
  notifyIncidentFamily(id) {
    const result = this.db.prepare(
      `UPDATE care_incident SET family_notified_at=?, updated_at=? WHERE id=? AND status!='closed' AND family_notified_at IS NULL`
    ).run(Date.now(), Date.now(), id);
    if (!result.changes) throw new Error("事件已关闭、已通知或不存在");
    this.audit("incident", id, "notify_family");
  }
  closeIncident(id, closeNote) {
    if (!closeNote.trim()) throw new Error("请填写处置结果和复盘说明");
    const result = this.db.prepare(
      `UPDATE care_incident SET status='closed', close_note=?, closed_at=?, updated_at=? WHERE id=? AND status='processing'`
    ).run(closeNote.trim(), Date.now(), Date.now(), id);
    if (!result.changes) throw new Error("事件须先进入处理中后才能关闭");
    this.audit("incident", id, "close", closeNote.trim());
  }
  findVisitors(includeFinished = true) {
    const sql = includeFinished ? `SELECT * FROM visitor_record ORDER BY visit_at DESC` : `SELECT * FROM visitor_record WHERE status IN ('scheduled','checked_in') ORDER BY visit_at ASC`;
    return this.db.prepare(sql).all();
  }
  createVisitor(data) {
    const now = Date.now();
    const row = {
      ...data,
      id: nanoid$1.nanoid(),
      leave_at: null,
      status: "scheduled",
      created_at: now,
      updated_at: now
    };
    this.db.prepare(
      `INSERT INTO visitor_record (id,elderly_id,visitor_name,relation,phone,visit_at,leave_at,purpose,status,approved_by,remark,created_at,updated_at)
         VALUES (@id,@elderly_id,@visitor_name,@relation,@phone,@visit_at,@leave_at,@purpose,@status,@approved_by,@remark,@created_at,@updated_at)`
    ).run(row);
    this.audit("visitor", row.id, "create", row.visitor_name);
    return row;
  }
  checkInVisitor(id) {
    const result = this.db.prepare(
      `UPDATE visitor_record SET status='checked_in', updated_at=? WHERE id=? AND status='scheduled'`
    ).run(Date.now(), id);
    if (!result.changes) throw new Error("仅预约中的探视可签到");
    this.audit("visitor", id, "check_in");
  }
  checkOutVisitor(id, leaveAt) {
    const result = this.db.prepare(
      `UPDATE visitor_record SET status='checked_out', leave_at=?, updated_at=? WHERE id=? AND status='checked_in'`
    ).run(leaveAt, Date.now(), id);
    if (!result.changes) throw new Error("仅已签到的探视可签离");
    this.audit("visitor", id, "check_out", leaveAt);
  }
  cancelVisitor(id) {
    const result = this.db.prepare(
      `UPDATE visitor_record SET status='cancelled', updated_at=? WHERE id=? AND status='scheduled'`
    ).run(Date.now(), id);
    if (!result.changes) throw new Error("仅预约中的探视可取消");
    this.audit("visitor", id, "cancel");
  }
  findCommunications(openOnly = false) {
    const sql = openOnly ? `SELECT * FROM family_communication WHERE status='open' ORDER BY communicated_at DESC` : `SELECT * FROM family_communication ORDER BY communicated_at DESC`;
    return this.db.prepare(sql).all();
  }
  createCommunication(data) {
    const now = Date.now();
    const row = {
      ...data,
      id: nanoid$1.nanoid(),
      status: "open",
      closed_at: null,
      created_at: now,
      updated_at: now
    };
    this.db.prepare(
      `INSERT INTO family_communication (id,elderly_id,contact_name,channel,communicated_at,content,follow_up,communicator,status,closed_at,created_at,updated_at)
         VALUES (@id,@elderly_id,@contact_name,@channel,@communicated_at,@content,@follow_up,@communicator,@status,@closed_at,@created_at,@updated_at)`
    ).run(row);
    this.audit("communication", row.id, "create", row.content);
    return row;
  }
  closeCommunication(id) {
    const result = this.db.prepare(
      `UPDATE family_communication SET status='closed', closed_at=?, updated_at=? WHERE id=? AND status='open'`
    ).run(Date.now(), Date.now(), id);
    if (!result.changes) throw new Error("该沟通事项已关闭或不存在");
    this.audit("communication", id, "close");
  }
  findInventory() {
    return this.db.prepare(
      `SELECT * FROM inventory_item WHERE status='active' ORDER BY category, expiry_date IS NULL, expiry_date, name`
    ).all();
  }
  createInventoryItem(data) {
    if (data.quantity < 0 || data.min_quantity < 0) throw new Error("库存数量不能小于零");
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now, updated_at: now };
    this.db.prepare(
      `INSERT INTO inventory_item (id,category,name,specification,unit,quantity,min_quantity,expiry_date,supplier,status,remark,created_at,updated_at)
         VALUES (@id,@category,@name,@specification,@unit,@quantity,@min_quantity,@expiry_date,@supplier,@status,@remark,@created_at,@updated_at)`
    ).run(row);
    this.audit("inventory", row.id, "create", row.name);
    return row;
  }
  findInventoryTransactions(itemId) {
    return this.db.prepare(
      `SELECT * FROM inventory_transaction WHERE item_id=? ORDER BY occurred_at DESC, created_at DESC LIMIT 100`
    ).all(itemId);
  }
  transactInventory(data) {
    if (data.transaction_type === "adjust" && data.quantity === 0) {
      throw new Error("盘点调整数量不能为零");
    }
    if (data.transaction_type !== "adjust" && data.quantity <= 0) {
      throw new Error("出入库数量必须大于零");
    }
    const item = this.db.prepare(`SELECT * FROM inventory_item WHERE id=? AND status='active'`).get(data.item_id);
    if (!item) throw new Error("库存物品不存在或已停用");
    const delta = data.transaction_type === "out" ? -data.quantity : data.quantity;
    if (item.quantity + delta < 0) throw new Error("库存不足，无法出库");
    const now = Date.now();
    const row = { ...data, id: nanoid$1.nanoid(), created_at: now };
    this.db.transaction(() => {
      this.db.prepare(`UPDATE inventory_item SET quantity=quantity+?, updated_at=? WHERE id=?`).run(delta, now, item.id);
      this.db.prepare(
        `INSERT INTO inventory_transaction (id,item_id,transaction_type,quantity,occurred_at,operator,reference_no,remark,created_at)
           VALUES (@id,@item_id,@transaction_type,@quantity,@occurred_at,@operator,@reference_no,@remark,@created_at)`
      ).run(row);
    })();
    this.audit("inventory", item.id, `transaction:${data.transaction_type}`, String(data.quantity));
    return row;
  }
  findDocuments(elderlyId) {
    this.refreshDocumentStatuses();
    const sql = elderlyId ? `SELECT * FROM elderly_document WHERE elderly_id=? ORDER BY expiry_date IS NULL, expiry_date, created_at DESC` : `SELECT * FROM elderly_document ORDER BY expiry_date IS NULL, expiry_date, created_at DESC`;
    return elderlyId ? this.db.prepare(sql).all(elderlyId) : this.db.prepare(sql).all();
  }
  refreshDocumentStatuses() {
    const now = Date.now();
    this.db.prepare(`UPDATE elderly_document SET status='expired', updated_at=? WHERE expiry_date IS NOT NULL AND date(expiry_date)<date('now') AND status!='expired'`).run(now);
    this.db.prepare(`UPDATE elderly_document SET status='expiring', updated_at=? WHERE expiry_date IS NOT NULL AND date(expiry_date)>=date('now') AND date(expiry_date)<=date('now','+30 days') AND status='valid'`).run(now);
  }
  createDocument(data) {
    const now = Date.now();
    const status = data.expiry_date && data.expiry_date.slice(0, 10) < (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) ? "expired" : "valid";
    const row = { ...data, id: nanoid$1.nanoid(), status, created_at: now, updated_at: now };
    this.db.prepare(
      `INSERT INTO elderly_document (id,elderly_id,document_type,document_name,file_path,signed_at,expiry_date,status,custodian,remark,created_at,updated_at)
         VALUES (@id,@elderly_id,@document_type,@document_name,@file_path,@signed_at,@expiry_date,@status,@custodian,@remark,@created_at,@updated_at)`
    ).run(row);
    this.audit("document", row.id, "archive", row.document_name);
    return row;
  }
  findHealthAlerts(includeResolved = false) {
    const sql = includeResolved ? `SELECT * FROM health_alert ORDER BY opened_at DESC` : `SELECT * FROM health_alert WHERE status!='resolved' ORDER BY opened_at DESC`;
    return this.db.prepare(sql).all();
  }
  startHealthAlert(id) {
    const result = this.db.prepare(`UPDATE health_alert SET status='processing' WHERE id=? AND status='open'`).run(id);
    if (!result.changes) throw new Error("仅待处理预警可开始处置");
    this.audit("health_alert", id, "start");
  }
  resolveHealthAlert(id, resolver, resolution) {
    if (!resolution.trim()) throw new Error("请填写预警处置说明");
    const result = this.db.prepare(
      `UPDATE health_alert SET status='resolved', resolver=?, resolution=?, resolved_at=? WHERE id=? AND status='processing'`
    ).run(resolver || null, resolution.trim(), Date.now(), id);
    if (!result.changes) throw new Error("预警须先开始处置后才能关闭");
    this.audit("health_alert", id, "resolve", resolution.trim());
  }
}
class SupplierRepo {
  constructor(db2) {
    this.db = db2;
  }
  db;
  findAll(activeOnly = false) {
    const sql = activeOnly ? `SELECT * FROM supplier WHERE deleted_at IS NULL AND status='active' ORDER BY name` : `SELECT * FROM supplier WHERE deleted_at IS NULL ORDER BY name`;
    return this.db.prepare(sql).all();
  }
  findById(id) {
    return this.db.prepare(`SELECT * FROM supplier WHERE id=? AND deleted_at IS NULL`).get(id);
  }
  insert(data) {
    const now = Date.now();
    const row = {
      ...data,
      id: nanoid$1.nanoid(),
      created_at: now,
      updated_at: now,
      deleted_at: null
    };
    this.db.prepare(`
      INSERT INTO supplier
        (id,name,contact,phone,address,category,tax_no,bank_account,bank_name,status,remark,created_at,updated_at,deleted_at)
      VALUES
        (@id,@name,@contact,@phone,@address,@category,@tax_no,@bank_account,@bank_name,@status,@remark,@created_at,@updated_at,@deleted_at)
    `).run(row);
    return row;
  }
  update(id, data) {
    const fields = Object.keys(data);
    if (!fields.length) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    this.db.prepare(`UPDATE supplier SET ${sets} WHERE id=@id`).run({ ...data, updated_at: Date.now(), id });
  }
  delete(id) {
    this.db.prepare(`UPDATE supplier SET deleted_at=?,updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
  }
}
class PurchaseOrderRepo {
  constructor(db2) {
    this.db = db2;
  }
  db;
  // ─── 采购单 ──────────────────────────────────────────────────
  findAll(status) {
    if (status) {
      return this.db.prepare(
        `SELECT * FROM purchase_order WHERE deleted_at IS NULL AND status=? ORDER BY created_at DESC`
      ).all(status);
    }
    return this.db.prepare(
      `SELECT * FROM purchase_order WHERE deleted_at IS NULL ORDER BY created_at DESC`
    ).all();
  }
  findById(id) {
    return this.db.prepare(
      `SELECT * FROM purchase_order WHERE id=? AND deleted_at IS NULL`
    ).get(id);
  }
  create(order, items) {
    const now = Date.now();
    const orderId = nanoid$1.nanoid();
    const orderNo = `PO${now}`;
    let totalAmount = 0;
    const itemRows = items.map((it) => {
      const amount = Number(((it.quantity ?? 0) * (it.unit_price ?? 0)).toFixed(2));
      totalAmount += amount;
      return {
        ...it,
        id: nanoid$1.nanoid(),
        order_id: orderId,
        amount,
        received_qty: 0,
        created_at: now,
        updated_at: now
      };
    });
    const row = {
      ...order,
      id: orderId,
      order_no: orderNo,
      total_amount: Number(totalAmount.toFixed(2)),
      paid_amount: 0,
      created_at: now,
      updated_at: now,
      deleted_at: null
    };
    const insertOrder = this.db.prepare(`
      INSERT INTO purchase_order
        (id,order_no,supplier_id,supplier_name,order_date,expect_date,total_amount,
         paid_amount,status,applicant,remark,created_at,updated_at,deleted_at)
      VALUES
        (@id,@order_no,@supplier_id,@supplier_name,@order_date,@expect_date,@total_amount,
         @paid_amount,@status,@applicant,@remark,@created_at,@updated_at,@deleted_at)
    `);
    const insertItem = this.db.prepare(`
      INSERT INTO purchase_order_item
        (id,order_id,item_name,category,specification,unit,quantity,unit_price,amount,received_qty,remark,created_at,updated_at)
      VALUES
        (@id,@order_id,@item_name,@category,@specification,@unit,@quantity,@unit_price,@amount,@received_qty,@remark,@created_at,@updated_at)
    `);
    const tx = this.db.transaction(() => {
      insertOrder.run(row);
      for (const item of itemRows) insertItem.run(item);
    });
    tx();
    return row;
  }
  updateStatus(id, status, operatorName) {
    const now = Date.now();
    const extra = { status, updated_at: now };
    if (status === "approved") {
      extra.approver = operatorName ?? null;
      extra.approved_at = now;
    }
    if (status === "received") {
      extra.received_at = now;
    }
    const sets = Object.keys(extra).map((k) => `${k}=@${k}`).join(",");
    this.db.prepare(`UPDATE purchase_order SET ${sets} WHERE id=@id`).run({ ...extra, id });
  }
  delete(id) {
    this.db.prepare(`UPDATE purchase_order SET deleted_at=?,updated_at=? WHERE id=?`).run(Date.now(), Date.now(), id);
  }
  // ─── 明细 ────────────────────────────────────────────────────
  findItems(orderId) {
    return this.db.prepare(
      `SELECT * FROM purchase_order_item WHERE order_id=? ORDER BY created_at`
    ).all(orderId);
  }
  // ─── 统计 ────────────────────────────────────────────────────
  getStats() {
    return this.db.prepare(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status='draft'    THEN 1 ELSE 0 END) AS draft,
        SUM(CASE WHEN status='pending'  THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN status='approved' THEN 1 ELSE 0 END) AS approved,
        SUM(CASE WHEN status='received' THEN 1 ELSE 0 END) AS received,
        COALESCE(SUM(total_amount),0)                      AS total_amount
      FROM purchase_order WHERE deleted_at IS NULL
    `).get();
  }
}
const TOKEN_LIFETIME_MS = 30 * 24 * 60 * 60 * 1e3;
const CLIENT_MESSAGE_ID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;
class ChatRepo {
  constructor(db2) {
    this.db = db2;
  }
  db;
  login(username, password) {
    const normalizedUsername = username?.trim() ?? "";
    if (!normalizedUsername || normalizedUsername.length > 100 || !password || password.length > 256) {
      throw new Error("用户名或密码错误");
    }
    const user = this.db.prepare(
      `SELECT u.id, u.username, u.password_hash, u.password_salt, u.real_name, u.department, r.menu_keys
       FROM sys_user u
       JOIN sys_role r ON r.id = u.role_id
       WHERE u.username = ? AND u.status = 'active' AND u.deleted_at IS NULL
         AND r.deleted_at IS NULL`
    ).get(normalizedUsername);
    if (!user || !this.hasChatPermission(user.menu_keys) || !verifyPassword(password, user.password_salt, user.password_hash)) {
      throw new Error("用户名或密码错误，或账号无聊天权限");
    }
    return this.issueSession(user);
  }
  /** Electron 主进程已完成本地登录时，为当前账号签发聊天会话。 */
  createSessionForUser(userId) {
    const normalizedUserId = this.normalizeUserId(userId);
    if (!normalizedUserId) throw new Error("聊天账号无效");
    return this.issueSession(this.requireActiveChatUser(
      normalizedUserId,
      "账号已停用或无聊天权限"
    ));
  }
  issueSession(user) {
    const token = crypto.randomBytes(32).toString("base64url");
    const now = Date.now();
    const expiresAt = now + TOKEN_LIFETIME_MS;
    this.db.prepare(
      `INSERT INTO chat_session_token (token_hash, user_id, expires_at, created_at, last_used_at)
       VALUES (?, ?, ?, ?, ?)`
    ).run(this.hashToken(token), user.id, expiresAt, now, now);
    return {
      mode: "local",
      token,
      expiresAt: this.toIso(expiresAt),
      userId: user.id,
      userName: user.username,
      nickName: user.real_name
    };
  }
  authenticate(token) {
    return this.toMe(this.requireUser(token));
  }
  logout(token) {
    if (typeof token !== "string" || !token) return;
    this.db.prepare(`DELETE FROM chat_session_token WHERE token_hash = ?`).run(this.hashToken(token));
  }
  me(token) {
    return this.toMe(this.requireUser(token));
  }
  contacts(token, keyword) {
    const current = this.requireUser(token);
    const search = keyword?.trim() ?? "";
    if (search.length > 50) throw new Error("搜索内容不能超过50个字符");
    const lowered = search.toLocaleLowerCase();
    const rows = this.db.prepare(
      `SELECT u.id, u.username, u.password_hash, u.password_salt, u.real_name, u.department, r.menu_keys
       FROM sys_user u
       JOIN sys_role r ON r.id = u.role_id
       WHERE u.status = 'active' AND u.deleted_at IS NULL AND r.deleted_at IS NULL
         AND u.id != ?
       ORDER BY u.real_name, u.id`
    ).all(current.id);
    return rows.filter((row) => this.hasChatPermission(row.menu_keys)).filter((row) => !lowered || [row.username, row.real_name, row.department ?? ""].some((value) => value.toLocaleLowerCase().includes(lowered))).slice(0, 100).map((row) => ({
      userId: row.id,
      userName: row.username,
      nickName: row.real_name,
      ...row.department ? { deptName: row.department } : {}
    }));
  }
  conversations(token) {
    const user = this.requireUser(token);
    const rows = this.db.prepare(
      `SELECT c.id AS conversation_id, c.type,
              CASE WHEN c.type = 'D' THEN COALESCE(peer.real_name, peer.username, '') ELSE c.name END AS name,
              c.owner_user_id, c.last_message_id, c.last_message_preview, c.last_message_at,
              (SELECT COUNT(*) FROM chat_message unread
               WHERE unread.conversation_id = c.id AND unread.deleted_at IS NULL
                 AND unread.id > cm.last_read_message_id AND unread.sender_user_id != ?) AS unread_count
       FROM chat_conversation_member cm
       JOIN chat_conversation c ON c.id = cm.conversation_id AND c.status = 'active'
       LEFT JOIN chat_conversation_member peer_member
         ON c.type = 'D' AND peer_member.conversation_id = c.id
        AND peer_member.user_id != ? AND peer_member.left_at IS NULL
       LEFT JOIN sys_user peer ON peer.id = peer_member.user_id
       WHERE cm.user_id = ? AND cm.left_at IS NULL
       ORDER BY COALESCE(c.last_message_at, c.created_at) DESC, c.id DESC`
    ).all(user.id, user.id, user.id);
    return rows.map((row) => ({
      conversationId: row.conversation_id,
      type: row.type,
      name: row.name,
      ...row.owner_user_id ? { ownerUserId: row.owner_user_id } : {},
      ...row.last_message_id !== null ? { lastMessageId: row.last_message_id } : {},
      ...row.last_message_preview ? { lastMessagePreview: row.last_message_preview } : {},
      ...row.last_message_at !== null ? { lastMessageTime: this.toIso(row.last_message_at) } : {},
      unreadCount: row.unread_count
    }));
  }
  createDirect(token, peerUserId) {
    const user = this.requireUser(token);
    const peerId = this.normalizeUserId(peerUserId);
    if (!peerId || peerId === user.id) throw new Error("私聊联系人无效");
    this.requireActiveChatUser(peerId, "联系人不存在、已停用或无聊天权限");
    const directKey = JSON.stringify([user.id, peerId].sort());
    return this.db.transaction(() => {
      this.db.prepare(
        `INSERT OR IGNORE INTO chat_conversation
           (type, direct_key, status, created_at, updated_at)
         VALUES ('D', ?, 'active', ?, ?)`
      ).run(directKey, Date.now(), Date.now());
      const conversation = this.db.prepare(
        `SELECT id FROM chat_conversation WHERE direct_key = ? AND type = 'D' AND status = 'active'`
      ).get(directKey);
      if (!conversation) throw new Error("创建私聊失败");
      const insertMember = this.db.prepare(
        `INSERT OR IGNORE INTO chat_conversation_member
           (conversation_id, user_id, role, joined_at) VALUES (?, ?, 'M', ?)`
      );
      const now = Date.now();
      insertMember.run(conversation.id, user.id, now);
      insertMember.run(conversation.id, peerId, now);
      return conversation.id;
    })();
  }
  createGroup(token, input) {
    const owner = this.requireUser(token);
    const name = input.name?.trim() ?? "";
    if (!name || name.length > 50) throw new Error("群聊名称长度应为1到50个字符");
    const memberIds = /* @__PURE__ */ new Set([owner.id]);
    for (const value of input.memberUserIds ?? []) {
      const id = this.normalizeUserId(value);
      if (id) memberIds.add(id);
    }
    if (memberIds.size < 3 || memberIds.size > 100) {
      throw new Error("群聊成员数量应为3到100人");
    }
    for (const id of memberIds) {
      this.requireActiveChatUser(id, "群聊包含不存在、已停用或无聊天权限的用户");
    }
    return this.db.transaction(() => {
      const now = Date.now();
      const result = this.db.prepare(
        `INSERT INTO chat_conversation
           (type, name, owner_user_id, status, created_at, updated_at)
         VALUES ('G', ?, ?, 'active', ?, ?)`
      ).run(name, owner.id, now, now);
      const conversationId = Number(result.lastInsertRowid);
      const insertMember = this.db.prepare(
        `INSERT INTO chat_conversation_member
           (conversation_id, user_id, role, joined_at) VALUES (?, ?, ?, ?)`
      );
      for (const id of memberIds) {
        insertMember.run(conversationId, id, id === owner.id ? "O" : "M", now);
      }
      return conversationId;
    })();
  }
  messages(token, query) {
    const user = this.requireUser(token);
    const conversationId = this.requirePositiveInteger(query.conversationId, "会话标识无效");
    this.requireMembership(conversationId, user.id);
    const after = this.positiveCursor(query.afterMessageId);
    const before = this.positiveCursor(query.beforeMessageId);
    const limit = Math.max(1, Math.min(query.limit ?? 50, 100));
    const conditions = ["m.conversation_id = ?", "m.deleted_at IS NULL"];
    const params = [conversationId];
    if (after !== void 0) {
      conditions.push("m.id > ?");
      params.push(after);
    }
    if (before !== void 0) {
      conditions.push("m.id < ?");
      params.push(before);
    }
    params.push(limit);
    const rows = this.db.prepare(
      `SELECT m.*, u.real_name AS sender_name
       FROM chat_message m JOIN sys_user u ON u.id = m.sender_user_id
       WHERE ${conditions.join(" AND ")}
       ORDER BY m.id ${after !== void 0 ? "ASC" : "DESC"} LIMIT ?`
    ).all(...params);
    if (after === void 0) rows.reverse();
    return rows.map((row) => this.toMessage(row));
  }
  send(token, input) {
    const user = this.requireUser(token);
    const conversationId = this.requirePositiveInteger(input.conversationId, "会话标识无效");
    this.requireMembership(conversationId, user.id);
    if (!CLIENT_MESSAGE_ID_PATTERN.test(input.clientMessageId ?? "")) {
      throw new Error("客户端消息标识无效");
    }
    const type = input.messageType?.trim() || "text";
    if (type !== "text") throw new Error("当前仅支持文本消息");
    const content = input.content?.trim() ?? "";
    if (!content || content.length > 2e3) throw new Error("消息内容长度应为1到2000个字符");
    return this.db.transaction(() => {
      const existing = this.findMessageByClientId(user.id, input.clientMessageId);
      if (existing) {
        if (existing.conversation_id !== conversationId) {
          throw new Error("客户端消息标识已用于其他会话");
        }
        return this.toMessage(existing);
      }
      const now = Date.now();
      const result = this.db.prepare(
        `INSERT INTO chat_message
           (conversation_id, sender_user_id, client_message_id, message_type, content, created_at)
         VALUES (?, ?, ?, 'text', ?, ?)`
      ).run(conversationId, user.id, input.clientMessageId, content, now);
      const messageId = Number(result.lastInsertRowid);
      const preview = content.replace(/\s+/g, " ").slice(0, 200);
      this.db.prepare(
        `UPDATE chat_conversation SET last_message_id = ?, last_message_preview = ?,
           last_message_at = ?, updated_at = ? WHERE id = ? AND status = 'active'`
      ).run(messageId, preview, now, now, conversationId);
      const message = this.findMessageById(messageId);
      if (!message) throw new Error("发送消息失败");
      return this.toMessage(message);
    })();
  }
  markRead(token, conversationIdValue, messageIdValue) {
    const user = this.requireUser(token);
    const conversationId = this.requirePositiveInteger(conversationIdValue, "已读位置无效");
    const messageId = this.requirePositiveInteger(messageIdValue, "已读位置无效");
    this.requireMembership(conversationId, user.id, "已读位置无效");
    const message = this.db.prepare(
      `SELECT id FROM chat_message WHERE id = ? AND conversation_id = ? AND deleted_at IS NULL`
    ).get(messageId, conversationId);
    if (!message) throw new Error("已读位置无效");
    this.db.prepare(
      `UPDATE chat_conversation_member
       SET last_read_message_id = MAX(last_read_message_id, ?), last_read_at = ?
       WHERE conversation_id = ? AND user_id = ? AND left_at IS NULL`
    ).run(messageId, Date.now(), conversationId, user.id);
  }
  requireUser(token) {
    if (typeof token !== "string" || !token) throw new Error("聊天登录已失效，请重新登录");
    const now = Date.now();
    const tokenHash = this.hashToken(token);
    const user = this.db.prepare(
      `SELECT u.id, u.username, u.password_hash, u.password_salt, u.real_name, u.department, r.menu_keys
       FROM chat_session_token t
       JOIN sys_user u ON u.id = t.user_id
       JOIN sys_role r ON r.id = u.role_id
       WHERE t.token_hash = ? AND t.expires_at > ?
         AND u.status = 'active' AND u.deleted_at IS NULL AND r.deleted_at IS NULL`
    ).get(tokenHash, now);
    if (!user || !this.hasChatPermission(user.menu_keys)) {
      this.db.prepare(`DELETE FROM chat_session_token WHERE token_hash = ? OR expires_at <= ?`).run(tokenHash, now);
      throw new Error("聊天登录已失效，请重新登录");
    }
    this.db.prepare(`UPDATE chat_session_token SET last_used_at = ? WHERE token_hash = ?`).run(now, tokenHash);
    return user;
  }
  requireActiveChatUser(userId, message) {
    const user = this.db.prepare(
      `SELECT u.id, u.username, u.password_hash, u.password_salt, u.real_name, u.department, r.menu_keys
       FROM sys_user u JOIN sys_role r ON r.id = u.role_id
       WHERE u.id = ? AND u.status = 'active' AND u.deleted_at IS NULL AND r.deleted_at IS NULL`
    ).get(userId);
    if (!user || !this.hasChatPermission(user.menu_keys)) throw new Error(message);
    return user;
  }
  requireMembership(conversationId, userId, message = "会话不存在或您不是会话成员") {
    const row = this.db.prepare(
      `SELECT 1 AS ok FROM chat_conversation_member cm
       JOIN chat_conversation c ON c.id = cm.conversation_id AND c.status = 'active'
       WHERE cm.conversation_id = ? AND cm.user_id = ? AND cm.left_at IS NULL`
    ).get(conversationId, userId);
    if (!row) throw new Error(message);
  }
  findMessageByClientId(userId, clientMessageId) {
    return this.db.prepare(
      `SELECT m.*, u.real_name AS sender_name FROM chat_message m
       JOIN sys_user u ON u.id = m.sender_user_id
       WHERE m.sender_user_id = ? AND m.client_message_id = ? AND m.deleted_at IS NULL`
    ).get(userId, clientMessageId);
  }
  findMessageById(messageId) {
    return this.db.prepare(
      `SELECT m.*, u.real_name AS sender_name FROM chat_message m
       JOIN sys_user u ON u.id = m.sender_user_id WHERE m.id = ? AND m.deleted_at IS NULL`
    ).get(messageId);
  }
  toMessage(row) {
    return {
      messageId: row.id,
      conversationId: row.conversation_id,
      senderUserId: row.sender_user_id,
      senderName: row.sender_name,
      clientMessageId: row.client_message_id,
      messageType: "text",
      content: row.content,
      createTime: this.toIso(row.created_at)
    };
  }
  toMe(user) {
    return { userId: user.id, userName: user.username, nickName: user.real_name };
  }
  hasChatPermission(value) {
    try {
      const keys = JSON.parse(value);
      return Array.isArray(keys) && (keys.includes("chat") || keys.includes("*"));
    } catch {
      return false;
    }
  }
  normalizeUserId(value) {
    if (typeof value === "number") return Number.isSafeInteger(value) && value > 0 ? String(value) : null;
    const normalized = typeof value === "string" ? value.trim() : "";
    return normalized && normalized.length <= 128 && /^[A-Za-z0-9_-]+$/.test(normalized) ? normalized : null;
  }
  requirePositiveInteger(value, message) {
    if (!Number.isSafeInteger(value) || value <= 0) throw new Error(message);
    return value;
  }
  positiveCursor(value) {
    return value !== void 0 && Number.isSafeInteger(value) && value > 0 ? value : void 0;
  }
  hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }
  toIso(timestamp) {
    return new Date(timestamp).toISOString();
  }
}
const MAX_IMPORT_FILE_SIZE = 2 * 1024 * 1024 * 1024;
const MAX_IMPORT_ROW_COUNT = 1e6;
const MAX_MANAGED_BACKUPS = 30;
const FUTURE_TIMESTAMP_TOLERANCE = 5 * 60 * 1e3;
const BACKUP_FILE_PATTERN = /^yanglao-.+\.db$/;
const IMPORT_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const STAGED_IMPORT_FILE_PATTERN = /^[0-9a-f-]{36}\.db(?:-(?:wal|shm))?$/i;
const SQLITE_EXTENSIONS = /* @__PURE__ */ new Set([".db", ".sqlite", ".sqlite3"]);
const EXCLUDED_TABLES = /* @__PURE__ */ new Set([
  "_migrations",
  "change_log",
  "sync_config",
  "sync_history",
  "lan_config",
  "sys_role",
  "sys_user",
  "sys_permission_group",
  "chat_conversation",
  "chat_conversation_member",
  "chat_message",
  "chat_session_token"
]);
const REMOTE_SYNC_TABLES = /* @__PURE__ */ new Set([
  "elderly",
  "family_contact",
  "health_profile",
  "vital_signs",
  "medication_order",
  "medication_record",
  "medical_visit",
  "admission",
  "leave_record",
  "discharge",
  "care_assessment",
  "care_plan",
  "care_record",
  "fee_item",
  "deposit_record",
  "monthly_bill",
  "bill_detail",
  "payment_record",
  "meal_menu",
  "meal_record",
  "nutrition_plan",
  "activity",
  "activity_attendance",
  "contract",
  "building",
  "room",
  "bed",
  "task_reminder",
  "iot_device_alert",
  "announcement"
]);
const LOCAL_ONLY_COLUMNS = {
  elderly: ["photo_path"],
  contract: ["file_path"],
  health_exam_result: ["attachment_path"],
  elderly_document: ["file_path"]
};
const SPECIAL_FRESHNESS_COLUMNS = {
  announcement_read: ["read_at"],
  health_alert: ["resolved_at", "opened_at"],
  iot_device_alert: ["resolved_at", "last_detected_at", "opened_at"],
  notification: ["read_at", "created_at"]
};
function quoteIdentifier$1(value) {
  return `"${value.replace(/"/g, '""')}"`;
}
function sqlString(value) {
  return `'${value.replace(/'/g, "''")}'`;
}
function valuesEqual(left, right) {
  if (Buffer.isBuffer(left) && Buffer.isBuffer(right)) return left.equals(right);
  return Object.is(left, right);
}
function removeDatabaseFiles(filePath) {
  for (const suffix of ["", "-wal", "-shm"]) fs.rmSync(`${filePath}${suffix}`, { force: true });
}
function controlledBackupPath(backupDirectory2, name) {
  if (typeof name !== "string" || !BACKUP_FILE_PATTERN.test(name)) {
    throw new Error("备份文件名无效");
  }
  const directory = path.resolve(backupDirectory2);
  const filePath = path.resolve(directory, name);
  if (path.dirname(filePath).toLowerCase() !== directory.toLowerCase() || !fs.existsSync(filePath)) {
    throw new Error("备份文件不存在或不在程序受控目录");
  }
  const realDirectory = fs.realpathSync(directory).toLowerCase();
  const realFilePath = fs.realpathSync(filePath);
  if (path.dirname(realFilePath).toLowerCase() !== realDirectory || !fs.statSync(realFilePath).isFile()) {
    throw new Error("备份文件不存在或不在程序受控目录");
  }
  return realFilePath;
}
function validateDatabaseForRestore(filePath) {
  let database;
  try {
    const stats = fs.statSync(filePath);
    if (!stats.isFile() || stats.size < 100 || stats.size > MAX_IMPORT_FILE_SIZE) {
      throw new Error("备份文件大小无效或超过 2 GB 限制");
    }
    database = new Database(filePath, { readonly: true, fileMustExist: true, timeout: 5e3 });
    const checkRows = database.pragma("quick_check");
    const messages = checkRows.map((row) => String(row.quick_check ?? "未知错误"));
    if (messages.length !== 1 || messages[0] !== "ok") {
      throw new Error(`数据库完整性检查失败：${messages.join("；")}`);
    }
    if (database.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = '_migrations'").get() === void 0) {
      throw new Error("备份不是养老管理系统数据库：缺少迁移记录");
    }
    const records = database.prepare("SELECT version, description FROM _migrations ORDER BY version").all();
    const supportedVersion = migrations.at(-1)?.version ?? 0;
    const backupVersion = records.at(-1)?.version;
    if (!Number.isInteger(backupVersion) || records.length === 0) {
      throw new Error("无法识别备份的结构版本");
    }
    if ((backupVersion ?? 0) > supportedVersion) {
      throw new Error(`备份结构版本 ${backupVersion} 高于当前支持版本 ${supportedVersion}`);
    }
    for (let index = 0; index < records.length; index += 1) {
      const record = records[index];
      const supported = migrations[index];
      if (!supported || record.version !== supported.version || record.description !== supported.description) {
        throw new Error(`备份迁移记录 v${record.version} 与当前应用不兼容`);
      }
    }
  } finally {
    database?.close();
  }
}
function snapshotDatabase(sourcePath, targetPath) {
  let source;
  try {
    source = new Database(sourcePath, { readonly: true, fileMustExist: true, timeout: 5e3 });
    source.exec(`VACUUM INTO ${sqlString(targetPath)}`);
  } finally {
    source?.close();
  }
}
function applyPendingDatabaseRestore(options) {
  const pendingRestorePath2 = path.resolve(options.pendingRestorePath);
  if (!fs.existsSync(pendingRestorePath2)) return null;
  const dbPath2 = path.resolve(options.dbPath);
  const backupDirectory2 = path.resolve(options.backupDirectory);
  const databaseDirectory = path.dirname(dbPath2);
  fs.mkdirSync(databaseDirectory, { recursive: true });
  fs.mkdirSync(backupDirectory2, { recursive: true });
  const temporaryPath = path.resolve(databaseDirectory, `restore-${crypto.randomUUID()}.db`);
  const rollbackPath = path.resolve(databaseDirectory, `restore-rollback-${crypto.randomUUID()}.db`);
  let request;
  let currentMoved = false;
  let originalPreserved = fs.existsSync(dbPath2);
  let safetyBackup;
  try {
    request = JSON.parse(fs.readFileSync(pendingRestorePath2, "utf8"));
    if (!request || typeof request.name !== "string" || typeof request.requestedAt !== "string") {
      throw new Error("数据库恢复请求无效");
    }
    const sourcePath = controlledBackupPath(backupDirectory2, request.name);
    validateDatabaseForRestore(sourcePath);
    snapshotDatabase(sourcePath, temporaryPath);
    validateDatabaseForRestore(temporaryPath);
    if (fs.existsSync(dbPath2)) {
      const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
      const safetyName = `yanglao-before-restore-${stamp}-${crypto.randomUUID().slice(0, 8)}.db`;
      const safetyPath = path.resolve(backupDirectory2, safetyName);
      snapshotDatabase(dbPath2, safetyPath);
      validateDatabaseForRestore(safetyPath);
      const stats = fs.statSync(safetyPath);
      safetyBackup = {
        name: safetyName,
        path: safetyPath,
        size: stats.size,
        createdAt: stats.mtime.toISOString()
      };
      fs.renameSync(dbPath2, rollbackPath);
      currentMoved = true;
    }
    removeDatabaseFiles(dbPath2);
    fs.renameSync(temporaryPath, dbPath2);
    validateDatabaseForRestore(dbPath2);
    removeDatabaseFiles(rollbackPath);
    return { restored: true, name: request.name, safetyBackup, originalPreserved: true };
  } catch (error) {
    if (currentMoved && fs.existsSync(rollbackPath)) {
      try {
        removeDatabaseFiles(dbPath2);
        fs.renameSync(rollbackPath, dbPath2);
        validateDatabaseForRestore(dbPath2);
        originalPreserved = true;
      } catch (rollbackError) {
        originalPreserved = false;
        const reason = rollbackError instanceof Error ? rollbackError.message : "未知错误";
        return {
          restored: false,
          name: request?.name,
          safetyBackup,
          originalPreserved,
          error: `数据库恢复失败，自动回滚也未完成：${reason}`
        };
      }
    }
    return {
      restored: false,
      name: request?.name,
      safetyBackup,
      originalPreserved,
      error: error instanceof Error ? error.message : "数据库备份恢复失败"
    };
  } finally {
    removeDatabaseFiles(temporaryPath);
    if (!currentMoved || originalPreserved) removeDatabaseFiles(rollbackPath);
    fs.rmSync(pendingRestorePath2, { force: true });
  }
}
class DatabaseBackupService {
  constructor(db2, options) {
    this.db = db2;
    this.dbPath = path.resolve(options.dbPath);
    this.backupDirectory = path.resolve(options.backupDirectory);
    this.importDirectory = path.resolve(options.importDirectory);
    fs.mkdirSync(this.backupDirectory, { recursive: true });
    fs.mkdirSync(this.importDirectory, { recursive: true });
    this.clearStagedImports();
  }
  db;
  backupDirectory;
  importDirectory;
  dbPath;
  createBackup() {
    this.assertBackupDiskSpace();
    this.db.pragma("wal_checkpoint(FULL)");
    const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    const name = `yanglao-${stamp}-${crypto.randomUUID().slice(0, 8)}.db`;
    const backupPath = path.resolve(this.backupDirectory, name);
    this.db.exec(`VACUUM INTO ${sqlString(backupPath)}`);
    const result = this.backupInfo(name);
    this.pruneBackups();
    return result;
  }
  listBackups() {
    return fs.readdirSync(this.backupDirectory).filter((name) => BACKUP_FILE_PATTERN.test(name)).map((name) => this.backupInfo(name)).sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }
  getBackupPath(name) {
    return controlledBackupPath(this.backupDirectory, name);
  }
  scheduleRestore(name, pendingRestorePath2) {
    const sourcePath = this.getBackupPath(name);
    validateDatabaseForRestore(sourcePath);
    const requestPath = path.resolve(pendingRestorePath2);
    fs.mkdirSync(path.dirname(requestPath), { recursive: true });
    const request = { name, requestedAt: (/* @__PURE__ */ new Date()).toISOString() };
    fs.writeFileSync(requestPath, JSON.stringify(request), { encoding: "utf8", mode: 384 });
    return { scheduled: true };
  }
  integrityCheck() {
    const rows = this.db.pragma("integrity_check");
    const messages = rows.map((row) => String(row.integrity_check ?? "未知检查结果"));
    return {
      ok: messages.length === 1 && messages[0] === "ok",
      messages,
      checkedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  async stageLocalDataFile(sourcePath) {
    const resolvedSource = path.resolve(sourcePath);
    if (!SQLITE_EXTENSIONS.has(path.extname(resolvedSource).toLowerCase())) {
      throw new Error("只支持 .db、.sqlite 或 .sqlite3 数据文件");
    }
    if (resolvedSource.toLowerCase() === this.dbPath.toLowerCase()) {
      throw new Error("不能同步当前正在使用的数据库文件");
    }
    if (!fs.existsSync(resolvedSource)) throw new Error("所选数据文件不存在");
    const sourceStats = fs.statSync(resolvedSource);
    if (!sourceStats.isFile() || sourceStats.size < 100 || sourceStats.size > MAX_IMPORT_FILE_SIZE) {
      throw new Error("数据文件大小无效或超过 2 GB 限制");
    }
    this.assertAvailableDiskSpace(resolvedSource, sourceStats.size);
    const importId = crypto.randomUUID();
    const stagedPath = this.stagedImportPath(importId);
    let source;
    try {
      source = new Database(resolvedSource, { readonly: true, fileMustExist: true, timeout: 5e3 });
      await source.backup(stagedPath);
      return {
        importId,
        fileName: this.safeSourceName(path.basename(resolvedSource)),
        size: fs.statSync(stagedPath).size
      };
    } catch (error) {
      this.discardStagedImport(stagedPath);
      throw error;
    } finally {
      source?.close();
    }
  }
  syncFromStagedFile(importId, requestedSourceName) {
    const importPath = this.stagedImportPath(importId);
    const sourceName = this.safeSourceName(requestedSourceName);
    let imported;
    try {
      if (!fs.existsSync(importPath)) throw new Error("待同步的数据文件不存在或已失效，请重新选择");
      const size = fs.statSync(importPath).size;
      if (size < 100 || size > MAX_IMPORT_FILE_SIZE) throw new Error("数据文件大小无效或超过 2 GB 限制");
      imported = new Database(importPath, { readonly: true, fileMustExist: true, timeout: 5e3 });
      this.validateImportedDatabase(imported);
      const safetyBackup = this.createBackup();
      const merged = this.mergeImportedDatabase(imported, sourceName);
      return {
        sourceName,
        ...merged,
        safetyBackup,
        synchronizedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    } finally {
      try {
        imported?.close();
      } finally {
        this.discardStagedImport(importPath);
      }
    }
  }
  backupInfo(name) {
    const backupPath = this.getBackupPathUnchecked(name);
    const stats = fs.statSync(backupPath);
    return {
      name,
      path: backupPath,
      size: stats.size,
      createdAt: stats.mtime.toISOString()
    };
  }
  getBackupPathUnchecked(name) {
    return path.resolve(this.backupDirectory, name);
  }
  assertAvailableDiskSpace(sourcePath, sourceSize) {
    const walSize = fs.existsSync(`${sourcePath}-wal`) ? fs.statSync(`${sourcePath}-wal`).size : 0;
    const currentSize = fs.existsSync(this.dbPath) ? fs.statSync(this.dbPath).size : 0;
    const disk = fs.statfsSync(this.importDirectory);
    const available = Number(disk.bavail) * Number(disk.bsize);
    const required = (sourceSize + walSize) * 3 + currentSize * 2 + 256 * 1024 * 1024;
    if (available < required) {
      throw new Error("本机可用磁盘空间不足，无法创建同步快照和安全备份");
    }
  }
  validateImportedDatabase(imported) {
    const checkRows = imported.pragma("quick_check");
    const checkMessages = checkRows.map((row) => String(row.quick_check ?? "未知错误"));
    if (checkMessages.length !== 1 || checkMessages[0] !== "ok") {
      throw new Error(`数据文件完整性检查失败：${checkMessages.join("；")}`);
    }
    if (!this.tableExists(imported, "_migrations")) {
      throw new Error("所选文件不是养老管理系统数据库：缺少迁移记录");
    }
    const importedMigrations = imported.prepare("SELECT version, description FROM _migrations ORDER BY version").all();
    const localMigrationMap = new Map(migrations.map((row) => [row.version, row.description]));
    const importedVersion = importedMigrations.at(-1)?.version;
    const localVersion = migrations.at(-1)?.version;
    if (!Number.isInteger(importedVersion) || !Number.isInteger(localVersion)) {
      throw new Error("无法识别数据文件的结构版本");
    }
    if ((importedVersion ?? 0) > (localVersion ?? 0)) {
      throw new Error(`数据文件结构版本 ${importedVersion} 高于当前支持版本 ${localVersion}`);
    }
    for (const migration of importedMigrations) {
      if (localMigrationMap.get(migration.version) !== migration.description) {
        throw new Error(`数据文件迁移记录 v${migration.version} 与当前应用不兼容`);
      }
    }
    let totalRows = 0;
    for (const table of this.importableTables(imported)) {
      const row = imported.prepare(`SELECT COUNT(*) AS count FROM ${quoteIdentifier$1(table)}`).get();
      totalRows += row.count;
      if (totalRows > MAX_IMPORT_ROW_COUNT) {
        throw new Error(`数据文件记录数超过 ${MAX_IMPORT_ROW_COUNT} 条限制`);
      }
    }
  }
  mergeImportedDatabase(imported, sourceName) {
    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    const tables = [];
    const importStartedAt = Date.now();
    const mergeAll = this.db.transaction(() => {
      this.db.pragma("defer_foreign_keys = ON");
      for (const table of this.importableTables(imported)) {
        const result = this.mergeTable(imported, table, importStartedAt);
        if (result.inserted + result.updated + result.skipped > 0) tables.push(result);
        inserted += result.inserted;
        updated += result.updated;
        skipped += result.skipped;
      }
      if (this.tableExists(this.db, "operations_audit_log")) {
        this.db.prepare(
          `INSERT INTO operations_audit_log (id, domain, record_id, action, detail, created_at)
           VALUES (?, 'system', ?, 'local_sync', ?, ?)`
        ).run(
          crypto.randomUUID(),
          crypto.randomUUID(),
          `${sourceName}；新增 ${inserted}；更新 ${updated}；跳过 ${skipped}`,
          Date.now()
        );
      }
    });
    mergeAll();
    return { inserted, updated, skipped, tables };
  }
  mergeTable(imported, table, importStartedAt) {
    const localColumns = this.tableColumns(this.db, table);
    const importedColumns = new Set(this.tableColumns(imported, table).map((column) => column.name));
    const primaryKeys = localColumns.filter((column) => column.pk > 0).sort((left, right) => left.pk - right.pk).map((column) => column.name);
    if (primaryKeys.length === 0 || primaryKeys.some((column) => !importedColumns.has(column))) {
      throw new Error(`数据表 ${table} 缺少可识别的主键`);
    }
    const commonColumns = localColumns.map((column) => column.name).filter((column) => importedColumns.has(column));
    const missingRequired = localColumns.filter(
      (column) => !importedColumns.has(column.name) && column.notnull === 1 && column.dflt_value === null && column.pk === 0
    );
    if (missingRequired.length > 0) {
      throw new Error(`数据表 ${table} 缺少必要字段 ${missingRequired.map((column) => column.name).join("、")}`);
    }
    const selectImported = imported.prepare(
      `SELECT ${commonColumns.map(quoteIdentifier$1).join(", ")} FROM ${quoteIdentifier$1(table)}`
    );
    const wherePrimaryKey = primaryKeys.map((column) => `${quoteIdentifier$1(column)} = ?`).join(" AND ");
    const selectLocal = this.db.prepare(
      `SELECT * FROM ${quoteIdentifier$1(table)} WHERE ${wherePrimaryKey}`
    );
    const insertRow = this.db.prepare(
      `INSERT INTO ${quoteIdentifier$1(table)} (${commonColumns.map(quoteIdentifier$1).join(", ")})
       VALUES (${commonColumns.map(() => "?").join(", ")})`
    );
    const updateColumns = commonColumns.filter((column) => !primaryKeys.includes(column));
    const updateRow = updateColumns.length > 0 ? this.db.prepare(
      `UPDATE ${quoteIdentifier$1(table)}
         SET ${updateColumns.map((column) => `${quoteIdentifier$1(column)} = ?`).join(", ")}
         WHERE ${wherePrimaryKey}`
    ) : null;
    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    for (const rawRow of selectImported.iterate()) {
      const row = { ...rawRow };
      const keyValues = primaryKeys.map((column) => row[column]);
      if (keyValues.some((value) => value === null || value === void 0 || value === "")) {
        throw new Error(`数据表 ${table} 包含无效主键`);
      }
      const local = selectLocal.get(...keyValues);
      for (const column of LOCAL_ONLY_COLUMNS[table] ?? []) {
        if (commonColumns.includes(column)) row[column] = local?.[column] ?? null;
      }
      if (!local) {
        insertRow.run(...commonColumns.map((column) => row[column]));
        this.enqueueRemoteSync(table, keyValues, row, "INSERT");
        inserted += 1;
        continue;
      }
      if (commonColumns.every((column) => valuesEqual(local[column], row[column]))) {
        skipped += 1;
        continue;
      }
      if (!this.importedRowIsNewer(table, commonColumns, row, local, importStartedAt)) {
        skipped += 1;
        continue;
      }
      if (!updateRow) {
        skipped += 1;
        continue;
      }
      updateRow.run(
        ...updateColumns.map((column) => row[column]),
        ...keyValues
      );
      this.enqueueRemoteSync(table, keyValues, row, "UPDATE");
      updated += 1;
    }
    return { table, inserted, updated, skipped };
  }
  importedRowIsNewer(table, commonColumns, imported, local, importStartedAt) {
    const freshnessColumns = commonColumns.includes("updated_at") ? ["updated_at"] : (SPECIAL_FRESHNESS_COLUMNS[table] ?? []).filter((column) => commonColumns.includes(column));
    if (freshnessColumns.length === 0) return false;
    const importedAt = this.latestTimestamp(imported, freshnessColumns);
    const localAt = this.latestTimestamp(local, freshnessColumns);
    if (!Number.isFinite(importedAt)) throw new Error(`数据表 ${table} 包含无效更新时间`);
    if (importedAt > importStartedAt + FUTURE_TIMESTAMP_TOLERANCE) {
      throw new Error(`数据表 ${table} 包含超出本机时间的记录`);
    }
    return importedAt > localAt;
  }
  latestTimestamp(row, columns) {
    let result = Number.NEGATIVE_INFINITY;
    for (const column of columns) {
      const value = row[column];
      if (value === null || value === void 0) continue;
      if (typeof value !== "number" || !Number.isFinite(value)) return Number.NaN;
      result = Math.max(result, value);
    }
    return result;
  }
  importableTables(imported) {
    const importedTables = new Set(
      imported.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all().map((row) => row.name)
    );
    return this.db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name").all().map((row) => row.name).filter((name) => !name.startsWith("sqlite_") && !EXCLUDED_TABLES.has(name) && importedTables.has(name));
  }
  tableColumns(database, table) {
    return database.prepare(`PRAGMA table_info(${quoteIdentifier$1(table)})`).all();
  }
  tableExists(database, table) {
    return database.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(table) !== void 0;
  }
  stagedImportPath(importId) {
    if (!IMPORT_ID_PATTERN.test(importId)) throw new Error("本地同步请求标识无效");
    return path.resolve(this.importDirectory, `${importId}.db`);
  }
  discardStagedImport(importPath) {
    for (const suffix of ["", "-wal", "-shm"]) fs.rmSync(`${importPath}${suffix}`, { force: true });
  }
  clearStagedImports() {
    for (const name of fs.readdirSync(this.importDirectory)) {
      if (STAGED_IMPORT_FILE_PATTERN.test(name)) {
        fs.rmSync(path.resolve(this.importDirectory, name), { force: true });
      }
    }
  }
  pruneBackups() {
    for (const backup of this.listBackups().slice(MAX_MANAGED_BACKUPS)) {
      fs.rmSync(backup.path, { force: true });
    }
  }
  assertBackupDiskSpace() {
    const currentSize = fs.existsSync(this.dbPath) ? fs.statSync(this.dbPath).size : 0;
    const disk = fs.statfsSync(this.backupDirectory);
    const available = Number(disk.bavail) * Number(disk.bsize);
    const required = currentSize * 2 + 128 * 1024 * 1024;
    if (available < required) throw new Error("本机可用磁盘空间不足，无法创建数据库备份");
  }
  enqueueRemoteSync(table, keyValues, row, operation) {
    if (!REMOTE_SYNC_TABLES.has(table) || !this.tableExists(this.db, "change_log")) return;
    const recordId = keyValues.map((value) => String(value)).join(":");
    if (!recordId || recordId.length > 64) return;
    const payload = { ...row };
    for (const column of LOCAL_ONLY_COLUMNS[table] ?? []) delete payload[column];
    this.db.prepare(
      `INSERT INTO change_log
       (id, table_name, record_id, operation, payload, created_at, synced)
       VALUES (?, ?, ?, ?, ?, ?, 0)`
    ).run(crypto.randomUUID(), table, recordId, operation, JSON.stringify(payload), Date.now());
  }
  safeSourceName(value) {
    const normalized = typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f]/g, "").trim() : "";
    return normalized.slice(0, 200) || "本地 SQLite 数据文件";
  }
}
let _db = null;
function initDatabase(dbPath2) {
  if (_db) return _db;
  _db = new Database(dbPath2);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");
  _db.pragma("synchronous = NORMAL");
  _db.pragma("cache_size = -32000");
  runMigrations(_db);
  console.info(`[DB] 已连接: ${dbPath2}`);
  return _db;
}
function getDatabase() {
  if (!_db) throw new Error("数据库未初始化，请先调用 initDatabase()");
  return _db;
}
function createRepos(db2 = getDatabase()) {
  return {
    changeLog: new ChangeLogRepo(db2),
    syncConfig: new SyncConfigRepo(db2),
    elderly: new ElderlyRepo(db2),
    building: new BuildingRepo(db2),
    familyContact: new FamilyContactRepo(db2),
    health: new HealthRepo(db2),
    admission: new AdmissionRepo(db2),
    care: new CareRepo(db2),
    fee: new FeeRepo(db2),
    meal: new MealRepo(db2),
    activity: new ActivityRepo(db2),
    contract: new ContractRepo(db2),
    notification: new NotificationRepo(db2),
    user: new UserRepo(db2),
    attendance: new AttendanceRepo(db2),
    iot: new IotRepo(db2),
    permissionGroup: new PermissionGroupRepo(db2),
    taskReminder: new TaskReminderRepo(db2),
    announcement: new AnnouncementRepo(db2),
    operations: new OperationsRepo(db2),
    supplier: new SupplierRepo(db2),
    purchaseOrder: new PurchaseOrderRepo(db2),
    chat: new ChatRepo(db2)
  };
}
class SyncEngine {
  constructor(getUnsynced, markSynced, updateLastSync, saveHistory, deviceId2, applyRemoteChanges2) {
    this.getUnsynced = getUnsynced;
    this.markSynced = markSynced;
    this.updateLastSync = updateLastSync;
    this.saveHistory = saveHistory;
    this.applyRemoteChanges = applyRemoteChanges2;
    this.deviceId = deviceId2;
    this.http = axios.create({ timeout: 15e3 });
  }
  getUnsynced;
  markSynced;
  updateLastSync;
  saveHistory;
  applyRemoteChanges;
  http;
  deviceId;
  accessToken = "";
  /** 更新同步服务端 URL（配置变更时调用） */
  setServerUrl(url, timeoutMs = 15e3) {
    this.http = axios.create({
      baseURL: url,
      timeout: timeoutMs,
      headers: this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : void 0
    });
  }
  setAccessToken(accessToken) {
    this.accessToken = accessToken?.trim() ?? "";
  }
  /**
   * 执行一次完整同步
   * @param trigger 触发方式
   * @param direction 同步方向
   * @param lastSyncAt 上次同步时间戳（ms），用于下行增量同步
   */
  async sync(trigger, direction, lastSyncAt, lastSyncCursor) {
    const startedAt = Date.now();
    let recordsSent = 0;
    let recordsReceived = 0;
    let nextSyncAt = Date.now();
    let nextSyncCursor = lastSyncCursor;
    try {
      if (direction === "upload" || direction === "both") {
        const unsyncedRows = this.getUnsynced(500);
        if (unsyncedRows.length > 0) {
          const payload = {
            deviceId: this.deviceId,
            clientTime: Date.now(),
            changes: unsyncedRows.map((r) => ({
              id: r.id,
              tableName: r.table_name,
              recordId: r.record_id,
              operation: r.operation,
              payload: JSON.parse(r.payload),
              createdAt: r.created_at,
              synced: r.synced === 1,
              syncedAt: r.synced_at ?? void 0
            }))
          };
          const res = await this.http.post("/sync/upload", payload);
          if (res.data.code === 0 || res.data.code === 200) {
            const acceptedIds = res.data.data?.acceptedIds;
            const ids = acceptedIds ? unsyncedRows.map((r) => r.id).filter((id) => acceptedIds.includes(id)) : res.data.data?.received === unsyncedRows.length ? unsyncedRows.map((r) => r.id) : [];
            if (ids.length !== unsyncedRows.length) {
              throw new Error("服务端未确认全部上传变更");
            }
            this.markSynced(ids);
            recordsSent = ids.length;
          } else {
            throw new Error(`上传失败: ${res.data.message ?? res.data.msg ?? "未知错误"}`);
          }
        }
      }
      if (direction === "download" || direction === "both") {
        const payload = {
          deviceId: this.deviceId,
          lastSyncAt: lastSyncAt ?? 0,
          lastSyncCursor
        };
        const res = await this.http.post("/sync/download", payload);
        if (res.data.code === 0 || res.data.code === 200) {
          const changes = res.data.data?.changes ?? [];
          await this.applyRemoteChanges?.(changes);
          recordsReceived = changes.length;
          nextSyncAt = res.data.data?.nextSyncAt ?? Date.now();
          nextSyncCursor = res.data.data?.nextSyncCursor ?? nextSyncCursor;
        }
      }
      const durationMs = Date.now() - startedAt;
      const result = {
        status: "success",
        recordsSent,
        recordsReceived,
        durationMs,
        nextSyncAt,
        nextSyncCursor
      };
      this.updateLastSync("success", void 0, nextSyncAt, nextSyncCursor);
      this.saveHistory({ ...result, trigger, direction });
      return result;
    } catch (err) {
      const durationMs = Date.now() - startedAt;
      const errorMsg = err instanceof Error ? err.message : String(err);
      const result = {
        status: "error",
        recordsSent,
        recordsReceived,
        durationMs,
        error: errorMsg
      };
      this.updateLastSync("error", errorMsg);
      this.saveHistory({ ...result, trigger, direction });
      return result;
    }
  }
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var dayjs_min$1 = { exports: {} };
var dayjs_min = dayjs_min$1.exports;
var hasRequiredDayjs_min;
function requireDayjs_min() {
  if (hasRequiredDayjs_min) return dayjs_min$1.exports;
  hasRequiredDayjs_min = 1;
  (function(module2, exports) {
    !(function(t, e) {
      module2.exports = e();
    })(dayjs_min, (function() {
      var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s = "minute", u = "hour", a = "day", o = "week", c = "month", f = "quarter", h = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|YYYY|YY|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(t2) {
        var e2 = ["th", "st", "nd", "rd"], n2 = t2 % 100;
        return "[" + t2 + (e2[(n2 - 20) % 10] || e2[n2] || e2[0]) + "]";
      } }, m = function(t2, e2, n2) {
        var r2 = String(t2);
        return !r2 || r2.length >= e2 ? t2 : "" + Array(e2 + 1 - r2.length).join(n2) + t2;
      }, v = { s: m, z: function(t2) {
        var e2 = -t2.utcOffset(), n2 = Math.abs(e2), r2 = Math.floor(n2 / 60), i2 = n2 % 60;
        return (e2 <= 0 ? "+" : "-") + m(r2, 2, "0") + ":" + m(i2, 2, "0");
      }, m: function t2(e2, n2) {
        if (e2.date() < n2.date()) return -t2(n2, e2);
        var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i2 = e2.clone().add(r2, c), s2 = n2 - i2 < 0, u2 = e2.clone().add(r2 + (s2 ? -1 : 1), c);
        return +(-(r2 + (n2 - i2) / (s2 ? i2 - u2 : u2 - i2)) || 0);
      }, a: function(t2) {
        return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
      }, p: function(t2) {
        return { M: c, y: h, w: o, d: a, D: d, h: u, m: s, s: i, ms: r, Q: f }[t2] || String(t2 || "").toLowerCase().replace(/s$/, "");
      }, u: function(t2) {
        return void 0 === t2;
      } }, g = "en", D = {};
      D[g] = M;
      var p = "$isDayjsObject", S = function(t2) {
        return t2 instanceof _ || !(!t2 || !t2[p]);
      }, w = function t2(e2, n2, r2) {
        var i2;
        if (!e2) return g;
        if ("string" == typeof e2) {
          var s2 = e2.toLowerCase();
          D[s2] && (i2 = s2), n2 && (D[s2] = n2, i2 = s2);
          var u2 = e2.split("-");
          if (!i2 && u2.length > 1) return t2(u2[0]);
        } else {
          var a2 = e2.name;
          D[a2] = e2, i2 = a2;
        }
        return !r2 && i2 && (g = i2), i2 || !r2 && g;
      }, O = function(t2, e2) {
        if (S(t2)) return t2.clone();
        var n2 = "object" == typeof e2 ? e2 : {};
        return n2.date = t2, n2.args = arguments, new _(n2);
      }, b = v;
      b.l = w, b.i = S, b.w = function(t2, e2) {
        return O(t2, { locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset });
      };
      var _ = (function() {
        function M2(t2) {
          this.$L = w(t2.locale, null, true), this.parse(t2), this.$x = this.$x || t2.x || {}, this[p] = true;
        }
        var m2 = M2.prototype;
        return m2.parse = function(t2) {
          this.$d = (function(t3) {
            var e2 = t3.date, n2 = t3.utc;
            if (null === e2) return /* @__PURE__ */ new Date(NaN);
            if (b.u(e2)) return /* @__PURE__ */ new Date();
            if (e2 instanceof Date) return new Date(e2);
            if ("string" == typeof e2 && !/Z$/i.test(e2)) {
              var r2 = e2.match($);
              if (r2) {
                var i2 = r2[2] - 1 || 0, s2 = (r2[7] || "0").substring(0, 3);
                return n2 ? new Date(Date.UTC(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2)) : new Date(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2);
              }
            }
            return new Date(e2);
          })(t2), this.init();
        }, m2.init = function() {
          var t2 = this.$d;
          this.$y = t2.getFullYear(), this.$M = t2.getMonth(), this.$D = t2.getDate(), this.$W = t2.getDay(), this.$H = t2.getHours(), this.$m = t2.getMinutes(), this.$s = t2.getSeconds(), this.$ms = t2.getMilliseconds();
        }, m2.$utils = function() {
          return b;
        }, m2.isValid = function() {
          return !(this.$d.toString() === l);
        }, m2.isSame = function(t2, e2) {
          var n2 = O(t2);
          return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
        }, m2.isAfter = function(t2, e2) {
          return O(t2) < this.startOf(e2);
        }, m2.isBefore = function(t2, e2) {
          return this.endOf(e2) < O(t2);
        }, m2.$g = function(t2, e2, n2) {
          return b.u(t2) ? this[e2] : this.set(n2, t2);
        }, m2.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, m2.valueOf = function() {
          return this.$d.getTime();
        }, m2.startOf = function(t2, e2) {
          var n2 = this, r2 = !!b.u(e2) || e2, f2 = b.p(t2), l2 = function(t3, e3) {
            var i2 = b.w(n2.$u ? Date.UTC(n2.$y, e3, t3) : new Date(n2.$y, e3, t3), n2);
            return r2 ? i2 : i2.endOf(a);
          }, $2 = function(t3, e3) {
            return b.w(n2.toDate()[t3].apply(n2.toDate("s"), (r2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e3)), n2);
          }, y2 = this.$W, M3 = this.$M, m3 = this.$D, v2 = "set" + (this.$u ? "UTC" : "");
          switch (f2) {
            case h:
              return r2 ? l2(1, 0) : l2(31, 11);
            case c:
              return r2 ? l2(1, M3) : l2(0, M3 + 1);
            case o:
              var g2 = this.$locale().weekStart || 0, D2 = (y2 < g2 ? y2 + 7 : y2) - g2;
              return l2(r2 ? m3 - D2 : m3 + (6 - D2), M3);
            case a:
            case d:
              return $2(v2 + "Hours", 0);
            case u:
              return $2(v2 + "Minutes", 1);
            case s:
              return $2(v2 + "Seconds", 2);
            case i:
              return $2(v2 + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, m2.endOf = function(t2) {
          return this.startOf(t2, false);
        }, m2.$set = function(t2, e2) {
          var n2, o2 = b.p(t2), f2 = "set" + (this.$u ? "UTC" : ""), l2 = (n2 = {}, n2[a] = f2 + "Date", n2[d] = f2 + "Date", n2[c] = f2 + "Month", n2[h] = f2 + "FullYear", n2[u] = f2 + "Hours", n2[s] = f2 + "Minutes", n2[i] = f2 + "Seconds", n2[r] = f2 + "Milliseconds", n2)[o2], $2 = o2 === a ? this.$D + (e2 - this.$W) : e2;
          if (o2 === c || o2 === h) {
            var y2 = this.clone().set(d, 1);
            y2.$d[l2]($2), y2.init(), this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d;
          } else l2 && this.$d[l2]($2);
          return this.init(), this;
        }, m2.set = function(t2, e2) {
          return this.clone().$set(t2, e2);
        }, m2.get = function(t2) {
          return this[b.p(t2)]();
        }, m2.add = function(r2, f2) {
          var d2, l2 = this;
          r2 = Number(r2);
          var $2 = b.p(f2), y2 = function(t2) {
            var e2 = O(l2);
            return b.w(e2.date(e2.date() + Math.round(t2 * r2)), l2);
          };
          if ($2 === c) return this.set(c, this.$M + r2);
          if ($2 === h) return this.set(h, this.$y + r2);
          if ($2 === a) return y2(1);
          if ($2 === o) return y2(7);
          var M3 = (d2 = {}, d2[s] = e, d2[u] = n, d2[i] = t, d2)[$2] || 1, m3 = this.$d.getTime() + r2 * M3;
          return b.w(m3, this);
        }, m2.subtract = function(t2, e2) {
          return this.add(-1 * t2, e2);
        }, m2.format = function(t2) {
          var e2 = this, n2 = this.$locale();
          if (!this.isValid()) return n2.invalidDate || l;
          var r2 = t2 || "YYYY-MM-DDTHH:mm:ssZ", i2 = b.z(this), s2 = this.$H, u2 = this.$m, a2 = this.$M, o2 = n2.weekdays, c2 = n2.months, f2 = n2.meridiem, h2 = function(t3, n3, i3, s3) {
            return t3 && (t3[n3] || t3(e2, r2)) || i3[n3].slice(0, s3);
          }, d2 = function(t3) {
            return b.s(s2 % 12 || 12, t3, "0");
          }, $2 = f2 || function(t3, e3, n3) {
            var r3 = t3 < 12 ? "AM" : "PM";
            return n3 ? r3.toLowerCase() : r3;
          };
          return r2.replace(y, (function(t3, r3) {
            return r3 || (function(t4) {
              switch (t4) {
                case "YY":
                  return String(e2.$y).slice(-2);
                case "YYYY":
                  return b.s(e2.$y, 4, "0");
                case "M":
                  return a2 + 1;
                case "MM":
                  return b.s(a2 + 1, 2, "0");
                case "MMM":
                  return h2(n2.monthsShort, a2, c2, 3);
                case "MMMM":
                  return h2(c2, a2);
                case "D":
                  return e2.$D;
                case "DD":
                  return b.s(e2.$D, 2, "0");
                case "d":
                  return String(e2.$W);
                case "dd":
                  return h2(n2.weekdaysMin, e2.$W, o2, 2);
                case "ddd":
                  return h2(n2.weekdaysShort, e2.$W, o2, 3);
                case "dddd":
                  return o2[e2.$W];
                case "H":
                  return String(s2);
                case "HH":
                  return b.s(s2, 2, "0");
                case "h":
                  return d2(1);
                case "hh":
                  return d2(2);
                case "a":
                  return $2(s2, u2, true);
                case "A":
                  return $2(s2, u2, false);
                case "m":
                  return String(u2);
                case "mm":
                  return b.s(u2, 2, "0");
                case "s":
                  return String(e2.$s);
                case "ss":
                  return b.s(e2.$s, 2, "0");
                case "SSS":
                  return b.s(e2.$ms, 3, "0");
                case "Z":
                  return i2;
              }
              return null;
            })(t3) || i2.replace(":", "");
          }));
        }, m2.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, m2.diff = function(r2, d2, l2) {
          var $2, y2 = this, M3 = b.p(d2), m3 = O(r2), v2 = (m3.utcOffset() - this.utcOffset()) * e, g2 = this - m3, D2 = function() {
            return b.m(y2, m3);
          };
          switch (M3) {
            case h:
              $2 = D2() / 12;
              break;
            case c:
              $2 = D2();
              break;
            case f:
              $2 = D2() / 3;
              break;
            case o:
              $2 = (g2 - v2) / 6048e5;
              break;
            case a:
              $2 = (g2 - v2) / 864e5;
              break;
            case u:
              $2 = g2 / n;
              break;
            case s:
              $2 = g2 / e;
              break;
            case i:
              $2 = g2 / t;
              break;
            default:
              $2 = g2;
          }
          return l2 ? $2 : b.a($2);
        }, m2.daysInMonth = function() {
          return this.endOf(c).$D;
        }, m2.$locale = function() {
          return D[this.$L];
        }, m2.locale = function(t2, e2) {
          if (!t2) return this.$L;
          var n2 = this.clone(), r2 = w(t2, e2, true);
          return r2 && (n2.$L = r2), n2;
        }, m2.clone = function() {
          return b.w(this.$d, this);
        }, m2.toDate = function() {
          return new Date(this.valueOf());
        }, m2.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, m2.toISOString = function() {
          return this.$d.toISOString();
        }, m2.toString = function() {
          return this.$d.toUTCString();
        }, M2;
      })(), Y = _.prototype;
      return O.prototype = Y, [["$ms", r], ["$s", i], ["$m", s], ["$H", u], ["$W", a], ["$M", c], ["$y", h], ["$D", d]].forEach((function(t2) {
        Y[t2[1]] = function(e2) {
          return this.$g(e2, t2[0], t2[1]);
        };
      })), O.extend = function(t2, e2) {
        return t2.$i || (t2(e2, _, O), t2.$i = true), O;
      }, O.locale = w, O.isDayjs = S, O.unix = function(t2) {
        return O(1e3 * t2);
      }, O.en = D[g], O.Ls = D, O.p = {}, O;
    }));
  })(dayjs_min$1);
  return dayjs_min$1.exports;
}
var dayjs_minExports = requireDayjs_min();
const dayjs = /* @__PURE__ */ getDefaultExportFromCjs(dayjs_minExports);
var relativeTime$2 = { exports: {} };
var relativeTime$1 = relativeTime$2.exports;
var hasRequiredRelativeTime;
function requireRelativeTime() {
  if (hasRequiredRelativeTime) return relativeTime$2.exports;
  hasRequiredRelativeTime = 1;
  (function(module2, exports) {
    !(function(r, e) {
      module2.exports = e();
    })(relativeTime$1, (function() {
      return function(r, e, t) {
        r = r || {};
        var n = e.prototype, o = { future: "in %s", past: "%s ago", s: "a few seconds", m: "a minute", mm: "%d minutes", h: "an hour", hh: "%d hours", d: "a day", dd: "%d days", M: "a month", MM: "%d months", y: "a year", yy: "%d years" };
        function i(r2, e2, t2, o2) {
          return n.fromToBase(r2, e2, t2, o2);
        }
        t.en.relativeTime = o, n.fromToBase = function(e2, n2, i2, d2, u) {
          for (var f, a, s, l = i2.$locale().relativeTime || o, h = r.thresholds || [{ l: "s", r: 44, d: "second" }, { l: "m", r: 89 }, { l: "mm", r: 44, d: "minute" }, { l: "h", r: 89 }, { l: "hh", r: 21, d: "hour" }, { l: "d", r: 35 }, { l: "dd", r: 25, d: "day" }, { l: "M", r: 45 }, { l: "MM", r: 10, d: "month" }, { l: "y", r: 17 }, { l: "yy", d: "year" }], m = h.length, c = 0; c < m; c += 1) {
            var y = h[c];
            y.d && (f = d2 ? t(e2).diff(i2, y.d, true) : i2.diff(e2, y.d, true));
            var p = (r.rounding || Math.round)(Math.abs(f));
            if (s = f > 0, p <= y.r || !y.r) {
              p <= 1 && c > 0 && (y = h[c - 1]);
              var v = l[y.l];
              u && (p = u("" + p)), a = "string" == typeof v ? v.replace("%d", p) : v(p, n2, y.l, s);
              break;
            }
          }
          if (n2) return a;
          var M = s ? l.future : l.past;
          return "function" == typeof M ? M(a) : M.replace("%s", a);
        }, n.to = function(r2, e2) {
          return i(r2, e2, this, true);
        }, n.from = function(r2, e2) {
          return i(r2, e2, this);
        };
        var d = function(r2) {
          return r2.$u ? t.utc() : t();
        };
        n.toNow = function(r2) {
          return this.to(d(this), r2);
        }, n.fromNow = function(r2) {
          return this.from(d(this), r2);
        };
      };
    }));
  })(relativeTime$2);
  return relativeTime$2.exports;
}
var relativeTimeExports = requireRelativeTime();
const relativeTime = /* @__PURE__ */ getDefaultExportFromCjs(relativeTimeExports);
var duration$4 = { exports: {} };
var duration$3 = duration$4.exports;
var hasRequiredDuration;
function requireDuration() {
  if (hasRequiredDuration) return duration$4.exports;
  hasRequiredDuration = 1;
  (function(module2, exports) {
    !(function(t, s) {
      module2.exports = s();
    })(duration$3, (function() {
      var t, s, n = 1e3, i = 6e4, e = 36e5, r = 864e5, o = 31536e6, u = 2628e6, d = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/, a = /\[([^\]]+)]|YYYY|YY|Y|M{1,2}|D{1,2}|H{1,2}|m{1,2}|s{1,2}|SSS/g, h = { years: o, months: u, days: r, hours: e, minutes: i, seconds: n, milliseconds: 1, weeks: 6048e5 }, c = function(t2) {
        return t2 instanceof g;
      }, f = function(t2, s2, n2) {
        return new g(t2, n2, s2.$l);
      }, m = function(t2) {
        return s.p(t2) + "s";
      }, l = function(t2) {
        return t2 < 0;
      }, $ = function(t2) {
        return l(t2) ? Math.ceil(t2) : Math.floor(t2);
      }, y = function(t2) {
        return Math.abs(t2);
      }, v = function(t2, s2) {
        return t2 ? l(t2) ? { negative: true, format: "" + y(t2) + s2 } : { negative: false, format: "" + t2 + s2 } : { negative: false, format: "" };
      }, g = (function() {
        function l2(t2, s2, n2) {
          var i2 = this;
          if (this.$d = {}, this.$l = n2, void 0 === t2 && (this.$ms = 0, this.parseFromMilliseconds()), s2) return f(t2 * h[m(s2)], this);
          if ("number" == typeof t2) return this.$ms = t2, this.parseFromMilliseconds(), this;
          if ("object" == typeof t2) return Object.keys(t2).forEach((function(s3) {
            i2.$d[m(s3)] = t2[s3];
          })), this.calMilliseconds(), this;
          if ("string" == typeof t2) {
            var e2 = t2.match(d);
            if (e2) {
              var r2 = e2.slice(2).map((function(t3) {
                return null != t3 ? Number(t3) : 0;
              }));
              return this.$d.years = r2[0], this.$d.months = r2[1], this.$d.weeks = r2[2], this.$d.days = r2[3], this.$d.hours = r2[4], this.$d.minutes = r2[5], this.$d.seconds = r2[6], this.calMilliseconds(), this;
            }
          }
          return this;
        }
        var y2 = l2.prototype;
        return y2.calMilliseconds = function() {
          var t2 = this;
          this.$ms = Object.keys(this.$d).reduce((function(s2, n2) {
            return s2 + (t2.$d[n2] || 0) * h[n2];
          }), 0);
        }, y2.parseFromMilliseconds = function() {
          var t2 = this.$ms;
          this.$d.years = $(t2 / o), t2 %= o, this.$d.months = $(t2 / u), t2 %= u, this.$d.days = $(t2 / r), t2 %= r, this.$d.hours = $(t2 / e), t2 %= e, this.$d.minutes = $(t2 / i), t2 %= i, this.$d.seconds = $(t2 / n), t2 %= n, this.$d.milliseconds = t2;
        }, y2.toISOString = function() {
          var t2 = v(this.$d.years, "Y"), s2 = v(this.$d.months, "M"), n2 = +this.$d.days || 0;
          this.$d.weeks && (n2 += 7 * this.$d.weeks);
          var i2 = v(n2, "D"), e2 = v(this.$d.hours, "H"), r2 = v(this.$d.minutes, "M"), o2 = this.$d.seconds || 0;
          this.$d.milliseconds && (o2 += this.$d.milliseconds / 1e3, o2 = Math.round(1e3 * o2) / 1e3);
          var u2 = v(o2, "S"), d2 = t2.negative || s2.negative || i2.negative || e2.negative || r2.negative || u2.negative, a2 = e2.format || r2.format || u2.format ? "T" : "", h2 = (d2 ? "-" : "") + "P" + t2.format + s2.format + i2.format + a2 + e2.format + r2.format + u2.format;
          return "P" === h2 || "-P" === h2 ? "P0D" : h2;
        }, y2.toJSON = function() {
          return this.toISOString();
        }, y2.format = function(t2) {
          var n2 = t2 || "YYYY-MM-DDTHH:mm:ss", i2 = { Y: this.$d.years, YY: s.s(this.$d.years, 2, "0"), YYYY: s.s(this.$d.years, 4, "0"), M: this.$d.months, MM: s.s(this.$d.months, 2, "0"), D: this.$d.days, DD: s.s(this.$d.days, 2, "0"), H: this.$d.hours, HH: s.s(this.$d.hours, 2, "0"), m: this.$d.minutes, mm: s.s(this.$d.minutes, 2, "0"), s: this.$d.seconds, ss: s.s(this.$d.seconds, 2, "0"), SSS: s.s(this.$d.milliseconds, 3, "0") };
          return n2.replace(a, (function(t3, s2) {
            return s2 || String(i2[t3]);
          }));
        }, y2.as = function(t2) {
          return this.$ms / h[m(t2)];
        }, y2.get = function(t2) {
          var s2 = this.$ms, n2 = m(t2);
          return "milliseconds" === n2 ? s2 %= 1e3 : s2 = "weeks" === n2 ? $(s2 / h[n2]) : this.$d[n2], s2 || 0;
        }, y2.add = function(t2, s2, n2) {
          var i2;
          return i2 = s2 ? t2 * h[m(s2)] : c(t2) ? t2.$ms : f(t2, this).$ms, f(this.$ms + i2 * (n2 ? -1 : 1), this);
        }, y2.subtract = function(t2, s2) {
          return this.add(t2, s2, true);
        }, y2.locale = function(t2) {
          var s2 = this.clone();
          return s2.$l = t2, s2;
        }, y2.clone = function() {
          return f(this.$ms, this);
        }, y2.humanize = function(s2) {
          return t().add(this.$ms, "ms").locale(this.$l).fromNow(!s2);
        }, y2.valueOf = function() {
          return this.asMilliseconds();
        }, y2.milliseconds = function() {
          return this.get("milliseconds");
        }, y2.asMilliseconds = function() {
          return this.as("milliseconds");
        }, y2.seconds = function() {
          return this.get("seconds");
        }, y2.asSeconds = function() {
          return this.as("seconds");
        }, y2.minutes = function() {
          return this.get("minutes");
        }, y2.asMinutes = function() {
          return this.as("minutes");
        }, y2.hours = function() {
          return this.get("hours");
        }, y2.asHours = function() {
          return this.as("hours");
        }, y2.days = function() {
          return this.get("days");
        }, y2.asDays = function() {
          return this.as("days");
        }, y2.weeks = function() {
          return this.get("weeks");
        }, y2.asWeeks = function() {
          return this.as("weeks");
        }, y2.months = function() {
          return this.get("months");
        }, y2.asMonths = function() {
          return this.as("months");
        }, y2.years = function() {
          return this.get("years");
        }, y2.asYears = function() {
          return this.as("years");
        }, l2;
      })(), p = function(t2, s2, n2) {
        return t2.add(s2.years() * n2, "y").add(s2.months() * n2, "M").add(s2.days() * n2, "d").add(s2.hours() * n2, "h").add(s2.minutes() * n2, "m").add(s2.seconds() * n2, "s").add(s2.milliseconds() * n2, "ms");
      };
      return function(n2, i2, e2) {
        t = e2, s = e2().$utils(), e2.duration = function(t2, s2) {
          var n3 = e2.locale();
          return f(t2, { $l: n3 }, s2);
        }, e2.isDuration = c;
        var r2 = i2.prototype.add, o2 = i2.prototype.subtract;
        i2.prototype.add = function(t2, s2) {
          return c(t2) ? p(this, t2, 1) : r2.bind(this)(t2, s2);
        }, i2.prototype.subtract = function(t2, s2) {
          return c(t2) ? p(this, t2, -1) : o2.bind(this)(t2, s2);
        };
      };
    }));
  })(duration$4);
  return duration$4.exports;
}
var durationExports = requireDuration();
const duration$2 = /* @__PURE__ */ getDefaultExportFromCjs(durationExports);
var localizedFormat$2 = { exports: {} };
var localizedFormat$1 = localizedFormat$2.exports;
var hasRequiredLocalizedFormat;
function requireLocalizedFormat() {
  if (hasRequiredLocalizedFormat) return localizedFormat$2.exports;
  hasRequiredLocalizedFormat = 1;
  (function(module2, exports) {
    !(function(e, t) {
      module2.exports = t();
    })(localizedFormat$1, (function() {
      var e = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" };
      return function(t, o, n) {
        var r = o.prototype, i = r.format;
        n.en.formats = e, r.format = function(t2) {
          void 0 === t2 && (t2 = "YYYY-MM-DDTHH:mm:ssZ");
          var o2 = this.$locale().formats, n2 = (function(t3, o3) {
            return t3.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, (function(t4, n3, r2) {
              var i2 = r2 && r2.toUpperCase();
              return n3 || o3[r2] || e[r2] || o3[i2].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, (function(e2, t5, o4) {
                return t5 || o4.slice(1);
              }));
            }));
          })(t2, void 0 === o2 ? {} : o2);
          return i.call(this, n2);
        };
      };
    }));
  })(localizedFormat$2);
  return localizedFormat$2.exports;
}
var localizedFormatExports = requireLocalizedFormat();
const localizedFormat = /* @__PURE__ */ getDefaultExportFromCjs(localizedFormatExports);
var isBetween$2 = { exports: {} };
var isBetween$1 = isBetween$2.exports;
var hasRequiredIsBetween;
function requireIsBetween() {
  if (hasRequiredIsBetween) return isBetween$2.exports;
  hasRequiredIsBetween = 1;
  (function(module2, exports) {
    !(function(e, i) {
      module2.exports = i();
    })(isBetween$1, (function() {
      return function(e, i, t) {
        i.prototype.isBetween = function(e2, i2, s, f) {
          var n = t(e2), o = t(i2), r = "(" === (f = f || "()")[0], u = ")" === f[1];
          return (r ? this.isAfter(n, s) : !this.isBefore(n, s)) && (u ? this.isBefore(o, s) : !this.isAfter(o, s)) || (r ? this.isBefore(n, s) : !this.isAfter(n, s)) && (u ? this.isAfter(o, s) : !this.isBefore(o, s));
        };
      };
    }));
  })(isBetween$2);
  return isBetween$2.exports;
}
var isBetweenExports = requireIsBetween();
const isBetween = /* @__PURE__ */ getDefaultExportFromCjs(isBetweenExports);
var isSameOrBefore$2 = { exports: {} };
var isSameOrBefore$1 = isSameOrBefore$2.exports;
var hasRequiredIsSameOrBefore;
function requireIsSameOrBefore() {
  if (hasRequiredIsSameOrBefore) return isSameOrBefore$2.exports;
  hasRequiredIsSameOrBefore = 1;
  (function(module2, exports) {
    !(function(e, i) {
      module2.exports = i();
    })(isSameOrBefore$1, (function() {
      return function(e, i) {
        i.prototype.isSameOrBefore = function(e2, i2) {
          return this.isSame(e2, i2) || this.isBefore(e2, i2);
        };
      };
    }));
  })(isSameOrBefore$2);
  return isSameOrBefore$2.exports;
}
var isSameOrBeforeExports = requireIsSameOrBefore();
const isSameOrBefore = /* @__PURE__ */ getDefaultExportFromCjs(isSameOrBeforeExports);
var isSameOrAfter$2 = { exports: {} };
var isSameOrAfter$1 = isSameOrAfter$2.exports;
var hasRequiredIsSameOrAfter;
function requireIsSameOrAfter() {
  if (hasRequiredIsSameOrAfter) return isSameOrAfter$2.exports;
  hasRequiredIsSameOrAfter = 1;
  (function(module2, exports) {
    !(function(e, t) {
      module2.exports = t();
    })(isSameOrAfter$1, (function() {
      return function(e, t) {
        t.prototype.isSameOrAfter = function(e2, t2) {
          return this.isSame(e2, t2) || this.isAfter(e2, t2);
        };
      };
    }));
  })(isSameOrAfter$2);
  return isSameOrAfter$2.exports;
}
var isSameOrAfterExports = requireIsSameOrAfter();
const isSameOrAfter = /* @__PURE__ */ getDefaultExportFromCjs(isSameOrAfterExports);
var zhCn$1 = { exports: {} };
var zhCn = zhCn$1.exports;
var hasRequiredZhCn;
function requireZhCn() {
  if (hasRequiredZhCn) return zhCn$1.exports;
  hasRequiredZhCn = 1;
  (function(module2, exports) {
    !(function(e, _) {
      module2.exports = _(requireDayjs_min());
    })(zhCn, (function(e) {
      function _(e2) {
        return e2 && "object" == typeof e2 && "default" in e2 ? e2 : { default: e2 };
      }
      var t = _(e), d = { name: "zh-cn", weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"), weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"), weekdaysMin: "日_一_二_三_四_五_六".split("_"), months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"), monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"), ordinal: function(e2, _2) {
        return "W" === _2 ? e2 + "周" : e2 + "日";
      }, weekStart: 1, yearStart: 4, formats: { LT: "HH:mm", LTS: "HH:mm:ss", L: "YYYY/MM/DD", LL: "YYYY年M月D日", LLL: "YYYY年M月D日Ah点mm分", LLLL: "YYYY年M月D日ddddAh点mm分", l: "YYYY/M/D", ll: "YYYY年M月D日", lll: "YYYY年M月D日 HH:mm", llll: "YYYY年M月D日dddd HH:mm" }, relativeTime: { future: "%s内", past: "%s前", s: "几秒", m: "1 分钟", mm: "%d 分钟", h: "1 小时", hh: "%d 小时", d: "1 天", dd: "%d 天", M: "1 个月", MM: "%d 个月", y: "1 年", yy: "%d 年" }, meridiem: function(e2, _2) {
        var t2 = 100 * e2 + _2;
        return t2 < 600 ? "凌晨" : t2 < 900 ? "早上" : t2 < 1100 ? "上午" : t2 < 1300 ? "中午" : t2 < 1800 ? "下午" : "晚上";
      } };
      return t.default.locale(d, null, true), d;
    }));
  })(zhCn$1);
  return zhCn$1.exports;
}
requireZhCn();
dayjs.extend(relativeTime);
dayjs.extend(duration$2);
dayjs.extend(localizedFormat);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale("zh-cn");
const minutesToMs = (minutes) => minutes * 60 * 1e3;
const todayAtMs = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return dayjs().hour(h).minute(m).second(0).millisecond(0).valueOf();
};
const msUntilNextFixedTime = (fixedTimes) => {
  const now = Date.now();
  const sorted = [...fixedTimes].sort();
  for (const t of sorted) {
    const target = todayAtMs(t);
    if (target > now) return target - now;
  }
  const tomorrow = dayjs(todayAtMs(sorted[0])).add(1, "day").valueOf();
  return tomorrow - now;
};
var _a$1;
function $constructor(name, initializer2, params) {
  function init(inst, def) {
    if (!inst._zod) {
      Object.defineProperty(inst, "_zod", {
        value: {
          def,
          constr: _,
          traits: /* @__PURE__ */ new Set()
        },
        enumerable: false
      });
    }
    if (inst._zod.traits.has(name)) {
      return;
    }
    inst._zod.traits.add(name);
    initializer2(inst, def);
    const proto = _.prototype;
    const keys = Object.keys(proto);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (!(k in inst)) {
        inst[k] = proto[k].bind(inst);
      }
    }
  }
  const Parent = params?.Parent ?? Object;
  class Definition extends Parent {
  }
  Object.defineProperty(Definition, "name", { value: name });
  function _(def) {
    var _a2;
    const inst = params?.Parent ? new Definition() : this;
    init(inst, def);
    (_a2 = inst._zod).deferred ?? (_a2.deferred = []);
    for (const fn of inst._zod.deferred) {
      fn();
    }
    return inst;
  }
  Object.defineProperty(_, "init", { value: init });
  Object.defineProperty(_, Symbol.hasInstance, {
    value: (inst) => {
      if (params?.Parent && inst instanceof params.Parent)
        return true;
      return inst?._zod?.traits?.has(name);
    }
  });
  Object.defineProperty(_, "name", { value: name });
  return _;
}
class $ZodAsyncError extends Error {
  constructor() {
    super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
  }
}
class $ZodEncodeError extends Error {
  constructor(name) {
    super(`Encountered unidirectional transform during encode: ${name}`);
    this.name = "ZodEncodeError";
  }
}
(_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
const globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
  return globalConfig;
}
function jsonStringifyReplacer(_, value) {
  if (typeof value === "bigint")
    return value.toString();
  return value;
}
function nullish(input) {
  return input === null || input === void 0;
}
function cleanRegex(source) {
  const start = source.startsWith("^") ? 1 : 0;
  const end = source.endsWith("$") ? source.length - 1 : source.length;
  return source.slice(start, end);
}
const EVALUATING = /* @__PURE__ */ Symbol("evaluating");
function defineLazy(object, key, getter) {
  let value = void 0;
  Object.defineProperty(object, key, {
    get() {
      if (value === EVALUATING) {
        return void 0;
      }
      if (value === void 0) {
        value = EVALUATING;
        value = getter();
      }
      return value;
    },
    set(v) {
      Object.defineProperty(object, key, {
        value: v
        // configurable: true,
      });
    },
    configurable: true
  });
}
function mergeDefs(...defs) {
  const mergedDescriptors = {};
  for (const def of defs) {
    const descriptors = Object.getOwnPropertyDescriptors(def);
    Object.assign(mergedDescriptors, descriptors);
  }
  return Object.defineProperties({}, mergedDescriptors);
}
function slugify(input) {
  return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {
};
function isObject(data) {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}
function isPlainObject(o) {
  if (isObject(o) === false)
    return false;
  const ctor = o.constructor;
  if (ctor === void 0)
    return true;
  if (typeof ctor !== "function")
    return true;
  const prot = ctor.prototype;
  if (isObject(prot) === false)
    return false;
  if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
    return false;
  }
  return true;
}
function shallowClone(o) {
  if (isPlainObject(o))
    return { ...o };
  if (Array.isArray(o))
    return [...o];
  if (o instanceof Map)
    return new Map(o);
  if (o instanceof Set)
    return new Set(o);
  return o;
}
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
  const cl = new inst._zod.constr(def ?? inst._zod.def);
  if (!def || params?.parent)
    cl._zod.parent = inst;
  return cl;
}
function normalizeParams(_params) {
  const params = _params;
  if (!params)
    return {};
  if (typeof params === "string")
    return { error: () => params };
  if (params?.message !== void 0) {
    if (params?.error !== void 0)
      throw new Error("Cannot specify both `message` and `error` params");
    params.error = params.message;
  }
  delete params.message;
  if (typeof params.error === "string")
    return { ...params, error: () => params.error };
  return params;
}
function aborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex; i < x.issues.length; i++) {
    if (x.issues[i]?.continue !== true) {
      return true;
    }
  }
  return false;
}
function explicitlyAborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex; i < x.issues.length; i++) {
    if (x.issues[i]?.continue === false) {
      return true;
    }
  }
  return false;
}
function prefixIssues(path2, issues) {
  return issues.map((iss) => {
    var _a2;
    (_a2 = iss).path ?? (_a2.path = []);
    iss.path.unshift(path2);
    return iss;
  });
}
function unwrapMessage(message) {
  return typeof message === "string" ? message : message?.message;
}
function finalizeIssue(iss, ctx, config2) {
  const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config2.customError?.(iss)) ?? unwrapMessage(config2.localeError?.(iss)) ?? "Invalid input";
  const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
  rest.path ?? (rest.path = []);
  rest.message = message;
  if (ctx?.reportInput) {
    rest.input = _input;
  }
  return rest;
}
function getLengthableOrigin(input) {
  if (Array.isArray(input))
    return "array";
  if (typeof input === "string")
    return "string";
  return "unknown";
}
function issue(...args) {
  const [iss, input, inst] = args;
  if (typeof iss === "string") {
    return {
      message: iss,
      code: "custom",
      input,
      inst
    };
  }
  return { ...iss };
}
const initializer$1 = (inst, def) => {
  inst.name = "$ZodError";
  Object.defineProperty(inst, "_zod", {
    value: inst._zod,
    enumerable: false
  });
  Object.defineProperty(inst, "issues", {
    value: def,
    enumerable: false
  });
  inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
  Object.defineProperty(inst, "toString", {
    value: () => inst.message,
    enumerable: false
  });
};
const $ZodError = $constructor("$ZodError", initializer$1);
const $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
function flattenError(error, mapper = (issue2) => issue2.message) {
  const fieldErrors = {};
  const formErrors = [];
  for (const sub of error.issues) {
    if (sub.path.length > 0) {
      fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
      fieldErrors[sub.path[0]].push(mapper(sub));
    } else {
      formErrors.push(mapper(sub));
    }
  }
  return { formErrors, fieldErrors };
}
function formatError(error, mapper = (issue2) => issue2.message) {
  const fieldErrors = { _errors: [] };
  const processError = (error2, path2 = []) => {
    for (const issue2 of error2.issues) {
      if (issue2.code === "invalid_union" && issue2.errors.length) {
        issue2.errors.map((issues) => processError({ issues }, [...path2, ...issue2.path]));
      } else if (issue2.code === "invalid_key") {
        processError({ issues: issue2.issues }, [...path2, ...issue2.path]);
      } else if (issue2.code === "invalid_element") {
        processError({ issues: issue2.issues }, [...path2, ...issue2.path]);
      } else {
        const fullpath = [...path2, ...issue2.path];
        if (fullpath.length === 0) {
          fieldErrors._errors.push(mapper(issue2));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < fullpath.length) {
            const el = fullpath[i];
            const terminal = i === fullpath.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue2));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    }
  };
  processError(error);
  return fieldErrors;
}
const _parse = (_Err) => (schema, value, _ctx, _params) => {
  const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
  const result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError();
  }
  if (result.issues.length) {
    const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
    captureStackTrace(e, _params?.callee);
    throw e;
  }
  return result.value;
};
const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
  const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  if (result.issues.length) {
    const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
    captureStackTrace(e, params?.callee);
    throw e;
  }
  return result.value;
};
const _safeParse = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
  const result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError();
  }
  return result.issues.length ? {
    success: false,
    error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  } : { success: true, data: result.value };
};
const safeParse$1 = /* @__PURE__ */ _safeParse($ZodRealError);
const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length ? {
    success: false,
    error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  } : { success: true, data: result.value };
};
const safeParseAsync$1 = /* @__PURE__ */ _safeParseAsync($ZodRealError);
const _encode = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _parse(_Err)(schema, value, ctx);
};
const _decode = (_Err) => (schema, value, _ctx) => {
  return _parse(_Err)(schema, value, _ctx);
};
const _encodeAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _parseAsync(_Err)(schema, value, ctx);
};
const _decodeAsync = (_Err) => async (schema, value, _ctx) => {
  return _parseAsync(_Err)(schema, value, _ctx);
};
const _safeEncode = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParse(_Err)(schema, value, ctx);
};
const _safeDecode = (_Err) => (schema, value, _ctx) => {
  return _safeParse(_Err)(schema, value, _ctx);
};
const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParseAsync(_Err)(schema, value, ctx);
};
const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
  return _safeParseAsync(_Err)(schema, value, _ctx);
};
const cuid = /^[cC][0-9a-z]{6,}$/;
const cuid2 = /^[0-9a-z]+$/;
const ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
const xid = /^[0-9a-vA-V]{20}$/;
const ksuid = /^[A-Za-z0-9]{27}$/;
const nanoid = /^[a-zA-Z0-9_-]{21}$/;
const duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
const uuid = (version2) => {
  if (!version2)
    return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
  return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version2}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
const email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
const _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
function emoji() {
  return new RegExp(_emoji$1, "u");
}
const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
const base64url = /^[A-Za-z0-9_-]*$/;
const httpProtocol = /^https?$/;
const e164 = /^\+[1-9]\d{6,14}$/;
const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
const date$1 = /* @__PURE__ */ new RegExp(`^${dateSource}$`);
function timeSource(args) {
  const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
  const regex = typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
  return regex;
}
function time$1(args) {
  return new RegExp(`^${timeSource(args)}$`);
}
function datetime$1(args) {
  const time2 = timeSource({ precision: args.precision });
  const opts = ["Z"];
  if (args.local)
    opts.push("");
  if (args.offset)
    opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
  const timeRegex = `${time2}(?:${opts.join("|")})`;
  return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
const string$1 = (params) => {
  const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
  return new RegExp(`^${regex}$`);
};
const lowercase = /^[^A-Z]*$/;
const uppercase = /^[^a-z]*$/;
const $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
  var _a2;
  inst._zod ?? (inst._zod = {});
  inst._zod.def = def;
  (_a2 = inst._zod).onattach ?? (_a2.onattach = []);
});
const $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
  var _a2;
  $ZodCheck.init(inst, def);
  (_a2 = inst._zod.def).when ?? (_a2.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== void 0;
  });
  inst._zod.onattach.push((inst2) => {
    const curr = inst2._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    if (def.maximum < curr)
      inst2._zod.bag.maximum = def.maximum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length <= def.maximum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: def.maximum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
const $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
  var _a2;
  $ZodCheck.init(inst, def);
  (_a2 = inst._zod.def).when ?? (_a2.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== void 0;
  });
  inst._zod.onattach.push((inst2) => {
    const curr = inst2._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    if (def.minimum > curr)
      inst2._zod.bag.minimum = def.minimum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length >= def.minimum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: def.minimum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
const $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
  var _a2;
  $ZodCheck.init(inst, def);
  (_a2 = inst._zod.def).when ?? (_a2.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== void 0;
  });
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.minimum = def.length;
    bag.maximum = def.length;
    bag.length = def.length;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length === def.length)
      return;
    const origin = getLengthableOrigin(input);
    const tooBig = length > def.length;
    payload.issues.push({
      origin,
      ...tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length },
      inclusive: true,
      exact: true,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
const $ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def) => {
  var _a2, _b;
  $ZodCheck.init(inst, def);
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.format = def.format;
    if (def.pattern) {
      bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
      bag.patterns.add(def.pattern);
    }
  });
  if (def.pattern)
    (_a2 = inst._zod).check ?? (_a2.check = (payload) => {
      def.pattern.lastIndex = 0;
      if (def.pattern.test(payload.value))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: def.format,
        input: payload.value,
        ...def.pattern ? { pattern: def.pattern.toString() } : {},
        inst,
        continue: !def.abort
      });
    });
  else
    (_b = inst._zod).check ?? (_b.check = () => {
    });
});
const $ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    def.pattern.lastIndex = 0;
    if (def.pattern.test(payload.value))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: payload.value,
      pattern: def.pattern.toString(),
      inst,
      continue: !def.abort
    });
  };
});
const $ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def) => {
  def.pattern ?? (def.pattern = lowercase);
  $ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def) => {
  def.pattern ?? (def.pattern = uppercase);
  $ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def) => {
  $ZodCheck.init(inst, def);
  const escapedRegex = escapeRegex(def.includes);
  const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
  def.pattern = pattern;
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.includes(def.includes, def.position))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: def.includes,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
const $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
  def.pattern ?? (def.pattern = pattern);
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.startsWith(def.prefix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: def.prefix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
const $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
  def.pattern ?? (def.pattern = pattern);
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.endsWith(def.suffix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: def.suffix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
const $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.check = (payload) => {
    payload.value = def.tx(payload.value);
  };
});
const version = {
  major: 4,
  minor: 4,
  patch: 3
};
const $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
  var _a2;
  inst ?? (inst = {});
  inst._zod.def = def;
  inst._zod.bag = inst._zod.bag || {};
  inst._zod.version = version;
  const checks = [...inst._zod.def.checks ?? []];
  if (inst._zod.traits.has("$ZodCheck")) {
    checks.unshift(inst);
  }
  for (const ch of checks) {
    for (const fn of ch._zod.onattach) {
      fn(inst);
    }
  }
  if (checks.length === 0) {
    (_a2 = inst._zod).deferred ?? (_a2.deferred = []);
    inst._zod.deferred?.push(() => {
      inst._zod.run = inst._zod.parse;
    });
  } else {
    const runChecks = (payload, checks2, ctx) => {
      let isAborted = aborted(payload);
      let asyncResult;
      for (const ch of checks2) {
        if (ch._zod.def.when) {
          if (explicitlyAborted(payload))
            continue;
          const shouldRun = ch._zod.def.when(payload);
          if (!shouldRun)
            continue;
        } else if (isAborted) {
          continue;
        }
        const currLen = payload.issues.length;
        const _ = ch._zod.check(payload);
        if (_ instanceof Promise && ctx?.async === false) {
          throw new $ZodAsyncError();
        }
        if (asyncResult || _ instanceof Promise) {
          asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
            await _;
            const nextLen = payload.issues.length;
            if (nextLen === currLen)
              return;
            if (!isAborted)
              isAborted = aborted(payload, currLen);
          });
        } else {
          const nextLen = payload.issues.length;
          if (nextLen === currLen)
            continue;
          if (!isAborted)
            isAborted = aborted(payload, currLen);
        }
      }
      if (asyncResult) {
        return asyncResult.then(() => {
          return payload;
        });
      }
      return payload;
    };
    const handleCanaryResult = (canary, payload, ctx) => {
      if (aborted(canary)) {
        canary.aborted = true;
        return canary;
      }
      const checkResult = runChecks(payload, checks, ctx);
      if (checkResult instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError();
        return checkResult.then((checkResult2) => inst._zod.parse(checkResult2, ctx));
      }
      return inst._zod.parse(checkResult, ctx);
    };
    inst._zod.run = (payload, ctx) => {
      if (ctx.skipChecks) {
        return inst._zod.parse(payload, ctx);
      }
      if (ctx.direction === "backward") {
        const canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });
        if (canary instanceof Promise) {
          return canary.then((canary2) => {
            return handleCanaryResult(canary2, payload, ctx);
          });
        }
        return handleCanaryResult(canary, payload, ctx);
      }
      const result = inst._zod.parse(payload, ctx);
      if (result instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError();
        return result.then((result2) => runChecks(result2, checks, ctx));
      }
      return runChecks(result, checks, ctx);
    };
  }
  defineLazy(inst, "~standard", () => ({
    validate: (value) => {
      try {
        const r = safeParse$1(inst, value);
        return r.success ? { value: r.data } : { issues: r.error?.issues };
      } catch (_) {
        return safeParseAsync$1(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
      }
    },
    vendor: "zod",
    version: 1
  }));
});
const $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
  inst._zod.parse = (payload, _) => {
    if (def.coerce)
      try {
        payload.value = String(payload.value);
      } catch (_2) {
      }
    if (typeof payload.value === "string")
      return payload;
    payload.issues.push({
      expected: "string",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
const $ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def);
  $ZodString.init(inst, def);
});
const $ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def) => {
  def.pattern ?? (def.pattern = guid);
  $ZodStringFormat.init(inst, def);
});
const $ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def) => {
  if (def.version) {
    const versionMap = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    };
    const v = versionMap[def.version];
    if (v === void 0)
      throw new Error(`Invalid UUID version: "${def.version}"`);
    def.pattern ?? (def.pattern = uuid(v));
  } else
    def.pattern ?? (def.pattern = uuid());
  $ZodStringFormat.init(inst, def);
});
const $ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def) => {
  def.pattern ?? (def.pattern = email);
  $ZodStringFormat.init(inst, def);
});
const $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    try {
      const trimmed = payload.value.trim();
      if (!def.normalize && def.protocol?.source === httpProtocol.source) {
        if (!/^https?:\/\//i.test(trimmed)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid URL format",
            input: payload.value,
            inst,
            continue: !def.abort
          });
          return;
        }
      }
      const url = new URL(trimmed);
      if (def.hostname) {
        def.hostname.lastIndex = 0;
        if (!def.hostname.test(url.hostname)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid hostname",
            pattern: def.hostname.source,
            input: payload.value,
            inst,
            continue: !def.abort
          });
        }
      }
      if (def.protocol) {
        def.protocol.lastIndex = 0;
        if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid protocol",
            pattern: def.protocol.source,
            input: payload.value,
            inst,
            continue: !def.abort
          });
        }
      }
      if (def.normalize) {
        payload.value = url.href;
      } else {
        payload.value = trimmed;
      }
      return;
    } catch (_) {
      payload.issues.push({
        code: "invalid_format",
        format: "url",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
const $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
  def.pattern ?? (def.pattern = emoji());
  $ZodStringFormat.init(inst, def);
});
const $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
  def.pattern ?? (def.pattern = nanoid);
  $ZodStringFormat.init(inst, def);
});
const $ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def) => {
  def.pattern ?? (def.pattern = cuid);
  $ZodStringFormat.init(inst, def);
});
const $ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def) => {
  def.pattern ?? (def.pattern = cuid2);
  $ZodStringFormat.init(inst, def);
});
const $ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def) => {
  def.pattern ?? (def.pattern = ulid);
  $ZodStringFormat.init(inst, def);
});
const $ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def) => {
  def.pattern ?? (def.pattern = xid);
  $ZodStringFormat.init(inst, def);
});
const $ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def) => {
  def.pattern ?? (def.pattern = ksuid);
  $ZodStringFormat.init(inst, def);
});
const $ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def) => {
  def.pattern ?? (def.pattern = datetime$1(def));
  $ZodStringFormat.init(inst, def);
});
const $ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def) => {
  def.pattern ?? (def.pattern = date$1);
  $ZodStringFormat.init(inst, def);
});
const $ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def) => {
  def.pattern ?? (def.pattern = time$1(def));
  $ZodStringFormat.init(inst, def);
});
const $ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def) => {
  def.pattern ?? (def.pattern = duration$1);
  $ZodStringFormat.init(inst, def);
});
const $ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def) => {
  def.pattern ?? (def.pattern = ipv4);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.format = `ipv4`;
});
const $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
  def.pattern ?? (def.pattern = ipv6);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.format = `ipv6`;
  inst._zod.check = (payload) => {
    try {
      new URL(`http://[${payload.value}]`);
    } catch {
      payload.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
const $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv4);
  $ZodStringFormat.init(inst, def);
});
const $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv6);
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    const parts = payload.value.split("/");
    try {
      if (parts.length !== 2)
        throw new Error();
      const [address, prefix] = parts;
      if (!prefix)
        throw new Error();
      const prefixNum = Number(prefix);
      if (`${prefixNum}` !== prefix)
        throw new Error();
      if (prefixNum < 0 || prefixNum > 128)
        throw new Error();
      new URL(`http://[${address}]`);
    } catch {
      payload.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
function isValidBase64(data) {
  if (data === "")
    return true;
  if (/\s/.test(data))
    return false;
  if (data.length % 4 !== 0)
    return false;
  try {
    atob(data);
    return true;
  } catch {
    return false;
  }
}
const $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
  def.pattern ?? (def.pattern = base64);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.contentEncoding = "base64";
  inst._zod.check = (payload) => {
    if (isValidBase64(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
function isValidBase64URL(data) {
  if (!base64url.test(data))
    return false;
  const base642 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
  const padded = base642.padEnd(Math.ceil(base642.length / 4) * 4, "=");
  return isValidBase64(padded);
}
const $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
  def.pattern ?? (def.pattern = base64url);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.contentEncoding = "base64url";
  inst._zod.check = (payload) => {
    if (isValidBase64URL(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
const $ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def) => {
  def.pattern ?? (def.pattern = e164);
  $ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
  try {
    const tokensParts = token.split(".");
    if (tokensParts.length !== 3)
      return false;
    const [header] = tokensParts;
    if (!header)
      return false;
    const parsedHeader = JSON.parse(atob(header));
    if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
      return false;
    if (!parsedHeader.alg)
      return false;
    if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
      return false;
    return true;
  } catch {
    return false;
  }
}
const $ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (isValidJWT(payload.value, def.alg))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
function handleArrayResult(result, final, index) {
  if (result.issues.length) {
    final.issues.push(...prefixIssues(index, result.issues));
  }
  final.value[index] = result.value;
}
const $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!Array.isArray(input)) {
      payload.issues.push({
        expected: "array",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = Array(input.length);
    const proms = [];
    for (let i = 0; i < input.length; i++) {
      const item = input[i];
      const result = def.element._zod.run({
        value: item,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        proms.push(result.then((result2) => handleArrayResult(result2, payload, i)));
      } else {
        handleArrayResult(result, payload, i);
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
function handleUnionResults(results, final, inst, ctx) {
  for (const result of results) {
    if (result.issues.length === 0) {
      final.value = result.value;
      return final;
    }
  }
  const nonaborted = results.filter((r) => !aborted(r));
  if (nonaborted.length === 1) {
    final.value = nonaborted[0].value;
    return nonaborted[0];
  }
  final.issues.push({
    code: "invalid_union",
    input: final.value,
    inst,
    errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  });
  return final;
}
const $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
  defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
  defineLazy(inst._zod, "values", () => {
    if (def.options.every((o) => o._zod.values)) {
      return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
    }
    return void 0;
  });
  defineLazy(inst._zod, "pattern", () => {
    if (def.options.every((o) => o._zod.pattern)) {
      const patterns = def.options.map((o) => o._zod.pattern);
      return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
    }
    return void 0;
  });
  const first = def.options.length === 1 ? def.options[0]._zod.run : null;
  inst._zod.parse = (payload, ctx) => {
    if (first) {
      return first(payload, ctx);
    }
    let async = false;
    const results = [];
    for (const option of def.options) {
      const result = option._zod.run({
        value: payload.value,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        results.push(result);
        async = true;
      } else {
        if (result.issues.length === 0)
          return result;
        results.push(result);
      }
    }
    if (!async)
      return handleUnionResults(results, payload, inst, ctx);
    return Promise.all(results).then((results2) => {
      return handleUnionResults(results2, payload, inst, ctx);
    });
  };
});
const $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    const left = def.left._zod.run({ value: input, issues: [] }, ctx);
    const right = def.right._zod.run({ value: input, issues: [] }, ctx);
    const async = left instanceof Promise || right instanceof Promise;
    if (async) {
      return Promise.all([left, right]).then(([left2, right2]) => {
        return handleIntersectionResults(payload, left2, right2);
      });
    }
    return handleIntersectionResults(payload, left, right);
  };
});
function mergeValues(a, b) {
  if (a === b) {
    return { valid: true, data: a };
  }
  if (a instanceof Date && b instanceof Date && +a === +b) {
    return { valid: true, data: a };
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const bKeys = Object.keys(b);
    const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
        };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return { valid: false, mergeErrorPath: [] };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
        };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  }
  return { valid: false, mergeErrorPath: [] };
}
function handleIntersectionResults(result, left, right) {
  const unrecKeys = /* @__PURE__ */ new Map();
  let unrecIssue;
  for (const iss of left.issues) {
    if (iss.code === "unrecognized_keys") {
      unrecIssue ?? (unrecIssue = iss);
      for (const k of iss.keys) {
        if (!unrecKeys.has(k))
          unrecKeys.set(k, {});
        unrecKeys.get(k).l = true;
      }
    } else {
      result.issues.push(iss);
    }
  }
  for (const iss of right.issues) {
    if (iss.code === "unrecognized_keys") {
      for (const k of iss.keys) {
        if (!unrecKeys.has(k))
          unrecKeys.set(k, {});
        unrecKeys.get(k).r = true;
      }
    } else {
      result.issues.push(iss);
    }
  }
  const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
  if (bothKeys.length && unrecIssue) {
    result.issues.push({ ...unrecIssue, keys: bothKeys });
  }
  if (aborted(result))
    return result;
  const merged = mergeValues(left.value, right.value);
  if (!merged.valid) {
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
  }
  result.value = merged.data;
  return result;
}
const $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    const _out = def.transform(payload.value, payload);
    if (ctx.async) {
      const output = _out instanceof Promise ? _out : Promise.resolve(_out);
      return output.then((output2) => {
        payload.value = output2;
        payload.fallback = true;
        return payload;
      });
    }
    if (_out instanceof Promise) {
      throw new $ZodAsyncError();
    }
    payload.value = _out;
    payload.fallback = true;
    return payload;
  };
});
function handleOptionalResult(result, input) {
  if (input === void 0 && (result.issues.length || result.fallback)) {
    return { issues: [], value: void 0 };
  }
  return result;
}
const $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  inst._zod.optout = "optional";
  defineLazy(inst._zod, "values", () => {
    return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, void 0]) : void 0;
  });
  defineLazy(inst._zod, "pattern", () => {
    const pattern = def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
  });
  inst._zod.parse = (payload, ctx) => {
    if (def.innerType._zod.optin === "optional") {
      const input = payload.value;
      const result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise)
        return result.then((r) => handleOptionalResult(r, input));
      return handleOptionalResult(result, input);
    }
    if (payload.value === void 0) {
      return payload;
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
const $ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def) => {
  $ZodOptional.init(inst, def);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
  inst._zod.parse = (payload, ctx) => {
    return def.innerType._zod.run(payload, ctx);
  };
});
const $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
  defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
  defineLazy(inst._zod, "pattern", () => {
    const pattern = def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
  });
  defineLazy(inst._zod, "values", () => {
    return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, null]) : void 0;
  });
  inst._zod.parse = (payload, ctx) => {
    if (payload.value === null)
      return payload;
    return def.innerType._zod.run(payload, ctx);
  };
});
const $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === void 0) {
      payload.value = def.defaultValue;
      return payload;
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => handleDefaultResult(result2, def));
    }
    return handleDefaultResult(result, def);
  };
});
function handleDefaultResult(payload, def) {
  if (payload.value === void 0) {
    payload.value = def.defaultValue;
  }
  return payload;
}
const $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === void 0) {
      payload.value = def.defaultValue;
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
const $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "values", () => {
    const v = def.innerType._zod.values;
    return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
  });
  inst._zod.parse = (payload, ctx) => {
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => handleNonOptionalResult(result2, inst));
    }
    return handleNonOptionalResult(result, inst);
  };
});
function handleNonOptionalResult(payload, inst) {
  if (!payload.issues.length && payload.value === void 0) {
    payload.issues.push({
      code: "invalid_type",
      expected: "nonoptional",
      input: payload.value,
      inst
    });
  }
  return payload;
}
const $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => {
        payload.value = result2.value;
        if (result2.issues.length) {
          payload.value = def.catchValue({
            ...payload,
            error: {
              issues: result2.issues.map((iss) => finalizeIssue(iss, ctx, config()))
            },
            input: payload.value
          });
          payload.issues = [];
          payload.fallback = true;
        }
        return payload;
      });
    }
    payload.value = result.value;
    if (result.issues.length) {
      payload.value = def.catchValue({
        ...payload,
        error: {
          issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
        },
        input: payload.value
      });
      payload.issues = [];
      payload.fallback = true;
    }
    return payload;
  };
});
const $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "values", () => def.in._zod.values);
  defineLazy(inst._zod, "optin", () => def.in._zod.optin);
  defineLazy(inst._zod, "optout", () => def.out._zod.optout);
  defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      const right = def.out._zod.run(payload, ctx);
      if (right instanceof Promise) {
        return right.then((right2) => handlePipeResult(right2, def.in, ctx));
      }
      return handlePipeResult(right, def.in, ctx);
    }
    const left = def.in._zod.run(payload, ctx);
    if (left instanceof Promise) {
      return left.then((left2) => handlePipeResult(left2, def.out, ctx));
    }
    return handlePipeResult(left, def.out, ctx);
  };
});
function handlePipeResult(left, next, ctx) {
  if (left.issues.length) {
    left.aborted = true;
    return left;
  }
  return next._zod.run({ value: left.value, issues: left.issues, fallback: left.fallback }, ctx);
}
const $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
  defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then(handleReadonlyResult);
    }
    return handleReadonlyResult(result);
  };
});
function handleReadonlyResult(payload) {
  payload.value = Object.freeze(payload.value);
  return payload;
}
const $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
  $ZodCheck.init(inst, def);
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _) => {
    return payload;
  };
  inst._zod.check = (payload) => {
    const input = payload.value;
    const r = def.fn(input);
    if (r instanceof Promise) {
      return r.then((r2) => handleRefineResult(r2, payload, input, inst));
    }
    handleRefineResult(r, payload, input, inst);
    return;
  };
});
function handleRefineResult(result, payload, input, inst) {
  if (!result) {
    const _iss = {
      code: "custom",
      input,
      inst,
      // incorporates params.error into issue reporting
      path: [...inst._zod.def.path ?? []],
      // incorporates params.error into issue reporting
      continue: !inst._zod.def.abort
      // params: inst._zod.def.params,
    };
    if (inst._zod.def.params)
      _iss.params = inst._zod.def.params;
    payload.issues.push(issue(_iss));
  }
}
var _a;
class $ZodRegistry {
  constructor() {
    this._map = /* @__PURE__ */ new WeakMap();
    this._idmap = /* @__PURE__ */ new Map();
  }
  add(schema, ..._meta) {
    const meta = _meta[0];
    this._map.set(schema, meta);
    if (meta && typeof meta === "object" && "id" in meta) {
      this._idmap.set(meta.id, schema);
    }
    return this;
  }
  clear() {
    this._map = /* @__PURE__ */ new WeakMap();
    this._idmap = /* @__PURE__ */ new Map();
    return this;
  }
  remove(schema) {
    const meta = this._map.get(schema);
    if (meta && typeof meta === "object" && "id" in meta) {
      this._idmap.delete(meta.id);
    }
    this._map.delete(schema);
    return this;
  }
  get(schema) {
    const p = schema._zod.parent;
    if (p) {
      const pm = { ...this.get(p) ?? {} };
      delete pm.id;
      const f = { ...pm, ...this._map.get(schema) };
      return Object.keys(f).length ? f : void 0;
    }
    return this._map.get(schema);
  }
  has(schema) {
    return this._map.has(schema);
  }
}
function registry() {
  return new $ZodRegistry();
}
(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
const globalRegistry = globalThis.__zod_globalRegistry;
// @__NO_SIDE_EFFECTS__
function _string(Class, params) {
  return new Class({
    type: "string",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _email(Class, params) {
  return new Class({
    type: "string",
    format: "email",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _guid(Class, params) {
  return new Class({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uuid(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uuidv4(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v4",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uuidv6(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v6",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uuidv7(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v7",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _url(Class, params) {
  return new Class({
    type: "string",
    format: "url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _emoji(Class, params) {
  return new Class({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _nanoid(Class, params) {
  return new Class({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _cuid(Class, params) {
  return new Class({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _cuid2(Class, params) {
  return new Class({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _ulid(Class, params) {
  return new Class({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _xid(Class, params) {
  return new Class({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _ksuid(Class, params) {
  return new Class({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _ipv4(Class, params) {
  return new Class({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _ipv6(Class, params) {
  return new Class({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _cidrv4(Class, params) {
  return new Class({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _cidrv6(Class, params) {
  return new Class({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _base64(Class, params) {
  return new Class({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _base64url(Class, params) {
  return new Class({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _e164(Class, params) {
  return new Class({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _jwt(Class, params) {
  return new Class({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _isoDateTime(Class, params) {
  return new Class({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: false,
    local: false,
    precision: null,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _isoDate(Class, params) {
  return new Class({
    type: "string",
    format: "date",
    check: "string_format",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _isoTime(Class, params) {
  return new Class({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _isoDuration(Class, params) {
  return new Class({
    type: "string",
    format: "duration",
    check: "string_format",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _maxLength(maximum, params) {
  const ch = new $ZodCheckMaxLength({
    check: "max_length",
    ...normalizeParams(params),
    maximum
  });
  return ch;
}
// @__NO_SIDE_EFFECTS__
function _minLength(minimum, params) {
  return new $ZodCheckMinLength({
    check: "min_length",
    ...normalizeParams(params),
    minimum
  });
}
// @__NO_SIDE_EFFECTS__
function _length(length, params) {
  return new $ZodCheckLengthEquals({
    check: "length_equals",
    ...normalizeParams(params),
    length
  });
}
// @__NO_SIDE_EFFECTS__
function _regex(pattern, params) {
  return new $ZodCheckRegex({
    check: "string_format",
    format: "regex",
    ...normalizeParams(params),
    pattern
  });
}
// @__NO_SIDE_EFFECTS__
function _lowercase(params) {
  return new $ZodCheckLowerCase({
    check: "string_format",
    format: "lowercase",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uppercase(params) {
  return new $ZodCheckUpperCase({
    check: "string_format",
    format: "uppercase",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _includes(includes, params) {
  return new $ZodCheckIncludes({
    check: "string_format",
    format: "includes",
    ...normalizeParams(params),
    includes
  });
}
// @__NO_SIDE_EFFECTS__
function _startsWith(prefix, params) {
  return new $ZodCheckStartsWith({
    check: "string_format",
    format: "starts_with",
    ...normalizeParams(params),
    prefix
  });
}
// @__NO_SIDE_EFFECTS__
function _endsWith(suffix, params) {
  return new $ZodCheckEndsWith({
    check: "string_format",
    format: "ends_with",
    ...normalizeParams(params),
    suffix
  });
}
// @__NO_SIDE_EFFECTS__
function _overwrite(tx) {
  return new $ZodCheckOverwrite({
    check: "overwrite",
    tx
  });
}
// @__NO_SIDE_EFFECTS__
function _normalize(form) {
  return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
}
// @__NO_SIDE_EFFECTS__
function _trim() {
  return /* @__PURE__ */ _overwrite((input) => input.trim());
}
// @__NO_SIDE_EFFECTS__
function _toLowerCase() {
  return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function _toUpperCase() {
  return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function _slugify() {
  return /* @__PURE__ */ _overwrite((input) => slugify(input));
}
// @__NO_SIDE_EFFECTS__
function _array(Class, element, params) {
  return new Class({
    type: "array",
    element,
    // get element() {
    //   return element;
    // },
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _refine(Class, fn, _params) {
  const schema = new Class({
    type: "custom",
    check: "custom",
    fn,
    ...normalizeParams(_params)
  });
  return schema;
}
// @__NO_SIDE_EFFECTS__
function _superRefine(fn, params) {
  const ch = /* @__PURE__ */ _check((payload) => {
    payload.addIssue = (issue$1) => {
      if (typeof issue$1 === "string") {
        payload.issues.push(issue(issue$1, payload.value, ch._zod.def));
      } else {
        const _issue = issue$1;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        _issue.input ?? (_issue.input = payload.value);
        _issue.inst ?? (_issue.inst = ch);
        _issue.continue ?? (_issue.continue = !ch._zod.def.abort);
        payload.issues.push(issue(_issue));
      }
    };
    return fn(payload.value, payload);
  }, params);
  return ch;
}
// @__NO_SIDE_EFFECTS__
function _check(fn, params) {
  const ch = new $ZodCheck({
    check: "custom",
    ...normalizeParams(params)
  });
  ch._zod.check = fn;
  return ch;
}
function initializeContext(params) {
  let target = params?.target ?? "draft-2020-12";
  if (target === "draft-4")
    target = "draft-04";
  if (target === "draft-7")
    target = "draft-07";
  return {
    processors: params.processors ?? {},
    metadataRegistry: params?.metadata ?? globalRegistry,
    target,
    unrepresentable: params?.unrepresentable ?? "throw",
    override: params?.override ?? (() => {
    }),
    io: params?.io ?? "output",
    counter: 0,
    seen: /* @__PURE__ */ new Map(),
    cycles: params?.cycles ?? "ref",
    reused: params?.reused ?? "inline",
    external: params?.external ?? void 0
  };
}
function process$1(schema, ctx, _params = { path: [], schemaPath: [] }) {
  var _a2;
  const def = schema._zod.def;
  const seen = ctx.seen.get(schema);
  if (seen) {
    seen.count++;
    const isCycle = _params.schemaPath.includes(schema);
    if (isCycle) {
      seen.cycle = _params.path;
    }
    return seen.schema;
  }
  const result = { schema: {}, count: 1, cycle: void 0, path: _params.path };
  ctx.seen.set(schema, result);
  const overrideSchema = schema._zod.toJSONSchema?.();
  if (overrideSchema) {
    result.schema = overrideSchema;
  } else {
    const params = {
      ..._params,
      schemaPath: [..._params.schemaPath, schema],
      path: _params.path
    };
    if (schema._zod.processJSONSchema) {
      schema._zod.processJSONSchema(ctx, result.schema, params);
    } else {
      const _json = result.schema;
      const processor = ctx.processors[def.type];
      if (!processor) {
        throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
      }
      processor(schema, ctx, _json, params);
    }
    const parent = schema._zod.parent;
    if (parent) {
      if (!result.ref)
        result.ref = parent;
      process$1(parent, ctx, params);
      ctx.seen.get(parent).isParent = true;
    }
  }
  const meta = ctx.metadataRegistry.get(schema);
  if (meta)
    Object.assign(result.schema, meta);
  if (ctx.io === "input" && isTransforming(schema)) {
    delete result.schema.examples;
    delete result.schema.default;
  }
  if (ctx.io === "input" && "_prefault" in result.schema)
    (_a2 = result.schema).default ?? (_a2.default = result.schema._prefault);
  delete result.schema._prefault;
  const _result = ctx.seen.get(schema);
  return _result.schema;
}
function extractDefs(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const idToSchema = /* @__PURE__ */ new Map();
  for (const entry of ctx.seen.entries()) {
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      const existing = idToSchema.get(id);
      if (existing && existing !== entry[0]) {
        throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      }
      idToSchema.set(id, entry[0]);
    }
  }
  const makeURI = (entry) => {
    const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
    if (ctx.external) {
      const externalId = ctx.external.registry.get(entry[0])?.id;
      const uriGenerator = ctx.external.uri ?? ((id2) => id2);
      if (externalId) {
        return { ref: uriGenerator(externalId) };
      }
      const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
      entry[1].defId = id;
      return { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}` };
    }
    if (entry[1] === root) {
      return { ref: "#" };
    }
    const uriPrefix = `#`;
    const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
    const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
    return { defId, ref: defUriPrefix + defId };
  };
  const extractToDef = (entry) => {
    if (entry[1].schema.$ref) {
      return;
    }
    const seen = entry[1];
    const { ref, defId } = makeURI(entry);
    seen.def = { ...seen.schema };
    if (defId)
      seen.defId = defId;
    const schema2 = seen.schema;
    for (const key in schema2) {
      delete schema2[key];
    }
    schema2.$ref = ref;
  };
  if (ctx.cycles === "throw") {
    for (const entry of ctx.seen.entries()) {
      const seen = entry[1];
      if (seen.cycle) {
        throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
      }
    }
  }
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (schema === entry[0]) {
      extractToDef(entry);
      continue;
    }
    if (ctx.external) {
      const ext = ctx.external.registry.get(entry[0])?.id;
      if (schema !== entry[0] && ext) {
        extractToDef(entry);
        continue;
      }
    }
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      extractToDef(entry);
      continue;
    }
    if (seen.cycle) {
      extractToDef(entry);
      continue;
    }
    if (seen.count > 1) {
      if (ctx.reused === "ref") {
        extractToDef(entry);
        continue;
      }
    }
  }
}
function finalize(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const flattenRef = (zodSchema) => {
    const seen = ctx.seen.get(zodSchema);
    if (seen.ref === null)
      return;
    const schema2 = seen.def ?? seen.schema;
    const _cached = { ...schema2 };
    const ref = seen.ref;
    seen.ref = null;
    if (ref) {
      flattenRef(ref);
      const refSeen = ctx.seen.get(ref);
      const refSchema = refSeen.schema;
      if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
        schema2.allOf = schema2.allOf ?? [];
        schema2.allOf.push(refSchema);
      } else {
        Object.assign(schema2, refSchema);
      }
      Object.assign(schema2, _cached);
      const isParentRef = zodSchema._zod.parent === ref;
      if (isParentRef) {
        for (const key in schema2) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (!(key in _cached)) {
            delete schema2[key];
          }
        }
      }
      if (refSchema.$ref && refSeen.def) {
        for (const key in schema2) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (key in refSeen.def && JSON.stringify(schema2[key]) === JSON.stringify(refSeen.def[key])) {
            delete schema2[key];
          }
        }
      }
    }
    const parent = zodSchema._zod.parent;
    if (parent && parent !== ref) {
      flattenRef(parent);
      const parentSeen = ctx.seen.get(parent);
      if (parentSeen?.schema.$ref) {
        schema2.$ref = parentSeen.schema.$ref;
        if (parentSeen.def) {
          for (const key in schema2) {
            if (key === "$ref" || key === "allOf")
              continue;
            if (key in parentSeen.def && JSON.stringify(schema2[key]) === JSON.stringify(parentSeen.def[key])) {
              delete schema2[key];
            }
          }
        }
      }
    }
    ctx.override({
      zodSchema,
      jsonSchema: schema2,
      path: seen.path ?? []
    });
  };
  for (const entry of [...ctx.seen.entries()].reverse()) {
    flattenRef(entry[0]);
  }
  const result = {};
  if (ctx.target === "draft-2020-12") {
    result.$schema = "https://json-schema.org/draft/2020-12/schema";
  } else if (ctx.target === "draft-07") {
    result.$schema = "http://json-schema.org/draft-07/schema#";
  } else if (ctx.target === "draft-04") {
    result.$schema = "http://json-schema.org/draft-04/schema#";
  } else if (ctx.target === "openapi-3.0") ;
  else ;
  if (ctx.external?.uri) {
    const id = ctx.external.registry.get(schema)?.id;
    if (!id)
      throw new Error("Schema is missing an `id` property");
    result.$id = ctx.external.uri(id);
  }
  Object.assign(result, root.def ?? root.schema);
  const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
  if (rootMetaId !== void 0 && result.id === rootMetaId)
    delete result.id;
  const defs = ctx.external?.defs ?? {};
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (seen.def && seen.defId) {
      if (seen.def.id === seen.defId)
        delete seen.def.id;
      defs[seen.defId] = seen.def;
    }
  }
  if (ctx.external) ;
  else {
    if (Object.keys(defs).length > 0) {
      if (ctx.target === "draft-2020-12") {
        result.$defs = defs;
      } else {
        result.definitions = defs;
      }
    }
  }
  try {
    const finalized = JSON.parse(JSON.stringify(result));
    Object.defineProperty(finalized, "~standard", {
      value: {
        ...schema["~standard"],
        jsonSchema: {
          input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
          output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
        }
      },
      enumerable: false,
      writable: false
    });
    return finalized;
  } catch (_err) {
    throw new Error("Error converting schema to JSON.");
  }
}
function isTransforming(_schema, _ctx) {
  const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
  if (ctx.seen.has(_schema))
    return false;
  ctx.seen.add(_schema);
  const def = _schema._zod.def;
  if (def.type === "transform")
    return true;
  if (def.type === "array")
    return isTransforming(def.element, ctx);
  if (def.type === "set")
    return isTransforming(def.valueType, ctx);
  if (def.type === "lazy")
    return isTransforming(def.getter(), ctx);
  if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") {
    return isTransforming(def.innerType, ctx);
  }
  if (def.type === "intersection") {
    return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
  }
  if (def.type === "record" || def.type === "map") {
    return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
  }
  if (def.type === "pipe") {
    if (_schema._zod.traits.has("$ZodCodec"))
      return true;
    return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
  }
  if (def.type === "object") {
    for (const key in def.shape) {
      if (isTransforming(def.shape[key], ctx))
        return true;
    }
    return false;
  }
  if (def.type === "union") {
    for (const option of def.options) {
      if (isTransforming(option, ctx))
        return true;
    }
    return false;
  }
  if (def.type === "tuple") {
    for (const item of def.items) {
      if (isTransforming(item, ctx))
        return true;
    }
    if (def.rest && isTransforming(def.rest, ctx))
      return true;
    return false;
  }
  return false;
}
const createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
  const ctx = initializeContext({ ...params, processors });
  process$1(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
};
const createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
  const { libraryOptions, target } = params ?? {};
  const ctx = initializeContext({ ...libraryOptions ?? {}, target, io, processors });
  process$1(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
};
const formatMap = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
  // do not set
};
const stringProcessor = (schema, ctx, _json, _params) => {
  const json = _json;
  json.type = "string";
  const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
  if (typeof minimum === "number")
    json.minLength = minimum;
  if (typeof maximum === "number")
    json.maxLength = maximum;
  if (format) {
    json.format = formatMap[format] ?? format;
    if (json.format === "")
      delete json.format;
    if (format === "time") {
      delete json.format;
    }
  }
  if (contentEncoding)
    json.contentEncoding = contentEncoding;
  if (patterns && patterns.size > 0) {
    const regexes = [...patterns];
    if (regexes.length === 1)
      json.pattern = regexes[0].source;
    else if (regexes.length > 1) {
      json.allOf = [
        ...regexes.map((regex) => ({
          ...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
          pattern: regex.source
        }))
      ];
    }
  }
};
const customProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Custom types cannot be represented in JSON Schema");
  }
};
const transformProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Transforms cannot be represented in JSON Schema");
  }
};
const arrayProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  const { minimum, maximum } = schema._zod.bag;
  if (typeof minimum === "number")
    json.minItems = minimum;
  if (typeof maximum === "number")
    json.maxItems = maximum;
  json.type = "array";
  json.items = process$1(def.element, ctx, {
    ...params,
    path: [...params.path, "items"]
  });
};
const unionProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const isExclusive = def.inclusive === false;
  const options = def.options.map((x, i) => process$1(x, ctx, {
    ...params,
    path: [...params.path, isExclusive ? "oneOf" : "anyOf", i]
  }));
  if (isExclusive) {
    json.oneOf = options;
  } else {
    json.anyOf = options;
  }
};
const intersectionProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const a = process$1(def.left, ctx, {
    ...params,
    path: [...params.path, "allOf", 0]
  });
  const b = process$1(def.right, ctx, {
    ...params,
    path: [...params.path, "allOf", 1]
  });
  const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
  const allOf = [
    ...isSimpleIntersection(a) ? a.allOf : [a],
    ...isSimpleIntersection(b) ? b.allOf : [b]
  ];
  json.allOf = allOf;
};
const nullableProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const inner = process$1(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  if (ctx.target === "openapi-3.0") {
    seen.ref = def.innerType;
    json.nullable = true;
  } else {
    json.anyOf = [inner, { type: "null" }];
  }
};
const nonoptionalProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  process$1(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};
const defaultProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process$1(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  json.default = JSON.parse(JSON.stringify(def.defaultValue));
};
const prefaultProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process$1(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  if (ctx.io === "input")
    json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
};
const catchProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process$1(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  let catchValue;
  try {
    catchValue = def.catchValue(void 0);
  } catch {
    throw new Error("Dynamic catch values are not supported in JSON Schema");
  }
  json.default = catchValue;
};
const pipeProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  const inIsTransform = def.in._zod.traits.has("$ZodTransform");
  const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
  process$1(innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = innerType;
};
const readonlyProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process$1(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  json.readOnly = true;
};
const optionalProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  process$1(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};
const ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def) => {
  $ZodISODateTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function datetime(params) {
  return /* @__PURE__ */ _isoDateTime(ZodISODateTime, params);
}
const ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def) => {
  $ZodISODate.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function date(params) {
  return /* @__PURE__ */ _isoDate(ZodISODate, params);
}
const ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def) => {
  $ZodISOTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function time(params) {
  return /* @__PURE__ */ _isoTime(ZodISOTime, params);
}
const ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def) => {
  $ZodISODuration.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function duration(params) {
  return /* @__PURE__ */ _isoDuration(ZodISODuration, params);
}
const initializer = (inst, issues) => {
  $ZodError.init(inst, issues);
  inst.name = "ZodError";
  Object.defineProperties(inst, {
    format: {
      value: (mapper) => formatError(inst, mapper)
      // enumerable: false,
    },
    flatten: {
      value: (mapper) => flattenError(inst, mapper)
      // enumerable: false,
    },
    addIssue: {
      value: (issue2) => {
        inst.issues.push(issue2);
        inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }
      // enumerable: false,
    },
    addIssues: {
      value: (issues2) => {
        inst.issues.push(...issues2);
        inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }
      // enumerable: false,
    },
    isEmpty: {
      get() {
        return inst.issues.length === 0;
      }
      // enumerable: false,
    }
  });
};
const ZodRealError = /* @__PURE__ */ $constructor("ZodError", initializer, {
  Parent: Error
});
const parse = /* @__PURE__ */ _parse(ZodRealError);
const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
const encode = /* @__PURE__ */ _encode(ZodRealError);
const decode = /* @__PURE__ */ _decode(ZodRealError);
const encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
const decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
const safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
const safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
const safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
const safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
const _installedGroups = /* @__PURE__ */ new WeakMap();
function _installLazyMethods(inst, group, methods) {
  const proto = Object.getPrototypeOf(inst);
  let installed = _installedGroups.get(proto);
  if (!installed) {
    installed = /* @__PURE__ */ new Set();
    _installedGroups.set(proto, installed);
  }
  if (installed.has(group))
    return;
  installed.add(group);
  for (const key in methods) {
    const fn = methods[key];
    Object.defineProperty(proto, key, {
      configurable: true,
      enumerable: false,
      get() {
        const bound = fn.bind(this);
        Object.defineProperty(this, key, {
          configurable: true,
          writable: true,
          enumerable: true,
          value: bound
        });
        return bound;
      },
      set(v) {
        Object.defineProperty(this, key, {
          configurable: true,
          writable: true,
          enumerable: true,
          value: v
        });
      }
    });
  }
}
const ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => {
  $ZodType.init(inst, def);
  Object.assign(inst["~standard"], {
    jsonSchema: {
      input: createStandardJSONSchemaMethod(inst, "input"),
      output: createStandardJSONSchemaMethod(inst, "output")
    }
  });
  inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
  inst.def = def;
  inst.type = def.type;
  Object.defineProperty(inst, "_def", { value: def });
  inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
  inst.safeParse = (data, params) => safeParse(inst, data, params);
  inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
  inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
  inst.spa = inst.safeParseAsync;
  inst.encode = (data, params) => encode(inst, data, params);
  inst.decode = (data, params) => decode(inst, data, params);
  inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
  inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
  inst.safeEncode = (data, params) => safeEncode(inst, data, params);
  inst.safeDecode = (data, params) => safeDecode(inst, data, params);
  inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
  inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
  _installLazyMethods(inst, "ZodType", {
    check(...chks) {
      const def2 = this.def;
      return this.clone(mergeDefs(def2, {
        checks: [
          ...def2.checks ?? [],
          ...chks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)
        ]
      }), { parent: true });
    },
    with(...chks) {
      return this.check(...chks);
    },
    clone(def2, params) {
      return clone(this, def2, params);
    },
    brand() {
      return this;
    },
    register(reg, meta) {
      reg.add(this, meta);
      return this;
    },
    refine(check, params) {
      return this.check(refine(check, params));
    },
    superRefine(refinement, params) {
      return this.check(superRefine(refinement, params));
    },
    overwrite(fn) {
      return this.check(/* @__PURE__ */ _overwrite(fn));
    },
    optional() {
      return optional(this);
    },
    exactOptional() {
      return exactOptional(this);
    },
    nullable() {
      return nullable(this);
    },
    nullish() {
      return optional(nullable(this));
    },
    nonoptional(params) {
      return nonoptional(this, params);
    },
    array() {
      return array(this);
    },
    or(arg) {
      return union([this, arg]);
    },
    and(arg) {
      return intersection(this, arg);
    },
    transform(tx) {
      return pipe(this, transform(tx));
    },
    default(d) {
      return _default(this, d);
    },
    prefault(d) {
      return prefault(this, d);
    },
    catch(params) {
      return _catch(this, params);
    },
    pipe(target) {
      return pipe(this, target);
    },
    readonly() {
      return readonly(this);
    },
    describe(description) {
      const cl = this.clone();
      globalRegistry.add(cl, { description });
      return cl;
    },
    meta(...args) {
      if (args.length === 0)
        return globalRegistry.get(this);
      const cl = this.clone();
      globalRegistry.add(cl, args[0]);
      return cl;
    },
    isOptional() {
      return this.safeParse(void 0).success;
    },
    isNullable() {
      return this.safeParse(null).success;
    },
    apply(fn) {
      return fn(this);
    }
  });
  Object.defineProperty(inst, "description", {
    get() {
      return globalRegistry.get(inst)?.description;
    },
    configurable: true
  });
  return inst;
});
const _ZodString = /* @__PURE__ */ $constructor("_ZodString", (inst, def) => {
  $ZodString.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json);
  const bag = inst._zod.bag;
  inst.format = bag.format ?? null;
  inst.minLength = bag.minimum ?? null;
  inst.maxLength = bag.maximum ?? null;
  _installLazyMethods(inst, "_ZodString", {
    regex(...args) {
      return this.check(/* @__PURE__ */ _regex(...args));
    },
    includes(...args) {
      return this.check(/* @__PURE__ */ _includes(...args));
    },
    startsWith(...args) {
      return this.check(/* @__PURE__ */ _startsWith(...args));
    },
    endsWith(...args) {
      return this.check(/* @__PURE__ */ _endsWith(...args));
    },
    min(...args) {
      return this.check(/* @__PURE__ */ _minLength(...args));
    },
    max(...args) {
      return this.check(/* @__PURE__ */ _maxLength(...args));
    },
    length(...args) {
      return this.check(/* @__PURE__ */ _length(...args));
    },
    nonempty(...args) {
      return this.check(/* @__PURE__ */ _minLength(1, ...args));
    },
    lowercase(params) {
      return this.check(/* @__PURE__ */ _lowercase(params));
    },
    uppercase(params) {
      return this.check(/* @__PURE__ */ _uppercase(params));
    },
    trim() {
      return this.check(/* @__PURE__ */ _trim());
    },
    normalize(...args) {
      return this.check(/* @__PURE__ */ _normalize(...args));
    },
    toLowerCase() {
      return this.check(/* @__PURE__ */ _toLowerCase());
    },
    toUpperCase() {
      return this.check(/* @__PURE__ */ _toUpperCase());
    },
    slugify() {
      return this.check(/* @__PURE__ */ _slugify());
    }
  });
});
const ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def) => {
  $ZodString.init(inst, def);
  _ZodString.init(inst, def);
  inst.email = (params) => inst.check(/* @__PURE__ */ _email(ZodEmail, params));
  inst.url = (params) => inst.check(/* @__PURE__ */ _url(ZodURL, params));
  inst.jwt = (params) => inst.check(/* @__PURE__ */ _jwt(ZodJWT, params));
  inst.emoji = (params) => inst.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
  inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
  inst.uuid = (params) => inst.check(/* @__PURE__ */ _uuid(ZodUUID, params));
  inst.uuidv4 = (params) => inst.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
  inst.uuidv6 = (params) => inst.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
  inst.uuidv7 = (params) => inst.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
  inst.nanoid = (params) => inst.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
  inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
  inst.cuid = (params) => inst.check(/* @__PURE__ */ _cuid(ZodCUID, params));
  inst.cuid2 = (params) => inst.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
  inst.ulid = (params) => inst.check(/* @__PURE__ */ _ulid(ZodULID, params));
  inst.base64 = (params) => inst.check(/* @__PURE__ */ _base64(ZodBase64, params));
  inst.base64url = (params) => inst.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
  inst.xid = (params) => inst.check(/* @__PURE__ */ _xid(ZodXID, params));
  inst.ksuid = (params) => inst.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
  inst.ipv4 = (params) => inst.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
  inst.ipv6 = (params) => inst.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
  inst.cidrv4 = (params) => inst.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
  inst.cidrv6 = (params) => inst.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
  inst.e164 = (params) => inst.check(/* @__PURE__ */ _e164(ZodE164, params));
  inst.datetime = (params) => inst.check(datetime(params));
  inst.date = (params) => inst.check(date(params));
  inst.time = (params) => inst.check(time(params));
  inst.duration = (params) => inst.check(duration(params));
});
function string(params) {
  return /* @__PURE__ */ _string(ZodString, params);
}
const ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  _ZodString.init(inst, def);
});
const ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def) => {
  $ZodEmail.init(inst, def);
  ZodStringFormat.init(inst, def);
});
const ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def) => {
  $ZodGUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
const ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def) => {
  $ZodUUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
const ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def) => {
  $ZodURL.init(inst, def);
  ZodStringFormat.init(inst, def);
});
const ZodEmoji = /* @__PURE__ */ $constructor("ZodEmoji", (inst, def) => {
  $ZodEmoji.init(inst, def);
  ZodStringFormat.init(inst, def);
});
const ZodNanoID = /* @__PURE__ */ $constructor("ZodNanoID", (inst, def) => {
  $ZodNanoID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
const ZodCUID = /* @__PURE__ */ $constructor("ZodCUID", (inst, def) => {
  $ZodCUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
const ZodCUID2 = /* @__PURE__ */ $constructor("ZodCUID2", (inst, def) => {
  $ZodCUID2.init(inst, def);
  ZodStringFormat.init(inst, def);
});
const ZodULID = /* @__PURE__ */ $constructor("ZodULID", (inst, def) => {
  $ZodULID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
const ZodXID = /* @__PURE__ */ $constructor("ZodXID", (inst, def) => {
  $ZodXID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
const ZodKSUID = /* @__PURE__ */ $constructor("ZodKSUID", (inst, def) => {
  $ZodKSUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
const ZodIPv4 = /* @__PURE__ */ $constructor("ZodIPv4", (inst, def) => {
  $ZodIPv4.init(inst, def);
  ZodStringFormat.init(inst, def);
});
const ZodIPv6 = /* @__PURE__ */ $constructor("ZodIPv6", (inst, def) => {
  $ZodIPv6.init(inst, def);
  ZodStringFormat.init(inst, def);
});
const ZodCIDRv4 = /* @__PURE__ */ $constructor("ZodCIDRv4", (inst, def) => {
  $ZodCIDRv4.init(inst, def);
  ZodStringFormat.init(inst, def);
});
const ZodCIDRv6 = /* @__PURE__ */ $constructor("ZodCIDRv6", (inst, def) => {
  $ZodCIDRv6.init(inst, def);
  ZodStringFormat.init(inst, def);
});
const ZodBase64 = /* @__PURE__ */ $constructor("ZodBase64", (inst, def) => {
  $ZodBase64.init(inst, def);
  ZodStringFormat.init(inst, def);
});
const ZodBase64URL = /* @__PURE__ */ $constructor("ZodBase64URL", (inst, def) => {
  $ZodBase64URL.init(inst, def);
  ZodStringFormat.init(inst, def);
});
const ZodE164 = /* @__PURE__ */ $constructor("ZodE164", (inst, def) => {
  $ZodE164.init(inst, def);
  ZodStringFormat.init(inst, def);
});
const ZodJWT = /* @__PURE__ */ $constructor("ZodJWT", (inst, def) => {
  $ZodJWT.init(inst, def);
  ZodStringFormat.init(inst, def);
});
const ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
  $ZodArray.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
  inst.element = def.element;
  _installLazyMethods(inst, "ZodArray", {
    min(n, params) {
      return this.check(/* @__PURE__ */ _minLength(n, params));
    },
    nonempty(params) {
      return this.check(/* @__PURE__ */ _minLength(1, params));
    },
    max(n, params) {
      return this.check(/* @__PURE__ */ _maxLength(n, params));
    },
    length(n, params) {
      return this.check(/* @__PURE__ */ _length(n, params));
    },
    unwrap() {
      return this.element;
    }
  });
});
function array(element, params) {
  return /* @__PURE__ */ _array(ZodArray, element, params);
}
const ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
  $ZodUnion.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
  inst.options = def.options;
});
function union(options, params) {
  return new ZodUnion({
    type: "union",
    options,
    ...normalizeParams(params)
  });
}
const ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
  $ZodIntersection.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
});
function intersection(left, right) {
  return new ZodIntersection({
    type: "intersection",
    left,
    right
  });
}
const ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
  $ZodTransform.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx);
  inst._zod.parse = (payload, _ctx) => {
    if (_ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    payload.addIssue = (issue$1) => {
      if (typeof issue$1 === "string") {
        payload.issues.push(issue(issue$1, payload.value, def));
      } else {
        const _issue = issue$1;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        _issue.input ?? (_issue.input = payload.value);
        _issue.inst ?? (_issue.inst = inst);
        payload.issues.push(issue(_issue));
      }
    };
    const output = def.transform(payload.value, payload);
    if (output instanceof Promise) {
      return output.then((output2) => {
        payload.value = output2;
        payload.fallback = true;
        return payload;
      });
    }
    payload.value = output;
    payload.fallback = true;
    return payload;
  };
});
function transform(fn) {
  return new ZodTransform({
    type: "transform",
    transform: fn
  });
}
const ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
  $ZodOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
  return new ZodOptional({
    type: "optional",
    innerType
  });
}
const ZodExactOptional = /* @__PURE__ */ $constructor("ZodExactOptional", (inst, def) => {
  $ZodExactOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
  return new ZodExactOptional({
    type: "optional",
    innerType
  });
}
const ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
  $ZodNullable.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
  return new ZodNullable({
    type: "nullable",
    innerType
  });
}
const ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
  $ZodDefault.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
  return new ZodDefault({
    type: "default",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
    }
  });
}
const ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
  $ZodPrefault.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
  return new ZodPrefault({
    type: "prefault",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
    }
  });
}
const ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
  $ZodNonOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
  return new ZodNonOptional({
    type: "nonoptional",
    innerType,
    ...normalizeParams(params)
  });
}
const ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
  $ZodCatch.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
  return new ZodCatch({
    type: "catch",
    innerType,
    catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
  });
}
const ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
  $ZodPipe.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
  inst.in = def.in;
  inst.out = def.out;
});
function pipe(in_, out) {
  return new ZodPipe({
    type: "pipe",
    in: in_,
    out
    // ...util.normalizeParams(params),
  });
}
const ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
  $ZodReadonly.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
  return new ZodReadonly({
    type: "readonly",
    innerType
  });
}
const ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
  $ZodCustom.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx);
});
function refine(fn, _params = {}) {
  return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
}
function superRefine(fn, params) {
  return /* @__PURE__ */ _superRefine(fn, params);
}
string().regex(/^1[3-9]\d{9}$/, "手机号格式不正确");
string().regex(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, "身份证号格式不正确");
string().email("邮箱格式不正确");
string().url("URL格式不正确");
class SyncScheduler {
  constructor(engine) {
    this.engine = engine;
  }
  engine;
  listeners = [];
  status = "idle";
  autoTimer = null;
  cronTask = null;
  fixedTimers = [];
  config = null;
  // ─── 事件监听 ──────────────────────────────────────────────
  on(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
  emit(event) {
    for (const l of this.listeners) l(event);
  }
  setStatus(s) {
    if (this.status === s) return;
    this.status = s;
    this.emit({ type: "status-change", status: s });
  }
  getStatus() {
    return this.status;
  }
  // ─── 手动触发 ──────────────────────────────────────────────
  async triggerManual() {
    await this.runSync("manual");
  }
  // ─── 调度管理 ──────────────────────────────────────────────
  /**
   * 应用新的同步配置，并重新启动调度
   * @param config 新配置
   */
  applyConfig(config2) {
    this.config = config2;
    this.engine.setAccessToken(config2.accessToken);
    this.engine.setServerUrl(config2.serverUrl);
    this.stopAll();
    if (!config2.enabled) {
      this.setStatus("disabled");
      return;
    }
    this.setStatus("idle");
    switch (config2.trigger) {
      case "manual":
        break;
      case "auto":
        this.startAutoSync(config2.intervalMs);
        break;
      case "scheduled":
        if (config2.cronExpression) {
          this.startCronSync(config2.cronExpression);
        }
        break;
      case "timed":
        if (config2.fixedTimes && config2.fixedTimes.length > 0) {
          this.startFixedTimeSync(config2.fixedTimes);
        }
        break;
    }
  }
  /** 停止所有调度 */
  stopAll() {
    if (this.autoTimer) {
      clearTimeout(this.autoTimer);
      this.autoTimer = null;
    }
    if (this.cronTask) {
      this.cronTask.stop();
      this.cronTask = null;
    }
    for (const t of this.fixedTimers) clearTimeout(t);
    this.fixedTimers = [];
  }
  // ─── 私有调度方法 ──────────────────────────────────────────
  /**
   * 自动同步：按 intervalMs 递归调度
   * @param intervalMs 间隔时间（ms）
   */
  startAutoSync(intervalMs) {
    const run = async () => {
      await this.runSync("auto");
      this.autoTimer = setTimeout(run, intervalMs);
    };
    this.autoTimer = setTimeout(run, intervalMs);
  }
  /**
   * cron 定时同步
   * @param expression node-cron 表达式
   */
  startCronSync(expression) {
    if (!cron.validate(expression)) {
      console.warn(`[Sync] 无效的 cron 表达式: ${expression}`);
      return;
    }
    this.cronTask = cron.schedule(expression, () => {
      void this.runSync("scheduled");
    });
  }
  /**
   * 固定时间同步（每天在指定 HH:mm 触发）
   * @param fixedTimes HH:mm 格式时间列表，如 ["09:00","18:00"]
   */
  startFixedTimeSync(fixedTimes) {
    const scheduleNext = (timeStr) => {
      const delay = msUntilNextFixedTime([timeStr]);
      const timer = setTimeout(async () => {
        await this.runSync("timed");
        const nextTimer = setTimeout(async () => {
          await this.runSync("timed");
          scheduleNext(timeStr);
        }, minutesToMs(24 * 60));
        this.fixedTimers.push(nextTimer);
      }, delay);
      this.fixedTimers.push(timer);
    };
    for (const t of fixedTimes) {
      scheduleNext(t);
    }
  }
  // ─── 执行同步 ──────────────────────────────────────────────
  async runSync(trigger) {
    if (this.status === "syncing") return;
    if (!this.config?.serverUrl) {
      this.emit({ type: "error", status: "error", trigger, error: "服务端 URL 未配置" });
      return;
    }
    this.setStatus("syncing");
    this.emit({ type: "start", status: "syncing", trigger });
    const result = await this.engine.sync(
      trigger,
      this.config.direction,
      this.config.lastSyncAt,
      this.config.lastSyncCursor
    );
    if (result.status === "success") {
      if (this.config) {
        this.config.lastSyncAt = result.nextSyncAt ?? Date.now();
        this.config.lastSyncCursor = result.nextSyncCursor;
      }
      this.setStatus("success");
      this.emit({
        type: "success",
        status: "success",
        trigger,
        durationMs: result.durationMs
      });
    } else {
      this.setStatus("error");
      this.emit({
        type: "error",
        status: "error",
        trigger,
        durationMs: result.durationMs,
        error: result.error
      });
    }
    setTimeout(() => {
      if (this.status !== "disabled") this.setStatus("idle");
    }, 3e3);
  }
}
function registerSyncHandlers(ipc, scheduler2, syncConfigRepo) {
  ipc.handle("sync:trigger-manual", async () => {
    await scheduler2.triggerManual();
    return { ok: true };
  });
  ipc.handle("sync:get-config", () => {
    const row = syncConfigRepo.get();
    return syncConfigRepo.toSyncConfig(row);
  });
  ipc.handle("sync:save-config", (_event, config2) => {
    syncConfigRepo.save(config2);
    scheduler2.applyConfig(config2);
    return { ok: true };
  });
  ipc.handle("sync:pending-count", () => {
    return { count: 0 };
  });
  ipc.handle("sync:get-status", () => {
    return scheduler2.getStatus();
  });
}
const ALLOWED_TABLES$1 = /* @__PURE__ */ new Set([
  "elderly",
  "family_contact",
  "health_profile",
  "vital_signs",
  "medication_order",
  "medication_record",
  "medical_visit",
  "admission",
  "leave_record",
  "discharge",
  "care_assessment",
  "care_plan",
  "care_record",
  "fee_item",
  "deposit_record",
  "monthly_bill",
  "bill_detail",
  "payment_record",
  "meal_menu",
  "meal_record",
  "nutrition_plan",
  "activity",
  "activity_attendance",
  "contract",
  "building",
  "room",
  "bed",
  "task_reminder",
  "iot_device_alert",
  "announcement"
]);
function quoteIdentifier(name) {
  return `\`${name}\``;
}
function getColumns(db2, table) {
  return new Set(
    db2.prepare(`PRAGMA table_info(${quoteIdentifier(table)})`).all().map((column) => column.name)
  );
}
function applyChange(db2, change) {
  if (!ALLOWED_TABLES$1.has(change.tableName)) {
    throw new Error(`不支持同步数据表: ${change.tableName}`);
  }
  const payload = change.payload;
  if (!payload || typeof payload.id !== "string" || !payload.id) {
    throw new Error(`同步记录缺少 ID: ${change.id}`);
  }
  const table = quoteIdentifier(change.tableName);
  const columns = getColumns(db2, change.tableName);
  if (change.operation === "DELETE") {
    if (columns.has("deleted_at")) {
      const deletedAt = typeof payload.deleted_at === "number" ? payload.deleted_at : change.createdAt;
      if (columns.has("updated_at")) {
        db2.prepare(`UPDATE ${table} SET deleted_at=?, updated_at=? WHERE id=?`).run(deletedAt, deletedAt, payload.id);
      } else {
        db2.prepare(`UPDATE ${table} SET deleted_at=? WHERE id=?`).run(deletedAt, payload.id);
      }
    } else {
      db2.prepare(`DELETE FROM ${table} WHERE id=?`).run(payload.id);
    }
    return;
  }
  const fields = Object.keys(payload).filter((field) => columns.has(field));
  if (!fields.includes("id")) {
    throw new Error(`同步记录包含未知字段: ${change.id}`);
  }
  const fieldNames = fields.map(quoteIdentifier);
  const placeholders = fields.map((field) => `@${field}`);
  const updates = fields.filter((field) => field !== "id");
  if (updates.length === 0) {
    db2.prepare(`INSERT OR IGNORE INTO ${table} (${fieldNames.join(", ")}) VALUES (${placeholders.join(", ")})`).run(payload);
    return;
  }
  const assignments = updates.map((field) => `${quoteIdentifier(field)}=excluded.${quoteIdentifier(field)}`);
  const where = columns.has("updated_at") && fields.includes("updated_at") ? ` WHERE excluded.updated_at >= ${table}.updated_at` : "";
  db2.prepare(
    `INSERT INTO ${table} (${fieldNames.join(", ")}) VALUES (${placeholders.join(", ")})
     ON CONFLICT(id) DO UPDATE SET ${assignments.join(", ")}${where}`
  ).run(payload);
}
function applyRemoteChanges(db2, changes) {
  const applyAll = db2.transaction(() => {
    for (const change of changes) applyChange(db2, change);
  });
  applyAll();
}
function registerElderlyHandlers(ipc, elderlyRepo) {
  ipc.handle("elderly:list", () => {
    return elderlyRepo.findAll();
  });
  ipc.handle("elderly:get", (_event, id) => {
    return elderlyRepo.findById(id);
  });
  ipc.handle("elderly:create", (_event, data) => {
    return elderlyRepo.insert(data);
  });
  ipc.handle("elderly:update", (_event, { id, data }) => {
    elderlyRepo.update(id, data);
    return { ok: true };
  });
  ipc.handle("elderly:delete", (_event, id) => {
    elderlyRepo.softDelete(id);
    return { ok: true };
  });
}
function registerConfigHandlers(ipc, syncConfigRepo, scheduler2) {
  ipc.handle("app:get-version", () => electron.app.getVersion());
  ipc.handle("app:get-user-data", () => electron.app.getPath("userData"));
  ipc.handle("sync:disable", () => {
    const current = syncConfigRepo.get();
    const config2 = syncConfigRepo.toSyncConfig(current);
    config2.enabled = false;
    syncConfigRepo.save(config2);
    scheduler2.applyConfig(config2);
    return { ok: true };
  });
}
function registerBuildingHandlers(ipc, repo) {
  ipc.handle("building:list", () => repo.findAllBuildings());
  ipc.handle("building:create", (_e, data) => repo.insertBuilding(data));
  ipc.handle("building:update", (_e, { id, data }) => {
    repo.updateBuilding(id, data);
    return { ok: true };
  });
  ipc.handle("building:delete", (_e, id) => {
    repo.deleteBuilding(id);
    return { ok: true };
  });
  ipc.handle("room:list", (_e, buildingId) => repo.findAllRooms(buildingId));
  ipc.handle("room:create", (_e, data) => repo.insertRoom(data));
  ipc.handle("room:update", (_e, { id, data }) => {
    repo.updateRoom(id, data);
    return { ok: true };
  });
  ipc.handle("room:delete", (_e, id) => {
    repo.deleteRoom(id);
    return { ok: true };
  });
  ipc.handle("bed:list", (_e, roomId) => repo.findAllBeds(roomId));
  ipc.handle("bed:available", () => repo.findAvailableBeds());
  ipc.handle("bed:stats", () => repo.getBedStats());
  ipc.handle("bed:create", (_e, data) => repo.insertBed(data));
  ipc.handle("bed:update", (_e, { id, data }) => {
    repo.updateBed(id, data);
    return { ok: true };
  });
  ipc.handle("bed:delete", (_e, id) => {
    repo.deleteBed(id);
    return { ok: true };
  });
}
function registerFamilyContactHandlers(ipc, repo) {
  ipc.handle("family:list", (_e, elderlyId) => repo.findByElderly(elderlyId));
  ipc.handle("family:create", (_e, data) => repo.insert(data));
  ipc.handle("family:update", (_e, { id, data }) => {
    repo.update(id, data);
    return { ok: true };
  });
  ipc.handle("family:delete", (_e, id) => {
    repo.softDelete(id);
    return { ok: true };
  });
}
function registerHealthHandlers(ipc, repo) {
  ipc.handle("health:profile:get", (_e, elderlyId) => repo.findProfile(elderlyId));
  ipc.handle("health:profile:save", (_e, { elderlyId, data }) => repo.upsertProfile(elderlyId, data));
  ipc.handle("health:vital:list", (_e, elderlyId, limit) => repo.findVitalSigns(elderlyId, limit));
  ipc.handle("health:vital:create", (_e, data) => repo.insertVitalSigns(data));
  ipc.handle("health:vital:delete", (_e, id) => {
    repo.deleteVitalSigns(id);
    return { ok: true };
  });
  ipc.handle("health:med:order:list", (_e, elderlyId, activeOnly) => repo.findMedOrders(elderlyId, activeOnly));
  ipc.handle("health:med:order:create", (_e, data) => repo.insertMedOrder(data));
  ipc.handle("health:med:order:update", (_e, { id, data }) => {
    repo.updateMedOrder(id, data);
    return { ok: true };
  });
  ipc.handle("health:med:order:delete", (_e, id) => {
    repo.deleteMedOrder(id);
    return { ok: true };
  });
  ipc.handle("health:med:record:list", (_e, elderlyId, date2) => repo.findMedRecords(elderlyId, date2));
  ipc.handle("health:med:record:create", (_e, data) => repo.insertMedRecord(data));
  ipc.handle("health:visit:list", (_e, elderlyId) => repo.findMedVisits(elderlyId));
  ipc.handle("health:visit:create", (_e, data) => repo.insertMedVisit(data));
  ipc.handle("health:visit:delete", (_e, id) => {
    repo.deleteMedVisit(id);
    return { ok: true };
  });
  ipc.handle("health:exam:appt:list", (_e, elderlyId) => repo.findExamAppointments(elderlyId));
  ipc.handle("health:exam:appt:create", (_e, data) => repo.insertExamAppointment(data));
  ipc.handle("health:exam:appt:update", (_e, { id, data }) => {
    repo.updateExamAppointment(id, data);
    return { ok: true };
  });
  ipc.handle("health:exam:appt:delete", (_e, id) => {
    repo.deleteExamAppointment(id);
    return { ok: true };
  });
  ipc.handle("health:exam:result:list", (_e, elderlyId) => repo.findExamResults(elderlyId));
  ipc.handle("health:exam:result:create", (_e, data) => repo.insertExamResult(data));
  ipc.handle("health:exam:result:update", (_e, { id, data }) => {
    repo.updateExamResult(id, data);
    return { ok: true };
  });
  ipc.handle("health:exam:result:delete", (_e, id) => {
    repo.deleteExamResult(id);
    return { ok: true };
  });
}
function registerAdmissionHandlers(ipc, repo) {
  ipc.handle("admission:list", () => repo.findAll());
  ipc.handle("admission:list:elderly", (_e, elderlyId) => repo.findByElderly(elderlyId));
  ipc.handle("admission:active", (_e, elderlyId) => repo.findActiveByElderly(elderlyId));
  ipc.handle("admission:create", (_e, data) => repo.insert(data));
  ipc.handle("admission:update", (_e, { id, data }) => {
    repo.update(id, data);
    return { ok: true };
  });
  ipc.handle("admission:delete", (_e, id) => {
    repo.softDelete(id);
    return { ok: true };
  });
  ipc.handle("admission:leave:list", (_e, elderlyId) => repo.findLeaveByElderly(elderlyId));
  ipc.handle("admission:leave:active", (_e, elderlyId) => repo.findActiveLeave(elderlyId));
  ipc.handle("admission:leave:create", (_e, data) => repo.insertLeave(data));
  ipc.handle("admission:leave:return", (_e, { id, actualReturn }) => {
    repo.updateLeave(id, { status: "returned", actual_return: actualReturn });
    return { ok: true };
  });
  ipc.handle("discharge:list", (_e, elderlyId) => repo.findDischargeByElderly(elderlyId));
  ipc.handle("discharge:create", (_e, data) => repo.insertDischarge(data));
}
function registerCareHandlers(ipc, repo) {
  ipc.handle("care:assess:list", (_e, elderlyId) => repo.findAssessments(elderlyId));
  ipc.handle("care:assess:latest", (_e, elderlyId) => repo.findLatestAssessment(elderlyId));
  ipc.handle("care:assess:create", (_e, data) => repo.insertAssessment(data));
  ipc.handle("care:assess:delete", (_e, id) => {
    repo.deleteAssessment(id);
    return { ok: true };
  });
  ipc.handle("care:plan:list", (_e, elderlyId) => repo.findPlans(elderlyId));
  ipc.handle("care:plan:active", (_e, elderlyId) => repo.findActivePlan(elderlyId));
  ipc.handle("care:plan:create", (_e, data) => repo.insertPlan(data));
  ipc.handle("care:plan:update", (_e, { id, data }) => {
    repo.updatePlan(id, data);
    return { ok: true };
  });
  ipc.handle("care:plan:delete", (_e, id) => {
    repo.deletePlan(id);
    return { ok: true };
  });
  ipc.handle("care:record:list", (_e, elderlyId, date2) => repo.findRecords(elderlyId, date2));
  ipc.handle("care:record:bydate", (_e, date2) => repo.findRecordsByDate(date2));
  ipc.handle("care:record:create", (_e, data) => repo.insertRecord(data));
  ipc.handle("care:record:delete", (_e, id) => {
    repo.deleteRecord(id);
    return { ok: true };
  });
  ipc.handle("care:workload", (_e, startDate, endDate) => repo.getWorkloadStats(startDate, endDate));
}
function registerFeeHandlers(ipc, repo) {
  ipc.handle("fee:item:list", (_e, activeOnly) => repo.findAllFeeItems(activeOnly));
  ipc.handle("fee:item:create", (_e, data) => repo.insertFeeItem(data));
  ipc.handle("fee:item:update", (_e, { id, data }) => {
    repo.updateFeeItem(id, data);
    return { ok: true };
  });
  ipc.handle("fee:item:delete", (_e, id) => {
    repo.deleteFeeItem(id);
    return { ok: true };
  });
  ipc.handle("fee:deposit:list", (_e, elderlyId) => repo.findDeposits(elderlyId));
  ipc.handle("fee:deposit:balance", (_e, elderlyId) => repo.getDepositBalance(elderlyId));
  ipc.handle("fee:deposit:create", (_e, data) => repo.insertDeposit(data));
  ipc.handle("fee:bill:list", (_e, elderlyId) => repo.findBills(elderlyId));
  ipc.handle("fee:bill:get", (_e, elderlyId, billMonth) => repo.findBill(elderlyId, billMonth));
  ipc.handle("fee:bill:overdue", () => repo.findOverdueBills());
  ipc.handle("fee:bill:create", (_e, data) => repo.insertBill(data));
  ipc.handle("fee:bill:create-with-details", (_e, { data, details }) => repo.insertBillWithDetails(data, details));
  ipc.handle("fee:bill:update", (_e, { id, data }) => {
    repo.updateBill(id, data);
    return { ok: true };
  });
  ipc.handle("fee:bill:detail:list", (_e, billId) => repo.findBillDetails(billId));
  ipc.handle("fee:bill:detail:create", (_e, data) => repo.insertBillDetail(data));
  ipc.handle("fee:payment:list", (_e, elderlyId, billId) => repo.findPayments(elderlyId, billId));
  ipc.handle("fee:payment:create", (_e, data) => repo.insertPayment(data));
  ipc.handle("fee:stats", (_e, month) => repo.getFinancialStats(month));
}
function registerMealHandlers(ipc, repo) {
  ipc.handle("meal:menu:bydate", (_e, date2) => repo.findMenuByDate(date2));
  ipc.handle("meal:menu:range", (_e, startDate, endDate) => repo.findMenuByRange(startDate, endDate));
  ipc.handle("meal:menu:create", (_e, data) => repo.insertMenu(data));
  ipc.handle("meal:menu:update", (_e, { id, data }) => {
    repo.updateMenu(id, data);
    return { ok: true };
  });
  ipc.handle("meal:menu:delete", (_e, id) => {
    repo.deleteMenu(id);
    return { ok: true };
  });
  ipc.handle("meal:record:list", (_e, elderlyId, limit) => repo.findMealRecords(elderlyId, limit));
  ipc.handle("meal:record:bydate", (_e, date2) => repo.findMealRecordsByDate(date2));
  ipc.handle("meal:record:create", (_e, data) => repo.insertMealRecord(data));
  ipc.handle("meal:record:update", (_e, { id, data }) => {
    repo.updateMealRecord(id, data);
    return { ok: true };
  });
  ipc.handle("meal:record:delete", (_e, id) => {
    repo.deleteMealRecord(id);
    return { ok: true };
  });
  ipc.handle("meal:nutrition:list", (_e, elderlyId, includeInactive) => repo.findNutritionPlans(elderlyId, includeInactive));
  ipc.handle("meal:nutrition:create", (_e, data) => repo.insertNutritionPlan(data));
  ipc.handle("meal:nutrition:update", (_e, { id, data }) => {
    repo.updateNutritionPlan(id, data);
    return { ok: true };
  });
  ipc.handle("meal:nutrition:delete", (_e, id) => {
    repo.deleteNutritionPlan(id);
    return { ok: true };
  });
}
function registerActivityHandlers(ipc, repo) {
  ipc.handle("activity:list", (_e, status) => repo.findAll(status));
  ipc.handle("activity:get", (_e, id) => repo.findById(id));
  ipc.handle("activity:create", (_e, data) => repo.insert(data));
  ipc.handle("activity:update", (_e, { id, data }) => {
    repo.update(id, data);
    return { ok: true };
  });
  ipc.handle("activity:delete", (_e, id) => {
    repo.softDelete(id);
    return { ok: true };
  });
  ipc.handle("activity:start", (_e, id) => {
    repo.start(id);
    return { ok: true };
  });
  ipc.handle("activity:complete", (_e, id) => {
    repo.complete(id);
    return { ok: true };
  });
  ipc.handle("activity:cancel", (_e, id) => {
    repo.cancel(id);
    return { ok: true };
  });
  ipc.handle("activity:attendance:list", (_e, activityId) => repo.findAttendance(activityId));
  ipc.handle("activity:attendance:elderly", (_e, elderlyId) => repo.findElderlyActivities(elderlyId));
  ipc.handle("activity:attendance:register", (_e, activityId, elderlyId) => repo.registerAttendance(activityId, elderlyId));
  ipc.handle("activity:attendance:checkin", (_e, activityId, elderlyId) => {
    repo.checkIn(activityId, elderlyId);
    return { ok: true };
  });
  ipc.handle("activity:attendance:absent", (_e, activityId, elderlyId) => {
    repo.markAbsent(activityId, elderlyId);
    return { ok: true };
  });
  ipc.handle("activity:attendance:remove", (_e, activityId, elderlyId) => {
    repo.removeAttendance(activityId, elderlyId);
    return { ok: true };
  });
}
function registerContractHandlers(ipc, repo) {
  ipc.handle("contract:list", () => repo.findAll());
  ipc.handle("contract:list:elderly", (_e, elderlyId) => repo.findByElderly(elderlyId));
  ipc.handle("contract:active", (_e, elderlyId) => repo.findActiveByElderly(elderlyId));
  ipc.handle("contract:expiring", (_e, days) => repo.findExpiringSoon(days));
  ipc.handle("contract:create", (_e, data) => repo.insert(data));
  ipc.handle("contract:update", (_e, { id, data }) => {
    repo.update(id, data);
    return { ok: true };
  });
  ipc.handle("contract:delete", (_e, id) => {
    repo.softDelete(id);
    return { ok: true };
  });
  ipc.handle("contract:gen:no", () => repo.generateContractNo());
  ipc.handle("contract:attachment:select", async () => {
    const result = await electron.dialog.showOpenDialog({
      title: "选择合同扫描件",
      properties: ["openFile"],
      filters: [
        { name: "合同文件", extensions: ["pdf", "jpg", "jpeg", "png", "webp"] }
      ]
    });
    if (result.canceled || result.filePaths.length === 0) return { canceled: true };
    const sourcePath = result.filePaths[0];
    const attachmentDir = node_path.join(electron.app.getPath("userData"), "contract-attachments");
    await promises.mkdir(attachmentDir, { recursive: true });
    const storedPath = node_path.join(attachmentDir, `${Date.now()}-${node_crypto.randomUUID()}${node_path.extname(sourcePath).toLowerCase()}`);
    await promises.copyFile(sourcePath, storedPath);
    return { canceled: false, filePath: storedPath, fileName: node_path.basename(sourcePath) };
  });
  ipc.handle("contract:attachment:open", async (_e, filePath) => {
    const error = await electron.shell.openPath(filePath);
    if (error) throw new Error(error);
    return { ok: true };
  });
}
function registerNotificationHandlers(ipc, repo) {
  ipc.handle("notify:list", (_e, unreadOnly) => repo.findAll(unreadOnly));
  ipc.handle("notify:unread:count", () => repo.getUnreadCount());
  ipc.handle("notify:create", (_e, data) => repo.insert(data));
  ipc.handle("notify:read", (_e, id) => {
    repo.markRead(id);
    return { ok: true };
  });
  ipc.handle("notify:unread", (_e, id) => {
    repo.markUnread(id);
    return { ok: true };
  });
  ipc.handle("notify:read:all", () => {
    repo.markAllRead();
    return { ok: true };
  });
  ipc.handle("notify:delete", (_e, id) => {
    repo.delete(id);
    return { ok: true };
  });
}
function sessionFilePath() {
  return path.join(electron.app.getPath("userData"), "session.json");
}
function loadPersistedSession() {
  try {
    const filePath = sessionFilePath();
    if (!fs.existsSync(filePath)) return null;
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (!data?.userId || !data.expiresAt || data.expiresAt < Date.now()) {
      clearPersistedSession();
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
function savePersistedSession(userId, ttlMs) {
  try {
    const data = { userId, expiresAt: Date.now() + ttlMs };
    fs.writeFileSync(sessionFilePath(), JSON.stringify(data), "utf-8");
  } catch {
  }
}
function clearPersistedSession() {
  try {
    const filePath = sessionFilePath();
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch {
  }
}
const REMEMBER_TTL_MS = 30 * 24 * 60 * 60 * 1e3;
const session = { user: null };
function requireActiveUser(userRepo) {
  if (!session.user) throw new Error("请先登录");
  const current = userRepo.findUserById(session.user.id);
  if (!current || current.status !== "active" || current.deleted_at !== null) {
    session.user = null;
    clearPersistedSession();
    throw new Error("当前账号已停用或不存在，请重新登录");
  }
  session.user = current;
  return current;
}
function toSafeUser$1(user) {
  const { password_hash: _h, password_salt: _s, ...safe } = user;
  return safe;
}
function registerAuthHandlers(ipc, userRepo) {
  ipc.handle("auth:login", (_e, { username, password, remember }) => {
    const user = userRepo.verifyLogin(username, password);
    if (!user) return { ok: false, error: "用户名或密码错误" };
    userRepo.recordLogin(user.id);
    session.user = user;
    if (remember) {
      savePersistedSession(user.id, REMEMBER_TTL_MS);
    } else {
      clearPersistedSession();
    }
    return { ok: true, user: toSafeUser$1(user) };
  });
  ipc.handle("auth:logout", () => {
    session.user = null;
    clearPersistedSession();
    return { ok: true };
  });
  ipc.handle("auth:current", () => {
    if (session.user) {
      try {
        return toSafeUser$1(requireActiveUser(userRepo));
      } catch {
        return null;
      }
    }
    const persisted = loadPersistedSession();
    if (!persisted) return null;
    const user = userRepo.findUserById(persisted.userId);
    if (!user || user.status !== "active") {
      clearPersistedSession();
      return null;
    }
    session.user = user;
    return toSafeUser$1(user);
  });
  ipc.handle("auth:change-password", (_e, { oldPassword, newPassword }) => {
    if (!session.user) return { ok: false, error: "未登录" };
    const ok = userRepo.verifyLogin(session.user.username, oldPassword);
    if (!ok) return { ok: false, error: "原密码不正确" };
    userRepo.setPassword(session.user.id, newPassword, false);
    session.user = userRepo.findUserById(session.user.id);
    return { ok: true };
  });
}
function registerLanHandlers(ipc, lanServer2, userRepo) {
  const requireAdministrator2 = () => {
    if (requireActiveUser(userRepo).role_id !== "role-admin") throw new Error("仅系统管理员可配置局域网服务");
  };
  ipc.handle("lan:config:get", () => {
    requireAdministrator2();
    return lanServer2.getConfig();
  });
  ipc.handle("lan:status", () => {
    requireAdministrator2();
    return lanServer2.getStatus();
  });
  ipc.handle("lan:ips", () => {
    requireAdministrator2();
    return lanServer2.getLanIPs();
  });
  ipc.handle("lan:config:save", (_e, cfg) => {
    requireAdministrator2();
    lanServer2.saveConfig(cfg);
    return { ok: true };
  });
  ipc.handle("lan:start", async (_e, port) => {
    try {
      requireAdministrator2();
      await lanServer2.start(port);
      return { ok: true, status: lanServer2.getStatus() };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  });
  ipc.handle("lan:stop", () => {
    requireAdministrator2();
    lanServer2.stop();
    return { ok: true, status: lanServer2.getStatus() };
  });
  ipc.handle("lan:ping", async (_e, url) => {
    requireAdministrator2();
    const http2 = await import("http");
    const https = await import("https");
    return new Promise((resolve) => {
      const startAt = Date.now();
      const mod = url.startsWith("https") ? https : http2;
      const timeout = setTimeout(() => resolve({ ok: false, error: "连接超时（5s）" }), 5e3);
      const req = mod.get(`${url.replace(/\/$/, "")}/ping`, (res) => {
        clearTimeout(timeout);
        const latency = Date.now() - startAt;
        if (res.statusCode === 200) {
          resolve({ ok: true, latency });
        } else {
          resolve({ ok: false, error: `HTTP ${res.statusCode}` });
        }
        res.resume();
      });
      req.on("error", (err) => {
        clearTimeout(timeout);
        resolve({ ok: false, error: err.message });
      });
    });
  });
}
function toSafeUser(user) {
  const { password_hash: _h, password_salt: _s, ...safe } = user;
  return safe;
}
function permissionKeys(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}
function requirePermission(repo, menu, button) {
  const currentUser = requireActiveUser(repo);
  const role = repo.findRoleById(currentUser.role_id);
  if (!role || role.deleted_at !== null) throw new Error("当前账号角色无效");
  const menus = permissionKeys(role.menu_keys);
  if (!menus.includes("*") && !menus.includes(menu)) throw new Error("当前账号无此菜单权限");
  if (button) {
    const buttons = permissionKeys(role.button_keys);
    if (!buttons.includes("*") && !buttons.includes(button)) throw new Error("当前账号无此操作权限");
  }
}
function requireAdministrator(repo) {
  if (requireActiveUser(repo).role_id !== "role-admin") throw new Error("仅系统管理员可执行角色和高权限账号操作");
}
function isPrivilegedRole(repo, roleId) {
  const role = repo.findRoleById(roleId);
  return !!role && (roleId === "role-admin" || permissionKeys(role.menu_keys).includes("*") || permissionKeys(role.button_keys).includes("*"));
}
function requireCanManageUser(repo, targetUserId) {
  const currentUser = requireActiveUser(repo);
  const target = repo.findUserById(targetUserId);
  if (!target) throw new Error("目标账号不存在");
  if (currentUser.role_id !== "role-admin" && (target.username === "admin" || isPrivilegedRole(repo, target.role_id))) {
    throw new Error("仅系统管理员可管理高权限账号");
  }
}
function validateRoleAssignment(repo, roleId, targetUserId) {
  if (typeof roleId !== "string") return;
  const role = repo.findRoleById(roleId);
  if (!role || role.deleted_at !== null) throw new Error("指定角色不存在");
  if (isPrivilegedRole(repo, roleId)) requireAdministrator(repo);
  const currentUser = requireActiveUser(repo);
  if (targetUserId === currentUser.id && currentUser.role_id !== "role-admin") {
    throw new Error("不能修改自己的角色");
  }
}
function registerUserHandlers(ipc, repo) {
  ipc.handle("user:list", () => {
    requirePermission(repo, "user");
    return repo.findAllUsers().map(toSafeUser);
  });
  ipc.handle("user:create", (_e, data) => {
    try {
      requirePermission(repo, "user", "user:create");
      validateRoleAssignment(repo, data.role_id);
      const row = repo.insertUser(data);
      return { ok: true, user: toSafeUser(row) };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "创建失败" };
    }
  });
  ipc.handle("user:update", (_e, { id, data }) => {
    try {
      requirePermission(repo, "user");
      requireCanManageUser(repo, id);
      const update = data && typeof data === "object" ? data : {};
      validateRoleAssignment(repo, update.role_id, id);
      repo.updateUser(id, data);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "更新失败" };
    }
  });
  ipc.handle("user:reset-password", (_e, { id, newPassword }) => {
    requirePermission(repo, "user", "user:reset-pw");
    requireCanManageUser(repo, id);
    repo.setPassword(id, newPassword, true);
    return { ok: true };
  });
  ipc.handle("user:delete", (_e, id) => {
    try {
      requirePermission(repo, "user", "user:delete");
      requireCanManageUser(repo, id);
      repo.softDeleteUser(id);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "删除失败" };
    }
  });
  ipc.handle("role:list", () => {
    requireActiveUser(repo);
    return repo.findAllRoles();
  });
  ipc.handle("role:create", (_e, data) => {
    requireAdministrator(repo);
    return repo.insertRole(data);
  });
  ipc.handle("role:update", (_e, { id, data }) => {
    try {
      requireAdministrator(repo);
      repo.updateRole(id, data);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "更新失败" };
    }
  });
  ipc.handle("role:delete", (_e, id) => {
    try {
      requireAdministrator(repo);
      repo.deleteRole(id);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "删除失败" };
    }
  });
}
function timeToMinutes(value) {
  const match = /^(\d{2}):(\d{2})/.exec(value);
  if (!match) return Number.NaN;
  return Number(match[1]) * 60 + Number(match[2]);
}
function validateShiftTimes(data) {
  if (data.start_time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(data.start_time)) {
    throw new Error("上班时间格式应为 HH:mm");
  }
  if (data.end_time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(data.end_time)) {
    throw new Error("下班时间格式应为 HH:mm");
  }
  if (data.start_time && data.end_time && timeToMinutes(data.start_time) >= timeToMinutes(data.end_time)) {
    throw new Error("下班时间必须晚于上班时间");
  }
}
function registerAttendanceHandlers(ipc, repo) {
  ipc.handle("shift:list", () => repo.findAllShifts());
  ipc.handle("shift:create", (_e, data) => {
    validateShiftTimes(data);
    return repo.insertShift(data);
  });
  ipc.handle("shift:update", (_e, { id, data }) => {
    validateShiftTimes(data);
    repo.updateShift(id, data);
    return { ok: true };
  });
  ipc.handle("shift:delete", (_e, id) => {
    repo.deleteShift(id);
    return { ok: true };
  });
  ipc.handle("shift:set-default", (_e, id) => {
    repo.setDefaultShift(id);
    return { ok: true };
  });
  ipc.handle(
    "shift:work-rule",
    (_e, userId, workDate) => repo.resolveWorkShift(userId, workDate)
  );
  ipc.handle(
    "schedule:list",
    (_e, startDate, endDate, userId) => repo.findSchedules(startDate, endDate, userId)
  );
  ipc.handle("schedule:get", (_e, id) => repo.findScheduleById(id));
  ipc.handle("schedule:create", (_e, data) => {
    try {
      return { ok: true, row: repo.insertSchedule(data) };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "排班失败（该日期该班次可能已存在）" };
    }
  });
  ipc.handle("schedule:update", (_e, { id, data }) => {
    try {
      repo.updateSchedule(id, data);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "更新失败" };
    }
  });
  ipc.handle("schedule:delete", (_e, id) => {
    repo.deleteSchedule(id);
    return { ok: true };
  });
  ipc.handle("attendance:today", (_e, userId, date2) => repo.findTodayAttendance(userId, date2));
  ipc.handle(
    "attendance:range",
    (_e, startDate, endDate, userId) => repo.findAttendanceByRange(startDate, endDate, userId)
  );
  ipc.handle("attendance:clock", (_e, { userId, clockType, clockAt, remark }) => {
    const clockDate = clockAt.slice(0, 10);
    const today = repo.findTodayAttendance(userId, clockDate);
    if (today.some((a) => a.clock_type === clockType)) {
      return { ok: false, error: clockType === "clock_in" ? "今日已上班打卡" : "今日已下班打卡" };
    }
    const workRule = repo.resolveWorkShift(userId, clockDate);
    if (!workRule) return { ok: false, error: "尚未设置上班时间，请先配置班次" };
    const actualMinutes = timeToMinutes(clockAt.slice(11, 16));
    const scheduledMinutes = timeToMinutes(
      clockType === "clock_in" ? workRule.shift.start_time : workRule.shift.end_time
    );
    if (!Number.isFinite(actualMinutes) || !Number.isFinite(scheduledMinutes)) {
      return { ok: false, error: "打卡时间或班次时间格式无效" };
    }
    const status = clockType === "clock_in" ? actualMinutes > scheduledMinutes ? "late" : "normal" : actualMinutes < scheduledMinutes ? "early_leave" : "normal";
    const row = repo.insertAttendance({
      user_id: userId,
      clock_date: clockDate,
      clock_type: clockType,
      clock_at: clockAt,
      status,
      remark: remark ?? null
    });
    return { ok: true, row, workRule };
  });
  ipc.handle("leave:list", (_e, userId, status) => repo.findLeaves(userId, status));
  ipc.handle("leave:create", (_e, data) => repo.insertLeave(data));
  ipc.handle("leave:approve", (_e, { id, approved, remark }) => {
    if (!session.user) return { ok: false, error: "未登录" };
    repo.approveLeave(id, session.user.id, approved, remark);
    return { ok: true };
  });
}
function registerIotHandlers(ipc, repo, reminderRepo) {
  ipc.handle("iot:device:list", () => repo.findAllDevices());
  ipc.handle("iot:device:create", (_e, data) => repo.insertDevice(data));
  ipc.handle("iot:device:update", (_e, { id, data }) => {
    repo.updateDevice(id, data);
    return { ok: true };
  });
  ipc.handle("iot:device:delete", (_e, id) => {
    repo.deleteDevice(id);
    return { ok: true };
  });
  ipc.handle("iot:data:list", (_e, deviceId2, limit) => repo.findDeviceData(deviceId2, limit));
  ipc.handle("iot:data:list:elderly", (_e, elderlyId, limit) => repo.findDeviceDataByElderly(elderlyId, limit));
  ipc.handle("iot:alert:list", (_e, includeResolved) => repo.findAlerts(includeResolved));
  ipc.handle("iot:health:check", () => repo.checkHealth());
  ipc.handle("iot:alert:create", (_e, data) => repo.createManualAlert(data));
  ipc.handle("iot:alert:sync-reminder", (_e, { alertId, userId }) => {
    return syncAlertToReminder(repo, reminderRepo, alertId, userId);
  });
  ipc.handle("iot:alert:start-repair", (_e, id) => {
    repo.startAlertRepair(id);
    return { ok: true };
  });
  ipc.handle("iot:alert:resolve", (_e, id) => {
    repo.resolveAlert(id);
    const reminder = reminderRepo.findByMaintenanceAlertId(id);
    if (reminder?.status === "active") reminderRepo.markDone(reminder.id);
    return { ok: true };
  });
  ipc.handle("iot:report", (_e, payload) => {
    return handleDeviceReport(repo, payload);
  });
}
function syncAlertToReminder(repo, reminderRepo, alertId, userId) {
  const existing = reminderRepo.findByMaintenanceAlertId(alertId);
  if (existing) return { reminder: existing, created: false };
  const alert = repo.findAlertById(alertId);
  if (!alert) throw new Error("维修事项不存在");
  const nextMinute = new Date(Date.now() + 6e4);
  const pad = (value) => String(value).padStart(2, "0");
  const reminder = reminderRepo.insert({
    title: `维修：${alert.device_name ?? "设备"} - ${alert.title}`,
    description: alert.content,
    remind_date: `${nextMinute.getFullYear()}-${pad(nextMinute.getMonth() + 1)}-${pad(nextMinute.getDate())}`,
    remind_at: `${pad(nextMinute.getHours())}:${pad(nextMinute.getMinutes())}`,
    repeat_type: "daily",
    repeat_days: null,
    creator_id: userId,
    assignee_id: userId,
    status: "active",
    schedule_id: null,
    maintenance_alert_id: alert.id
  });
  return { reminder, created: true };
}
function handleDeviceReport(repo, payload) {
  const device = repo.findDeviceById(payload.deviceId);
  if (!device) return { ok: false, error: "设备不存在，请先在设备管理中注册" };
  const row = repo.insertDeviceData({
    device_id: payload.deviceId,
    elderly_id: payload.elderlyId ?? device.elderly_id ?? null,
    data: JSON.stringify(payload.data),
    reported_at: Date.now()
  });
  return { ok: true, row };
}
function registerPermissionGroupHandlers(ipc, repo) {
  ipc.handle("permission-group:list", () => repo.findAll());
  ipc.handle("permission-group:create", (_e, data) => {
    try {
      const row = repo.insert(data);
      return { ok: true, group: row };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "创建失败" };
    }
  });
  ipc.handle("permission-group:update", (_e, { id, data }) => {
    try {
      repo.update(id, data);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "更新失败" };
    }
  });
  ipc.handle("permission-group:delete", (_e, id) => {
    try {
      repo.softDelete(id);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "删除失败" };
    }
  });
}
function registerTaskReminderHandlers(ipc, repo) {
  ipc.handle("reminder:list-mine", (_e, userId, includeInactive) => repo.findByAssignee(userId, includeInactive));
  ipc.handle("reminder:list-created", (_e, userId) => repo.findByCreator(userId));
  ipc.handle("reminder:get", (_e, id) => repo.findById(id));
  ipc.handle("reminder:by-schedule-ids", (_e, ids) => {
    const map = repo.findByScheduleIds(ids);
    return Object.fromEntries(map);
  });
  ipc.handle("reminder:create", (_e, data) => repo.insert(data));
  ipc.handle("reminder:update", (_e, { id, data }) => {
    repo.update(id, data);
    return { ok: true };
  });
  ipc.handle("reminder:done", (_e, id) => {
    repo.markDone(id);
    return { ok: true };
  });
  ipc.handle("reminder:cancel", (_e, id) => {
    repo.cancel(id);
    return { ok: true };
  });
  ipc.handle("reminder:delete", (_e, id) => {
    repo.softDelete(id);
    return { ok: true };
  });
}
function shouldTrigger(row, now) {
  const pad = (n) => String(n).padStart(2, "0");
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const nowHHmm = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  if (row.remind_at !== nowHHmm) return false;
  if (row.remind_date > todayStr) return false;
  if (row.last_triggered_at) {
    const last = new Date(row.last_triggered_at);
    const lastStr = `${last.getFullYear()}-${pad(last.getMonth() + 1)}-${pad(last.getDate())}`;
    if (lastStr === todayStr) return false;
  }
  switch (row.repeat_type) {
    case "none":
      return row.remind_date === todayStr;
    case "daily":
      return true;
    case "weekly": {
      const days = row.repeat_days ? JSON.parse(row.repeat_days) : [];
      return days.includes(now.getDay());
    }
    case "monthly": {
      const days = row.repeat_days ? JSON.parse(row.repeat_days) : [];
      return days.includes(now.getDate());
    }
    default:
      return false;
  }
}
function scanDueReminders(repo, assigneeId, now = /* @__PURE__ */ new Date()) {
  const active = repo.findByAssignee(assigneeId);
  const due = [];
  for (const row of active) {
    if (shouldTrigger(row, now)) {
      repo.markTriggered(row.id);
      due.push(row);
      if (row.repeat_type === "none") {
        repo.markDone(row.id);
      }
    }
  }
  return due;
}
function registerAnnouncementHandlers(ipc, repo) {
  ipc.handle("announcement:list", () => repo.findAll());
  ipc.handle(
    "announcement:visible",
    (_e, userId) => repo.findVisibleForUser(userId)
  );
  ipc.handle("announcement:create", (_e, data) => repo.insert(data));
  ipc.handle(
    "announcement:update",
    (_e, payload) => repo.update(payload.id, payload.data)
  );
  ipc.handle(
    "announcement:publish",
    (_e, payload) => {
      repo.publish(payload.id, payload.userId);
      return { ok: true };
    }
  );
  ipc.handle("announcement:withdraw", (_e, id) => {
    repo.withdraw(id);
    return { ok: true };
  });
  ipc.handle("announcement:delete", (_e, id) => {
    repo.softDelete(id);
    return { ok: true };
  });
  ipc.handle(
    "announcement:read",
    (_e, payload) => {
      repo.markRead(payload.announcementId, payload.userId);
      return { ok: true };
    }
  );
  ipc.handle(
    "announcement:read-stats",
    (_e, id) => repo.getReadStats(id)
  );
  ipc.handle(
    "announcement:read-users",
    (_e, id) => repo.findReadUsers(id)
  );
}
function registerOperationsHandlers(ipc, repo) {
  ipc.handle("operations:risk-summary", () => repo.findRiskSummary());
  ipc.handle("operations:handover:list", () => repo.findHandovers());
  ipc.handle("operations:handover:create", (_e, data) => repo.createHandover(data));
  ipc.handle("operations:handover:acknowledge", (_e, { id, incomingStaff }) => {
    repo.acknowledgeHandover(id, incomingStaff);
    return { ok: true };
  });
  ipc.handle("operations:incident:list", (_e, includeClosed) => repo.findIncidents(includeClosed));
  ipc.handle("operations:incident:create", (_e, data) => repo.createIncident(data));
  ipc.handle("operations:incident:start", (_e, { id, responsible }) => {
    repo.startIncident(id, responsible ?? null);
    return { ok: true };
  });
  ipc.handle("operations:incident:notify-family", (_e, id) => {
    repo.notifyIncidentFamily(id);
    return { ok: true };
  });
  ipc.handle("operations:incident:close", (_e, { id, closeNote }) => {
    repo.closeIncident(id, closeNote);
    return { ok: true };
  });
  ipc.handle("operations:visitor:list", (_e, includeFinished) => repo.findVisitors(includeFinished));
  ipc.handle("operations:visitor:create", (_e, data) => repo.createVisitor(data));
  ipc.handle("operations:visitor:checkin", (_e, id) => {
    repo.checkInVisitor(id);
    return { ok: true };
  });
  ipc.handle("operations:visitor:checkout", (_e, { id, leaveAt }) => {
    repo.checkOutVisitor(id, leaveAt);
    return { ok: true };
  });
  ipc.handle("operations:visitor:cancel", (_e, id) => {
    repo.cancelVisitor(id);
    return { ok: true };
  });
  ipc.handle("operations:communication:list", (_e, openOnly) => repo.findCommunications(openOnly));
  ipc.handle("operations:communication:create", (_e, data) => repo.createCommunication(data));
  ipc.handle("operations:communication:close", (_e, id) => {
    repo.closeCommunication(id);
    return { ok: true };
  });
  ipc.handle("operations:inventory:list", () => repo.findInventory());
  ipc.handle("operations:inventory:create", (_e, data) => repo.createInventoryItem(data));
  ipc.handle("operations:inventory:transactions", (_e, itemId) => repo.findInventoryTransactions(itemId));
  ipc.handle("operations:inventory:transact", (_e, data) => repo.transactInventory(data));
  ipc.handle("operations:document:list", (_e, elderlyId) => repo.findDocuments(elderlyId));
  ipc.handle("operations:document:create", (_e, data) => repo.createDocument(data));
  ipc.handle("operations:document:attachment:select", async () => {
    const result = await electron.dialog.showOpenDialog({
      title: "选择养老服务文书",
      properties: ["openFile"],
      filters: [{ name: "文书附件", extensions: ["pdf", "doc", "docx", "jpg", "jpeg", "png", "webp"] }]
    });
    if (result.canceled || result.filePaths.length === 0) return { canceled: true };
    const sourcePath = result.filePaths[0];
    const attachmentDir = node_path.join(electron.app.getPath("userData"), "elderly-documents");
    await promises.mkdir(attachmentDir, { recursive: true });
    const filePath = node_path.join(attachmentDir, `${Date.now()}-${node_crypto.randomUUID()}${node_path.extname(sourcePath).toLowerCase()}`);
    await promises.copyFile(sourcePath, filePath);
    return { canceled: false, filePath, fileName: node_path.basename(sourcePath) };
  });
  ipc.handle("operations:document:attachment:open", async (_e, filePath) => {
    const error = await electron.shell.openPath(filePath);
    if (error) throw new Error(error);
    return { ok: true };
  });
  ipc.handle("operations:health-alert:list", (_e, includeResolved) => repo.findHealthAlerts(includeResolved));
  ipc.handle("operations:health-alert:start", (_e, id) => {
    repo.startHealthAlert(id);
    return { ok: true };
  });
  ipc.handle("operations:health-alert:resolve", (_e, { id, resolver, resolution }) => {
    repo.resolveHealthAlert(id, resolver, resolution);
    return { ok: true };
  });
}
function registerPurchaseHandlers(ipc, supplierRepo, orderRepo) {
  ipc.handle("purchase:supplier:list", () => supplierRepo.findAll());
  ipc.handle("purchase:supplier:create", (_e, data) => supplierRepo.insert(data));
  ipc.handle("purchase:supplier:update", (_e, { id, data }) => {
    supplierRepo.update(id, data);
    return { ok: true };
  });
  ipc.handle("purchase:supplier:delete", (_e, id) => {
    supplierRepo.delete(id);
    return { ok: true };
  });
  ipc.handle("purchase:order:list", (_e, status) => orderRepo.findAll(status));
  ipc.handle("purchase:order:items", (_e, orderId) => orderRepo.findItems(orderId));
  ipc.handle("purchase:order:stats", () => orderRepo.getStats());
  ipc.handle("purchase:order:create", (_e, { order, items }) => orderRepo.create(order, items));
  ipc.handle("purchase:order:update-status", (_e, { id, status, remark }) => {
    orderRepo.updateStatus(id, status, remark);
    return { ok: true };
  });
  ipc.handle("purchase:order:delete", (_e, id) => {
    orderRepo.delete(id);
    return { ok: true };
  });
}
function readAppConfig(configPath) {
  try {
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, "utf-8"));
    }
  } catch {
  }
  return {};
}
function writeAppConfig(configPath, cfg) {
  fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2), "utf-8");
}
function registerDbHandlers(ipc, defaultDbPath2, appConfigPath2, pendingRestorePath2, backupService2, userRepo, getMainWindow, isRemoteSyncRunning) {
  const requireAdministrator2 = () => {
    if (requireActiveUser(userRepo).role_id !== "role-admin") throw new Error("仅系统管理员可执行数据安全操作");
  };
  ipc.handle("db:get-path", () => {
    const cfg = readAppConfig(appConfigPath2);
    return {
      current: cfg.dbPath || defaultDbPath2,
      default: defaultDbPath2,
      isCustom: !!cfg.dbPath
    };
  });
  ipc.handle("db:set-path", (_e, newPath) => {
    requireAdministrator2();
    const cfg = readAppConfig(appConfigPath2);
    if (newPath) cfg.dbPath = newPath;
    else delete cfg.dbPath;
    writeAppConfig(appConfigPath2, cfg);
    return { ok: true };
  });
  ipc.handle("db:reset-path", () => {
    requireAdministrator2();
    const cfg = readAppConfig(appConfigPath2);
    delete cfg.dbPath;
    writeAppConfig(appConfigPath2, cfg);
    return { ok: true };
  });
  ipc.handle("db:select-path", async () => {
    requireAdministrator2();
    const win = getMainWindow();
    const result = await electron.dialog.showSaveDialog(win ?? void 0, {
      title: "选择数据库文件保存位置",
      defaultPath: path.join(electron.app.getPath("userData"), "yanglao.db"),
      filters: [{ name: "SQLite 数据库文件", extensions: ["db"] }]
    });
    if (result.canceled) return { canceled: true };
    return { canceled: false, path: result.filePath };
  });
  ipc.handle("db:backup:create", () => {
    requireAdministrator2();
    return backupService2.createBackup();
  });
  ipc.handle("db:backup:list", () => {
    requireAdministrator2();
    return backupService2.listBackups();
  });
  ipc.handle("db:backup:restore", (_event, name) => {
    requireAdministrator2();
    if (isRemoteSyncRunning()) throw new Error("远程同步正在执行，请稍后再恢复数据库备份");
    const result = backupService2.scheduleRestore(name, pendingRestorePath2);
    setImmediate(() => {
      electron.app.relaunch();
      electron.app.quit();
    });
    return result;
  });
  ipc.handle("db:integrity-check", () => {
    requireAdministrator2();
    return backupService2.integrityCheck();
  });
  ipc.handle("db:local-sync:select-and-run", async () => {
    requireAdministrator2();
    if (isRemoteSyncRunning()) throw new Error("远程同步正在执行，请稍后再选择本地数据文件");
    const win = getMainWindow();
    const selected = await electron.dialog.showOpenDialog(win ?? void 0, {
      title: "选择要同步的 SQLite 数据文件",
      properties: ["openFile"],
      filters: [{ name: "SQLite 数据文件", extensions: ["db", "sqlite", "sqlite3"] }]
    });
    if (selected.canceled || !selected.filePaths[0]) return { canceled: true };
    const staged = await backupService2.stageLocalDataFile(selected.filePaths[0]);
    const result = backupService2.syncFromStagedFile(staged.importId, staged.fileName);
    return { canceled: false, result };
  });
  ipc.handle("db:backup:export", async (_event, name) => {
    requireAdministrator2();
    const sourcePath = backupService2.getBackupPath(name);
    const win = getMainWindow();
    const result = await electron.dialog.showSaveDialog(win ?? void 0, {
      title: "导出数据库备份",
      defaultPath: path.join(electron.app.getPath("documents"), name),
      filters: [{ name: "SQLite 数据库备份", extensions: ["db"] }]
    });
    if (result.canceled || !result.filePath) return { canceled: true };
    const destination = path.resolve(result.filePath);
    const managedDirectory = fs.realpathSync(backupService2.backupDirectory).toLowerCase();
    const destinationDirectory = fs.realpathSync(path.dirname(destination)).toLowerCase();
    if (destinationDirectory === managedDirectory || destinationDirectory.startsWith(`${managedDirectory}${path.sep}`)) {
      throw new Error("不能覆盖程序受控备份目录中的历史备份，请选择其他位置");
    }
    fs.copyFileSync(sourcePath, destination);
    return { canceled: false, path: destination };
  });
  ipc.handle("db:backup:open-directory", async () => {
    requireAdministrator2();
    const error = await electron.shell.openPath(backupService2.backupDirectory);
    if (error) throw new Error(error);
    return { ok: true };
  });
  ipc.handle("config:app:get", () => readAppConfig(appConfigPath2));
  ipc.handle("config:app:set", (_e, partial) => {
    if (Object.prototype.hasOwnProperty.call(partial, "dbPath")) requireAdministrator2();
    const cfg = readAppConfig(appConfigPath2);
    Object.assign(cfg, partial);
    if (cfg.autoRefreshSec === 0) delete cfg.autoRefreshSec;
    if (cfg.chatMode !== void 0 && cfg.chatMode !== "local" && cfg.chatMode !== "online") {
      delete cfg.chatMode;
    }
    writeAppConfig(appConfigPath2, cfg);
    return { ok: true };
  });
}
function errorMessage(error) {
  const response = error.response;
  return response?.data?.msg ?? (error instanceof Error ? error.message : "聊天服务请求失败");
}
function registerChatHandlers(ipc, syncConfigRepo, chatRepo, userRepo, appConfigPath2) {
  let desktopChatSession = null;
  let onlineIdentityKey = "";
  const getMode = () => readAppConfig(appConfigPath2).chatMode === "online" ? "online" : "local";
  const localToken = () => {
    const currentUser = requireActiveUser(userRepo);
    if (desktopChatSession?.userId !== currentUser.id) {
      const issued = chatRepo.createSessionForUser(currentUser.id);
      desktopChatSession = { userId: currentUser.id, token: issued.token };
    }
    return desktopChatSession.token;
  };
  const onlineClient = () => {
    requireActiveUser(userRepo);
    const config2 = syncConfigRepo.get();
    const serverUrl = config2.server_url.trim().replace(/\/$/, "");
    const accessToken = config2.access_token?.trim();
    if (!serverUrl || !accessToken) {
      throw new Error("请先在数据同步中配置线上服务地址和访问令牌");
    }
    return axios.create({
      baseURL: serverUrl,
      timeout: 15e3,
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  };
  const onlineRequest = async (run) => {
    try {
      const http2 = onlineClient();
      const currentUser = requireActiveUser(userRepo);
      const authorization = String(http2.defaults.headers.common.Authorization ?? http2.defaults.headers.Authorization ?? "");
      const identityKey = `${currentUser.id}:${currentUser.username}:${http2.defaults.baseURL}:${authorization}`;
      if (onlineIdentityKey !== identityKey) {
        const identity = await http2.get("/system/chat/me");
        if (identity.data.code !== 200 || identity.data.data?.userName !== currentUser.username) {
          throw new Error("线上聊天令牌与当前桌面账号不匹配，请配置该账号对应的访问令牌");
        }
        onlineIdentityKey = identityKey;
      }
      const response = await run(http2);
      if (response.data.code !== 200 || response.data.data === void 0) {
        throw new Error(response.data.msg || "聊天服务返回异常");
      }
      return response.data.data;
    } catch (error) {
      throw new Error(errorMessage(error));
    }
  };
  ipc.handle("chat:mode:get", () => getMode());
  ipc.handle("chat:mode:set", async (_event, mode) => {
    requireActiveUser(userRepo);
    if (mode !== "local" && mode !== "online") throw new Error("聊天服务模式无效");
    if (mode === "online") {
      await onlineRequest((http2) => http2.get("/system/chat/me"));
    }
    const config2 = readAppConfig(appConfigPath2);
    config2.chatMode = mode;
    writeAppConfig(appConfigPath2, config2);
    return { mode };
  });
  ipc.handle("chat:me", () => getMode() === "local" ? chatRepo.me(localToken()) : onlineRequest((http2) => http2.get("/system/chat/me")));
  ipc.handle("chat:contacts", (_event, keyword) => getMode() === "local" ? chatRepo.contacts(localToken(), keyword) : onlineRequest((http2) => http2.get("/system/chat/contacts", { params: { keyword } })));
  ipc.handle("chat:conversations", () => getMode() === "local" ? chatRepo.conversations(localToken()) : onlineRequest((http2) => http2.get("/system/chat/conversations")));
  ipc.handle("chat:direct:create", (_event, peerUserId) => getMode() === "local" ? chatRepo.createDirect(localToken(), peerUserId) : onlineRequest((http2) => http2.post("/system/chat/conversations/direct", { peerUserId })));
  ipc.handle("chat:group:create", (_event, input) => getMode() === "local" ? chatRepo.createGroup(localToken(), input) : onlineRequest((http2) => http2.post("/system/chat/conversations/group", input)));
  ipc.handle("chat:messages", (_event, input) => getMode() === "local" ? chatRepo.messages(localToken(), input) : onlineRequest((http2) => http2.get(
    `/system/chat/conversations/${input.conversationId}/messages`,
    { params: input }
  )));
  ipc.handle("chat:message:send", (_event, input) => getMode() === "local" ? chatRepo.send(localToken(), input) : onlineRequest((http2) => http2.post(
    `/system/chat/conversations/${input.conversationId}/messages`,
    { clientMessageId: input.clientMessageId, messageType: "text", content: input.content }
  )));
  ipc.handle(
    "chat:read",
    async (_event, input) => {
      if (getMode() === "local") {
        chatRepo.markRead(localToken(), input.conversationId, input.lastReadMessageId);
        return { ok: true };
      }
      return onlineRequest((http2) => http2.put(
        `/system/chat/conversations/${input.conversationId}/read`,
        { lastReadMessageId: input.lastReadMessageId }
      ));
    }
  );
}
const ALLOWED_TABLES = /* @__PURE__ */ new Set([
  "elderly",
  "family_contact",
  "health_profile",
  "vital_signs",
  "medication_order",
  "medication_record",
  "medical_visit",
  "admission",
  "leave_record",
  "discharge",
  "care_assessment",
  "care_plan",
  "care_record",
  "fee_item",
  "deposit_record",
  "monthly_bill",
  "bill_detail",
  "payment_record",
  "meal_menu",
  "meal_record",
  "nutrition_plan",
  "activity",
  "activity_attendance",
  "contract",
  "building",
  "room",
  "bed",
  "task_reminder",
  "iot_device_alert",
  "announcement"
]);
const LAN_CONFIG_FIELDS = /* @__PURE__ */ new Set(["enabled", "port", "allow_write", "secret"]);
function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    let size = 0;
    let rejected = false;
    req.on("data", (chunk) => {
      if (rejected) return;
      size += Buffer.byteLength(chunk);
      if (size > 2 * 1024 * 1024) {
        rejected = true;
        reject(new Error("请求体不能超过 2 MB"));
        return;
      }
      body += chunk;
    });
    req.on("end", () => {
      if (rejected) return;
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("请求体 JSON 格式错误"));
      }
    });
    req.on("error", reject);
  });
}
function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Private-Network": "true"
  });
  res.end(JSON.stringify(data));
}
class LanServer {
  constructor(db2, iotRepo, chatRepo) {
    this.db = db2;
    this.iotRepo = iotRepo;
    this.chatRepo = chatRepo;
  }
  db;
  iotRepo;
  chatRepo;
  server = null;
  currentPort = 7788;
  // ─── 配置读写 ──────────────────────────────────────────────
  getConfig() {
    return this.db.prepare("SELECT * FROM lan_config WHERE id=1").get();
  }
  saveConfig(cfg) {
    const normalized = { ...cfg };
    if (Object.prototype.hasOwnProperty.call(normalized, "secret") && !normalized.secret) {
      normalized.secret = nanoid$1.nanoid(32);
    }
    const fields = Object.keys(normalized).filter((field) => LAN_CONFIG_FIELDS.has(field));
    if (!fields.length) return;
    const sets = [...fields, "updated_at"].map((f) => `${f}=@${f}`).join(",");
    const values = Object.fromEntries(fields.map((field) => [field, normalized[field]]));
    this.db.prepare(`UPDATE lan_config SET ${sets} WHERE id=1`).run({ ...values, updated_at: Date.now() });
  }
  // ─── 本机局域网 IP ─────────────────────────────────────────
  getLanIPs() {
    const nets = os.networkInterfaces();
    const ips = [];
    for (const list of Object.values(nets)) {
      for (const iface of list ?? []) {
        if (iface.family === "IPv4" && !iface.internal) {
          ips.push(iface.address);
        }
      }
    }
    return ips;
  }
  getAccessUrls() {
    return this.getLanIPs().map((ip) => `http://${ip}:${this.currentPort}`);
  }
  // ─── 服务器生命周期 ───────────────────────────────────────
  async start(port) {
    if (this.server?.listening) return;
    const cfg = this.getConfig();
    if (!cfg.secret) {
      cfg.secret = nanoid$1.nanoid(32);
      this.saveConfig({ secret: cfg.secret });
    }
    this.currentPort = port ?? cfg.port ?? 7788;
    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => this.handleRequest(req, res));
      this.server.listen(this.currentPort, "0.0.0.0", () => {
        const address = this.server?.address();
        if (address && typeof address === "object") this.currentPort = address.port;
        console.info(`[LAN Server] 已启动，端口 ${this.currentPort}`);
        resolve();
      });
      this.server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
          reject(new Error(`端口 ${this.currentPort} 已被占用，请修改端口后重试`));
        } else {
          reject(err);
        }
      });
    });
  }
  stop() {
    this.server?.close();
    this.server = null;
    console.info("[LAN Server] 已停止");
  }
  isRunning() {
    return this.server?.listening === true;
  }
  getStatus() {
    return {
      running: this.isRunning(),
      port: this.currentPort,
      urls: this.isRunning() ? this.getAccessUrls() : []
    };
  }
  // ─── 请求路由 ──────────────────────────────────────────────
  handleRequest(req, res) {
    const cfg = this.getConfig();
    const requestUrl = new URL(req.url ?? "/", "http://localhost");
    const pathname = requestUrl.pathname;
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, PUT, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Secret",
        "Access-Control-Allow-Private-Network": "true"
      });
      return res.end();
    }
    if (req.method === "GET" && pathname === "/ping") {
      return sendJson(res, 200, { code: 0, message: "pong", data: { version: "1.0", time: Date.now() } });
    }
    const requiresSharedSecret = pathname.startsWith("/sync/") || pathname === "/iot/report";
    if (requiresSharedSecret && !cfg.secret) {
      return sendJson(res, 503, { code: 503, message: "局域网服务尚未配置访问密钥" });
    }
    if (cfg.secret) {
      const authorization = req.headers.authorization ?? "";
      const bearerSecret = /^Bearer\s+(.+)$/i.exec(authorization)?.[1]?.trim();
      const clientSecret = req.headers["x-secret"] || (requiresSharedSecret ? bearerSecret : void 0);
      if (clientSecret !== cfg.secret) {
        return sendJson(res, 401, { code: 401, message: "密钥错误" });
      }
    }
    if (pathname.startsWith("/system/chat/") || pathname === "/system/scene/buildings") {
      void this.handleChatRequest(req, res, requestUrl);
      return;
    }
    if (req.method === "POST" && pathname === "/sync/upload") {
      void this.handleUpload(req, res, cfg);
      return;
    }
    if (req.method === "POST" && pathname === "/sync/download") {
      void this.handleDownload(req, res);
      return;
    }
    if (req.method === "POST" && pathname === "/iot/report") {
      void this.handleIotReport(req, res);
      return;
    }
    sendJson(res, 404, { code: 404, message: "接口不存在" });
  }
  // ─── 本地聊天：复用线上 /system/chat/* 契约 ─────────────────
  async handleChatRequest(req, res, requestUrl) {
    if (!this.chatRepo) {
      sendJson(res, 503, { code: 503, msg: "本地聊天服务未初始化" });
      return;
    }
    const success = (data) => {
      sendJson(res, 200, { code: 200, msg: "操作成功", data });
    };
    try {
      const pathname = requestUrl.pathname;
      if (req.method === "POST" && pathname === "/system/chat/login") {
        const body = await readJson(req);
        const login = this.chatRepo.login(body.username ?? "", body.password ?? "");
        success({
          token: login.token,
          expiresAt: login.expiresAt,
          user: {
            userId: login.userId,
            userName: login.userName,
            nickName: login.nickName
          }
        });
        return;
      }
      const authorization = req.headers.authorization ?? "";
      const match = /^Bearer\s+(.+)$/i.exec(authorization);
      if (!match?.[1]) {
        sendJson(res, 401, { code: 401, msg: "请先登录本地聊天" });
        return;
      }
      const token = match[1].trim();
      this.chatRepo.authenticate(token);
      if (req.method === "GET" && pathname === "/system/scene/buildings") {
        success({
          buildings: this.db.prepare(
            `SELECT id, name, floors FROM building WHERE deleted_at IS NULL ORDER BY sort_order, name`
          ).all(),
          rooms: this.db.prepare(
            `SELECT id, building_id, floor, room_no, status
             FROM room WHERE deleted_at IS NULL ORDER BY building_id, floor, room_no`
          ).all(),
          beds: this.db.prepare(
            `SELECT id, room_id, bed_no, status
             FROM bed WHERE deleted_at IS NULL ORDER BY room_id, bed_no`
          ).all()
        });
        return;
      }
      if (req.method === "POST" && pathname === "/system/chat/logout") {
        this.chatRepo.logout(token);
        success({ ok: true });
        return;
      }
      if (req.method === "GET" && pathname === "/system/chat/me") {
        success(this.chatRepo.me(token));
        return;
      }
      if (req.method === "GET" && pathname === "/system/chat/contacts") {
        success(this.chatRepo.contacts(token, requestUrl.searchParams.get("keyword") ?? void 0));
        return;
      }
      if (req.method === "GET" && pathname === "/system/chat/conversations") {
        success(this.chatRepo.conversations(token));
        return;
      }
      if (req.method === "POST" && pathname === "/system/chat/conversations/direct") {
        const body = await readJson(req);
        success(this.chatRepo.createDirect(token, body.peerUserId ?? ""));
        return;
      }
      if (req.method === "POST" && pathname === "/system/chat/conversations/group") {
        const body = await readJson(req);
        success(this.chatRepo.createGroup(token, body));
        return;
      }
      const messagesMatch = /^\/system\/chat\/conversations\/(\d+)\/messages$/.exec(pathname);
      if (messagesMatch) {
        const conversationId = Number(messagesMatch[1]);
        if (req.method === "GET") {
          const numberParam = (name) => {
            const value = requestUrl.searchParams.get(name);
            return value ? Number(value) : void 0;
          };
          success(this.chatRepo.messages(token, {
            conversationId,
            afterMessageId: numberParam("afterMessageId"),
            beforeMessageId: numberParam("beforeMessageId"),
            limit: numberParam("limit")
          }));
          return;
        }
        if (req.method === "POST") {
          const body = await readJson(req);
          success(this.chatRepo.send(token, { ...body, conversationId }));
          return;
        }
      }
      const readMatch = /^\/system\/chat\/conversations\/(\d+)\/read$/.exec(pathname);
      if (req.method === "PUT" && readMatch) {
        const body = await readJson(req);
        this.chatRepo.markRead(token, Number(readMatch[1]), Number(body.lastReadMessageId));
        success({ ok: true });
        return;
      }
      sendJson(res, 404, { code: 404, msg: "聊天接口不存在" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "本地聊天请求失败";
      const unauthorized = /登录|用户名或密码|账号已停用|聊天权限/.test(message);
      sendJson(res, unauthorized ? 401 : 400, {
        code: unauthorized ? 401 : 400,
        msg: message
      });
    }
  }
  // ─── 物联网设备数据上报 ─────────────────────────────────────
  async handleIotReport(req, res) {
    try {
      if (!this.iotRepo) {
        return sendJson(res, 503, { code: 503, message: "设备数据服务未初始化" });
      }
      const body = await readJson(req);
      if (!body.deviceId || !body.data) {
        return sendJson(res, 400, { code: 400, message: "缺少 deviceId 或 data" });
      }
      const result = handleDeviceReport(this.iotRepo, body);
      if (!result.ok) return sendJson(res, 404, { code: 404, message: result.error });
      sendJson(res, 200, { code: 0, message: "ok", data: result.row });
    } catch (err) {
      console.error("[LAN Server] iot report error:", err);
      sendJson(res, 500, { code: 500, message: String(err) });
    }
  }
  // ─── 上传处理：客户端→主机 ─────────────────────────────────
  async handleUpload(req, res, cfg) {
    try {
      if (!cfg.allow_write) {
        return sendJson(res, 403, { code: 403, message: "主机已禁止客户端写入" });
      }
      const body = await readJson(req);
      const changes = body.changes ?? [];
      let applied = 0;
      const apply = this.db.transaction(() => {
        for (const change of changes) {
          if (!ALLOWED_TABLES.has(change.tableName)) {
            throw new Error(`不允许同步数据表：${change.tableName}`);
          }
          this.applyChange(change.tableName, change.operation, change.payload);
          this.db.prepare(`
            INSERT OR IGNORE INTO change_log (id, table_name, record_id, operation, payload, created_at, synced, synced_at)
            VALUES (?, ?, ?, ?, ?, ?, 1, ?)
          `).run(
            change.id ?? nanoid$1.nanoid(),
            change.tableName,
            change.recordId,
            change.operation,
            JSON.stringify(change.payload),
            change.createdAt ?? Date.now(),
            Date.now()
          );
          applied++;
        }
      });
      apply();
      sendJson(res, 200, { code: 0, message: "ok", data: { received: applied, changes: [] } });
    } catch (err) {
      console.error("[LAN Server] upload error:", err);
      sendJson(res, 500, { code: 500, message: String(err) });
    }
  }
  // ─── 下载处理：主机→客户端 ─────────────────────────────────
  async handleDownload(req, res) {
    try {
      const body = await readJson(req);
      const since = body.lastSyncAt ?? 0;
      const rows = this.db.prepare(`SELECT * FROM change_log WHERE created_at > ? ORDER BY created_at ASC LIMIT 2000`).all(since);
      const changes = rows.map((r) => ({
        id: r.id,
        tableName: r.table_name,
        recordId: r.record_id,
        operation: r.operation,
        payload: (() => {
          try {
            return JSON.parse(r.payload);
          } catch {
            return {};
          }
        })(),
        createdAt: r.created_at
      }));
      sendJson(res, 200, { code: 0, message: "ok", data: { received: 0, changes } });
    } catch (err) {
      console.error("[LAN Server] download error:", err);
      sendJson(res, 500, { code: 500, message: String(err) });
    }
  }
  // ─── 变更应用到本地 DB ─────────────────────────────────────
  applyChange(table, operation, payload) {
    if (!payload.id) throw new Error(`同步 ${table} 数据缺少 id`);
    if (operation === "DELETE") {
      const hasDeletedAt = this.db.prepare(`SELECT 1 FROM pragma_table_info('${table}') WHERE name='deleted_at'`).get();
      if (hasDeletedAt) {
        this.db.prepare(`UPDATE ${table} SET deleted_at=@deleted_at, updated_at=@updated_at WHERE id=@id`).run({
          deleted_at: payload.deleted_at ?? Date.now(),
          updated_at: Date.now(),
          id: payload.id
        });
      } else {
        this.db.prepare(`DELETE FROM ${table} WHERE id=?`).run(payload.id);
      }
      return;
    }
    const tableColumns = new Set(
      this.db.prepare(`PRAGMA table_info(${table})`).all().map((column) => column.name)
    );
    const cols = Object.keys(payload);
    const invalidColumns = cols.filter((column) => !tableColumns.has(column));
    if (invalidColumns.length) {
      throw new Error(`数据表 ${table} 包含非法字段：${invalidColumns.join(", ")}`);
    }
    const placeholders = cols.map((c) => `@${c}`).join(", ");
    const updateColumns = cols.filter((c) => c !== "id");
    const conflict = updateColumns.length ? `DO UPDATE SET ${updateColumns.map((c) => `${c}=excluded.${c}`).join(", ")}` : "DO NOTHING";
    this.db.prepare(`INSERT INTO ${table} (${cols.join(", ")}) VALUES (${placeholders})
                ON CONFLICT(id) ${conflict}`).run(payload);
  }
}
electron.app.setPath("sessionData", path.join(electron.app.getPath("userData"), "session-data"));
const gotSingleInstanceLock = electron.app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) electron.app.quit();
log.transports.file.level = "info";
log.transports.console.level = utils.is.dev ? "debug" : "warn";
electronUpdater.autoUpdater.logger = log;
const defaultDbPath = path.join(electron.app.getPath("userData"), "yanglao.db");
const appConfigPath = path.join(electron.app.getPath("userData"), "yanglao-app-config.json");
const pendingRestorePath = path.join(electron.app.getPath("userData"), "pending-database-restore.json");
const backupDirectory = path.join(electron.app.getPath("userData"), "backups");
const appConfig = readAppConfig(appConfigPath);
const dbPath = appConfig.dbPath || defaultDbPath;
const restoreResult = applyPendingDatabaseRestore({
  dbPath,
  backupDirectory,
  pendingRestorePath
});
const db = initDatabase(dbPath);
const repos = createRepos(db);
const backupService = new DatabaseBackupService(db, {
  dbPath,
  backupDirectory,
  importDirectory: path.join(electron.app.getPath("userData"), "imports")
});
const deviceId = process.env["YANGLAO_DEVICE_ID"] || nanoid$1.nanoid();
const syncEngine = new SyncEngine(
  (limit) => repos.changeLog.getUnsynced(limit),
  (ids) => repos.changeLog.markSynced(ids),
  (status, msg, syncedAt, syncCursor) => repos.syncConfig.updateLastSync(status, msg, syncedAt, syncCursor),
  (result) => {
    db.prepare(
      `INSERT INTO sync_history (id, trigger, status, direction, started_at, finished_at, duration_ms, records_sent, records_recv, error_msg)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      nanoid$1.nanoid(),
      result.trigger,
      result.status,
      result.direction,
      Date.now() - result.durationMs,
      Date.now(),
      result.durationMs,
      result.recordsSent,
      result.recordsReceived,
      result.error ?? null
    );
  },
  deviceId,
  (changes) => applyRemoteChanges(db, changes)
);
const scheduler = new SyncScheduler(syncEngine);
const savedConfig = repos.syncConfig.toSyncConfig(repos.syncConfig.get());
scheduler.applyConfig(savedConfig);
const lanServer = new LanServer(db, repos.iot, repos.chat);
let mainWindow = null;
let restoreResultShown = false;
if (gotSingleInstanceLock) {
  electron.app.on("second-instance", () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });
}
function createWindow() {
  const iconExtension = process.platform === "win32" ? "ico" : "png";
  const iconPath = utils.is.dev ? path.join(__dirname, `../../resources/icon.${iconExtension}`) : path.join(process.resourcesPath, `icon.${iconExtension}`);
  mainWindow = new electron.BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    show: false,
    icon: iconPath,
    autoHideMenuBar: true,
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
    if (restoreResult && !restoreResultShown) {
      restoreResultShown = true;
      if (restoreResult.restored) {
        void electron.dialog.showMessageBox(mainWindow, {
          type: "info",
          title: "数据库已恢复",
          message: `已从 ${restoreResult.name} 恢复本地数据。`,
          detail: restoreResult.safetyBackup ? `恢复前数据已另存为 ${restoreResult.safetyBackup.name}。` : ""
        });
      } else {
        void electron.dialog.showMessageBox(mainWindow, {
          type: "error",
          title: "数据库恢复失败",
          message: restoreResult.error || "数据库备份恢复失败",
          detail: restoreResult.originalPreserved ? "原数据库未被替换，可以继续使用。" : "自动回滚未完成，请联系技术人员并保留备份目录。"
        });
      }
    }
    try {
      repos.notification.generateBirthdayReminders(db);
      repos.iot.checkHealth();
    } catch {
    }
    try {
      const lanCfg = lanServer.getConfig();
      if (lanCfg.enabled) {
        lanServer.start().catch((err) => log.error("[LAN Server] 自动启动失败:", err));
      }
    } catch {
    }
  });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    electron.shell.openExternal(url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
  scheduler.on((event) => {
    mainWindow?.webContents.send("sync:event", event);
  });
}
registerSyncHandlers(electron.ipcMain, scheduler, repos.syncConfig);
registerElderlyHandlers(electron.ipcMain, repos.elderly);
registerConfigHandlers(electron.ipcMain, repos.syncConfig, scheduler);
registerBuildingHandlers(electron.ipcMain, repos.building);
registerFamilyContactHandlers(electron.ipcMain, repos.familyContact);
registerHealthHandlers(electron.ipcMain, repos.health);
registerAdmissionHandlers(electron.ipcMain, repos.admission);
registerCareHandlers(electron.ipcMain, repos.care);
registerFeeHandlers(electron.ipcMain, repos.fee);
registerMealHandlers(electron.ipcMain, repos.meal);
registerActivityHandlers(electron.ipcMain, repos.activity);
registerContractHandlers(electron.ipcMain, repos.contract);
registerNotificationHandlers(electron.ipcMain, repos.notification);
registerLanHandlers(electron.ipcMain, lanServer, repos.user);
registerAuthHandlers(electron.ipcMain, repos.user);
registerUserHandlers(electron.ipcMain, repos.user);
registerAttendanceHandlers(electron.ipcMain, repos.attendance);
registerIotHandlers(electron.ipcMain, repos.iot, repos.taskReminder);
registerPermissionGroupHandlers(electron.ipcMain, repos.permissionGroup);
registerTaskReminderHandlers(electron.ipcMain, repos.taskReminder);
registerAnnouncementHandlers(electron.ipcMain, repos.announcement);
registerOperationsHandlers(electron.ipcMain, repos.operations);
registerPurchaseHandlers(electron.ipcMain, repos.supplier, repos.purchaseOrder);
registerChatHandlers(electron.ipcMain, repos.syncConfig, repos.chat, repos.user, appConfigPath);
registerDbHandlers(
  electron.ipcMain,
  defaultDbPath,
  appConfigPath,
  pendingRestorePath,
  backupService,
  repos.user,
  () => mainWindow,
  () => scheduler.getStatus() === "syncing"
);
cron.schedule("* * * * *", () => {
  try {
    const currentUser = session.user;
    if (!currentUser) return;
    const due = scanDueReminders(repos.taskReminder, currentUser.id);
    for (const reminder of due) {
      if (electron.Notification.isSupported()) {
        new electron.Notification({
          title: `任务提醒：${reminder.title}`,
          body: reminder.description || "到时间了，请及时处理"
        }).show();
      }
      mainWindow?.webContents.send("reminder:alarm", reminder);
    }
  } catch (err) {
    log.error("[TaskReminder] 扫描到期提醒失败:", err);
  }
});
cron.schedule("* * * * *", () => {
  try {
    const { opened } = repos.iot.checkHealth();
    for (const alert of opened) {
      const currentUser = session.user;
      if (currentUser) {
        syncAlertToReminder(repos.iot, repos.taskReminder, alert.id, currentUser.id);
      }
      repos.notification.insert({
        type: "system",
        title: `维修提醒：${alert.title}`,
        content: alert.content,
        elderly_id: null,
        is_read: 0,
        read_at: null
      });
      if (electron.Notification.isSupported()) {
        new electron.Notification({ title: `维修提醒：${alert.title}`, body: alert.content }).show();
      }
    }
  } catch (err) {
    log.error("[IotHealth] 设备巡检失败:", err);
  }
});
electron.app.whenReady().then(() => {
  if (!gotSingleInstanceLock) return;
  utils.electronApp.setAppUserModelId("com.yanglao.desktop");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  scheduler.stopAll();
  db.close();
  if (process.platform !== "darwin") electron.app.quit();
});
if (!utils.is.dev) {
  try {
    electronUpdater.autoUpdater.checkForUpdatesAndNotify().catch((err) => {
      log.warn(
        "[Updater] 检查更新失败（可忽略，不影响正常使用）:",
        err?.message ?? err
      );
    });
  } catch (err) {
    log.warn("[Updater] 未配置更新源，跳过自动更新检查");
  }
}
