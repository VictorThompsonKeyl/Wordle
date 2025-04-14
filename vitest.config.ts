import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'jsdom', // Active jsdom pour les tests qui manipulent le DOM
        coverage: {
            reporter: ['text', 'json', 'html'],
        },
    },
})