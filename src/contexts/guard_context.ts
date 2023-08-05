import { createContext } from '@lit-labs/context'

export interface Guard {
  mayChangeNetworkTopology: () => boolean
}

export const guardContext = createContext<Guard>('guard')
