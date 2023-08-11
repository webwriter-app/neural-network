import { createContext } from '@lit-labs/context'
import { DataSet } from '@/data_set/data_set'
import type { WwDeepLearning } from '@/app'

export const dataSetContext = createContext<DataSet>('data-set')

export function selectDataSet(dataSet: DataSet) {
  ;(<WwDeepLearning>this).dataSet = dataSet
  ;(<WwDeepLearning>this).resetModel()
}
