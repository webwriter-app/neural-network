import type { ReactiveController } from 'lit'
import type { WwDeepLearning } from '@/app'

import type { Settings } from '@/types/settings'

export class SettingsController implements ReactiveController {
  host: WwDeepLearning

  constructor(host: WwDeepLearning) {
    this.host = host
    host.addController(this)
  }

  hostConnected() {
    window.addEventListener(
      'set-setting',
      (
        e: CustomEvent<{
          name: string
          value: boolean
        }>
      ) => this.setSetting(e.detail.name, e.detail.value)
    )
    this.host.renderRoot.addEventListener(
      'set-settings',
      (e: CustomEvent<Settings>) => this.setSettings(e.detail)
    )
  }

  hostDisconnected() {}

  setSetting(name: string, value: boolean) {
    if (Object.hasOwn(this.host.settings, name)) {
      this.host.settings[name] = value
      this.host.settings = {
        ...this.host.settings,
      }
    }
  }

  setSettings(settings: Settings) {
    this.host.settings = { ...settings }
  }
}
