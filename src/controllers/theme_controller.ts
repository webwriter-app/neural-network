import type { ReactiveController } from 'lit'
import type { NeuralNetwork } from '@/app'
import type { Theme } from '@/types/theme'
import { ThemeUtils } from '@/utils/theme_utils'

export class ThemeController implements ReactiveController {
  host: NeuralNetwork

  constructor(host: NeuralNetwork) {
    this.host = host
    host.addController(this)
  }

  // HOST LIFECYCLE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  hostConnected() {
    // add event listeners for setup related events on host
    this.host.renderRoot.addEventListener(
      'set-theme',
      (e: CustomEvent<Theme>) => this.setTheme(e.detail)
    )

    // set the default theme based on the user's preffered color scheme (if
    // supported)
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      this.setTheme(ThemeUtils.darkTheme)
    } else {
      this.setTheme(ThemeUtils.lightTheme)
    }
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // set the theme
  setTheme(theme: Theme): void {
    // update the context
    this.host.theme = { ...theme }

    // in case of dark theme add the corresponding option
    if (theme == ThemeUtils.darkTheme) {
      document.documentElement.classList.add('sl-theme-dark')
      this.host.classList.add('sl-theme-dark')
    }
    // else remove the class
    else {
      document.documentElement.classList.remove('sl-theme-dark')
      this.host.classList.remove('sl-theme-dark')
    }

    this.host.requestUpdate()
  }
}
