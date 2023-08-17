import { createContext } from '@lit-labs/context'
import type { WwDeepLearning } from '@/app'

export interface TrainOptions {
  learningRate: string
  dropoutRate: string
  epochs: string
  batchSize: string
  lossFunction: string
  optimizer: string
}
export const trainOptionsContext = createContext<TrainOptions>('train-options')

export const defaultTrainOptions: TrainOptions = {
  learningRate: '0.001',
  dropoutRate: '0',
  epochs: '8',
  batchSize: '32',
  lossFunction: 'meanSquaredError',
  optimizer: 'sgd',
}

export function setTrainOption(option: string, value: string) {
  ;(<WwDeepLearning>this).trainOptions[option] = value
  ;(<WwDeepLearning>this).trainOptions = {
    ...(<WwDeepLearning>this).trainOptions,
  }
}
