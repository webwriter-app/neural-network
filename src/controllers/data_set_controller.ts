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

  hostConnected() {
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

  hostDisconnected() {}

  selectDataSet(dataSet: DataSet) {
    this.host.dataSet = dataSet
    this.host.modelController.discardModel()
  }

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
      this.host.availableDataSets.splice(index, 1)
      this.host.availableDataSets = [...this.host.availableDataSets]
      AlertUtils.spawn({
        message: `The data set '${name}' was successfully deleted`,
        variant: 'warning',
        icon: 'check-circle',
      })
    }
  }
}
