import { createContext } from '@lit-labs/context'
import type { Network } from '@/components/network/network'

export const networkContext = createContext<Network>('network')
