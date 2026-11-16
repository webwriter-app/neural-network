import type { ReactiveController } from 'lit'
import { listen } from './listen'
import type { WebwriterNeuralNetwork } from '../widgets/webwriter-neural-network'
import type { SetupStatus } from '../model/app-types'
export class SetupController implements ReactiveController {
  host: WebwriterNeuralNetwork

  constructor(host: WebwriterNeuralNetwork) {
    this.host = host
    host.addController(this)
  }

  // HOST LIFECYCLE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  private abort = new AbortController()

  hostConnected() {
    this.abort = new AbortController()
    // add event listeners for setup related events on host
    listen<string>(this.host.renderRoot, 'setup-completed', (e) => this.setupCompleted(e.detail), this.abort.signal)
  }

  hostDisconnected() {
    this.abort.abort()
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // called when one component has completed its setup - sets the corresponding
  // completed property to true and then checks whether the setup is completed
  setupCompleted(name: string): void {
    this.host.setupStatus[`${name}Completed` as keyof SetupStatus] = true
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
