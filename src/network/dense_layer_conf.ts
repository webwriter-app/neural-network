import { CLayerConf } from '@/network/c_layer_conf'

export interface DenseLayerConf extends CLayerConf {
  HTML_TAG: 'dense-layer'
  LAYER_TYPE: 'Dense'
  LAYER_NAME: 'Dense layer'
  units: number
}
