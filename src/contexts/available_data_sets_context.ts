import { createContext } from '@lit/context'
import type { DataSet } from '@/types/data_set'

export const availableDataSetsContext = createContext<DataSet[]>(
  'available-data-sets'
)
