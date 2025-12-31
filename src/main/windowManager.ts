import { BrowserWindow, BrowserWindowConstructorOptions, screen } from 'electron'
import path from 'path'
import Store from 'electron-store'
import { v4 as uuidv4 } from 'uuid'

const isDev = process.env.NODE_ENV === 'development'

const store = new Store({
  defaults: { windows: [] }
})

// 窗口配置类型
export interface WindowConfig {
  id?: string
  name: string
  width?: number
  height?: number
  x?: number
  y?: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  resizable?: boolean
  movable?: boolean
  minimizable?: boolean
  maximizable?: boolean
  closable?: boolean
  fullscreen?: boolean
  fullscreenable?: boolean
  alwaysOnTop?: boolean
  title?: string
  icon?: string
  show?: boolean
  autoHideMenuBar?: boolean
  webPreferences?: BrowserWindowConstructorOptions['webPreferences']
}

// 窗口状态类型
export interface WindowState {
  id: string
  name: string
  width: number
  height: number
  x: number
  y: number
  isMaximized: boolean
  isMinimized: boolean
  isFullscreen: boolean
  alwaysOnTop: boolean
}

class WindowManager {
  private windows: Map<string, BrowserWindow> = new Map()
  private defaultConfig: WindowConfig = {
    name: 'mainWindow',
    width: 900,
    height: 670,
    minWidth: 800,
    minHeight: 600,
    resizable: true,
    movable: true,
    minimizable: true,
    maximizable: true,
    closable: true,
    fullscreenable: true,
    alwaysOnTop: false
  }

  /**
   * 创建新窗口
   * @param config 窗口配置
   * @returns BrowserWindow实例
   */
  createWindow(config: WindowConfig): BrowserWindow {
    const id = config.id || uuidv4()
    const finalConfig = { ...this.defaultConfig, ...config }

    // 尝试恢复窗口状态
    const savedState = this.getSavedWindowState(id)
    if (savedState) {
      finalConfig.width = savedState.width
      finalConfig.height = savedState.height
      finalConfig.x = savedState.x
      finalConfig.y = savedState.y
      finalConfig.alwaysOnTop = savedState.alwaysOnTop
    }

    // 确保窗口在屏幕范围内
    this.ensureWindowInBounds(finalConfig)

    // 设置webPreferences默认值
    finalConfig.webPreferences = {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      ...finalConfig.webPreferences
    }

    const window = new BrowserWindow(finalConfig)
    this.windows.set(id, window)

    // 监听窗口事件，保存窗口状态
    this.setupWindowEventListeners(id, window)

    // 加载页面
    this.loadPage(window)

    return window
  }

  /**
   * 获取窗口
   * @param id 窗口ID
   * @returns BrowserWindow实例或undefined
   */
  getWindow(id: string): BrowserWindow | undefined {
    return this.windows.get(id)
  }

  /**
   * 获取所有窗口
   * @returns BrowserWindow实例数组
   */
  getAllWindows(): BrowserWindow[] {
    return Array.from(this.windows.values())
  }

  /**
   * 根据名称获取窗口
   * @param name 窗口名称
   * @returns BrowserWindow实例或undefined
   */
  getWindowByName(name: string): BrowserWindow | undefined {
    return Array.from(this.windows.values()).find(window => {
      return window['name'] === name
    })
  }

  /**
   * 关闭窗口
   * @param id 窗口ID
   */
  closeWindow(id: string): void {
    const window = this.windows.get(id)
    if (window) {
      window.close()
      this.windows.delete(id)
    }
  }

  /**
   * 关闭所有窗口
   */
  closeAllWindows(): void {
    this.windows.forEach((window, id) => {
      window.close()
      this.windows.delete(id)
    })
  }

  /**
   * 显示窗口
   * @param id 窗口ID
   */
  showWindow(id: string): void {
    const window = this.windows.get(id)
    if (window) {
      window.show()
    }
  }

