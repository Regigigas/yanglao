// stylelint.config.ts
// CSS / SCSS / Vue <style> 块约束
// 基于 stylelint-config-standard-scss + stylelint-config-recommended-vue

import type { Config } from 'stylelint';

const config: Config = {
  extends: [
    // SCSS 标准规则（已包含 stylelint-config-standard，无需重复引入）
    'stylelint-config-standard-scss',
    // Vue <style> 块支持
    'stylelint-config-recommended-vue',
  ],
  rules: {
    // ── Google Style: 2 空格缩进 ─────────────────────────────
    indentation: 2,

    // ── Google Style: 属性按字母排序（推荐，不强制） ──────────
    'declaration-property-value-no-unknown': true,

    // ── 引号 ─────────────────────────────────────────────────
    'string-quotes': 'single',

    // ── 颜色值规范 ────────────────────────────────────────────
    'color-hex-length': 'short',
    'color-hex-case': null, // 由 prettier 处理

    // ── 选择器 ────────────────────────────────────────────────
    // 允许 :deep() / :global() / :slotted() Vue scoped 语法
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['deep', 'global', 'slotted', 'local'] },
    ],
    // 允许 v-bind() CSS 函数
    'function-no-unknown': [
      true,
      { ignoreFunctions: ['v-bind', 'theme', 'constant'] },
    ],

    // ── 属性 ─────────────────────────────────────────────────
    // 禁止重复属性
    'declaration-block-no-duplicate-properties': true,
    // 禁止空代码块
    'block-no-empty': true,
    // 禁止多余单位（0 不加单位）
    'length-zero-no-unit': true,
    // 简写属性
    'shorthand-property-no-redundant-values': true,

    // ── UnoCSS / Tailwind 兼容（at-rule 忽略） ────────────────
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen', 'layer', 'unocss'],
      },
    ],
  },
  overrides: [
    {
      // Vue SFC <style> 块
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
};

export default config;
