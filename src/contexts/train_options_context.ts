import { createContext } from '@lit-labs/context'
export interface TrainOptions {
  learningRate: number
  dropoutRate: number
  epochs: number
  batchSize: number
  lossFunction: string
  optimizer: string
}
export const trainOptionsContext = createContext<TrainOptions>('train-options')
