import { preferencesManager } from './preferences'

function usePreferences() {
  const preferences = preferencesManager.getPreferences()

  return {
    preferences
  }
}

export { usePreferences }
