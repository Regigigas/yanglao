interface PermissionPolicy {
  method: string;
  pattern: RegExp;
  permission: string;
}

function crudPolicies(prefix: string, permissionPrefix: string): PermissionPolicy[] {
  return [
    { method: 'GET', pattern: new RegExp(`^${prefix}/list$`), permission: `${permissionPrefix}:list` },
    { method: 'POST', pattern: new RegExp(`^${prefix}/export$`), permission: `${permissionPrefix}:export` },
    { method: 'POST', pattern: new RegExp(`^${prefix}$`), permission: `${permissionPrefix}:add` },
    { method: 'PUT', pattern: new RegExp(`^${prefix}$`), permission: `${permissionPrefix}:edit` },
    { method: 'GET', pattern: new RegExp(`^${prefix}/[^/]+$`), permission: `${permissionPrefix}:query` },
    { method: 'DELETE', pattern: new RegExp(`^${prefix}/[^/]+$`), permission: `${permissionPrefix}:remove` },
  ];
}

const policies: PermissionPolicy[] = [
  ...crudPolicies('/system/user', 'system:user'),
  { method: 'GET', pattern: /^\/system\/user$/, permission: 'system:user:query' },
  { method: 'POST', pattern: /^\/system\/user\/importData$/, permission: 'system:user:import' },
  { method: 'PUT', pattern: /^\/system\/user\/(resetPwd|changeStatus|authRole)$/, permission: 'system:user:edit' },
  { method: 'GET', pattern: /^\/system\/user\/(authRole\/[^/]+|deptTree)$/, permission: 'system:user:query' },

  ...crudPolicies('/system/role', 'system:role'),
  { method: 'PUT', pattern: /^\/system\/role\/(dataScope|changeStatus|authUser\/.+)$/, permission: 'system:role:edit' },
  { method: 'GET', pattern: /^\/system\/role\/authUser\/(allocatedList|unallocatedList)$/, permission: 'system:role:list' },
  { method: 'GET', pattern: /^\/system\/role\/(optionselect|deptTree\/[^/]+)$/, permission: 'system:role:query' },

  ...crudPolicies('/system/dept', 'system:dept'),
  { method: 'GET', pattern: /^\/system\/dept\/list\/exclude\/[^/]+$/, permission: 'system:dept:list' },
  { method: 'PUT', pattern: /^\/system\/dept\/updateSort$/, permission: 'system:dept:edit' },

  ...crudPolicies('/system/menu', 'system:menu'),
  { method: 'PUT', pattern: /^\/system\/menu\/updateSort$/, permission: 'system:menu:edit' },

  ...crudPolicies('/system/post', 'system:post'),
  ...crudPolicies('/system/config', 'system:config'),
  { method: 'DELETE', pattern: /^\/system\/config\/refreshCache$/, permission: 'system:config:remove' },
  ...crudPolicies('/system/dict/type', 'system:dict'),
  ...crudPolicies('/system/dict/data', 'system:dict'),
  { method: 'DELETE', pattern: /^\/system\/dict\/type\/refreshCache$/, permission: 'system:dict:remove' },
  ...crudPolicies('/system/notice', 'system:notice'),
  ...crudPolicies('/system/operlog', 'monitor:operlog'),
  { method: 'DELETE', pattern: /^\/system\/operlog\/clean$/, permission: 'monitor:operlog:remove' },
  ...crudPolicies('/system/logininfor', 'monitor:logininfor'),
  { method: 'DELETE', pattern: /^\/system\/logininfor\/clean$/, permission: 'monitor:logininfor:remove' },
  { method: 'GET', pattern: /^\/system\/logininfor\/unlock\/[^/]+$/, permission: 'monitor:logininfor:unlock' },

  ...crudPolicies('/system/purchase/supplier', 'purchase:supplier'),
  ...crudPolicies('/system/purchase/order', 'purchase:order'),
  { method: 'PUT', pattern: /^\/system\/purchase\/order\/[^/]+\/status$/, permission: 'purchase:order:edit' },
  { method: 'POST', pattern: /^\/system\/sync\/upload$/, permission: 'system:sync:upload' },
  { method: 'POST', pattern: /^\/system\/sync\/download$/, permission: 'system:sync:download' },
  { method: 'GET', pattern: /^\/system\/chat\//, permission: 'system:chat' },
  { method: 'POST', pattern: /^\/system\/chat\//, permission: 'system:chat' },
  { method: 'PUT', pattern: /^\/system\/chat\//, permission: 'system:chat' },
  { method: 'GET', pattern: /^\/system\/online\/list$/, permission: 'monitor:online:list' },
  { method: 'DELETE', pattern: /^\/system\/online\/[^/]+$/, permission: 'monitor:online:forceLogout' },

  ...crudPolicies('/schedule/job', 'monitor:job'),
  { method: 'PUT', pattern: /^\/schedule\/job\/(changeStatus|run)$/, permission: 'monitor:job:changeStatus' },
  { method: 'GET', pattern: /^\/schedule\/job\/log\/(list|[^/]+)$/, permission: 'monitor:job:list' },
  { method: 'POST', pattern: /^\/schedule\/job\/log\/export$/, permission: 'monitor:job:export' },
  { method: 'DELETE', pattern: /^\/schedule\/job\/log\/(clean|[^/]+)$/, permission: 'monitor:job:remove' },

  { method: 'GET', pattern: /^\/code\/gen\/(list|db\/list)$/, permission: 'tool:gen:list' },
  { method: 'GET', pattern: /^\/code\/gen\/batchGenCode$/, permission: 'tool:gen:code' },
  { method: 'GET', pattern: /^\/code\/gen\/[^/]+$/, permission: 'tool:gen:query' },
  { method: 'POST', pattern: /^\/code\/gen\/importTable$/, permission: 'tool:gen:import' },
  { method: 'PUT', pattern: /^\/code\/gen$/, permission: 'tool:gen:edit' },
  { method: 'DELETE', pattern: /^\/code\/gen\/[^/]+$/, permission: 'tool:gen:remove' },
  { method: 'GET', pattern: /^\/code\/gen\/preview\/[^/]+$/, permission: 'tool:gen:preview' },
  { method: 'GET', pattern: /^\/code\/gen\/(download|genCode)\/[^/]+$/, permission: 'tool:gen:code' },
  { method: 'GET', pattern: /^\/code\/gen\/synchDb\/[^/]+$/, permission: 'tool:gen:edit' },
];

export function requiredPermission(method: string, path: string): string | null {
  const normalized = path.length > 1 ? path.replace(/\/$/, '') : path;
  const unprotected = [
    /^\/system\/health$/,
    /^\/system\/user\/(getInfo|profile(?:\/.*)?|info\/[^/]+|register|recordlogin|importTemplate)$/,
    /^\/system\/menu\/getRouters$/,
    /^\/system\/config\/configKey\/[^/]+$/,
    /^\/system\/dict\/data\/type\/[^/]+$/,
    /^\/system\/(post|dict\/type)\/optionselect$/,
    /^\/system\/notice\/(listTop|markRead|markReadAll|readUsers\/list)$/,
    /^\/system\/purchase\/(supplier\/[^/]+|order\/(stats|[^/]+|[^/]+\/items))$/,
    /^\/system\/app-update\/latest$/,
  ];
  if (unprotected.some((pattern) => pattern.test(normalized))) return null;
  return policies.find((policy) => policy.method === method.toUpperCase() && policy.pattern.test(normalized))?.permission ?? null;
}

export function hasPermission(authorities: string[], required: string): boolean {
  return authorities.some((authority) => {
    if (authority === '*:*:*' || authority === required) return true;
    const pattern = authority.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replaceAll('*', '.*');
    return new RegExp(`^${pattern}$`).test(required);
  });
}
