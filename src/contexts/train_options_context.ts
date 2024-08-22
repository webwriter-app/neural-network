import { createContext } from '@lit/context'
import type { TrainOptions } from '@/types/train_options'

export const trainOptionsContext = createContext<TrainOptions>('train-options')
