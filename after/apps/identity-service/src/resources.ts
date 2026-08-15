import type { CrudResource } from '@app/common';

const audit = ['createBy', 'createTime', 'updateBy', 'updateTime', 'remark'] as const;

export const POST_RESOURCE: CrudResource = {
  table: 'sys_post', id: 'post_id',
  columns: ['postId', 'postCode', 'postName', 'postSort', 'status', ...audit],
  like: ['postCode', 'postName'], exact: ['status'], defaultOrder: 'post_sort',
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
