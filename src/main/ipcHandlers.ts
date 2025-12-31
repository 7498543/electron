import { ipcMain, BrowserWindow } from 'electron'
import { windowManager } from './windowManager'

export function registerIPCHandlers(): void {
  // 窗口控制IPC
  ipcMain.handle('window:minimize', event => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      window.minimize()
      return true
    }
    return false
  })

  ipcMain.handle('window:maximize', event => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      if (window.isMaximized()) {
        window.unmaximize()
        return { maximized: false }
      } else {
        window.maximize()
        return { maximized: true }
      }
    }
    return { maximized: false }
  })

  ipcMain.handle('window:close', event => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      window.close()
      return true
    }
    return false
  })

  ipcMain.handle('window:toggleAlwaysOnTop', event => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      const alwaysOnTop = window.isAlwaysOnTop()
      window.setAlwaysOnTop(!alwaysOnTop)
      return { alwaysOnTop: !alwaysOnTop }
    }
    return { alwaysOnTop: false }
  })

  ipcMain.handle('window:getBounds', event => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      return window.getBounds()
    }
    return null
  })

  // 系统信息IPC
  ipcMain.handle('system:getOS', () => {
    return process.platform
  })

  ipcMain.handle('system:getVersion', () => {
    return process.version
  })

  ipcMain.handle('system:getAppVersion', () => {
    return process.env.npm_package_version || '1.0.0'
  })

  // 窗口管理器IPC（全局窗口控制）
  ipcMain.handle('windowManager:getAllWindows', () => {
    const windows = windowManager.getAllWindows()
    return windows.map(window => ({
      id: window.id,
      isVisible: window.isVisible(),
      isFocused: window.isFocused(),
      isMaximized: window.isMaximized(),
      isMinimized: window.isMinimized(),
      isAlwaysOnTop: window.isAlwaysOnTop()
    }))
  })

  ipcMain.handle('windowManager:showWindow', (_, windowId) => {
    windowManager.showWindow(windowId)
    return true
  })

  ipcMain.handle('windowManager:hideWindow', (_, windowId) => {
    windowManager.hideWindow(windowId)
    return true
  })

  ipcMain.handle('windowManager:closeWindow', (_, windowId) => {
    windowManager.closeWindow(windowId)
    return true
  })
}
