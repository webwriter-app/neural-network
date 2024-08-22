import { createContext } from '@lit/context'
import type { Theme } from '@/types/theme'

export const themeContext = createContext<Theme>('theme')
