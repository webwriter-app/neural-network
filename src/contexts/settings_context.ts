import { createContext } from '@lit/context'
import type { Settings } from '@/types/settings'

export const settingsContext = createContext<Settings>('settings')
