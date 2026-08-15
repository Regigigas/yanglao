import type { CrudResource } from '@app/common';

const audit = ['createBy', 'createTime', 'updateBy', 'updateTime', 'remark'] as const;

export const CONFIG_RESOURCE: CrudResource = {
  table: 'sys_config', id: 'config_id', columns: ['configId', 'configName', 'configKey', 'configValue', 'configType', ...audit],
  like: ['configName', 'configKey'], exact: ['configType'], defaultOrder: 'config_id',
};
export const DICT_TYPE_RESOURCE: CrudResource = {
  table: 'sys_dict_type', id: 'dict_id', columns: ['dictId', 'dictName', 'dictType', 'status', ...audit],
  like: ['dictName', 'dictType'], exact: ['status'], defaultOrder: 'dict_id',
};
export const DICT_DATA_RESOURCE: CrudResource = {
  table: 'sys_dict_data', id: 'dict_code', columns: ['dictCode', 'dictSort', 'dictLabel', 'dictValue', 'dictType', 'cssClass', 'listClass', 'isDefault', 'status', ...audit],
  like: ['dictLabel'], exact: ['dictType', 'status'], defaultOrder: 'dict_sort',
};
export const NOTICE_RESOURCE: CrudResource = {
  table: 'sys_notice', id: 'notice_id', columns: ['noticeId', 'noticeTitle', 'noticeType', 'noticeContent', 'status', ...audit],
  like: ['noticeTitle', 'createBy'], exact: ['noticeType'], defaultOrder: 'notice_id',
};
export const OPER_LOG_RESOURCE: CrudResource = {
  table: 'sys_oper_log', id: 'oper_id', columns: ['operId', 'title', 'businessType', 'method', 'requestMethod', 'operatorType', 'operName', 'deptName', 'operUrl', 'operIp', 'operLocation', 'operParam', 'jsonResult', 'status', 'errorMsg', 'operTime', 'costTime'],
  like: ['title', 'operName', 'operIp'], exact: ['businessType', 'status'], defaultOrder: 'oper_id',
};
export const LOGIN_INFO_RESOURCE: CrudResource = {
  table: 'sys_logininfor', id: 'info_id', columns: ['infoId', 'userName', 'ipaddr', 'loginLocation', 'browser', 'os', 'status', 'msg', 'loginTime'],
  like: ['userName', 'ipaddr'], exact: ['status'], defaultOrder: 'info_id',
};
