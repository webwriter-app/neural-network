import { createContext } from '@lit-labs/context'
import { DataSet } from '@/data_set/data_set'
export const availableDataSetsContext = createContext<DataSet[]>(
  'available-data-sets'
)
