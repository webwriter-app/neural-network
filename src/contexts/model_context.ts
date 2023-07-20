import { createContext } from '@lit-labs/context'
import * as tf from '@tensorflow/tfjs'
export type tfModel = tf.LayersModel
export interface Model {
  model: tfModel
  reset: () => void
  build: () => void
  isTraining: boolean
  actEpoch: number
  actBatch: number
  train: () => void
  stopRequested: boolean
  predict: () => void
}
export const modelContext = createContext<Model>('model')
