import { createContext } from '@lit-labs/context'
import type { DataSet } from '@/types/data_set'

export const dataSetContext = createContext<DataSet>('data-set')
