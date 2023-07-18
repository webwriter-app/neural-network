import { createContext } from '@lit-labs/context'
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
export interface Panels {
  openPanels: string[]
  open: (...panels: string[]) => void
  close: (...panels: string[]) => void
  containsSome: (...panels: string[]) => boolean
}
export const panelsContext = createContext<Panels>('panels')
