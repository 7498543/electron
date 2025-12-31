import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// 自定义API接口
export interface MainWindowAPI {
  sendMessage: (channel: string, ...args: unknown[]) => void
  onMessage: (channel: string, callback: (...args: unknown[]) => void) => () => void
  invoke: <T = unknown>(channel: string, ...args: unknown[]) => Promise<T>
}

// 将Electron API安全地暴露给渲染进程
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('mainWindowAPI', {
      sendMessage: (channel: string, ...args: unknown[]) => ipcRenderer.send(channel, ...args),
      onMessage: (channel: string, callback: (...args: unknown[]) => void) => {
        ipcRenderer.on(channel, (_event, ...args) => callback(...args))
        return () => ipcRenderer.removeAllListeners(channel)
      },
      invoke: <T = unknown>(channel: string, ...args: unknown[]) => ipcRenderer.invoke(channel, ...args) as Promise<T>
    })
  } catch (error) {
    console.error(error)
  }
}
