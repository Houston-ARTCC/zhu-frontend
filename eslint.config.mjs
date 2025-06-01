import { defineConfig } from 'eslint/config';
import { fixupConfigRules } from '@eslint/compat';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
});

export default defineConfig([{
    extends: [
        js.configs.recommended,
        ...fixupConfigRules(compat.extends(
            'plugin:import/recommended',
            'plugin:jsx-a11y/recommended',
            'next/core-web-vitals',
        )),
        ts.configs.recommended,
        ts.configs.stylistic,
    ],

    rules: {
        'semi': 'warn',
        'indent': ['warn', 4, { SwitchCase: 1 }],
        'comma-dangle': ['warn', 'always-multiline'],
        'quote-props': ['warn', 'consistent-as-needed'],
        'max-len': ['error', { code: 150 }],
        'object-curly-newline': ['warn', { multiline: true, consistent: true }],

        '@typescript-eslint/consistent-type-imports': ['warn', { fixStyle: 'inline-type-imports' }],
        '@typescript-eslint/no-shadow': 'error',

        'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
        'react/jsx-indent': ['warn', 4],
        'react/jsx-filename-extension': [2, { extensions: ['.jsx', '.tsx'] }],
        'react/no-unescaped-entities': 'off',
        'react/no-unstable-nested-components': ['error', { allowAsProps: true }],

        'jsx-a11y/no-static-element-interactions': 'off',

        'import/order': [
            'error',
            {
                'newlines-between': 'never',
                'groups': [
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    'sibling',
                    'index',
                ],
                'pathGroups': [
                    {
                        pattern: 'react',
                        group: 'builtin',
                        position: 'before',
                    },
                    {
                        pattern: 'next/**',
                        group: 'builtin',
                        position: 'before',
                    },
                    {
                        pattern: '@/app/**',
                        group: 'internal',
                        position: 'before',
                    },
                    {
                        pattern: '@/components/**',
                        group: 'internal',
                        position: 'before',
                    },
                    {
                        pattern: '@/utils/**',
                        group: 'internal',
                        position: 'before',
                    },
                    {
                        pattern: '@/types/**',
                        group: 'internal',
                        position: 'before',
                    },
                    {
                        pattern: './**',
                        group: 'sibling',
                        position: 'before',
                    },
                ],
                'pathGroupsExcludedImportTypes': ['react', 'next'],
            },
        ],
    },
}, {
    files: ['src/types/**/*.ts'],

    rules: {
        '@typescript-eslint/consistent-type-definitions': 'off',
    },
}]);
