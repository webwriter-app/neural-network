import type { ReactiveController } from 'lit'
import type { NeuralNetwork } from '@/app'
import type { QAndAEntry } from '@/types/q_and_a_entry'

import { AlertUtils } from '@/utils/alert_utils'

export class QAndAController implements ReactiveController {
  host: NeuralNetwork

  constructor(host: NeuralNetwork) {
    this.host = host
    host.addController(this)
  }

  // HOST LIFECYCLE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  hostConnected() {
    // add event listeners for Q&A related events on host
    this.host.renderRoot.addEventListener(
      'add-new-help-entry',
      (e: CustomEvent<QAndAEntry>) => this.addNewEntry(e.detail)
    )
    this.host.renderRoot.addEventListener(
      'update-help-entry',
      (e: CustomEvent<QAndAEntry>) => this.updateEntry(e.detail)
    )
    this.host.renderRoot.addEventListener(
      'remove-help-entry',
      (e: CustomEvent<string>) => this.removeEntry(e.detail)
    )
  }

  hostDisconnected() {}

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // adds a new Q&A entry if no entry with the same title exists - else spawns
  // an alert
  addNewEntry(entry: QAndAEntry) {
    console.log([...this.host.qAndA])
    if (
      !this.host.qAndA.some((qAndAEntry) => qAndAEntry.title == entry.title)
    ) {
      this.host.qAndA.push(entry)
      this.host.qAndA = [...this.host.qAndA]
    } else {
      AlertUtils.spawn({
        message: `The help entry could not be created. Another entry with the same name already exists!`,
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
        message: 'Help entry updated successfull',
        variant: 'success',
        icon: 'check-circle',
      })
    } else {
      AlertUtils.spawn({
        message: `Could not update Q&A entry! An entry with this title does not exist!`,
        variant: 'danger',
        icon: 'x-circle',
      })
    }
  }
}
