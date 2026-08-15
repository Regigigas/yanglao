import type { CrudResource } from '@app/common';

export const SUPPLIER_RESOURCE: CrudResource = {
  table: 'supplier', id: 'id',
  columns: ['id', 'name', 'contact', 'phone', 'address', 'category', 'taxNo', 'bankAccount', 'bankName', 'status', 'remark', 'createBy', 'createTime', 'updateBy', 'updateTime', 'delFlag'],
  like: ['name'], exact: ['category', 'status'], defaultOrder: 'create_time', softDelete: true,
};
