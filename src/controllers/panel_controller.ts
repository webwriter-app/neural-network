import type { ReactiveController } from 'lit'
import type { WwDeepLearning } from '@/app'

export class PanelController implements ReactiveController {
  host: WwDeepLearning

  constructor(host: WwDeepLearning) {
    this.host = host
    host.addController(this)
  }

  // HOST LIFECYCLE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  hostConnected() {
    // add event listeners for panel related events on host
    this.host.renderRoot.addEventListener(
      'open-panel',
      (e: CustomEvent<string>) => this.openPanel(e.detail)
    )

    // add event listeners for panel related events on window (because these
    // events may also be fired by elements that are not in the DOM anymore when
    // firing)
    window.addEventListener('close-panel', (e: CustomEvent<string>) =>
      this.closePanel(e.detail)
    )
    window.addEventListener('close-all-panels', (_e: Event) =>
      this.closeAllPanels()
    )
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // open a panel
  openPanel(panel: string): void {
    this.host.panel = panel
  }

  // close a panel if it is currently open
  closePanel(panel: string): void {
    if (this.host.panel == panel) {
      this.host.panel = undefined
    }
  }

  // close the current panel independent of which is currently open
  closeAllPanels(): void {
    this.host.panel = undefined
  }
}
