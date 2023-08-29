import type { Settings } from '@/types/settings'

export class SettingsUtils {
  static defaultSettings: Settings = {
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
}
