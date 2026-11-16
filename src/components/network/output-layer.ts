
import type { Position } from '../../model/network-types'
import type { Activation } from '../../model/network-types'
import type { OutputLayerConf } from '../../model/network-types'
import type { LabelDesc } from '../../model/data-types'
import { CLayer } from './c-layer'
import { neuronCount } from '../../model/network-layout'
import { NetworkUtils } from './network-utils'

import type { DataSet } from '../../model/data-types'

import { AlertUtils } from '../../model/alert-utils'

import * as tf from '@tensorflow/tfjs'
import { CNeuron } from './neuron'

export class OutputLayer extends CLayer<OutputLayerConf> {
  static scopedElements = {
    'c-neuron': CNeuron,
  }

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties)
    if (changedProperties.has('conf')) {
      // check the updated data set keys
      if (!this.conf.labelDesc) {
        // if no label was assigned (should in theory not happen), notify the
        // network that this layer wants to be deleted
        this.dispatchEvent(
          new CustomEvent<OutputLayer>('query-layer-deletion', {
            detail: this,
            bubbles: true,
            composed: true,
          }),
        )
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
      this.conf.labelDesc = this.dataSet.labelDesc
      this.dispatchEvent(
        new Event('update-layer-confs', {
          bubbles: true,
          composed: true,
        }),
      )
    }
  }

  // FACTORY - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // creates a new output layer with the optionally specified properties
  static create({
    activation = NetworkUtils.actNone,
    pos,
  }: {
    activation?: Activation
    pos?: Position
  } = {}): OutputLayerConf {
    // create a new dense layer element with the specified properties
    const outputLayerConf: OutputLayerConf = {
      HTML_TAG: 'output-layer',
      LAYER_TYPE: 'Output',
      LAYER_NAME: 'Output layer',
      activation: activation,
      pos: pos as Position,
      firstSpawn: true,
      // layer id and data set label will be added by the network
      layerId: 0,
      labelDesc: undefined as unknown as LabelDesc,
    }

    // emit an layer-conf-created event - the network listens to them, so it can
    // add a unique layer id to the layer and add it to the network array
    dispatchEvent(
      new CustomEvent<OutputLayerConf>('layer-conf-created', {
        detail: outputLayerConf,
        bubbles: true,
        composed: true,
      }),
    )

    return outputLayerConf
  }

  // duplicate this layer
  duplicate(): void {
    AlertUtils.spawn({
      message: this.msg(
        'The selected layer can not be duplicated! Only a single output layer is currently supported!',
      ),
      variant: 'warning',
      icon: 'x-circle',
    })
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> INFO - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get description
  getDescription(): string {
    let description = this.msg(
      'An output layer in this simulation is just a normal dense layer, additionally equipped with the ability to output the incoming data out of the network.',
    )
    if (this.dataSet.type == 'classification') {
      description +=
        ' ' +
        this.msg(
          'Since the purpose if this layer is to output a classifiction, we should combine it with a softmax activation function in order to provide a probability distribution.',
        )
    }
    return description
  }

  // -> BUILD  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  build(inputs: tf.SymbolicTensor[]): tf.SymbolicTensor {
    // check if we have multiple inputs and concatenate them if necessary
    let input: tf.SymbolicTensor | tf.SymbolicTensor[] | tf.Tensor | tf.Tensor[]
    if (inputs.length > 1) {
      input = tf.layers
        .concatenate({ axis: 1, name: `concatinputs-${this.getTensorName()}` })
        .apply(inputs)
    } else {
      input = inputs[0]
    }

    // create the layer's tensor
    const tensor = <tf.SymbolicTensor>tf.layers
      .dense({
        units: neuronCount(this.conf, this.dataSet),
        activation: this.conf.activation.tfName ?? undefined,
        name: this.getTensorName(),
      })
      .apply(input)
    Object.assign(tensor, { layer_id: this.conf.layerId })
    this.tensor = tensor
    return tensor
  }
}
