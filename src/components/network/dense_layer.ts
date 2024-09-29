import { TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { range } from 'lit/directives/range.js'

import type { Position } from '@/types/position'
import type { Activation } from '@/types/activation'
import type { DenseLayerConf } from '@/types/dense_layer_conf'
import { CLayer } from '@/components/network/c_layer'
import { NetworkUtils } from '@/utils/network_utils'

import * as tf from '@tensorflow/tfjs'
import { CNeuron } from './neuron'

export class DenseLayer extends CLayer {

  static scopedElements = {
    "c-neuron": CNeuron
  }

  @property() // @ts-ignore
  accessor conf: DenseLayerConf

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
    return 'A dense layer, also called fully-connected layer, is a layer whose inside neurons connect to every neuron in the preceding layer.'
  }

  // -> CREATING - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // creates a new dense layer with the optionally specified properties
  static create({
    units = 5,
    activation = NetworkUtils.actReLu,
    pos = null,
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
      pos: pos,
      firstSpawn: true,
      // layerId will be added later by the network
      layerId: undefined,
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
      this.canvas.getHeight(this.getCyId()) + this.canvas.LAYER_DISTANCE
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
        activation: this.conf.activation.tfName,
        name: this.getTensorName(),
      })
      .apply(input)

    // finally apply dropout
/*     const dropout: tf.SymbolicTensor = <tf.SymbolicTensor>(
      tf.layers
        .dropout({ rate: parseFloat(this.trainOptions.dropoutRate) })
        .apply(dense)
    ) */

    // set this tensor to the dropout tensor and add the layer id
    dense['layer_id'] = this.conf.layerId
    this.tensor = dense
    return dense
  }

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      ${super.render()}
      ${this.conf.pos
        ? html`${map(
            range(this.conf.units),
            (i) => html`
              <c-neuron
                .layer="${this}"
                neuronId="${i + 1}"
                .pos="${{
                  x:
                    this.conf.pos.x +
                    i *
                      (this.canvas.NEURON_SIZE + this.canvas.NEURON_DISTANCE) -
                    ((this.conf.units - 1) *
                      (this.canvas.NEURON_SIZE + this.canvas.NEURON_DISTANCE)) /
                      2,
                  y: this.conf.pos.y,
                }}"
                bias="${this.bias ? this.bias[i] : null}"
              ></c-neuron>
            `
          )}`
        : html``}
    `
  }
}
