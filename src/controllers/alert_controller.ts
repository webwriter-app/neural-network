import type { ReactiveController } from 'lit'
import type { WwDeepLearning } from '@/app'
import type { SlAlert } from '@shoelace-style/shoelace'

// This component is work in progress and currently does not work and is not
// used!
export class AlertController implements ReactiveController {
  host: WwDeepLearning
  alertsStack: HTMLDivElement

  constructor(host: WwDeepLearning) {
    this.host = host
    host.addController(this)
    host.addController(this)
  }

  // HOST LIFECYCLE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  hostConnected() {
    // add event listeners for panel related events on host
    this.host.renderRoot.addEventListener(
      'spawn-alert',
      (e: CustomEvent<SlAlert>) => this.spawnAlert(e.detail)
    )
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // spawn the alert
  spawnAlert(alert: SlAlert) {
    return new Promise<void>((resolve) => {
      this.host._alertStack.appendChild(this)

      // Wait for the toast stack to render
      requestAnimationFrame(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- force a reflow for the initial transition
        this.host.clientWidth
        this.show()
      })

      this.addEventListener(
        'sl-after-hide',
        () => {
          toastStack.removeChild(this)
          resolve()

          // Remove the toast stack from the DOM when there are no more alerts
          if (toastStack.querySelector('sl-alert') === null) {
            toastStack.remove()
          }
        },
        { once: true }
      )
    })
  }
}
