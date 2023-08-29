import type { DataSetInput } from '@/types/data_set_input'
import type { DataSetLabel } from '@/types/data_set_label'

export interface DataSet {
  // information about the dataSet
  name: string
  description: string
  type: 'regression' | 'classification'

  // formal description of input and labels, not the data
  inputs: DataSetInput[]
  label: DataSetLabel

  // data
  data: Array<{
    inputs: number[]
    label: number
  }>
}
