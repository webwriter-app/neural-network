import { createContext } from '@lit/context'
import type { Selected } from '@/types/selected'

export const selectedContext = createContext<Selected>('selected')
