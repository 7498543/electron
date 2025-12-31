import { createApp } from 'vue'
import App from './App.vue'
import { initStores } from '@stores/index'

async function bootstrap() {
  const app = createApp(App)

  await initStores(app, { namespace: 'learn-el' })

  app.mount('#app')

  return app
}

bootstrap()
