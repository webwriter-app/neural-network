import type { InputLayerConf } from '@/types/input_layer_conf'
import type { DenseLayerConf } from '@/types/dense_layer_conf'
import type { OutputLayerConf } from '@/types/output_layer_conf'

export type LayerType = (
  | InputLayerConf
  | DenseLayerConf
  | OutputLayerConf
)['LAYER_TYPE']
