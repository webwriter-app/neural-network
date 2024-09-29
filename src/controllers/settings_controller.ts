import type { ReactiveController } from 'lit'
import type { NeuralNetwork } from '@/app'

import type { Settings } from '@/types/settings'

export class SettingsController implements ReactiveController {
  host: NeuralNetwork

  constructor(host: NeuralNetwork) {
    this.host = host
    host.addController(this)
  }

  // HOST LIFECYCLE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  hostConnected() {
    // add event listeners for settings related events on host
    this.host.renderRoot.addEventListener(
      'set-settings',
      (e: CustomEvent<Settings>) => this.setSettings(e.detail)
    )

    // add event listeners for settings related events on window (because these
    // events may also be fired by elements that are not in the DOM anymore when
    // firing)
    window.addEventListener(
      'set-setting',
      (
        e: CustomEvent<{
          name: string
          value: boolean
        }>
      ) => this.setSetting(e.detail.name, e.detail.value)
    )
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // sets the value of a setting
  setSetting(name: string, value: boolean) {
    if (Object.hasOwn(this.host.settings, name)) {
      this.host.settings[name] = value
      this.host.settings = {
        ...this.host.settings,
      }
    }
  }

  // overwrites the whole settings
  setSettings(settings: Settings) {
    this.host.settings = { ...settings }
  }
}
