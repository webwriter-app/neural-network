import { DataSetLabel } from '@/types/data_set_label'

// type definition
export interface DataSetClassificationLabel<index extends number = null>
  extends DataSetLabel {
  index: index // index only important for neurons, so they reference the right class
  type: 'classification'
  classes: Array<{
    key: string
    description: string
  }>
}

// type guard
export function isClassificationLabel(
  dataSetLabel: DataSetLabel
): dataSetLabel is DataSetClassificationLabel {
  return dataSetLabel.type == 'classification'
}
