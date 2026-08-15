# 架构与命名约定

## 服务命名

目录与运行服务统一采用小写 kebab-case，并以职责结尾：

| 目录 | 服务名 | 职责 | 端口 |
|---|---|---|---:|
| `apps/api-gateway` | `api-gateway` | 统一入口、路由、JWT 与会话校验 | 8080 |
| `apps/auth-service` | `auth-service` | 身份认证与 token 生命周期 | 9200 |
| `apps/system-service` | `system-service` | 系统管理和养老业务 | 9201 |
| `apps/codegen-service` | `codegen-service` | NestJS CRUD 代码生成 | 9202 |
| `apps/scheduler-service` | `scheduler-service` | Cron 任务和执行日志 | 9203 |
| `apps/file-service` | `file-service` | 文件存储 | 9300 |
| `apps/monitor-service` | `monitor-service` | 健康检查和指标 | 9100 |

代码文件遵循 NestJS 社区惯例：`*.module.ts`、`*.controller.ts`、`*.service.ts`、`*.dto.ts`。共享基础设施放入 `libs/common`，业务代码不反向依赖网关。

## 请求链路

```text
Web / Terminal
      ↓
api-gateway (JWT + Redis session)
      ↓
auth / system / codegen / scheduler / file
      ↓
MySQL / Redis / uploads
```

外部 API 前缀保留原系统约定，网关转发时移除第一段：

| 外部前缀 | 内部服务 |
|---|---|
| `/auth/**` | `auth-service` |
| `/system/**` | `system-service` |
| `/code/**` | `codegen-service` |
| `/schedule/**` | `scheduler-service` |
| `/file/**` | `file-service` |

## NestJS 方案替换

- Nacos 服务发现 → Docker DNS + 环境变量路由。
- Spring Cloud Gateway → NestJS + `http-proxy-middleware`。
- Spring Security / Redis Token → HS512 JWT + Redis 会话。
- MyBatis → 参数化 `mysql2` 数据访问层。
- Quartz → `@nestjs/schedule` + 数据库任务配置。
- Spring Boot Admin → 独立 Monitor service。
- Java 代码生成器 → NestJS Controller / Service / DTO / Module 模板。
- Maven 聚合构建 → Nest CLI monorepo + npm scripts。

## 数据与安全

- SQL 只通过参数占位符写入值；动态表名和字段名只允许来自代码内白名单。
- 用户密码继续兼容原 bcrypt 哈希。
- 生产环境 Redis 不可用时网关拒绝受保护请求。
- 文件服务拒绝可执行扩展名并验证解析后的绝对路径，防止路径穿越。
- 定时任务只调用注册过的 NestJS handler，不执行数据库中的任意代码字符串。
