import { createContext } from '@lit-labs/context'

export interface SetupStatus {
  canvasCompleted: boolean
  dataSetCompleted: boolean
  loading: boolean
}

export const setupStatusContext = createContext<SetupStatus>('setup-status')

/* related functions
  setupCompleted: (name: strin) => void
  checkLoading: () => void
*/
