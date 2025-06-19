import { FlatCompat } from '@eslint/eslintrc';
import parser from '@typescript-eslint/parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Use TS-specific unused vars rule
      '@typescript-eslint/no-unused-vars': 'off',
      // General best practices
      'no-console': 'off',
      'prefer-const': 'error',
      'no-undef': 'error',
    },
  },
  {
    files: ['**/*.js'],
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-undef': 'error',
    },
  },
  {
    // React rules for all files (remove jsx-uses-react for React 17+)
    rules: {
      'react/prop-types': 'error',
      'react/jsx-uses-vars': 'error',
      'react/no-unused-prop-types': 'warn',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-key': 'error',
    },
  },
];

export default eslintConfig;
