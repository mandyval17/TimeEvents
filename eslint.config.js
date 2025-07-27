import tanstackQuery from '@tanstack/eslint-plugin-query';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
  {
    ignores: ['dist'], // Files/directories to ignore
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'], // Target files
    languageOptions: {
      ecmaVersion: 2020, // ECMAScript version
      sourceType: 'module', // Use ES modules
      globals: globals.browser, // Global variables
      parser: tsParser, // Use TypeScript parser
    },
    plugins: {
      react, // React plugin
      'react-hooks': reactHooks, // React hooks plugin
      'react-refresh': reactRefresh, // React refresh plugin
      '@typescript-eslint': typescript, // TypeScript plugin
      'eslint-plugin-query': tanstackQuery,
    },
    rules: {
      // React Rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // React Refresh
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      'no-unused-vars': [
        'error',
        {
          "vars": "all",
          "args": "none",
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_"
        },
      ],

      // TypeScript-Specific Rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          "vars": "all",
          "args": "none",
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_"
        }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',

      // General Rules
      'no-console': 'warn',
      'no-duplicate-imports': 'error',
      'default-case': 'error',
      'camelcase': 'warn',
      'max-lines': [
        'warn',
        {
          max: 2000,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect React version
      },
      'import/resolver': {
        alias: {
          map: [
            ['@', './src'],
            ['@components', './src/components'],
            ['@pages', './src/pages'],
            ['@hooks', './src/hooks'],
            ['@utilities', './src/utilities'],
          ],
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        }
      },
    },
  },
];
