import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

export default defineConfig({
  // ── 主进程 ────────────────────────────────────────────────
  main: {
    plugins: [
      // exclude: 让 workspace 内部包（TypeScript 源码）被打包进 out/main/index.js
      // 而不是被 externalize 后在运行时直接 require TS 源文件导致崩溃
      externalizeDepsPlugin({
        exclude: ['@yanglao/db', '@yanglao/sync', '@yanglao/core', '@yanglao/ui'],
      }),
    ],
    resolve: {
      alias: {
        '@main': resolve('src/main'),
      },
    },
    build: {
      rollupOptions: {
        // better-sqlite3 是原生 .node 模块，必须在运行时由 Node require，不能打包
        external: ['better-sqlite3'],
      },
    },
  },

  // ── 预加载脚本 ────────────────────────────────────────────
  preload: {
    plugins: [
      externalizeDepsPlugin({
        exclude: ['@yanglao/db', '@yanglao/sync', '@yanglao/core', '@yanglao/ui'],
      }),
    ],
  },

  // ── 渲染进程（Vue）───────────────────────────────────────
  renderer: {
    root: 'src/renderer',
    resolve: {
      alias: {
        '@': resolve('src/renderer/src'),
        '@ui': resolve('../../packages/ui/src'),
        '@core': resolve('../../packages/core/src'),
      },
    },
    // dev 模式下 esbuild 预优化也需要排除 oxc-parser 的平台原生/WASM 绑定
    optimizeDeps: {
      exclude: ['@oxc-parser/binding-wasm32-wasi'],
      esbuildOptions: {
        plugins: [{
          name: 'exclude-oxc-bindings',
          setup(build) {
            build.onResolve({ filter: /^@oxc-parser\/binding-/ }, () => ({
              path: 'empty-module',
              namespace: 'oxc-binding-stub',
            }))
            build.onLoad({ filter: /.*/, namespace: 'oxc-binding-stub' }, () => ({
              contents: 'export {}',
              loader: 'js',
            }))
          },
        }],
      },
    },
    plugins: [
      vue(),
      UnoCSS({
        // 引用 packages/ui 中定义的 UnoCSS 配置
        configFile: resolve('../../packages/ui/uno.config.ts'),
      }),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia',
          { from: '@vueuse/core', imports: ['useLocalStorage', 'useMediaQuery', 'useToggle', 'useDark'] },
          { from: '@vueuse/motion', imports: ['useMotion'] },
        ],
        dts: 'src/renderer/auto-imports.d.ts',
        eslintrc: { enabled: true },
      }),
      Components({
        resolvers: [NaiveUiResolver()],
        dirs: ['src/renderer/src/components', '../../packages/ui/src/components'],
        dts: 'src/renderer/components.d.ts',
      }),
    ],
    build: {
      rollupOptions: {
        external: [
          // oxc-parser 的 WASM/native 绑定是可选平台模块，不能被 Rollup 打包
          '@oxc-parser/binding-wasm32-wasi',
          /^@oxc-parser\/binding-/,
        ],
        output: {
          // 代码分割：每个视图/路由独立 chunk，减小首屏体积
          manualChunks: {
            'vendor-vue': ['vue', 'vue-router', 'pinia'],
            'vendor-naive': ['naive-ui'],
            'vendor-echarts': ['echarts', 'vue-echarts'],
            'vendor-utils': ['axios', 'dayjs', 'zod'],
            'vendor-query': ['@tanstack/vue-query'],
          },
        },
      },
    },
  },
})
