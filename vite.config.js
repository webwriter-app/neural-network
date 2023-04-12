import { defineConfig } from "vite"
import { viteStaticCopy as copy } from 'vite-plugin-static-copy';
import * as path from 'path'

export default defineConfig({
    plugins: [
        copy({
            targets: [
              {
                src: '../node_modules/@shoelace-style/shoelace/dist/assets',
                dest: 'shoelace'
              }
            ]
        })
    ],
    root: 'src',
    resolve: {
        alias: [
            {find: '@', replacement: path.resolve(__dirname, 'src')},
        ]
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true
    }
})