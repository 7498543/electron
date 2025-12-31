type StorageType = 'localStorage' | 'sessionStorage'

interface StorageManagerOptions {
  prefix?: string
  storageType?: StorageType
}

interface StorageItem<T> {
  expiry?: number
  value: T
}

class StorageManager {
  private prefix: string
  private storage: Storage

  constructor(options: StorageManagerOptions = {}) {
    const { prefix = '', storageType = 'localStorage' } = options
    this.prefix = prefix
    this.storage = storageType === 'localStorage' ? window.localStorage : window.sessionStorage
  }

  /**
   * 获取完整的存储键
   * @param key 原始键
   * @returns 带前缀的完整键
   */
  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  /**
   * 获取存储项
   * @param key 键
   * @param defaultValue 当项不存在或已过期时返回的默认值
   * @returns 值，如果项已过期或解析错误则返回默认值
   */
  getItem<T>(key: string, defaultValue: T | null = null): null | T {
    const fullKey = this.getKey(key)
    const item = this.storage.getItem(fullKey)
    if (!item) return defaultValue || null
    try {
      const parsedItem: StorageItem<T> = JSON.parse(item)
      if (parsedItem.expiry && Date.now() > parsedItem.expiry) {
        this.storage.removeItem(fullKey)
        return defaultValue
      }
      return parsedItem.value || defaultValue || null
    } catch (error) {
      console.error('Error parsing JSON:', error)
      return defaultValue || null
    }
  }

  /**
   * 设置存储项
   * @param key 键
   * @param value 值
   * @param ttl 存活时间（毫秒）
   */
  setItem<T>(key: string, value: T, ttl?: number): void {
    const fullKey = this.getKey(key)
    const item: StorageItem<T> = {
      expiry: ttl ? Date.now() + ttl : undefined,
      value
    }
    try {
      this.storage.setItem(fullKey, JSON.stringify(item))
    } catch (error) {
      console.error('Error setting item:', error)
    }
  }
  /**
   * 移除存储项
   * @param key 键
   */
  removeItem(key: string): void {
    const fullKey = this.getKey(key)
    this.storage.removeItem(fullKey)
  }

  /**
   * 清除所有过期的存储项
   */
  clearExpiredItems(): void {
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i)
      if (key && key.startsWith(this.prefix)) {
        const shortKey = key.replace(this.prefix, '')
        this.getItem(shortKey) // 调用 getItem 方法检查并移除过期项
      }
    }
  }
}

export { StorageManager }
