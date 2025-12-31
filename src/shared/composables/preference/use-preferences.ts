import { computed } from 'vue'
import { preferencesManager } from './preferences'

function usePreferences(): Record<string, any> {
  const preferences = preferencesManager.getPreferences()

  const appPreferences = computed(() => preferences.app)

  return {}
}

export { usePreferences }
