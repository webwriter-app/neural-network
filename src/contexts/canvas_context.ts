import { createContext } from '@lit-labs/context'
import type { CCanvas } from '@/components/canvas'
import type { WwDeepLearning } from '@/app'

export const canvasContext = createContext<CCanvas>('canvas')

export function setCanvas(canvas: CCanvas) {
  ;(<WwDeepLearning>this).canvas = canvas
  ;(<WwDeepLearning>this).setupCompleted('canvas')
}
