import * as tf from '@tensorflow/tfjs'

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
