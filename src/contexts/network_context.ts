import { createContext } from '@lit-labs/context'
import type { CNetwork } from '@/components/network/network'

export const networkContext = createContext<CNetwork>('network')
