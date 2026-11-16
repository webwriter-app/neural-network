import type { CNeuron } from '../components/network/neuron'
import type { CEdge } from '../components/network/c-edge'
import type { CLayer } from '../components/network/c-layer'

// layer/neuron/edge represent the cyId of the element (only one property is set
// as a time since no multi-selection is allowed)
export interface Selected {
  layer?: string
  neuron?: string
  edge?: string
}

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

export interface QAndAEntry {
  title: string
  description: string
}

export type SelectedEle = CLayer | CNeuron | CEdge

export interface SetupStatus {
  canvasCompleted: boolean
  loading: boolean
}
