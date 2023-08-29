import type { ReactiveController } from 'lit'
import type { WwDeepLearning } from '@/app'

export class SetupController implements ReactiveController {
  host: WwDeepLearning

  constructor(host: WwDeepLearning) {
    this.host = host
    host.addController(this)
  }

  hostConnected() {
    this.host.renderRoot.addEventListener(
      'setup-completed',
      (e: CustomEvent<string>) => this.setupCompleted(e.detail)
    )
  }

  hostDisconnected() {}

  setupCompleted(name: string): void {
    this.host.setupStatus[`${name}Completed`] = true
    this.host.setupStatus = {
      ...this.host.setupStatus,
    }
    this.checkLoading()
  }

  checkLoading(): void {
    if (!Object.values(this.host.setupStatus).some((value) => value == false)) {
      this.host.setupStatus.loading = false
      this.host.setupStatus = {
        ...this.host.setupStatus,
      }
    }
  }
}
