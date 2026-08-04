-- SQL 脚本：采购管理模块建表（RuoYi 后台）
-- 放在 after/sql/ 目录下，由 DBA 执行或在应用启动时自动执行

-- =========================================
-- 供应商表
-- =========================================
CREATE TABLE IF NOT EXISTS `supplier` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY COMMENT '供应商ID',
  `name` VARCHAR(100) NOT NULL COMMENT '供应商名称',
  `contact` VARCHAR(50) DEFAULT NULL COMMENT '联系人',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
  `address` VARCHAR(200) DEFAULT NULL COMMENT '地址',
  `category` VARCHAR(20) NOT NULL DEFAULT 'other' COMMENT '类别：medicine/care_supply/food/equipment/other',
  `tax_no` VARCHAR(50) DEFAULT NULL COMMENT '税号',
  `bank_account` VARCHAR(50) DEFAULT NULL COMMENT '银行账号',
  `bank_name` VARCHAR(100) DEFAULT NULL COMMENT '开户行',
  `status` VARCHAR(10) NOT NULL DEFAULT 'active' COMMENT '状态：active/inactive',
  `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
  `create_by` VARCHAR(64) DEFAULT NULL COMMENT '创建者',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_by` VARCHAR(64) DEFAULT NULL COMMENT '更新者',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `del_flag` CHAR(1) DEFAULT '0' COMMENT '删除标志（0存在 2删除）',
  INDEX `idx_status` (`status`),
  INDEX `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='供应商表';

-- =========================================
-- 采购单表
-- =========================================
CREATE TABLE IF NOT EXISTS `purchase_order` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY COMMENT '采购单ID',
  `order_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '采购单号',
  `supplier_id` VARCHAR(64) DEFAULT NULL COMMENT '供应商ID',
  `supplier_name` VARCHAR(100) DEFAULT NULL COMMENT '供应商名称',
  `order_date` DATE NOT NULL COMMENT '采购日期',
  `expect_date` DATE DEFAULT NULL COMMENT '预计到货日期',
  `total_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '总金额',
  `paid_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '已付金额',
  `status` VARCHAR(20) NOT NULL DEFAULT 'draft' COMMENT '状态：draft/pending/approved/received/cancelled',
  `applicant` VARCHAR(64) DEFAULT NULL COMMENT '申请人',
  `approver` VARCHAR(64) DEFAULT NULL COMMENT '审批人',
  `approved_at` DATETIME DEFAULT NULL COMMENT '审批时间',
  `received_at` DATETIME DEFAULT NULL COMMENT '入库时间',
  `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
  `create_by` VARCHAR(64) DEFAULT NULL COMMENT '创建者',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_by` VARCHAR(64) DEFAULT NULL COMMENT '更新者',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `del_flag` CHAR(1) DEFAULT '0' COMMENT '删除标志（0存在 2删除）',
  INDEX `idx_order_no` (`order_no`),
  INDEX `idx_status` (`status`),
  INDEX `idx_supplier` (`supplier_id`),
  INDEX `idx_order_date` (`order_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='采购单表';

-- =========================================
-- 采购单明细表
-- =========================================
CREATE TABLE IF NOT EXISTS `purchase_order_item` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY COMMENT '明细ID',
  `order_id` VARCHAR(64) NOT NULL COMMENT '采购单ID',
  `item_name` VARCHAR(100) NOT NULL COMMENT '物品名称',
  `category` VARCHAR(20) NOT NULL DEFAULT 'other' COMMENT '类别：medicine/care_supply/food/equipment/other',
  `specification` VARCHAR(100) DEFAULT NULL COMMENT '规格',
  `unit` VARCHAR(20) NOT NULL DEFAULT '件' COMMENT '单位',
  `quantity` DECIMAL(10,2) NOT NULL COMMENT '数量',
  `unit_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '单价',
  `amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '金额',
  `received_qty` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '已入库数量',
  `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='采购单明细表';
