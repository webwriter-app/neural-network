import { createContext } from '@lit-labs/context'
import { Canvas } from '@/components/canvas'
export { Canvas } from '@/components/canvas'
export const canvasContext = createContext<Canvas>('canvas')
