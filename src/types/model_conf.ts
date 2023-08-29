import type * as tf from '@tensorflow/tfjs'

export interface ModelConf {
  model: tf.LayersModel
  loss: string
  metrics: string[]
  isTraining: boolean
  totalEpochs: number
  actEpoch: number
  actBatch: number
  history: tf.Logs[]
  predictedValue: number | number[] // regression | classification
}
