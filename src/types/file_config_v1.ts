import type { CLayerConf } from '@/network/c_layer_conf'
import type { CLayerConnectionConf } from '@/network/c_layer_connection_conf'
import type { TrainOptions } from '@/contexts/train_options_context'
import type { DataSet } from '@/data_set/data_set'
import type { Settings } from '@/contexts/settings_context'
import type { HelpEntry } from '@/contexts/help_context'

export type FileConfigV1 = {
  version: 1
  settings: Settings
  help: HelpEntry[]
  dataSet: DataSet
  availableDataSets: DataSet[]
  layerConfs: CLayerConf[]
  layerConnectionConfs: CLayerConnectionConf[]
  trainOptions: TrainOptions
}
