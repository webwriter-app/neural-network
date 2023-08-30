import type { CLayerConf } from '@/types/c_layer_conf'
import type { LabelDesc } from '@/types/label_desc'

export interface OutputLayerConf extends CLayerConf {
  HTML_TAG: 'output-layer'
  LAYER_TYPE: 'Output'
  LAYER_NAME: 'Output layer'
  labelDesc: LabelDesc
}
