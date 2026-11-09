import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        exclude: ['**/node_modules/**', '.next/**'],
        setupFiles: ['./vitest.setup.ts'],
    },
    resolve: {
        alias: {
            'server-only': new URL('./vitest.server-only-stub.ts', import.meta.url).pathname,
            '@': new URL('./src', import.meta.url).pathname,
        },
    },
});
