import type { CLayerConf } from '@/types/c_layer_conf'
import type { CLayerConnectionConf } from '@/types/c_layer_connection_conf'
import type { TrainOptions } from '@/types/train_options'
import type { DataSet } from '@/types/data_set'
import type { Settings } from '@/types/settings'
import type { QAndAEntry } from '@/types/q_and_a_entry'

export type FileConfigV1 = {
  version: 1
  settings: Settings
  qAndA: QAndAEntry[]
  dataSet: DataSet
  availableDataSets: DataSet[]
  layerConfs: CLayerConf[]
  layerConnectionConfs: CLayerConnectionConf[]
  trainOptions: TrainOptions
}
