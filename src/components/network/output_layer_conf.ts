import { NeuronLayerConf } from '@/components/network/neuron_layer_conf'
import { DataSetLabel } from '@/types/data_set_label'

export interface OutputLayerConf extends NeuronLayerConf {
  HTML_TAG: 'output-layer'
  LAYER_TYPE: 'Output'
  LAYER_NAME: 'Output layer'
  dataSetLabel: DataSetLabel
}
