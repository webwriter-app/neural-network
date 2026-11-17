
import type { DataSet } from '../../model/data-types'
import type { InputLayerConf } from '../../model/network-types'
import type { Position } from '../../model/network-types'
import type { Activation } from '../../model/network-types'
import { CLayer } from './c-layer'
import { LAYER_DISTANCE, layerSize, neuronCount } from '../../model/network-layout'
import { NetworkUtils } from './network-utils'

import { AlertUtils } from '../../model/alert-utils'

import * as tf from '@tensorflow/tfjs'
import { CNeuron } from './neuron'

// an input layer is a special type of a neuron layer. We do not allow
// activation functions and provide methods to assign features from the
// dataSet to this input layer. We do not allow manual editing of the neurons
// and other layers can not connect to an input layer.
export class InputLayer extends CLayer<InputLayerConf> {

  static scopedElements = {
    "c-neuron": CNeuron
  }

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties)
    if (changedProperties.has('conf')) {
      // check the updated data set keys
      if (!this.conf.featureKeys.length) {
        // if no key was assigned, notify the network that this layer wants to
        // be deleted
        this.delete()
        AlertUtils.spawn({
          message: `${this.msg('Layer')} ${this.getId()} ${this.msg('was deleted because no data could be assigned to it!')}`,
          variant: 'warning',
          icon: 'x-circle',
        })
      }
    }
    if (
      changedProperties.has('dataSet') &&
      changedProperties.get('dataSet') &&
      (<DataSet>changedProperties.get('dataSet')).name != this.dataSet.name
    ) {
      this.conf.featureKeys = this.dataSet.featureDescs.map(
        (featureDesc) => featureDesc.key
      )
      this.dispatchEvent(
        new Event('update-layer-confs', {
          bubbles: true,
          composed: true,
        })
      )
    }
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> INFO - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get description
  getDescription(): string {
    return this.msg('An input layer is a layer that just takes data provided from outside the network and passes it on to the next layer(s)')
  }

  // -> CREATING - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // creates a new input layer with the optionally specified properties
  static create({
    activation = NetworkUtils.actNone,
    featureKeys,
    pos,
  }: {
    activation?: Activation
    featureKeys?: string[]
    pos?: Position
  } = {}): InputLayerConf {
    // create a new dense layer configuration with the specified properties
    const inputLayerConf: InputLayerConf = {
      HTML_TAG: 'input-layer',
      LAYER_TYPE: 'Input',
      LAYER_NAME: 'Input layer',
      activation: activation,
      pos: pos as Position,
      firstSpawn: true,
      // layer id and data set keys will be added by the layer
      layerId: 0,
      featureKeys: featureKeys as string[],
    }

    // emit an layer-conf-created event - the network listens to them, so it can
    // add a unique layer id to the layer conf and add it to the network array
    dispatchEvent(
      new CustomEvent<InputLayerConf>('layer-conf-created', {
        detail: inputLayerConf,
        bubbles: true,
        composed: true,
      })
    )

    return inputLayerConf
  }

  // duplicate this layer
  duplicate(): void {
    const newPos = { ...this.conf.pos }
    newPos.y -=
      layerSize(neuronCount(this.conf, this.dataSet)).height + LAYER_DISTANCE
    InputLayer.create({
      activation: this.conf.activation,
      featureKeys: this.conf.featureKeys,
      pos: newPos,
    })
  }

  // -> BUILD  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  build(inputs: tf.SymbolicTensor[]): tf.SymbolicTensor {
    <[]>inputs
    //  create our input tensor
    const tensor = tf.input({
      shape: [this.conf.featureKeys.length],
      name: this.getTensorName(),
    })
    Object.assign(tensor, { layer_id: this.conf.layerId })
    this.tensor = tensor
    return tensor
  }
}
