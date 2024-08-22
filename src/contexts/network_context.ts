import { createContext } from '@lit/context'
import type { CNetwork } from '@/components/network/network'

export const networkContext = createContext<CNetwork>('network')
