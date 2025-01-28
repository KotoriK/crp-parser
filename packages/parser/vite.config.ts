import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import paths from 'vite-tsconfig-paths'
export default defineConfig({
    plugins: [dts({ rollupTypes: true }), paths()],
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