  /**
   * 隐藏窗口
   * @param id 窗口ID
   */
  hideWindow(id: string): void {
    const window = this.windows.get(id)
    if (window) {
      window.hide()
    }
  }

  /**
   * 最大化窗口
   * @param id 窗口ID
   */
  maximizeWindow(id: string): void {
    const window = this.windows.get(id)
    if (window) {
      window.maximize()
    }
  }

  /**
   * 最小化窗口
   * @param id 窗口ID
   */
  minimizeWindow(id: string): void {
    const window = this.windows.get(id)
    if (window) {
      window.minimize()
    }
  }

  /**
   * 恢复窗口
   * @param id 窗口ID
   */
  restoreWindow(id: string): void {
    const window = this.windows.get(id)
    if (window) {
      window.restore()
    }
  }

  /**
   * 保存窗口状态
   * @param id 窗口ID
   * @param window BrowserWindow实例
   */
  private saveWindowState(id: string, window: BrowserWindow): void {
    if (window.isDestroyed()) return

    const bounds = window.getBounds()
    const state: WindowState = {
      id,
      name: window['name'] || 'unknown',
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
      isMaximized: window.isMaximized(),
      isMinimized: window.isMinimized(),
      isFullscreen: window.isFullScreen(),
      alwaysOnTop: window.isAlwaysOnTop()
    }

    const windows = store.get('windows', []) as WindowState[]
    const index = windows.findIndex(w => w.id === id)

    if (index !== -1) {
      windows[index] = state
    } else {
      windows.push(state)
    }

    store.set('windows', windows)
  }

  /**
   * 获取保存的窗口状态
   * @param id 窗口ID
   * @returns WindowState或undefined
   */
  private getSavedWindowState(id: string): WindowState | undefined {
    const windows = store.get('windows', []) as WindowState[]
    return windows.find(w => w.id === id)
  }

  /**
   * 确保窗口在屏幕范围内
   * @param config 窗口配置
   */
  private ensureWindowInBounds(config: WindowConfig): void {
    const displays = screen.getAllDisplays()
    let displayFound = false

    // 检查窗口是否在任何显示范围内
    for (const display of displays) {
      if (config.x !== undefined && config.y !== undefined) {
        if (
          config.x >= display.bounds.x &&
          config.x <= display.bounds.x + display.bounds.width &&
          config.y >= display.bounds.y &&
          config.y <= display.bounds.y + display.bounds.height
        ) {
          displayFound = true
          break
        }
      }
    }

    // 如果窗口不在任何显示范围内，将其居中
    if (!displayFound) {
      const primaryDisplay = screen.getPrimaryDisplay()
      config.x = Math.floor((primaryDisplay.bounds.width - (config.width || 900)) / 2)
      config.y = Math.floor((primaryDisplay.bounds.height - (config.height || 670)) / 2)
    }
  }

  /**
   * 为窗口设置事件监听器
   * @param id 窗口ID
   * @param window BrowserWindow实例
   */
  private setupWindowEventListeners(id: string, window: BrowserWindow): void {
    // 窗口移动时保存状态
    window.on('move', () => {
      this.saveWindowState(id, window)
    })

    // 窗口大小改变时保存状态
    window.on('resize', () => {
      this.saveWindowState(id, window)
    })

    // 窗口关闭前保存状态
    window.on('close', () => {
      this.saveWindowState(id, window)
    })

    // 窗口关闭时从map中移除
    window.on('closed', () => {
      this.windows.delete(id)
    })

    // 窗口总是置顶状态改变时保存
    window.on('always-on-top-changed', () => {
      this.saveWindowState(id, window)
    })
  }

  /**
   * 加载页面
   * @param window BrowserWindow实例
   */
  private loadPage(window: BrowserWindow): void {
    // 根据窗口名称加载不同的页面
    if (isDev && process.env['ELECTRON_RENDERER_URL']) {
      window.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      window.loadFile(path.join(__dirname, '../renderer/index.html'))
    }
  }
}

export const windowManager = new WindowManager()
