import type { ReactiveController } from 'lit'
import type { NeuralNetwork } from '@/app'

export class SetupController implements ReactiveController {
  host: NeuralNetwork

  constructor(host: NeuralNetwork) {
    this.host = host
    host.addController(this)
  }

  // HOST LIFECYCLE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  hostConnected() {
    // add event listeners for setup related events on host
    this.host.renderRoot.addEventListener(
      'setup-completed',
      (e: CustomEvent<string>) => this.setupCompleted(e.detail)
    )
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // called when one component has completed its setup - sets the corresponding
  // completed property to true and then checks whether the setup is completed
  setupCompleted(name: string): void {
    this.host.setupStatus[`${name}Completed`] = true
    this.host.setupStatus = {
      ...this.host.setupStatus,
    }
    this.checkLoading()
  }

  // check whether the setup is completed by checking if all completed
  // properties are true. In this case, set 'loading' to false. Used by the app
  // element to determine whether to display a loading screen or the app
  checkLoading(): void {
    if (!Object.values(this.host.setupStatus).some((value) => value == false)) {
      this.host.setupStatus.loading = false
      this.host.setupStatus = {
        ...this.host.setupStatus,
      }
    }
  }
}
