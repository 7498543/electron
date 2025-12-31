import { createApp } from 'vue'
import App from './App.vue'
import { initStores } from '@stores/index'

async function bootstrap(): Promise<void> {
  const app = createApp(App)

  await initStores(app, { namespace: 'learn-el' })

  app.mount('#app')
}

bootstrap()
