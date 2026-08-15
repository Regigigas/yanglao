# 养老管理系统 NestJS 微服务后端

`after/` 已按 NestJS monorepo 的通用目录规范重建。管理端仍保持原有 `/auth`、`/system`、`/code`、`/schedule`、`/file` API 前缀，后端实现由 Spring Cloud / Java 迁移为 NestJS / TypeScript。

## 目录结构

```text
after/
├─ apps/
│  ├─ api-gateway/       # API 网关、JWT/Redis 会话校验，8080
│  ├─ auth-service/      # 登录、注册、刷新与退出，9200
│  ├─ system-service/    # 用户、角色、菜单、采购、聊天、同步等，9201
│  ├─ codegen-service/   # 数据表导入与 NestJS CRUD 代码生成，9202
│  ├─ scheduler-service/ # 数据库任务、Cron 调度与执行日志，9203
│  ├─ file-service/      # 本地文件上传、下载与安全删除，9300
│  └─ monitor-service/   # 健康检查和运行指标，9100
├─ libs/
│  ├─ common/            # MySQL、Redis、响应模型和共享工具
│  ├─ config/            # NestJS 运行配置读取与生产环境校验
│  └─ security/          # 路由权限策略、通配权限和验证码
├─ scripts/              # 整组启动与发布包脚本
├─ web-admin/            # 原 Vue 2 管理端（目录名规范化）
├─ sql/                  # 兼容原数据库的初始化脚本
├─ docker/               # Docker Compose 和 Nginx 配置
├─ Dockerfile
├─ nest-cli.json
└─ package.json
```

## 环境要求

- Node.js 20.11 或更高版本（已在 Node.js 22 验证）
- MySQL 8.x
- Redis 7.x
- npm 10.x

## 本地开发

```powershell
Copy-Item .env.example .env
npm install
npm run typecheck
npm run start:dev
```

默认会启动七个服务。MySQL 或 Redis 暂时未启动时，进程仍可启动用于接口和健康检查；生产环境应设置 `REDIS_REQUIRED=true`，确保失效会话不能继续访问。

单独开发一个服务：

```powershell
npm run start:gateway
npm run start:system
npm run start:scheduler
```

## 构建与打包

```powershell
# 构建全部 NestJS 服务
npm run build

# 生成可分发的 .tgz 包到 release/
npm run package

# 构建 Vue 管理端
npm run build:web
```

生产启动：

```powershell
npm ci --omit=dev
npm run start:prod
```

## Docker 部署

先创建 `.env`，并至少修改 `JWT_SECRET` 和 `DB_PASSWORD`：

```powershell
Copy-Item .env.example .env
npm run docker:build
npm run docker:up
```

Compose 会启动 MySQL、Redis、七个 NestJS 服务和 Nginx。原 Nacos 配置 SQL 继续保留用于迁移对照；NestJS 运行配置由 `libs/config` 和环境变量提供。原权限字符、角色菜单、数据范围及 Redis 会话逻辑由 `libs/security`、Gateway 和 System service 继续执行。

详细配置见 [DEPLOY.md](./DEPLOY.md)，架构与命名约定见 [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)，原 Java 模块与 NestJS 模块的逐项对应见 [docs/MIGRATION_MAP.md](./docs/MIGRATION_MAP.md)。

## API 兼容范围

- 系统管理：用户、资料、角色、部门、岗位、菜单、字典、参数、公告、登录日志、操作日志、在线用户。
- 养老业务：终端数据同步、供应商、采购单、聊天、App 更新检查。
- 平台能力：认证、文件服务、定时任务、NestJS 代码生成、健康检查与运行指标。
- 返回结构继续使用 `code / msg / data` 和分页 `code / msg / rows / total`。

默认初始化账号仍由 `sql/ry_20260417.sql` 提供：`admin / admin123`。生产环境部署后必须立即修改默认密码。
