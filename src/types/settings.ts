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
