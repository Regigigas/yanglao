# NestJS 微服务部署说明

## 1. 配置

从 `.env.example` 复制 `.env`。生产环境必须修改：

- `JWT_SECRET`：长度足够的随机值；修改后原 Java 版本签发的 token 会全部失效。
- `DB_PASSWORD`：MySQL 强密码。
- `REDIS_REQUIRED=true`：强制网关检查登录会话。
- `FILE_PUBLIC_URL`：外部可访问的文件地址，建议使用 HTTPS 域名。

不要将 `.env`、密码、token 或密钥提交到 Git。

## 2. 数据库

现有数据库可直接复用，不需要修改前端接口。新环境按以下顺序导入：

1. `sql/ry_20260417.sql`
2. `sql/purchase_tables.sql`
3. `sql/chat_tables.sql`
4. `sql/yanglao_sync.sql`
5. `sql/quartz.sql`

Docker Compose 已按这个顺序挂载初始化脚本。原 Nacos 配置库和 Seata 表不再是 NestJS 运行依赖。

## 3. 裸机发布

```powershell
npm ci
npm run typecheck
npm run build
npm run package
```

将 `release/yanglao-nest-cloud-1.0.0.tgz` 上传到服务器后：

```bash
mkdir yanglao-nest-cloud
tar -xzf yanglao-nest-cloud-1.0.0.tgz -C yanglao-nest-cloud --strip-components=1
cd yanglao-nest-cloud
cp .env.example .env
npm install --omit=dev
npm run start:prod
```

建议使用 systemd、PM2 或容器编排器负责进程守护。七个进程的入口位于 `dist/apps/<service-name>/main.js`。

## 4. Docker Compose

```powershell
Copy-Item .env.example .env
npm run docker:build
npm run docker:up
docker compose -f docker/docker-compose.yml ps
```

停止服务：

```powershell
npm run docker:down
```

MySQL、Redis 和上传文件使用具名 volume；`docker compose down` 不会删除数据，只有显式增加 `-v` 才会删除 volume。

## 5. 健康检查

- Gateway：`GET http://localhost:8080/health`
- File：`GET http://localhost:9300/health`
- Monitor：`GET http://localhost:9100/health`
- Metrics：`GET http://localhost:9100/metrics`

业务接口只通过 Gateway 对外开放。服务端口可仅在内网暴露；示例 Compose 映射端口是为了便于联调，生产环境可移除 9100、9200-9203、9300 的宿主机端口映射。

## 6. 回滚

部署时保留上一版 `.tgz` 或容器镜像。应用回滚不自动回滚数据库；执行结构迁移前应先备份 MySQL。上传文件 volume 和数据库 volume 必须独立备份。
