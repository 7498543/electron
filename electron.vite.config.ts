import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

const alias = {
  '@shared': resolve('src/shared'),
  '@stores': resolve('src/shared/stores'),
  '@utils': resolve('src/shared/utils'),
  '@constants': resolve('src/shared/constants')
}

export default defineConfig({
  main: {
    resolve: {
      alias: alias
    },
    build: {
      outDir: 'out/main',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/index.ts')
        }
      }
    }
  },
  preload: {
    resolve: {
      alias: alias
    },
    build: {
      outDir: 'out/preload',
      rollupOptions: {
        input: {
          mainWindow: resolve(__dirname, 'src/preload/src/index.ts')
        }
      }
    }
  },
  renderer: {
    resolve: {
      alias: alias
    },
    build: {
      outDir: 'out/renderer',
      rollupOptions: {
        input: {
          mainWindow: resolve(__dirname, 'src/renderer/src/index.vue')
        }
      }
    },
    plugins: [vue()]
  }
})
