import { createContext } from '@lit-labs/context'
import { DataSet } from '@/data_set/data_set'
export const dataSetContext = createContext<DataSet>('data-set')
