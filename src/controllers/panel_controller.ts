import type { ReactiveController } from 'lit'
import type { WwDeepLearning } from '@/app'

export class PanelController implements ReactiveController {
  host: WwDeepLearning

  constructor(host: WwDeepLearning) {
    this.host = host
    host.addController(this)
  }

  hostConnected() {
    this.host.renderRoot.addEventListener(
      'open-panel',
      (e: CustomEvent<string>) => this.openPanel(e.detail)
    )
    window.addEventListener('close-panel', (e: CustomEvent<string>) =>
      this.closePanel(e.detail)
    )
    window.addEventListener('close-all-panels', (_e: Event) =>
      this.closeAllPanels()
    )
  }

  hostDisconnected() {}

  openPanel(panel: string): void {
    this.host.panel = panel
  }

  closePanel(panel: string): void {
    if (this.host.panel == panel) {
      this.host.panel = undefined
    }
  }

  closeAllPanels(): void {
    this.host.panel = undefined
  }
}
