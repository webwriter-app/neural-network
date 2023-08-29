import type { CLayerConf } from '@/types/c_layer_conf'
import type { DataSetLabel } from '@/types/data_set_label'

export interface OutputLayerConf extends CLayerConf {
  HTML_TAG: 'output-layer'
  LAYER_TYPE: 'Output'
  LAYER_NAME: 'Output layer'
  dataSetLabel: DataSetLabel
}
