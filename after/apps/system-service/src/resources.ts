import type { CrudResource } from '@app/common';

const audit = ['createBy', 'createTime', 'updateBy', 'updateTime', 'remark'] as const;

export const POST_RESOURCE: CrudResource = {
  table: 'sys_post', id: 'post_id',
  columns: ['postId', 'postCode', 'postName', 'postSort', 'status', ...audit],
  like: ['postCode', 'postName'], exact: ['status'], defaultOrder: 'post_sort',
};

export const CONFIG_RESOURCE: CrudResource = {
  table: 'sys_config', id: 'config_id',
  columns: ['configId', 'configName', 'configKey', 'configValue', 'configType', ...audit],
  like: ['configName', 'configKey'], exact: ['configType'], defaultOrder: 'config_id',
};

export const DICT_TYPE_RESOURCE: CrudResource = {
  table: 'sys_dict_type', id: 'dict_id',
  columns: ['dictId', 'dictName', 'dictType', 'status', ...audit],
  like: ['dictName', 'dictType'], exact: ['status'], defaultOrder: 'dict_id',
};

export const DICT_DATA_RESOURCE: CrudResource = {
  table: 'sys_dict_data', id: 'dict_code',
  columns: ['dictCode', 'dictSort', 'dictLabel', 'dictValue', 'dictType', 'cssClass', 'listClass', 'isDefault', 'status', ...audit],
  like: ['dictLabel'], exact: ['dictType', 'status'], defaultOrder: 'dict_sort',
};

export const NOTICE_RESOURCE: CrudResource = {
  table: 'sys_notice', id: 'notice_id',
  columns: ['noticeId', 'noticeTitle', 'noticeType', 'noticeContent', 'status', ...audit],
  like: ['noticeTitle', 'createBy'], exact: ['noticeType'], defaultOrder: 'notice_id',
};

export const OPER_LOG_RESOURCE: CrudResource = {
  table: 'sys_oper_log', id: 'oper_id',
  columns: ['operId', 'title', 'businessType', 'method', 'requestMethod', 'operatorType', 'operName', 'deptName', 'operUrl', 'operIp', 'operLocation', 'operParam', 'jsonResult', 'status', 'errorMsg', 'operTime', 'costTime'],
  like: ['title', 'operName', 'operIp'], exact: ['businessType', 'status'], defaultOrder: 'oper_id',
};

export const LOGIN_INFO_RESOURCE: CrudResource = {
  table: 'sys_logininfor', id: 'info_id',
  columns: ['infoId', 'userName', 'ipaddr', 'loginLocation', 'browser', 'os', 'status', 'msg', 'loginTime'],
  like: ['userName', 'ipaddr'], exact: ['status'], defaultOrder: 'info_id',
};

export const DEPT_RESOURCE: CrudResource = {
  table: 'sys_dept', id: 'dept_id',
  columns: ['deptId', 'parentId', 'ancestors', 'deptName', 'orderNum', 'leader', 'phone', 'email', 'status', 'delFlag', ...audit],
  like: ['deptName'], exact: ['status'], defaultOrder: 'order_num', softDelete: true,
};

export const MENU_RESOURCE: CrudResource = {
  table: 'sys_menu', id: 'menu_id',
  columns: ['menuId', 'menuName', 'parentId', 'orderNum', 'path', 'component', 'query', 'routeName', 'isFrame', 'isCache', 'menuType', 'visible', 'status', 'perms', 'icon', ...audit],
  like: ['menuName'], exact: ['status'], defaultOrder: 'order_num',
};

export const ROLE_RESOURCE: CrudResource = {
  table: 'sys_role', id: 'role_id',
  columns: ['roleId', 'roleName', 'roleKey', 'roleSort', 'dataScope', 'menuCheckStrictly', 'deptCheckStrictly', 'status', 'delFlag', ...audit],
  like: ['roleName', 'roleKey'], exact: ['status'], defaultOrder: 'role_sort', softDelete: true,
};

export const USER_RESOURCE: CrudResource = {
  table: 'sys_user', id: 'user_id',
  columns: ['userId', 'deptId', 'userName', 'nickName', 'userType', 'email', 'phonenumber', 'sex', 'avatar', 'password', 'status', 'delFlag', 'loginIp', 'loginDate', 'pwdUpdateDate', ...audit],
  like: ['userName', 'nickName', 'phonenumber'], exact: ['status', 'deptId'], defaultOrder: 'user_id', softDelete: true,
};

export const SUPPLIER_RESOURCE: CrudResource = {
  table: 'supplier', id: 'id',
  columns: ['id', 'name', 'contact', 'phone', 'address', 'category', 'taxNo', 'bankAccount', 'bankName', 'status', 'remark', 'createBy', 'createTime', 'updateBy', 'updateTime', 'delFlag'],
  like: ['name'], exact: ['category', 'status'], defaultOrder: 'create_time', softDelete: true,
};
