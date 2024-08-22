import { createContext } from '@lit/context'
import type { CCanvas } from '@/components/canvas'

export const canvasContext = createContext<CCanvas>('canvas')
