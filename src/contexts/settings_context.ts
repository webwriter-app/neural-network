import { createContext } from '@lit-labs/context'
import type { Settings } from '@/types/settings'

export const settingsContext = createContext<Settings>('settings')
