import { createContext } from '@lit-labs/context'
import type { WwDeepLearning } from '@/app'

export const panels = [
  'settings',
  'start',
  'help',
  'network',
  'dataSet',
  'train',
  'predict',
  'layer',
  'neuron',
  'edge',
]

export const panelContext = createContext<string>('panel')

export function openPanel(panel: string): void {
  ;(<WwDeepLearning>this).panel = panel
}

export function closePanels(panels: string[]): void {
  if (panels.includes((<WwDeepLearning>this).panel)) {
    ;(<WwDeepLearning>this).panel = undefined
  }
}
