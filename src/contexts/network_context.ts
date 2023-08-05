import { createContext } from '@lit-labs/context'
import { Network } from '@/components/network/network'
export const networkContext = createContext<Network>('network')
