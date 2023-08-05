import { createContext } from '@lit-labs/context'
import type { WwDeepLearning } from '@/app'

export const panelGroups: { [key: string]: string[] } = {
  right: [
    'settings',
    'network',
    'dataSet',
    'train',
    'predict',
    'layer',
    'neuron',
    'edge',
  ],
}

export const openPanelsContext = createContext<string[]>('open-panels')

export function openPanel(panel: string, group?: string): void {
  if (group) {
    ;(<WwDeepLearning>this).closePanels(panelGroups[group])
  }
  ;(<WwDeepLearning>this).openPanels.push(panel)
  ;(<WwDeepLearning>this).openPanels = [...(<WwDeepLearning>this).openPanels]
}

export function closePanels(panels: string[]): void {
  ;(<WwDeepLearning>this).openPanels = (<WwDeepLearning>this).openPanels.filter(
    (openPanel: string) => {
      return !panels.includes(openPanel)
    }
  )
  ;(<WwDeepLearning>this).openPanels = [...(<WwDeepLearning>this).openPanels]
}
