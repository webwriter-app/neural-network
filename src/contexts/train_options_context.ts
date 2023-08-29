import { createContext } from '@lit-labs/context'
import type { TrainOptions } from '@/types/train_options'

export const trainOptionsContext = createContext<TrainOptions>('train-options')
