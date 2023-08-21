import { createContext } from '@lit-labs/context'
import type { WwDeepLearning } from '@/app'

export interface Settings {
  // start
  mayImport: boolean
  showDefaultConfs: boolean
  mayExport: boolean

  // network
  allowDenseLayers: boolean
  mayAddAndRemoveLayers: boolean
  mayEditLayers: boolean
  maySelectDataOnInputLayer: boolean
  mayChangeNeurons: boolean
  mayChangeActivationFunction: boolean
  mayChangeLayerConnections: boolean

  // data set
  maySelectDataSet: boolean
  mayManageDataSets: boolean
  showPlots: boolean

  // training
  mayEditHyperparameters: boolean
  mayEditBatchSize: boolean
  mayEditLearningRate: boolean
  mayEditDropoutRate: boolean
}
export const settingsContext = createContext<Settings>('settomgs')

export const defaultSettings: Settings = {
  mayImport: true,
  showDefaultConfs: true,
  mayExport: true,
  allowDenseLayers: true,
  mayAddAndRemoveLayers: true,
  mayEditLayers: true,
  maySelectDataOnInputLayer: true,
  mayChangeNeurons: true,
  mayChangeActivationFunction: true,
  mayChangeLayerConnections: true,
  maySelectDataSet: true,
  mayManageDataSets: true,
  showPlots: true,
  mayEditHyperparameters: true,
  mayEditBatchSize: true,
  mayEditLearningRate: true,
  mayEditDropoutRate: true,
}

export function setSetting(name: string, value: boolean) {
  if (Object.hasOwn((<WwDeepLearning>this).settings, name)) {
    ;(<WwDeepLearning>this).settings[name] = value
    ;(<WwDeepLearning>this).settings = {
      ...(<WwDeepLearning>this).settings,
    }
  }
}

export function setSettings(settings: Settings) {
  ;(<WwDeepLearning>this).settings = { ...settings }
}
