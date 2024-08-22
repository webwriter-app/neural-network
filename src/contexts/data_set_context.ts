import { createContext } from '@lit/context'
import type { DataSet } from '@/types/data_set'

export const dataSetContext = createContext<DataSet>('data-set')
