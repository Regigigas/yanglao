// packages/db/src/schema.ts
// SQLite 表结构定义（DDL 字符串 + 类型接口）
// 所有时间字段均存储为 INTEGER（Unix 时间戳，单位 ms）

// ─── 变更日志表（同步基础设施）──────────────────────────────────
export const CREATE_CHANGE_LOG = `
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
`;

export const CREATE_CHANGE_LOG_INDEXES = `
CREATE INDEX IF NOT EXISTS idx_change_log_synced ON change_log(synced);
CREATE INDEX IF NOT EXISTS idx_change_log_table ON change_log(table_name);
CREATE INDEX IF NOT EXISTS idx_change_log_created ON change_log(created_at DESC);
`;

// ─── 同步配置表 ──────────────────────────────────────────────
export const CREATE_SYNC_CONFIG = `
CREATE TABLE IF NOT EXISTS sync_config (
  id                 INTEGER PRIMARY KEY,
  enabled            INTEGER NOT NULL DEFAULT 0,
  trigger            TEXT    NOT NULL DEFAULT 'manual',
  interval_ms        INTEGER NOT NULL DEFAULT 300000,
  cron_expression    TEXT,
  fixed_times        TEXT,
  server_url         TEXT    NOT NULL DEFAULT '',
  access_token       TEXT,
  direction          TEXT    NOT NULL DEFAULT 'both',
  last_sync_at       INTEGER,
  last_sync_cursor   INTEGER,
  last_sync_status   TEXT,
  last_sync_message  TEXT
);
`;

// ─── 同步历史记录表 ──────────────────────────────────────────
export const CREATE_SYNC_HISTORY = `
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
`;

// ─── 老人信息表 ─────────────────────────────────────────────
export const CREATE_ELDERLY = `
CREATE TABLE IF NOT EXISTS elderly (
  id             TEXT    PRIMARY KEY,
  name           TEXT    NOT NULL,
  gender         TEXT,
  birth_date     TEXT,
  id_card        TEXT,
  phone          TEXT,
  address        TEXT,
  room_no        TEXT,
  nation         TEXT,
  marriage       TEXT,
  education      TEXT,
  medicare_no    TEXT,
  care_level     TEXT,
  bed_id         TEXT,
  admission_date TEXT,
  remark         TEXT,
  photo_path     TEXT,
  status         TEXT    NOT NULL DEFAULT 'active',
  created_at     INTEGER NOT NULL,
  updated_at     INTEGER NOT NULL,
  deleted_at     INTEGER
);
`;

// ─── TypeScript 类型 ──────────────────────────────────────────

export interface ChangeLogRow {
  id: string;
  table_name: string;
  record_id: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  payload: string; // JSON
  created_at: number;
  synced: 0 | 1;
  synced_at: number | null;
}

export interface SyncConfigRow {
  id: 1;
  enabled: 0 | 1;
  trigger: 'manual' | 'auto' | 'scheduled' | 'timed';
  interval_ms: number;
  cron_expression: string | null;
  fixed_times: string | null; // JSON
  server_url: string;
  access_token: string | null;
  direction: 'upload' | 'download' | 'both';
  last_sync_at: number | null;
  last_sync_cursor: number | null;
  last_sync_status: 'success' | 'error' | null;
  last_sync_message: string | null;
}

export interface SyncHistoryRow {
  id: string;
  trigger: string;
  status: 'success' | 'error' | 'partial';
  direction: string;
  started_at: number;
  finished_at: number | null;
  duration_ms: number | null;
  records_sent: number;
  records_recv: number;
  error_msg: string | null;
}

