import type { ActivationIdentifier } from '@tensorflow/tfjs-layers/dist/keras_format/activation_config'
import type * as tf from '@tensorflow/tfjs'
import type { LabelDesc } from './data-types'

export type LayerType = (
  | InputLayerConf
  | DenseLayerConf
  | OutputLayerConf
)['LAYER_TYPE']

export type Position = {
  x: number
  y: number
}

export interface Activation {
  name: string
  fullName?: string
  tfName: ActivationIdentifier | null
  description: string
  img?: string
  range: string
}

export interface CLayerConnectionConf {
  sourceLayerId: number
  targetLayerId: number
}

export interface InputLayerConf extends CLayerConf {
  HTML_TAG: 'input-layer'
  LAYER_TYPE: 'Input'
  LAYER_NAME: 'Input layer'
  featureKeys: string[]
}

// the tensor conf is a property of the layer which stores important information
// about the model after building and during training. we do not store this
// information in the main layer conf since the layer conf is stored as an
// attribute and may not contain circular structures as values (which tensor
// contain)
export interface TensorConf {
  tensor: tf.SymbolicTensor
  bias?: Float32Array
  weights?: Float32Array
}

export interface DenseLayerConf extends CLayerConf {
  HTML_TAG: 'dense-layer'
  LAYER_TYPE: 'Dense'
  LAYER_NAME: 'Dense layer'
  units: number
}

export interface ModelConf {
  model: tf.LayersModel | null
  loss: string | null
  metrics: string[]
  plottedMetrics: string[]
  isTraining: boolean
  totalEpochs: number
  actEpoch: number
  actBatch: number
  history: tf.Logs[]
  predictedValue: number | number[] | null // regression | classification
}

export interface TrainOptions {
  learningRate: string
  dropoutRate: string
  batchSize: string
  lossFunction: string
  optimizer: string
}

export interface CLayerConf {
  // html tag
  HTML_TAG: string
  // a type and description that is displayed as an info for the layer
  LAYER_TYPE: string
  LAYER_NAME: string
  // layer id
  layerId: number
  // activation
  activation: Activation
  // position
  pos: Position
  // firstSpawn: if true, the layer spawns an alert about its creation when it
  // is connected and then sets it to false
  firstSpawn: boolean
}

export interface OutputLayerConf extends CLayerConf {
  HTML_TAG: 'output-layer'
  LAYER_TYPE: 'Output'
  LAYER_NAME: 'Output layer'
  labelDesc: LabelDesc
}
