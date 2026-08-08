// eslint.config.ts
// Google Style + Vue3 + TypeScript — ESLint Flat Config (ESLint 10+)
// 规则依据：https://google.github.io/styleguide/tsguide.html

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import type { Linter } from 'eslint';

const config: Linter.Config[] = [
  // ── 全局忽略 ──────────────────────────────────────────────
  {
    ignores: [
      '**/dist/**',
      '**/out/**',
      '**/release/**',
      '**/node_modules/**',
      '**/*.d.ts',
      'apps/desktop/src/renderer/auto-imports.d.ts',
      'apps/desktop/src/renderer/components.d.ts',
      '.husky/**',
    ],
  },

  // ── 基础 JS 推荐规则 ──────────────────────────────────────
  js.configs.recommended,

  // ── TypeScript 推荐规则 ───────────────────────────────────
  ...tseslint.configs.recommended,

  // ── Vue3 推荐规则 ─────────────────────────────────────────
  ...pluginVue.configs['flat/recommended'],

  // ── Google TypeScript Style 核心规则 ─────────────────────
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Google: 必须使用分号
      semi: ['error', 'always'],
      // Google: 单引号
      quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: false }],
      // Google: 2 空格缩进
      indent: 'off', // 由 prettier 接管
      // Google: 80 列警告（prettier 自动格式化，此处作为审查提示）
      'max-len': ['warn', { code: 80, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true, ignoreComments: true }],
      // Google: 不允许 var
      'no-var': 'error',
      // Google: 优先 const
      'prefer-const': 'error',
      // Google: 严格等于
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      // Google: 尾部逗号
      'comma-dangle': ['error', 'always-multiline'],
      // Google: 不允许尾部空格
      'no-trailing-spaces': 'error',
      // Google: 对象键排序（建议但不强制）
      'sort-keys': 'off',
      // Google: 箭头函数括号（gts 要求 always）
      'arrow-parens': ['error', 'always'],
      // Google: 空行约束
      'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 1 }],
      // Google: 类型声明

      // ── TypeScript 专项 ──────────────────────────────────
      // any 使用警告（Google 不禁止但要求有注释说明）
      '@typescript-eslint/no-explicit-any': 'warn',
      // 禁止未使用变量
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // 禁止 non-null 断言（需要有充分理由）
      '@typescript-eslint/no-non-null-assertion': 'warn',
      // 一致的类型导入
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', disallowTypeAnnotations: false },
      ],
      // Google: 不允许 require（使用 import）
      '@typescript-eslint/no-require-imports': 'error',
      // 命名约定（Google: camelCase for vars/funcs, PascalCase for types/classes）
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'variable', format: ['camelCase', 'UPPER_CASE', 'PascalCase'], leadingUnderscore: 'allow' },
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
        { selector: 'typeLike', format: ['PascalCase'] },
        { selector: 'enumMember', format: ['UPPER_CASE', 'PascalCase'] },
      ],
      // 异步函数必须处理返回值
      '@typescript-eslint/no-floating-promises': 'error',
      // 禁止无意义的 void 操作
      '@typescript-eslint/no-meaningless-void-operator': 'warn',
    },
  },

  // ── Vue3 专项规则 ─────────────────────────────────────────
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: pluginVue.configs['flat/recommended'][0]?.languageOptions?.parser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
    rules: {
      // 分号
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'no-var': 'error',
      'prefer-const': 'error',

      // Google: 组件名必须多词（防止和原生 HTML 冲突）
      'vue/multi-word-component-names': 'error',
      // Google: 强制 Composition API 风格（script setup 优先）
      'vue/component-api-style': ['error', ['script-setup', 'composition']],
      // 属性顺序（Google 要求一致性）
      'vue/attributes-order': ['warn', { alphabetical: false }],
      // defineProps/defineEmits 宏顺序
      'vue/define-macros-order': [
        'error',
        { order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'] },
      ],
      // 禁止 v-html（XSS 风险，符合 Google 安全要求）
      'vue/no-v-html': 'error',
      // 模板中不允许多余空格
      'vue/html-indent': ['error', 2],
      // 闭合标签风格
      'vue/html-self-closing': [
        'error',
        {
          html: { void: 'never', normal: 'never', component: 'always' },
          svg: 'always',
          math: 'always',
        },
      ],
      // prop 类型必须定义
      'vue/require-prop-types': 'error',
      // 组件 prop 默认值
      'vue/require-default-prop': 'warn',
      // 禁止 this 访问（Composition API 不需要）
      'vue/no-this-in-before-route-enter': 'off',
      // TypeScript 类型导入
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // ── Node.js（主进程/预加载）专项 ─────────────────────────
  {
    files: ['apps/desktop/src/main/**/*.ts', 'apps/desktop/src/preload/**/*.ts', 'packages/db/**/*.ts', 'packages/sync/**/*.ts'],
    rules: {
      // 主进程允许 console（配合 electron-log 使用）
      'no-console': 'off',
      // Node 环境允许 require
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // ── 测试文件宽松规则 ──────────────────────────────────────
  {
    files: ['**/*.{test,spec}.{ts,js}', '**/__tests__/**/*.{ts,js}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-console': 'off',
    },
  },
];

export default config;
