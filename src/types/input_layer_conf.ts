import type { CLayerConf } from '@/types/c_layer_conf'

export interface InputLayerConf extends CLayerConf {
  HTML_TAG: 'input-layer'
  LAYER_TYPE: 'Input'
  LAYER_NAME: 'Input layer'
  dataSetKeys: string[]
}
