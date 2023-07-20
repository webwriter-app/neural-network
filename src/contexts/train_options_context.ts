import { createContext } from '@lit-labs/context'
export interface TrainOptions {
  learningRate: string
  dropoutRate: string
  epochs: string
  batchSize: string
  lossFunction: string
  optimizer: string
  setOption: (attribute: string, value: string) => void
}
export const trainOptionsContext = createContext<TrainOptions>('train-options')