export interface ElderlyRow {
  id: string;
  name: string;
  gender: 'male' | 'female' | null;
  birth_date: string | null;
  id_card: string | null;
  phone: string | null;
  address: string | null;
  room_no: string | null;
  nation: string | null;
  marriage: string | null;
  education: string | null;
  medicare_no: string | null;
  care_level: string | null;
  bed_id: string | null;
  admission_date: string | null;
  remark: string | null;
  photo_path: string | null;
  status: 'active' | 'inactive' | 'left';
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

// ─── 床位管理 ─────────────────────────────────────────────────

export interface BuildingRow {
  id: string;
  name: string;
  floors: number;
  remark: string | null;
  sort_order: number;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface RoomTypeRow {
  id: string;
  code: string;
  name: string;
  default_capacity: number;
  default_price: number;
  area: number | null;
  has_window: 0 | 1;
  has_private_bathroom: 0 | 1;
  care_equipment: string | null;
  status: 'active' | 'inactive';
  remark: string | null;
  sort_order: number;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface CorridorRow {
  id: string;
  building_id: string;
  floor: number;
  name: string;
  direction: 'east_west' | 'north_south';
  sort_order: number;
  remark: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface RoomRow {
  id: string;
  building_id: string;
  floor: number;
  corridor_id: string | null;
  room_no: string;
  room_type: 'single' | 'double' | 'triple' | 'ward' | string;
  room_type_id: string | null;
  capacity: number;
  price: number;
  status: 'available' | 'occupied' | 'maintenance';
  layout_side: 'left' | 'right' | 'none';
  sort_order: number;
  remark: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface BedRow {
  id: string;
  room_id: string;
  bed_no: string;
  status: 'available' | 'occupied' | 'maintenance';
  elderly_id: string | null;
  remark: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface RoomGenerateInput {
  building_id: string;
  floor: number;
  corridor_id: string | null;
  side: 'left' | 'right' | 'none' | 'both';
  start_no: number;
  room_count: number;
  room_prefix: string;
  room_suffix: string;
  number_width: number;
  room_type_id: string | null;
  room_type: string;
  capacity: number;
  price: number;
  bed_prefix: string;
  bed_style: 'letter' | 'number';
  skip_existing: boolean;
}

export interface RoomGenerateResult {
  rooms: RoomRow[];
  beds: BedRow[];
  skipped: string[];
}

// ─── 家属联系人 ───────────────────────────────────────────────

export interface FamilyContactRow {
  id: string;
  elderly_id: string;
  name: string;
  relation: string;
  phone: string;
  phone2: string | null;
  id_card: string | null;
  address: string | null;
  is_emergency: 0 | 1;
  is_guardian: 0 | 1;
  remark: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

// ─── 健康档案 ─────────────────────────────────────────────────

export interface HealthProfileRow {
  id: string;
  elderly_id: string;
  blood_type: string | null;
  allergy: string | null;
  chronic_disease: string | null;
  surgery_history: string | null;
  family_history: string | null;
  disability: string | null;
  diet_require: string | null;
  remark: string | null;
  created_at: number;
  updated_at: number;
}

// ─── 入住管理 ─────────────────────────────────────────────────

export interface AdmissionRow {
  id: string;
  elderly_id: string;
  bed_id: string | null;
  admission_date: string;
  care_level: string;
  deposit: number;
  monthly_fee: number;
  status: 'active' | 'discharged';
  remark: string | null;
  created_by: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface LeaveRecordRow {
  id: string;
  elderly_id: string;
  leave_date: string;
  expect_return: string | null;
  actual_return: string | null;
  reason: string | null;
  contact_phone: string | null;
  status: 'out' | 'returned';
  created_by: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface DischargeRow {
  id: string;
  elderly_id: string;
  admission_id: string | null;
  discharge_date: string;
  reason: string;
  refund_amount: number;
  remark: string | null;
  created_by: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

// ─── 护理管理 ─────────────────────────────────────────────────

export interface CareAssessmentRow {
  id: string;
  elderly_id: string;
  assess_date: string;
  assessor: string | null;
  eating: number;
  bathing: number;
  grooming: number;
  dressing: number;
  bowel: number;
  bladder: number;
  toilet: number;
  transfer: number;
  mobility: number;
  stairs: number;
  total_score: number;
  care_level: string;
  remark: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface CarePlanRow {
  id: string;
  elderly_id: string;
  care_level: string;
  start_date: string;
  end_date: string | null;
  status: 'active' | 'ended';
  content: string | null;
  created_by: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface CareRecordRow {
  id: string;
  elderly_id: string;
  plan_id: string | null;
  record_date: string;
  shift: 'day' | 'evening' | 'night';
  care_type: string;
  content: string;
  executor: string | null;
  status: 'done' | 'skipped';
  remark: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

// ─── 健康管理 ─────────────────────────────────────────────────

export interface VitalSignsRow {
  id: string;
  elderly_id: string;
  record_date: string;
  record_time: string;
  temperature: number | null;
  pulse: number | null;
  respiration: number | null;
  systolic_bp: number | null;
  diastolic_bp: number | null;
  blood_sugar: number | null;
  weight: number | null;
  spo2: number | null;
  recorder: string | null;
  remark: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface MedicationOrderRow {
  id: string;
  elderly_id: string;
  drug_name: string;
  drug_spec: string | null;
  dosage: string;
  frequency: string;
  route: string;
  start_date: string;
  end_date: string | null;
  prescriber: string | null;
  status: 'active' | 'stopped';
  remark: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface MedicationRecordRow {
  id: string;
  elderly_id: string;
  order_id: string;
  take_date: string;
  take_time: string;
  shift: 'morning' | 'noon' | 'evening' | 'bedtime';
  status: 'taken' | 'refused' | 'missed';
  executor: string | null;
  remark: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface MedicalVisitRow {
  id: string;
  elderly_id: string;
  visit_date: string;
  hospital: string | null;
  department: string | null;
  doctor: string | null;
  diagnosis: string | null;
  treatment: string | null;
  cost: number | null;
  escort: string | null;
  remark: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

// ─── 费用管理 ─────────────────────────────────────────────────

export interface FeeItemRow {
  id: string;
  name: string;
  category: 'bed' | 'care' | 'meal' | 'medical' | 'other';
  unit_price: number;
  unit: string;
  is_required: 0 | 1;
  status: 'active' | 'inactive';
  remark: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface DepositRecordRow {
  id: string;
  elderly_id: string;
  amount: number;
  type: 'deposit' | 'refund';
  pay_method: 'cash' | 'wechat' | 'alipay' | 'bank' | 'other';
  pay_date: string;
  operator: string | null;
  remark: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface MonthlyBillRow {
  id: string;
  elderly_id: string;
  bill_month: string; // YYYY-MM
  total: number;
  paid: number;
  status: 'unpaid' | 'partial' | 'paid';
  remark: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface BillDetailRow {
  id: string;
  bill_id: string;
  elderly_id: string;
  fee_item_id: string | null;
  item_name: string;
  quantity: number;
  unit_price: number;
  amount: number;
  remark: string | null;
  created_at: number;
  updated_at: number;
}

export interface PaymentRecordRow {
  id: string;
  elderly_id: string;
  bill_id: string | null;
  amount: number;
  pay_method: 'cash' | 'wechat' | 'alipay' | 'bank' | 'other';
  pay_date: string;
  operator: string | null;
  receipt_no: string | null;
  remark: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

// ─── 餐饮管理 ─────────────────────────────────────────────────

export interface MealMenuRow {
  id: string;
  menu_date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  dishes: string; // JSON array
  calories: number | null;
  remark: string | null;
  created_by: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface MealRecordRow {
  id: string;
  elderly_id: string;
  record_date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  status: 'normal' | 'absent' | 'special';
  intake_rate: number; // 0-100 进食率
  remark: string | null;
  recorder: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

/** 老人个性化营养方案：由营养师或护理人员依据健康状况制定。 */
export interface NutritionPlanRow {
  id: string;
  elderly_id: string;
  diet_type:
    | 'normal'
    | 'diabetes'
    | 'hypertension'
    | 'low_purine'
    | 'soft'
    | 'malnutrition'
    | 'other';
  allergies: string | null;
  avoid_foods: string | null;
  daily_calories: number | null;
  protein_target: number | null;
  meal_advice: string | null;
  effective_date: string;
  expiry_date: string | null;
  status: 'active' | 'inactive';
  remark: string | null;
  created_by: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

// ─── 活动管理 ─────────────────────────────────────────────────

export interface ActivityRow {
  id: string;
  title: string;
  category: 'entertainment' | 'sports' | 'cultural' | 'health' | 'other';
  activity_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  organizer: string | null;
  max_capacity: number | null;
  description: string | null;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  created_by: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface ActivityAttendanceRow {
  id: string;
  activity_id: string;
  elderly_id: string;
  check_in_at: number | null;
  status: 'registered' | 'attended' | 'absent';
  remark: string | null;
  created_at: number;
  updated_at: number;
}

// ─── 合同管理 ─────────────────────────────────────────────────

export interface ContractRow {
  id: string;
  elderly_id: string;
  contract_no: string;
  sign_date: string;
  start_date: string;
  end_date: string;
  auto_renew: 0 | 1;
  renew_months: number;
  monthly_amount: number;
  status: 'active' | 'expired' | 'terminated';
  file_path: string | null;
  remark: string | null;
  created_by: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

// ─── 通知 ─────────────────────────────────────────────────────

export interface NotificationRow {
  id: string;
  type: 'birthday' | 'contract_expire' | 'overdue' | 'leave_return' | 'system';
  title: string;
  content: string;
  elderly_id: string | null;
  is_read: 0 | 1;
  read_at: number | null;
  created_at: number;
}

// ─── 公告 ─────────────────────────────────────────────────────

/** 面向全体系统使用人员的公告；仅在发布时间至失效时间内进入全局滚动栏。 */
export interface AnnouncementRow {
  id: string;
  title: string;
  content: string;
  level: 'normal' | 'important' | 'urgent';
  status: 'draft' | 'published' | 'withdrawn';
  is_pinned: 0 | 1;
  publish_at: number;
  expire_at: number | null;
  created_by: string;
  published_by: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

/** 公告阅读记录按账号保存，保证阅读状态和阅读统计可追溯。 */
export interface AnnouncementReadRow {
  announcement_id: string;
  user_id: string;
  read_at: number;
}

export interface AnnouncementForUserRow extends AnnouncementRow {
  is_read: 0 | 1;
  read_at: number | null;
}

export interface AnnouncementReadUserRow {
  user_id: string;
  real_name: string;
  username: string;
  read_at: number;
}

export interface AnnouncementReadStats {
  total: number;
  read: number;
  unread: number;
}

// ─── 用户 / 角色 / 权限 ───────────────────────────────────────

export interface RoleRow {
  id: string;
  name: string;
  code: string;
  /** 可访问的菜单 key 列表，JSON 数组字符串；["*"] 表示全部菜单 */
  menu_keys: string;
  /** 可操作的按钮权限 key 列表，JSON 数组字符串；["*"] 表示全部按钮 */
  button_keys: string;
  /** 系统内置角色（超级管理员），不可删除/禁用/修改权限 */
  is_system: 0 | 1;
  remark: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface UserRow {
  id: string;
  username: string;
  password_hash: string;
  password_salt: string;
  real_name: string;
  phone: string | null;
  role_id: string;
  status: 'active' | 'disabled';
  /** 下次登录是否强制要求修改密码 */
  must_change_pw: 0 | 1;
  last_login_at: number | null;
  remark: string | null;
  /** 职位（展示属性，如：护士、前台、后勤，不参与权限判断） */
  position: string | null;
  /** 部门（展示属性） */
  department: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

/**
 * 权限组：预设的菜单/按钮权限集合，创建或编辑角色时可一键套用（套用即把值拷贝到角色表单，
 * 之后仍可手动增减）。权限组与角色之间没有外键关联，删除/修改权限组不影响已套用过它的角色。
 */
export interface PermissionGroupRow {
  id: string;
  name: string;
  code: string;
  /** 菜单 key 列表，JSON 数组字符串 */
  menu_keys: string;
  /** 按钮权限 key 列表，JSON 数组字符串 */
  button_keys: string;
  remark: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

// ─── 考勤：班次 / 排班 / 打卡 / 请假 ───────────────────────────

export interface ShiftRow {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  is_default: number;
  remark: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

// ─── 本地聊天 ─────────────────────────────────────────────────

export interface ChatConversationRow {
  id: number;
  type: 'D' | 'G';
  direct_key: string | null;
  name: string | null;
  owner_user_id: string | null;
  last_message_id: number | null;
  last_message_preview: string;
  last_message_at: number | null;
  status: 'active' | 'disabled';
  created_at: number;
  updated_at: number;
}

export interface ChatConversationMemberRow {
  conversation_id: number;
  user_id: string;
  role: 'O' | 'A' | 'M';
  joined_at: number;
  left_at: number | null;
  last_read_message_id: number;
  last_read_at: number | null;
}

export interface ChatMessageRow {
  id: number;
  conversation_id: number;
  sender_user_id: string;
  client_message_id: string;
  message_type: 'text';
  content: string;
  created_at: number;
  deleted_at: number | null;
}

export interface ChatSessionTokenRow {
  token_hash: string;
  user_id: string;
  expires_at: number;
  created_at: number;
  last_used_at: number;
}

export interface WorkShiftRule {
  shift: ShiftRow;
  source: 'schedule' | 'default';
}

export interface ScheduleRow {
  id: string;
  user_id: string;
  shift_id: string;
  work_date: string;
  remark: string | null;
  /** 任务类型（如：巡房、护理、餐饮、活动），可选 */
  task_type: string | null;
  /** 任务负责的区域/床位范围描述，纯文本，可选 */
  task_target: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface AttendanceRow {
  id: string;
  user_id: string;
  clock_date: string;
  clock_type: 'clock_in' | 'clock_out';
  clock_at: string;
  status: 'normal' | 'late' | 'early_leave' | 'absent';
  remark: string | null;
  created_at: number;
  updated_at: number;
}

export interface LeaveApplicationRow {
  id: string;
  user_id: string;
  leave_type: 'sick' | 'annual' | 'personal' | 'other';
  start_date: string;
  end_date: string;
  reason: string | null;
  status: 'pending' | 'approved' | 'rejected';
  approver_id: string | null;
  approve_remark: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

// ─── 物联网设备 ───────────────────────────────────────────────

export interface IotDeviceRow {
  id: string;
  device_no: string;
  name: string;
  device_type:
    | 'vital_monitor'
    | 'wristband'
    | 'scale'
    | 'blood_pressure'
    | 'circuit_monitor'
    | 'network_gateway'
    | 'other';
  conn_type: 'wifi' | 'bluetooth';
  ip_address: string | null;
  port: number | null;
  mac_address: string | null;
  elderly_id: string | null;
  status: 'online' | 'offline';
  last_seen_at: number | null;
  remark: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface IotDeviceDataRow {
  id: string;
  device_id: string;
  elderly_id: string | null;
  /** JSON 字符串，如 {"heart_rate":78,"temperature":36.5} */
  data: string;
  reported_at: number;
  created_at: number;
}

/** 设备巡检自动生成的维修事项。status 为 resolved 后保留历史记录。 */
export interface IotDeviceAlertRow {
  id: string;
  device_id: string;
  alert_type: 'circuit' | 'network';
  /** auto：设备巡检生成；manual：人工登记。 */
  source: 'auto' | 'manual';
  severity: 'warning' | 'critical';
  title: string;
  content: string;
  status: 'pending' | 'processing' | 'resolved';
  opened_at: number;
  last_detected_at: number;
  resolved_at: number | null;
  device_name?: string;
}

// ─── 体检预约与结果 ───────────────────────────────────────────

export interface HealthExamAppointmentRow {
  id: string;
  elderly_id: string;
  exam_date: string;
  institution: string | null;
  exam_items: string | null;
  status: 'pending' | 'completed' | 'cancelled';
  remark: string | null;
  created_by: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface HealthExamResultRow {
  id: string;
  elderly_id: string;
  appointment_id: string | null;
  exam_date: string;
  institution: string | null;
  /** JSON 数组字符串：[{"name":"血压","value":"130/85","unit":"mmHg","abnormal":0}] */
  items: string;
  conclusion: string | null;
  attachment_path: string | null;
  created_by: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

// ─── 任务提醒（闹钟式提醒，支持自建与上级分配）───────────────────

export interface TaskReminderRow {
  id: string;
  title: string;
  /** 提醒详情/备注，可选 */
  description: string | null;
  /** 提醒触发的时间点，HH:mm */
  remind_at: string;
  /** 首次/单次触发日期，YYYY-MM-DD；重复类型为 daily 时仍需一个起始日期 */
  remind_date: string;
  /** none：不重复；daily：每天；weekly：每周（配合 repeat_days 存星期几）；monthly：每月（配合 repeat_days 存日期几号） */
  repeat_type: 'none' | 'daily' | 'weekly' | 'monthly';
  /** JSON 数组字符串：weekly 时为 0-6（0=周日）；monthly 时为 1-31；none/daily 时为 null */
  repeat_days: string | null;
  /** 创建人 user_id */
  creator_id: string;
  /** 负责人 user_id（自己创建给自己，或上级分配给他人） */
  assignee_id: string;
  status: 'active' | 'done' | 'cancelled';
  /** 上次触发提醒的时间戳（ms），避免同一分钟/同一天重复触发 */
  last_triggered_at: number | null;
  /** 关联的排班记录 ID（由排班页内联创建时填入），可选 */
  schedule_id: string | null;
  /** 关联的设备维修事项 ID，用于避免重复创建维修提醒，可选 */
  maintenance_alert_id: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

// ─── 采购管理 ─────────────────────────────────────────────────

export const CREATE_SUPPLIER = `
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
`;

export const CREATE_PURCHASE_ORDER = `
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
  created_by     TEXT,
  created_at     INTEGER NOT NULL,
  updated_at     INTEGER NOT NULL,
  deleted_at     INTEGER
);
`;

export const CREATE_PURCHASE_ORDER_ITEM = `
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
`;

export interface SupplierRow {
  id: string;
  name: string;
  contact: string | null;
  phone: string | null;
  address: string | null;
  category: 'medicine' | 'care_supply' | 'food' | 'equipment' | 'other';
  tax_no: string | null;
  bank_account: string | null;
  bank_name: string | null;
  status: 'active' | 'inactive';
  remark: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface PurchaseOrderRow {
  id: string;
  order_no: string;
  supplier_id: string | null;
  supplier_name: string | null;
  order_date: string;
  expect_date: string | null;
  total_amount: number;
  paid_amount: number;
  /** draft 草稿 | pending 待审批 | approved 已审批 | received 已入库 | cancelled 已取消 */
  status: 'draft' | 'pending' | 'approved' | 'received' | 'cancelled';
  applicant: string | null;
  approver: string | null;
  approved_at: number | null;
  received_at: number | null;
  remark: string | null;
  created_by: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface PurchaseOrderItemRow {
  id: string;
  order_id: string;
  item_name: string;
  category: 'medicine' | 'care_supply' | 'food' | 'equipment' | 'other';
  specification: string | null;
  unit: string;
  quantity: number;
  unit_price: number;
  amount: number;
  received_qty: number;
  remark: string | null;
  created_at: number;
  updated_at: number;
}

// ─── 运营与安全闭环 ─────────────────────────────────────────────

export interface CareHandoverRow {
  id: string;
  handover_date: string;
  shift: 'day' | 'evening' | 'night';
  outgoing_staff: string;
  incoming_staff: string | null;
  resident_summary: string | null;
  abnormal_summary: string | null;
  pending_items: string | null;
  status: 'pending' | 'acknowledged';
  acknowledged_at: number | null;
  created_at: number;
  updated_at: number;
}

export interface CareIncidentRow {
  id: string;
  elderly_id: string | null;
  incident_type: 'fall' | 'wandering' | 'choking' | 'pressure_injury' | 'injury' | 'other';
  severity: 'normal' | 'urgent' | 'critical';
  occurred_at: string;
  location: string | null;
  description: string;
  immediate_action: string | null;
  responsible: string | null;
  family_notified_at: number | null;
  status: 'reported' | 'processing' | 'closed';
  close_note: string | null;
  closed_at: number | null;
  created_at: number;
  updated_at: number;
}

export interface VisitorRecordRow {
  id: string;
  elderly_id: string;
  visitor_name: string;
  relation: string | null;
  phone: string | null;
  visit_at: string;
  leave_at: string | null;
  purpose: string | null;
  status: 'scheduled' | 'checked_in' | 'checked_out' | 'cancelled';
  approved_by: string | null;
  remark: string | null;
  created_at: number;
  updated_at: number;
}

export interface FamilyCommunicationRow {
  id: string;
  elderly_id: string;
  contact_name: string;
  channel: 'phone' | 'wechat' | 'sms' | 'face_to_face' | 'other';
  communicated_at: string;
  content: string;
  follow_up: string | null;
  communicator: string | null;
  status: 'open' | 'closed';
  closed_at: number | null;
  created_at: number;
  updated_at: number;
}

export interface InventoryItemRow {
  id: string;
  category: 'medicine' | 'care_supply' | 'food' | 'other';
  name: string;
  specification: string | null;
  unit: string;
  quantity: number;
  min_quantity: number;
  expiry_date: string | null;
  supplier: string | null;
  status: 'active' | 'inactive';
  remark: string | null;
  created_at: number;
  updated_at: number;
}

export interface InventoryTransactionRow {
  id: string;
  item_id: string;
  transaction_type: 'in' | 'out' | 'adjust';
  quantity: number;
  occurred_at: string;
  operator: string | null;
  reference_no: string | null;
  remark: string | null;
  created_at: number;
}

export interface ElderlyDocumentRow {
  id: string;
  elderly_id: string;
  document_type: string;
  document_name: string;
  file_path: string | null;
  signed_at: string | null;
  expiry_date: string | null;
  status: 'valid' | 'expiring' | 'expired';
  custodian: string | null;
  remark: string | null;
  created_at: number;
  updated_at: number;
}

export interface HealthAlertRow {
  id: string;
  elderly_id: string;
  vital_id: string | null;
  alert_type: string;
  severity: 'warning' | 'critical';
  content: string;
  status: 'open' | 'processing' | 'resolved';
  opened_at: number;
  resolved_at: number | null;
  resolver: string | null;
  resolution: string | null;
}

/** 运营中心的只读风险汇总项，source_id 指向原始业务记录而非复制一份数据。 */
export interface OperationsRiskRow {
  id: string;
  source: 'health' | 'iot' | 'medication' | 'care' | 'admission' | 'contract' | 'fee' | 'inventory' | 'document';
  source_id: string;
  elderly_id: string | null;
  elderly_name: string | null;
  title: string;
  content: string;
  severity: 'warning' | 'critical';
  status: string;
  risk_at: string;
}
