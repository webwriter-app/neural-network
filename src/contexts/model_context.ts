import { createContext } from '@lit-labs/context'
import * as tf from '@tensorflow/tfjs'
export type tfModel = tf.LayersModel
export interface Model {
  model: tfModel
  isTraining: boolean
  actEpoch: number
  actBatch: number
  stopRequested: boolean
}
export const modelContext = createContext<Model>('model')

/* related functions: 
  resetModel: () => void
  buildModel: () => void
  trainModel: () => void
  predictModel: () => void
*/
