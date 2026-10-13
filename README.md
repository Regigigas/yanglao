# 养老管理系统

养老机构管理系统由线上同步服务、Electron 桌面端和 uni-app 终端组成。

## 项目结构

| 目录 | 用途 |
| --- | --- |
| `after/` | 线上管理端与数据同步服务，基于 RuoYi Cloud、Spring Boot 和 Vue 2 |
| `before/` | Electron 桌面端，支持 SQLite 离线存储及与线上服务双向同步 |
| `terminal/` | uni-app 终端应用 |

## 数据同步

线上同步接口由 `after` 中的 `ruoyi-system` 服务提供：

- `POST /sync/upload`：接收 Electron 本地变更
- `POST /sync/download`：按游标返回其他设备的增量变更

Electron 在“系统设置 > 数据同步”中配置网关地址和 RuoYi Bearer Token。通过 Nginx 部署时，同步地址通常为 `https://example.com/prod-api`。

首次部署线上服务需要按顺序导入 `after/sql/` 中的 SQL 文件，并为同步账号分配 `system:sync:upload`、`system:sync:download` 权限。

## 发行资产

GitHub Releases 提供以下安装和部署包：

- `yanglao-desktop-<version>-windows-x64.exe`：Windows Electron 安装包
- `yanglao-desktop-<version>-macos-x64.dmg` / `yanglao-desktop-<version>-macos-arm64.dmg`：Intel 与 Apple 芯片 Mac 安装包
- `yanglao-desktop-<version>-linux-x64.AppImage`：Linux 免安装应用
- `yanglao-desktop-<version>-linux-x64.deb`：Debian/Ubuntu 安装包
- `yanglao-online-<version>.zip`：线上同步服务部署包，包含 Web 静态资源、后端 JAR、SQL 和 Docker 配置

推送 `v*` 格式的 Git 标签（例如 `v1.1.2`）会自动构建 macOS、Windows 和 Linux 桌面安装包，并上传到对应的 GitHub Release。也可在 GitHub Actions 的 **Build desktop releases** 工作流中手动运行并指定 Release 标签。

Electron 安装版会从本仓库 GitHub Releases 检查新版本。
