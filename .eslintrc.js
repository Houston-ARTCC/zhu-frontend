module.exports = {
    root: true,
    extends: [
        'airbnb',
        'next/core-web-vitals',
        'plugin:@typescript-eslint/recommended',
        'plugin:tailwindcss/recommended',
    ],
    plugins: ['@typescript-eslint', 'tailwindcss'],
    rules: {
        'semi': 'warn',
        'indent': ['warn', 4, { SwitchCase: 1 }],
        'comma-dangle': ['warn', 'always-multiline'],
        'quote-props': ['warn', 'consistent-as-needed'],
        'max-len': ['error', { code: 150 }],
        'default-case': 'off',
        'object-curly-newline': ['warn', { multiline: true }],

        '@typescript-eslint/consistent-type-imports': ['warn', { fixStyle: 'inline-type-imports' }],

        'react/jsx-indent': ['warn', 4],
        'react/jsx-indent-props': 'off',
        'react/jsx-filename-extension': [2, { extensions: ['.jsx', '.tsx'] }],
        'react/jsx-one-expression-per-line': 'off',
        'react/require-default-props': 'off',
        'react/no-unescaped-entities': 'off',
        'react/no-array-index-key': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/function-component-definition': [
            'error',
            { namedComponents: 'arrow-function' },
        ],

        'jsx-a11y/no-static-element-interactions': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',

        'import/extensions': 'off',
        'import/prefer-default-export': 'off',
        'import/order': [
            'error',
            {
                'newlines-between': 'never',
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
                        group: 'sibling',
                        position: 'before',
                    },
                    {
                        pattern: '@/components/**',
                        group: 'sibling',
                        position: 'before',
                    },
                    {
                        pattern: '@/utils/**',
                        group: 'sibling',
                        position: 'before',
                    },
                    {
                        pattern: '@/types/**',
                        group: 'sibling',
                        position: 'before',
                    },
                ],
                'pathGroupsExcludedImportTypes': ['react', 'next'],
            },
        ],
    },
};
