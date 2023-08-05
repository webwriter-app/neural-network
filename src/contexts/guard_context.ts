import type { WwDeepLearning } from '@/app'
import { createContext } from '@lit-labs/context'

export interface Guard {
  mayChangeNetworkTopology: () => boolean
}

export const guardContext = createContext<Guard>('guard')

export const guard = {
  mayChangeNetworkTopology: () => {
    if ((<WwDeepLearning>this).model.model) return false
    return true
  },
}
