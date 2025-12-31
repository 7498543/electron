import { Tray, Menu, BrowserWindow, nativeImage, app } from 'electron'
import { join } from 'path'

const iconPath = join(__dirname, '../assets/icons/tray-icon.png')

export function createTray(mainWindow: BrowserWindow): Tray {
  let trayIcon = nativeImage.createFromPath(iconPath)

  // 适配不同分辨率
  if (process.platform === 'darwin') {
    trayIcon = trayIcon.resize({ width: 22, height: 22 })
  } else {
    trayIcon = trayIcon.resize({ width: 16, height: 16 })
  }

  const tray = new Tray(trayIcon)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主窗口',
      click: () => {
        if (mainWindow.isVisible()) {
          mainWindow.focus()
        } else {
          mainWindow.show()
        }
      }
    },

    { type: 'separator' },
    {
      label: '最小化到托盘',
      click: () => {
        mainWindow.hide()
      }
    },
    {
      label: '始终置顶',
      type: 'checkbox',
      checked: mainWindow.isAlwaysOnTop(),
      click: menuItem => {
        mainWindow.setAlwaysOnTop(menuItem.checked)
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit()
      }
    }
  ])

  tray.setContextMenu(contextMenu)

  // 托盘点击事件
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })

  // 双击显示/隐藏
  tray.on('double-click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.minimize()
      mainWindow.hide()
    } else {
      mainWindow.show()
      mainWindow.focus()
    }
  })

  return tray
}
