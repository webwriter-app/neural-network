import { createContext } from '@lit-labs/context'
import type { CCanvas } from '@/components/canvas'
export const canvasContext = createContext<CCanvas>('canvas')
