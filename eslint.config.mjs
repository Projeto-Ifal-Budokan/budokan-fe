import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
    },
  },
  {
    rules: {
      // React specific rules
      'react/prop-types': 'error',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/no-unused-prop-types': 'warn',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-key': 'error',

      // Tailwind specific rules
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/no-custom-classname': 'warn',

      // General best practices
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-undef': 'error',
    },
  },
];

export default eslintConfig;
