import { createContext } from '@lit-labs/context'
import { spawnAlert } from '@/utils/alerts'
import { DataSet } from '@/data_set/data_set'
import type { WwDeepLearning } from '@/app'

export const availableDataSetsContext = createContext<DataSet[]>(
  'available-data-sets'
)

export function addDataSet(dataSetArg: DataSet) {
  if (
    (<WwDeepLearning>this).availableDataSets.find(
      (dataSet) => dataSet.name == dataSetArg.name
    )
  ) {
    spawnAlert({
      message: `A data set with the same name already exists!`,
      variant: 'danger',
      icon: 'x-circle',
    })
  } else {
    ;(<WwDeepLearning>this).availableDataSets.push(dataSetArg)
    ;(<WwDeepLearning>this).availableDataSets = [
      ...(<WwDeepLearning>this).availableDataSets,
    ]
  }
}

export function deleteDataSet(name: string) {
  const dataSet = (<WwDeepLearning>this).availableDataSets.find(
    (dataSet) => dataSet.name == name
  )
  if (dataSet == (<WwDeepLearning>this).dataSet) {
    spawnAlert({
      message: `You can not delete a data set that is currently selected`,
      variant: 'danger',
      icon: 'x-circle',
    })
  } else {
    const index = (<WwDeepLearning>this).availableDataSets.findIndex(
      (dataSet) => dataSet.name == name
    )
    ;(<WwDeepLearning>this).availableDataSets.splice(index, 1)
    ;(<WwDeepLearning>this).availableDataSets = [
      ...(<WwDeepLearning>this).availableDataSets,
    ]
  }
}
