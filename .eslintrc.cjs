/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
    extraFileExtensions: ['.astro'],
  },
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/strict',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:astro/recommended',
  ],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'import/no-cycle': 'error',
    'import/no-default-export': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'import/order': ['error', {
      groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
      'newlines-between': 'always',
    }],
    'eqeqeq': ['error', 'always'],
    'prefer-const': 'error',
    'no-var': 'error',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'warn',
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        'max-len': 'off',
      },
    },
    {
      files: ['*.cjs', '*.mjs'],
      parserOptions: {
        project: null,
      },
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        'quote-props': 'off',
      },
    },
    {
      files: ['src/env.d.ts'],
      rules: {
        '@typescript-eslint/triple-slash-reference': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      typescript: { alwaysTryTypes: true },
      node: true,
    },
  },
};
