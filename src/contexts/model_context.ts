import { createContext } from '@lit-labs/context'
import * as tf from '@tensorflow/tfjs'
export type tfModel = tf.LayersModel
export interface Model {
  model: tfModel
  reset: () => void
  build: () => void
  train: () => void
  predict: () => void
}
export const modelContext = createContext<Model>('model')
