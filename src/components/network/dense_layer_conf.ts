import { NeuronLayerConf } from '@/components/network/neuron_layer_conf'

export interface DenseLayerConf extends NeuronLayerConf {
  HTML_TAG: 'dense-layer'
  LAYER_TYPE: 'Dense'
  LAYER_NAME: 'Dense layer'
  units: number
}
