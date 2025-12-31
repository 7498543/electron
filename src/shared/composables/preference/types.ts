import { DeepPartial } from '@shared/types/helper'

type SupportedLanguagesType = 'en-US' | 'zh-CN'

type LayoutType = 'vertical' | 'horizontal'

interface AppPreferences {
  /** 应用名 */
  name: string
  /** 布局方式 */
  layout: LayoutType
  /** 支持的语言 */
  locale: SupportedLanguagesType
  /** 是否开启水印 */
  watermark: boolean
}

interface ThemePreferences {
  /** 错误色 */
  colorDestructive: string
  /** 主题色 */
  colorPrimary: string
  /** 成功色 */
  colorSuccess: string
  /** 警告色 */
  colorWarning: string
  /** 圆角 */
  radius: string
}
interface WidgetPreferences {
  /** 是否启用全屏部件 */
  fullscreen: boolean
  /** 是否启用全局搜索部件 */
  globalSearch: boolean
  /** 是否启用语言切换部件 */
  languageToggle: boolean
  /** 是否开启锁屏功能 */
  lockScreen: boolean
  /** 是否显示通知部件 */
  notification: boolean
  /** 显示刷新按钮 */
  refresh: boolean
  /** 是否显示侧边栏显示/隐藏部件 */
  sidebarToggle: boolean
  /** 是否显示主题切换部件 */
  themeToggle: boolean
}

interface CopyrightPreferences {
  /** 版权公司名 */
  companyName: string
  /** 版权公司名链接 */
  companySiteLink: string
  /** 版权日期 */
  date: string
  /** 版权是否可见 */
  enable: boolean
  /** 备案号 */
  icp: string
  /** 备案号链接 */
  icpLink: string
  /** 设置面板是否显示*/
  settingShow?: boolean
}

interface Preferences {
  /** 全局配置 */
  app: AppPreferences
  /** 主题配置 */
  theme: ThemePreferences
  /** 版权配置 */
  copyright: CopyrightPreferences
  /** 功能配置 */
  widget: WidgetPreferences
}

type PreferencesKeys = keyof Preferences

interface InitialOptions {
  namespace: string
  overrides?: DeepPartial<Preferences>
}

export type { Preferences, CopyrightPreferences, PreferencesKeys, WidgetPreferences, AppPreferences, InitialOptions }
