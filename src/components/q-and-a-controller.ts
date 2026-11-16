import type { ReactiveController } from 'lit'
import { listen } from './listen'
import type { WebwriterNeuralNetwork } from '../widgets/webwriter-neural-network'
import type { QAndAEntry } from '../model/app-types'

import { AlertUtils } from '../model/alert-utils'

export class QAndAController implements ReactiveController {
  host: WebwriterNeuralNetwork

  constructor(host: WebwriterNeuralNetwork) {
    this.host = host
    host.addController(this)
  }

  // HOST LIFECYCLE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  private abort = new AbortController()

  hostConnected() {
    this.abort = new AbortController()
    // add event listeners for Q&A related events on host
    listen<QAndAEntry>(this.host.renderRoot, 'add-new-help-entry', (e) => this.addNewEntry(e.detail), this.abort.signal)
    listen<QAndAEntry>(this.host.renderRoot, 'update-help-entry', (e) => this.updateEntry(e.detail), this.abort.signal)
    listen<string>(this.host.renderRoot, 'remove-help-entry', (e) => this.removeEntry(e.detail), this.abort.signal)
  }


  hostDisconnected() {
    this.abort.abort()
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // adds a new Q&A entry if no entry with the same title exists - else spawns
  // an alert
  addNewEntry(entry: QAndAEntry) {
    if (
      !this.host.qAndA.some((qAndAEntry) => qAndAEntry.title == entry.title)
    ) {
      this.host.qAndA.push(entry)
      this.host.qAndA = [...this.host.qAndA]
    } else {
      AlertUtils.spawn({
        message: this.host.msg('The help entry could not be created. Another entry with the same name already exists!'),
        variant: 'danger',
        icon: 'x-circle',
      })
    }
  }

  // removes a Q&A entry by its name
  removeEntry(title: string) {
    const index = this.host.qAndA.findIndex((entry) => entry.title == title)
    this.host.qAndA.splice(index, 1)
    this.host.qAndA = [...this.host.qAndA]
  }

  // updates a Q&A entry by receiving a complete Q&A entry and replacing the
  // current Q&A entry with this title with it
  updateEntry(entry: QAndAEntry) {
    const index = this.host.qAndA.findIndex(
      (entry) => entry.title == entry.title
    )
    if (index != -1) {
      this.host.qAndA[index].description = entry.description
      this.host.qAndA = [...this.host.qAndA]
      AlertUtils.spawn({
        message: this.host.msg('Help entry updated successfully'),
        variant: 'success',
        icon: 'check-circle',
      })
    } else {
      AlertUtils.spawn({
        message: this.host.msg('Could not update Q&A entry! An entry with this title does not exist!'),
        variant: 'danger',
        icon: 'x-circle',
      })
    }
  }
}
