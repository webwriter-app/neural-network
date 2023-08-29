import { createContext } from '@lit-labs/context'
import type { Selected } from '@/types/selected'

export const selectedContext = createContext<Selected>('selected')
