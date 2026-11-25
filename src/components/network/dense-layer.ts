
import type { Position } from '../../model/network-types'
import type { Activation } from '../../model/network-types'
import type { DenseLayerConf } from '../../model/network-types'
import { CLayer } from './c-layer'
import { LAYER_DISTANCE, layerSize, neuronCount } from '../../model/network-layout'
import { NetworkUtils } from './network-utils'

import * as tf from '@tensorflow/tfjs'
import { CNeuron } from './neuron'

export class DenseLayer extends CLayer<DenseLayerConf> {

  static scopedElements = {
    "c-neuron": CNeuron
  }

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties)

    // eventhough the ui should not allow setting the number of units to 0 or
    // even negative values, this is safeguarded here
    if (this.conf.units <= 0) {
      this.conf.units = 1
    }
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> INFO - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get a description of this layer to display in an info card
  getDescription(): string {
    return this.msg('A dense layer, also called fully-connected layer, is a layer whose inside neurons connect to every neuron in the preceding layer.')
  }

  // -> CREATING - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // creates a new dense layer with the optionally specified properties
  static create({
    units = 5,
    activation = NetworkUtils.actReLu,
    pos,
  }: {
    units?: number
    activation?: Activation
    pos?: Position
  } = {}): DenseLayerConf {
    // create a new dense layer configuration with the specified properties
    const denseLayerConf: DenseLayerConf = {
      HTML_TAG: 'dense-layer',
      LAYER_TYPE: 'Dense',
      LAYER_NAME: 'Dense layer',
      units: units,
      activation: activation,
      pos: pos as Position,
      firstSpawn: true,
      // layerId will be added later by the network
      layerId: 0,
    }

    // emit an layer-conf-created event - the network listens to them, so it can
    // add a unique layer id to the layer conf and add it to the network array
    dispatchEvent(
      new CustomEvent<DenseLayerConf>('layer-conf-created', {
        detail: denseLayerConf,
        bubbles: true,
        composed: true,
      })
    )

    return denseLayerConf
  }

  // duplicate this layer
  duplicate(): void {
    const newPos = { ...this.conf.pos }
    newPos.y -=
      layerSize(neuronCount(this.conf, this.dataSet)).height + LAYER_DISTANCE
    DenseLayer.create({
      units: this.conf.units,
      activation: this.conf.activation,
      pos: newPos,
    })
  }

  // -> BUILD  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  build(inputs: tf.SymbolicTensor[]): tf.SymbolicTensor {
    // check if we have multiple inputs.
    let input: tf.SymbolicTensor | tf.SymbolicTensor[] | tf.Tensor | tf.Tensor[]
    if (inputs.length > 1) {
      // if there are multiple inputs we concatenate them into one
      input = tf.layers
        .concatenate({ axis: 1, name: `concatinputs-${this.getTensorName()}` })
        .apply(inputs)
    } else {
      // we know that we must have one input since this method has to have been
      // called from somewhere, so we set the input to the tensor of the first
      // (and single) input of our inputFrom array
      input = inputs[0]
    }

    // lets now create the main tensor
    const dense = <tf.SymbolicTensor>tf.layers
      .dense({
        units: this.conf.units,
        activation: this.conf.activation.tfName ?? undefined,
        name: this.getTensorName(),
      })
      .apply(input)

    // remember the layer id on the tensor
    Object.assign(dense, { layer_id: this.conf.layerId })
    this.tensor = dense
    return dense
  }
}
