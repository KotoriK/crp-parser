import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
export default defineConfig({
    plugins: [dts({ rollupTypes: true })],
    build: {
        sourcemap: true,
        target: 'esnext',
        lib: {
            entry: 'src/index.ts',
            fileName: 'index',
            formats: ['es'],
        }
    },
})