import { NeuronLayerConf } from '@/components/network/neuron_layer_conf'

export interface InputLayerConf extends NeuronLayerConf {
  HTML_TAG: 'input-layer'
  LAYER_TYPE: 'Input'
  LAYER_NAME: 'Input layer'
  dataSetKeys: string[]
}
