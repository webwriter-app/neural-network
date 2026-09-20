import { defineConfig } from 'vite'
import { viteStaticCopy as copy } from 'vite-plugin-static-copy'
import * as path from 'path'

export default defineConfig({
  plugins: [
    copy({
      targets: [
        {
          src: '../node_modules/@shoelace-style/shoelace/dist/assets',
          dest: 'shoelace',
          rename: { stripBase: 4 },
        },
        { 
          src: './assets',
          dest: ''
        }
      ],
    }),
  ],
  root: 'src',
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(import.meta.dirname, 'src') }],
  },
  build: {
    outDir: '../dist',
    target: "es2022",
    emptyOutDir: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: './app.ts',
      name: 'App',
      // the proper extensions will be added
      fileName: 'app',
      cssFileName: 'style',
    },
  },
  esbuild: {
    target: "es2022",
    exclude: [],
  },
  define: {
    'process.env': {}
  }
})
