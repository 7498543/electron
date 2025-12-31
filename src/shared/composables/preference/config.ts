import type { Preferences } from './types'

const defaultPreferences: Preferences = {
  app: {
    name: '',
    layout: 'vertical',
    locale: 'zh-CN',
    watermark: true
  },
  theme: {
    colorDestructive: '#FF4D4F',
    colorPrimary: '#1890FF',
    colorSuccess: '#52C41A',
    colorWarning: '#FAAD14',
    radius: '4px'
  },
  copyright: {
    companyName: '',
    icp: '',
    icpLink: '',
    companySiteLink: '',
    date: '',
    enable: false
  },
  widget: {
    fullscreen: true,
    globalSearch: true,
    languageToggle: true,
    lockScreen: true,
    notification: true,
    refresh: true,
    sidebarToggle: true,
    themeToggle: true
  }
}

export { defaultPreferences }
