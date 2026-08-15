# Java 模块到 NestJS 模块映射

本次迁移只替换实现技术，不删除原有业务能力。原 Java 模块与 NestJS 目录对应如下：

| 原模块 | NestJS 模块 | 保留能力 |
| --- | --- | --- |
| `ruoyi-gateway` | `apps/api-gateway` | 路由、JWT、Redis 会话、白名单、黑名单、验证码、权限拦截 |
| `ruoyi-auth` | `apps/auth-service` | 登录、退出、刷新、注册、锁屏解锁、登录日志 |
| `ruoyi-modules/ruoyi-system` 身份与权限 | `apps/identity-service` | 用户、角色、部门、菜单、岗位、数据范围 |
| `ruoyi-modules/ruoyi-system` 平台配置 | `apps/platform-service` | 参数、字典、通知、日志、在线用户、更新检查 |
| 原采购与供应商业务 | `apps/procurement-service` | 供应商、采购单、采购明细和状态流转 |
| 原聊天业务 | `apps/collaboration-service` | 联系人、私聊、群聊、消息和已读位置 |
| 原终端同步业务 | `apps/sync-service` | 上传、下载、游标和变更白名单 |
| `ruoyi-modules/ruoyi-gen` | `apps/codegen-service` | 数据表导入、字段同步、预览、批量生成和下载；输出改为 NestJS 模板 |
| `ruoyi-modules/ruoyi-job` | `apps/scheduler-service` | 任务配置、Cron 调度、立即执行、状态切换、执行日志 |
| `ruoyi-modules/ruoyi-file` | `apps/file-service` | 上传、静态访问、安全删除、扩展名和路径校验 |
| `ruoyi-visual/ruoyi-monitor` | `apps/monitor-service` | 健康检查和运行指标 |
| `ruoyi-common-*` 数据与 Redis 能力 | `libs/common` | MySQL 连接池、事务、Redis、统一响应和异常处理 |
| `ruoyi-common-security`、`ruoyi-common-datascope` | `libs/security` + `identity-service` | 权限字符、通配权限、角色菜单、数据范围、验证码和 XSS 防护 |
| Nacos 配置 | `libs/config` + `.env` | 运行配置、生产配置校验；原配置 SQL 保留作迁移基线 |
| `ruoyi-ui` | `web-admin` | 原 Vue 2 页面、API 调用和交互逻辑，仅规范化目录名 |

原数据库表名、权限字符、API 前缀和 `code / msg / data` 返回结构保持兼容。Gateway 在 `/system/**` 内按业务路径选择服务，因此前端 API 无需修改。Java 源文件与 Maven 构建文件不再参与运行。
