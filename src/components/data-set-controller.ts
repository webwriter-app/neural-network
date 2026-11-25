import type { ReactiveController } from 'lit'
import { listen } from './listen'
import { str } from '@lit/localize'
import type { WebwriterNeuralNetwork } from '../widgets/webwriter-neural-network'
import type { DataSet } from '../model/data-types'

import { AlertUtils } from '../model/alert-utils'

export class DataSetController implements ReactiveController {
  host: WebwriterNeuralNetwork

  constructor(host: WebwriterNeuralNetwork) {
    this.host = host
    host.addController(this)
  }

  // HOST LIFECYCLE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  private abort = new AbortController()

  hostConnected() {
    this.abort = new AbortController()
    // add event listeners for data set related events on host
    listen<DataSet>(this.host.renderRoot, 'select-data-set', (e) => this.selectDataSet(e.detail), this.abort.signal)
    listen<DataSet>(this.host.renderRoot, 'add-data-set', (e) => this.addDataSet(e.detail), this.abort.signal)
    listen<string>(this.host.renderRoot, 'delete-data-set', (e) => this.deleteDataSet(e.detail), this.abort.signal)
  }

  hostDisconnected() {
    this.abort.abort()
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // selects a new data set
  selectDataSet(dataSet: DataSet) {
    void this.host.useDataSet(dataSet)
  }

  // adds a new data set to the list of available data sets if no data set with
  // this name already exists, else spawns an alert
  addDataSet(dataSetArg: DataSet) {
    if (
      this.host.availableDataSets.find(
        (dataSet) => dataSet.name == dataSetArg.name
      )
    ) {
      AlertUtils.spawn({
        message: this.host.msg('A data set with the same name already exists!'),
        variant: 'danger',
        icon: 'x-circle',
      })
    } else {
      this.host.availableDataSets.push(dataSetArg)
      this.host.availableDataSets = [...this.host.availableDataSets]
    }
  }

  // deletes a data set from the list of available data sets
  deleteDataSet(name: string) {
    const dataSet = this.host.availableDataSets.find(
      (dataSet) => dataSet.name == name
    )
    if (dataSet == this.host.dataSet) {
      AlertUtils.spawn({
        message: this.host.msg('You can not delete a data set that is currently selected'),
        variant: 'danger',
        icon: 'x-circle',
      })
    } else {
      const index = this.host.availableDataSets.findIndex(
        (dataSet) => dataSet.name == name
      )
      if (index != -1) {
        this.host.availableDataSets.splice(index, 1)
        this.host.availableDataSets = [...this.host.availableDataSets]
        AlertUtils.spawn({
          message: this.host.msg(str`The data set '${name}' was successfully deleted`),
          variant: 'warning',
          icon: 'check-circle',
        })
      } else {
        AlertUtils.spawn({
          message: this.host.msg('Error: Requested deletion of a data set that does not exist'),
          variant: 'danger',
          icon: 'x-circle',
        })
      }
    }
  }
}
