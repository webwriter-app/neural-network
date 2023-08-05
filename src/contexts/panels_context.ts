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

export const openPanelsContext = createContext<string[]>('open-panels')

/* related functions
  openPanel: (panels: string, group?: string) => void
  closePanels: (...panels: string[]) => void
*/
