import { createContext } from '@lit-labs/context'
import { DataSet } from '@/data_set/data_set'
import type { WwDeepLearning } from '@/app'

export const availableDataSetsContext = createContext<DataSet[]>(
  'available-data-sets'
)

export function addDataSet(dataSet: DataSet) {
  ;(<WwDeepLearning>this).availableDataSets.push(dataSet)
  ;(<WwDeepLearning>this).availableDataSets = [
    ...(<WwDeepLearning>this).availableDataSets,
  ]
}
