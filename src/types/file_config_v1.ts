import type { CLayerConf } from '@/components/network/c_layer_conf'
import type { CLayerConnectionConf } from '@/components/network/c_layer_connection_conf'
import type { TrainOptions } from '@/contexts/train_options_context'
import type { DataSet } from '@/data_set/data_set'

export type FileConfigV1 = {
  version: 1
  dataSet: DataSet
  layerConfs: CLayerConf[]
  layerConnectionConfs: CLayerConnectionConf[]
  trainOptions: TrainOptions
}
