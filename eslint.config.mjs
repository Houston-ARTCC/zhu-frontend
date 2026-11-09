import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import nextVitals from 'eslint-config-next/core-web-vitals';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import ts from 'typescript-eslint';

export default defineConfig([{
    extends: [
        js.configs.recommended,
        // Next's config registers these plugins and overrides some of their rules, so it comes after.
        { rules: importPlugin.flatConfigs.recommended.rules },
        { rules: jsxA11y.flatConfigs.recommended.rules },
        ...nextVitals,
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

        // Mount checks for browser-only rendering and route-change resets set state in effects on purpose.
        'react-hooks/set-state-in-effect': 'off',

        // TypeScript already checks default imports, and this rule misreads mapbox-gl's bundled types.
        'import/default': 'off',
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
