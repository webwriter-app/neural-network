import { defineConfig } from 'vite'
import { viteStaticCopy as copy } from 'vite-plugin-static-copy'
import react from '@vitejs/plugin-react'
import * as path from 'path'

export default defineConfig({
  plugins: [
    /* react({
      babel: {
        plugins: [
            ["@babel/plugin-proposal-decorators", {version: "2023-11"}],
        ],
    },
    }), */
    copy({
      targets: [
        {
          src: '../node_modules/@shoelace-style/shoelace/dist/assets',
          dest: 'shoelace',
        },
      ],
    }),
  ],
  root: 'src',
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
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
    },
  },
  esbuild: {
    target: "es2022",
    exclude: [],
  }
})
