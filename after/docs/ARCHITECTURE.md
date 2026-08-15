# 架构与命名约定

`after/` 采用 NestJS monorepo 组织代码，但运行时不是一个大服务。每个 `apps/*-service` 都可以独立构建、启动和部署，网关只负责认证、权限和路由转发。

## 顶层结构

```text
after/
├── apps/                  # 可独立运行的 NestJS 应用
├── libs/                  # 跨服务共享能力
├── web-admin/             # Vue 2 管理端
├── sql/                   # 兼容原系统的数据初始化脚本
├── docker/                # Compose 与 Nginx 配置
├── scripts/               # 启动、打包脚本
├── nest-cli.json
└── package.json
```

## 服务边界

| 目录 | 服务名 | 职责 | 端口 |
|---|---|---|---:|
| `apps/api-gateway` | `api-gateway` | 统一入口、JWT、Redis session、权限校验、路由转发 | 8080 |
| `apps/auth-service` | `auth-service` | 登录、刷新 token、退出、注册 | 9200 |
| `apps/identity-service` | `identity-service` | 用户、角色、部门、菜单、岗位、数据权限 | 9201 |
| `apps/platform-service` | `platform-service` | 参数、字典、通知、日志、在线会话、App 更新 | 9204 |
| `apps/procurement-service` | `procurement-service` | 供应商、采购订单 | 9205 |
| `apps/collaboration-service` | `collaboration-service` | 联系人、私聊、群聊 | 9206 |
| `apps/sync-service` | `sync-service` | 终端增量同步 | 9207 |
| `apps/codegen-service` | `codegen-service` | NestJS CRUD 代码生成 | 9202 |
| `apps/scheduler-service` | `scheduler-service` | 定时任务和执行日志 | 9203 |
| `apps/file-service` | `file-service` | 文件上传、下载、删除 | 9300 |
| `apps/monitor-service` | `monitor-service` | 健康检查和运行指标 | 9100 |

## 服务内部结构

复杂服务采用 feature module 分层，不再把全部接口堆在一个 controller 里。

```text
apps/identity-service/src/
├── app.module.ts
├── main.ts
├── domain/
│   ├── identity-domain.module.ts
│   ├── identity.service.ts
│   └── resources.ts
├── modules/
│   ├── users/
│   ├── roles/
│   ├── departments/
│   ├── menus/
│   ├── posts/
│   └── health/
└── shared/
    └── http.helpers.ts
```

```text
apps/platform-service/src/
├── app.module.ts
├── main.ts
├── domain/
│   ├── platform-domain.module.ts
│   └── resources.ts
├── modules/
│   ├── config/
│   ├── dictionary/
│   ├── notices/
│   ├── audit/
│   ├── online-sessions/
│   ├── app-updates/
│   └── health/
└── shared/
    └── http.helpers.ts
```

约定：

- `modules/*` 只负责某个业务能力的 Controller 和 Module。
- `domain/*` 放本服务内可复用的业务 Service、资源定义和领域规则。
- `shared/*` 放本服务内部共享的请求解析、导出文件等辅助函数。
- `libs/common` 放 MySQL、Redis、响应模型、通用数据访问。
- `libs/config` 放运行时配置读取。
- `libs/security` 放路由权限、验证码和通配权限规则。

## 请求链路

```text
Web / Terminal
  -> api-gateway
  -> auth / identity / platform / procurement / collaboration / sync
  -> codegen / scheduler / file / monitor
  -> MySQL / Redis / uploads
```

外部 API 前缀保持兼容，前端不需要跟着服务拆分改接口：

| 外部前缀 | 内部服务 |
|---|---|
| `/auth/**` | `auth-service` |
| `/system/user/**`, `/system/role/**`, `/system/dept/**`, `/system/menu/**`, `/system/post/**` | `identity-service` |
| `/system/config/**`, `/system/dict/**`, `/system/notice/**`, `/system/operlog/**`, `/system/logininfor/**`, `/system/online/**`, `/system/app-update/**` | `platform-service` |
| `/system/purchase/**` | `procurement-service` |
| `/system/chat/**` | `collaboration-service` |
| `/system/sync/**` | `sync-service` |
| `/code/**` | `codegen-service` |
| `/schedule/**` | `scheduler-service` |
| `/file/**` | `file-service` |

## Java 到 NestJS 的替换关系

- Spring Cloud Gateway -> NestJS gateway + `http-proxy-middleware`
- Spring Security / Redis token -> JWT + Redis session + permission policy
- MyBatis -> `mysql2` 参数化数据访问
- Quartz -> `@nestjs/schedule` + 数据库任务配置
- Spring Boot Admin -> 独立 `monitor-service`
- Maven 聚合构建 -> Nest CLI monorepo + npm scripts

## 当前迁移边界

当前阶段复用原 MySQL 实例和表结构，但按服务明确逻辑所有权。后续如果要继续演进，可以把跨服务读写逐步改成内部 API、事件或独立 schema，而不影响现有管理端 API。
