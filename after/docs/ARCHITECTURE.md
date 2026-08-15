# 架构与命名约定

## 服务命名

目录与运行服务统一采用小写 kebab-case，并以职责结尾：

| 目录 | 服务名 | 职责 | 端口 |
|---|---|---|---:|
| `apps/api-gateway` | `api-gateway` | 统一入口、路由、JWT 与会话校验 | 8080 |
| `apps/auth-service` | `auth-service` | 身份认证与 token 生命周期 | 9200 |
| `apps/identity-service` | `identity-service` | 用户、角色、组织、菜单和岗位 | 9201 |
| `apps/codegen-service` | `codegen-service` | NestJS CRUD 代码生成 | 9202 |
| `apps/scheduler-service` | `scheduler-service` | Cron 任务和执行日志 | 9203 |
| `apps/platform-service` | `platform-service` | 参数、字典、通知、审计、在线会话和更新配置 | 9204 |
| `apps/procurement-service` | `procurement-service` | 供应商和采购订单 | 9205 |
| `apps/collaboration-service` | `collaboration-service` | 联系人、私聊和群聊 | 9206 |
| `apps/sync-service` | `sync-service` | 终端增量同步 | 9207 |
| `apps/file-service` | `file-service` | 文件存储 | 9300 |
| `apps/monitor-service` | `monitor-service` | 健康检查和指标 | 9100 |

代码文件遵循 NestJS 社区惯例：`*.module.ts`、`*.controller.ts`、`*.service.ts`、`*.dto.ts`。数据库与 Redis 基础设施放入 `libs/common`，运行配置放入 `libs/config`，接口权限、通配权限和验证码放入 `libs/security`，业务代码不反向依赖网关。

## 请求链路

```text
Web / Terminal
      ↓
api-gateway (JWT + Redis session + permission)
      ↓
auth / identity / platform / procurement / collaboration / sync
      ↓
codegen / scheduler / file / monitor
      ↓
MySQL / Redis / uploads
```

外部 API 前缀保留原系统约定，网关转发时移除第一段：

| 外部前缀 | 内部服务 |
|---|---|
| `/auth/**` | `auth-service` |
| `/system/user/**`、`role/**`、`dept/**`、`menu/**`、`post/**` | `identity-service` |
| `/system/config/**`、`dict/**`、`notice/**`、`operlog/**`、`logininfor/**`、`online/**`、`app-update/**` | `platform-service` |
| `/system/purchase/**` | `procurement-service` |
| `/system/chat/**` | `collaboration-service` |
| `/system/sync/**` | `sync-service` |
| `/code/**` | `codegen-service` |
| `/schedule/**` | `scheduler-service` |
| `/file/**` | `file-service` |

## NestJS 方案替换

- Nacos 服务发现 → Docker DNS + 环境变量路由。
- Spring Cloud Gateway → NestJS + `http-proxy-middleware`。
- Spring Security / Redis Token → HS512 JWT + Redis 会话，并保留菜单权限字符和数据范围校验。
- MyBatis → 参数化 `mysql2` 数据访问层。
- Quartz → `@nestjs/schedule` + 数据库任务配置。
- Spring Boot Admin → 独立 Monitor service。
- Java 代码生成器 → NestJS Controller / Service / DTO / Module 模板。
- Maven 聚合构建 → Nest CLI monorepo + npm scripts。

## 边界与数据所有权

- 服务按业务能力（bounded context）拆分，不按数据表或 Controller 数量拆分，避免形成大量相互调用的小服务。
- Gateway 只负责认证、权限和路由，不承载业务逻辑；每个服务独立启动、构建和部署。
- 当前迁移阶段复用原 MySQL 实例和表结构，但每张业务表只有一个逻辑所属服务。跨域读取暂时保留以兼容原逻辑，后续可逐步改为内部 API 或事件。
- 外部 `/system/**` 契约不变；服务拆分不会要求管理端同步修改接口地址。

## 数据与安全

- SQL 只通过参数占位符写入值；动态表名和字段名只允许来自代码内白名单。
- 用户密码继续兼容原 bcrypt 哈希。
- 生产环境 Redis 不可用时网关拒绝受保护请求。
- 文件服务拒绝可执行扩展名并验证解析后的绝对路径，防止路径穿越。
- 定时任务只调用注册过的 NestJS handler，不执行数据库中的任意代码字符串。
