import type { CLayerConf, CLayerConnectionConf, TrainOptions } from './network-types'
import type { QAndAEntry, Settings } from './app-types'

export type FileConfig = FileConfigV1

export interface FeatureDesc {
  key: string
  description: string
}

export interface DataSet {
  // information about the dataSet
  name: string
  description: string
  type: 'regression' | 'classification'

  // formal description of features and labels
  featureDescs: FeatureDesc[]
  labelDesc: LabelDesc

  // data (features and labels)
  data: Array<{
    features: number[]
    label: number
  }>
}

export interface LabelDesc {
  key: string
  description: string
  // classes only for label in classification dataset
  // the id is unset while a new class is being drafted in the create dialog
  classes?: Array<{
    id?: number
    description: string
  }>
}

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
