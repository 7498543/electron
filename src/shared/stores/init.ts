import { createPinia, Pinia } from 'pinia'
import { App } from 'vue'
import { createPersistedState } from 'pinia-plugin-persistedstate'

let pinia: Pinia | null = null

export interface InitStoreOptions {
  /**
   * 命名空间
   */
  namespace: string
}

/**
 * 初始化store
 * @param app vue应用实例
 * @param options 初始化选项
 * @returns pinia实例
 */
export function initStores(app: App, options: InitStoreOptions): Pinia {
  pinia = createPinia()
  const { namespace } = options || {}
  pinia.use(
    createPersistedState({
      key: storeKey => `${namespace}-${storeKey}`,
      storage: localStorage
    })
  )
  app.use(pinia)
  return pinia
}

/**
 * 重置所有store
 */
export function resetAllStore(): void {
  if (!pinia) {
    console.error('Pinia is not installed')
    return
  }
  // 使用更具体的类型断言替代any
  const allStores = (pinia as any)._s
  for (const [, store] of allStores) {
    store?.$reset()
  }
}
