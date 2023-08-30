import { createContext } from '@lit-labs/context'
import type { Theme } from '@/types/theme'

export const themeContext = createContext<Theme>('theme')
