import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { createTray } from './trayManager'
import { registerIPCHandlers } from './ipcHandlers'
import { windowManager } from './windowManager'

import { electronApp, optimizer, is } from '@electron-toolkit/utils'

// 防止多实例
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
}

function createWindow(): void {
  // 使用WindowManager创建主窗口
  const mainWindow = windowManager.createWindow({
    name: 'mainWindow',
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/mainWindow/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  })

  // 创建系统托盘
  createTray(mainWindow)

  // 注册IPC处理器
  registerIPCHandlers()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  // 在开发模式下安装Vue DevTools
  if (is.dev) {
    import('electron-devtools-installer').then(({ default: installExtension }) => {
      // 手动指定Vue DevTools的ID
      installExtension('nhdogjmejiglipccpnnnanhbledajbpd')
        .then(name => console.log(`Added Extension:  ${name}`))
        .catch(error => console.log('An error occurred when installing Vue DevTools: ', error))
    })
  }

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
