import type { Configuration } from 'electron-builder'
import { existsSync } from 'fs'

const hasIcon = (path: string): boolean => existsSync(path)

const config: Configuration = {
  appId: 'com.yanglao.desktop',
  productName: '养老管理系统',
  copyright: 'Copyright © 2026',
  directories: {
    buildResources: 'resources',
    output: 'release',
  },
  electronDist: 'node_modules/electron/dist',
  extraResources: [
    { from: 'resources/icon.ico', to: 'icon.ico' },
    { from: 'resources/icon.png', to: 'icon.png' },
  ],
  files: [
    'out/**/*',
    '!out/**/*.map',
    // better-sqlite3 源码/文档不需要打包，减小体积（pnpm 场景下 electron-builder 会自动解析符号链接找到实际依赖）
    '!**/node_modules/better-sqlite3/src/**',
    '!**/node_modules/better-sqlite3/deps/**',
    '!**/node_modules/better-sqlite3/docs/**',
    '!**/node_modules/better-sqlite3/.github/**',
  ],
  // ── 关键：原生模块必须从 asar 中解压到磁盘才能被 Node 正常 dlopen ──
  // 否则打包后启动会抛出 "Cannot find module xxx.node" 或直接崩溃
  asarUnpack: [
    'node_modules/better-sqlite3/**/*.node',
    'node_modules/better-sqlite3/build/**',
    'node_modules/better-sqlite3/prebuilds/**',
  ],
  // better-sqlite3 使用 N-API（NAPI_VERSION=10），其官方 prebuilds 天然兼容
  // 不同 Node/Electron 版本，无需重新编译。关闭 npmRebuild 可避免在没有
  // Python/VS Build Tools 的机器上因缺少编译工具链而导致打包失败。
  npmRebuild: false,
  buildDependenciesFromSource: false,

  win: {
    target: [{ target: 'nsis', arch: ['x64'] }],
    artifactName: 'yanglao-desktop-${version}-windows-${arch}.${ext}',
    icon: hasIcon('resources/icon.ico') ? 'resources/icon.ico' : undefined,
  },
  mac: {
    target: [{ target: 'dmg', arch: ['x64', 'arm64'] }],
    artifactName: 'yanglao-desktop-${version}-macos-${arch}.${ext}',
    icon: hasIcon('resources/icon.icns') ? 'resources/icon.icns' : undefined,
    category: 'public.app-category.productivity',
  },
  linux: {
    target: [{ target: 'AppImage', arch: ['x64'] }],
    artifactName: 'yanglao-desktop-${version}-linux-${arch}.${ext}',
    icon: hasIcon('resources/icon.png') ? 'resources/icon.png' : undefined,
    category: 'Office',
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    installerIcon: hasIcon('resources/icon.ico') ? 'resources/icon.ico' : undefined,
    uninstallerIcon: hasIcon('resources/icon.ico') ? 'resources/icon.ico' : undefined,
    installerHeaderIcon: hasIcon('resources/icon.ico') ? 'resources/icon.ico' : undefined,
    // 卸载时不删除用户数据（数据库文件），避免误操作丢失养老院业务数据
    deleteAppDataOnUninstall: false,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: '养老管理系统',
    perMachine: false,
  },
  publish: {
    provider: 'github',
    owner: 'Regigigas',
    repo: 'yanglao',
    releaseType: 'release',
  },
}

export default config
