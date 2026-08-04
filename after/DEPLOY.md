# 线上同步服务部署

## 环境要求

- Docker Engine 与 Docker Compose
- 可访问的 MySQL、Redis 和 Nacos 服务
- 对外开放的 HTTP/HTTPS 域名

## 部署步骤

1. 修改 `docker/docker-compose.yml` 中的 MySQL 密码和 Nacos 鉴权配置。
2. 检查 `docker/nacos/conf/application.properties`，确保数据库和鉴权参数与 Compose 配置一致。
3. 将 `sql/` 中的 SQL 按业务基础表、配置、采购、同步表的顺序导入 MySQL。
4. 在 `docker/` 目录执行 `docker compose up -d --build`。
5. 为桌面端使用的 RuoYi 账号分配 `system:sync:upload` 和 `system:sync:download` 权限。
6. 在 Electron 数据同步页面填写网关地址和该账号登录后获得的 Bearer Token。

通过发行包部署时，Web 静态资源和各服务 JAR 已放入对应 Docker 构建目录，无需再次执行 `copy.sh`。

生产环境必须替换示例密码与 Nacos 鉴权值，并在网关前配置 HTTPS。
