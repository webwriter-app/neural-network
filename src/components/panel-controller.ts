import type { ReactiveController } from 'lit'
import { listen } from './listen'
import type { WebwriterNeuralNetwork } from '../widgets/webwriter-neural-network'

export class PanelController implements ReactiveController {
  host: WebwriterNeuralNetwork

  constructor(host: WebwriterNeuralNetwork) {
    this.host = host
    host.addController(this)
  }

  // HOST LIFECYCLE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  private abort = new AbortController()

  hostConnected() {
    this.abort = new AbortController()
    // add event listeners for panel related events on host
    listen<string>(this.host.renderRoot, 'open-panel', (e) => this.openPanel(e.detail), this.abort.signal)

    // add event listeners for panel related events on window (because these
    // events may also be fired by elements that are not in the DOM anymore when
    // firing)
    listen<string>(window, 'close-panel', (e) =>
      this.closePanel(e.detail), this.abort.signal)
    listen(window, 'close-all-panels', () =>
      this.closeAllPanels(), this.abort.signal)
  }

  hostDisconnected() {
    this.abort.abort()
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
