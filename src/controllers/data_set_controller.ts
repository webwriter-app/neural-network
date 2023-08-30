import type { ReactiveController } from 'lit'
import type { WwDeepLearning } from '@/app'
import type { DataSet } from '@/types/data_set'

import { AlertUtils } from '@/utils/alert_utils'

export class DataSetController implements ReactiveController {
  host: WwDeepLearning

  constructor(host: WwDeepLearning) {
    this.host = host
    host.addController(this)
  }

  // HOST LIFECYCLE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  hostConnected() {
    // add event listeners for data set related events on host
    this.host.renderRoot.addEventListener(
      'select-data-set',
      (e: CustomEvent<DataSet>) => this.selectDataSet(e.detail)
    )
    this.host.renderRoot.addEventListener(
      'add-data-set',
      (e: CustomEvent<DataSet>) => this.addDataSet(e.detail)
    )
    this.host.renderRoot.addEventListener(
      'delete-data-set',
      (e: CustomEvent<string>) => this.deleteDataSet(e.detail)
    )
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // selects a new data set
  selectDataSet(dataSet: DataSet) {
    this.host.dataSet = dataSet
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
        message: `A data set with the same name already exists!`,
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
        message: `You can not delete a data set that is currently selected`,
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
          message: `The data set '${name}' was successfully deleted`,
          variant: 'warning',
          icon: 'check-circle',
        })
      } else {
        AlertUtils.spawn({
          message: `Error: Requested deletion of a data set that does not exist`,
          variant: 'danger',
          icon: 'x-circle',
        })
      }
    }
  }
}
