import type { ReactiveController } from 'lit'
import { listen } from './listen'
import type { WebwriterNeuralNetwork } from '../widgets/webwriter-neural-network'

import type { Settings } from '../model/app-types'

export class SettingsController implements ReactiveController {
  host: WebwriterNeuralNetwork

  constructor(host: WebwriterNeuralNetwork) {
    this.host = host
    host.addController(this)
  }

  // HOST LIFECYCLE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  private abort = new AbortController()

  hostConnected() {
    this.abort = new AbortController()
    // add event listeners for settings related events on host
    listen<Settings>(this.host.renderRoot, 'set-settings', (e) => this.setSettings(e.detail), this.abort.signal)

    // add event listeners for settings related events on window (because these
    // events may also be fired by elements that are not in the DOM anymore when
    // firing)
    listen<{ name: string; value: boolean }>(window, 'set-setting', (e) => this.setSetting(e.detail.name, e.detail.value), this.abort.signal)
  }

  hostDisconnected() {
    this.abort.abort()
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // sets the value of a setting
  setSetting(name: string, value: boolean) {
    if (Object.hasOwn(this.host.settings, name)) {
      this.host.settings[name as keyof Settings] = value
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
