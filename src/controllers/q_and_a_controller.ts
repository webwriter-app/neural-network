import type { ReactiveController } from 'lit'
import type { WwDeepLearning } from '@/app'
import type { QAndAEntry } from '@/types/q_and_a_entry'

import { AlertUtils } from '@/utils/alert_utils'

export class QAndAController implements ReactiveController {
  host: WwDeepLearning

  constructor(host: WwDeepLearning) {
    this.host = host
    host.addController(this)
  }

  hostConnected() {
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

  removeEntry(title: string) {
    const index = this.host.qAndA.findIndex((entry) => entry.title == title)
    this.host.qAndA.splice(index, 1)
    this.host.qAndA = [...this.host.qAndA]
  }

  updateEntry(entry: QAndAEntry) {
    const index = this.host.qAndA.findIndex(
      (entry) => entry.title == entry.title
    )
    this.host.qAndA[index].description = entry.description
    this.host.qAndA = [...this.host.qAndA]
    AlertUtils.spawn({
      message: 'Help entry updated successfull',
      variant: 'success',
      icon: 'check-circle',
    })
  }
}
