import { DataSetLabel } from '@/types/data_set_label'

// type definition
export interface DataSetRegressionLabel extends DataSetLabel {
  type: 'regression'
}

// type guard
export function isRegressionLabel(
  dataSetLabel: DataSetLabel
): dataSetLabel is DataSetRegressionLabel {
  return dataSetLabel.type == 'regression'
}
