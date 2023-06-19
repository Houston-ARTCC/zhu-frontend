module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'tailwindcss'],
    extends: [
        'airbnb',
        'next/core-web-vitals',
        'plugin:@typescript-eslint/recommended',
        'plugin:tailwindcss/recommended',
    ],
    rules: {
        'semi': 'warn',
        'indent': ['warn', 4, { SwitchCase: 1 }],
        'comma-dangle': ['warn', 'always-multiline'],
        'quote-props': ['warn', 'consistent-as-needed'],
        'max-len': ['error', { code: 150 }],
        'default-case': 'off',
        'object-curly-newline': ['warn', { multiline: true, consistent: true }],
        'no-shadow': 'off',

        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/consistent-type-imports': ['warn', { fixStyle: 'inline-type-imports' }],

        'react/jsx-indent': ['warn', 4],
        'react/jsx-indent-props': 'off',
        'react/jsx-filename-extension': [2, { extensions: ['.jsx', '.tsx'] }],
        'react/jsx-one-expression-per-line': 'off',
        'react/require-default-props': 'off',
        'react/no-unescaped-entities': 'off',
        'react/no-array-index-key': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
        'react/no-unstable-nested-components': ['error', { allowAsProps: true }],

        'jsx-a11y/no-static-element-interactions': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',

        'import/extensions': 'off',
        'import/prefer-default-export': 'off',
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
};
