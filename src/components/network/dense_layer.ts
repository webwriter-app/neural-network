import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { range } from 'lit/directives/range.js'

import { globalStyles } from '@/global_styles'

import { NeuronLayer } from '@/components/network/neuron_layer'

import { Position } from '@/types/position'
import {
  ActivationOption,
  activationsMap,
} from '@/components/network/activation'

import * as tf from '@tensorflow/tfjs'
import { DenseLayerConf } from '@/components/network/dense_layer_conf'

@customElement('dense-layer')
export class DenseLayer extends NeuronLayer {
  // a type and description that is displayed as an info for the layer
  static LAYER_TYPE = 'Dense'
  static LAYER_NAME = 'Dense layer'

  @property()
  conf: DenseLayerConf

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // empty

  // FACTORY - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static create({
    units = 5,
    activation = 'ReLu',
    pos = null,
  }: {
    units?: number
    activation?: ActivationOption
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
      // layerId and data set will be added later by the network
      layerId: undefined,
    }

    // emit an layer-conf-created event - the network listens to them, so it can add
    // a unique layer id to the layer conf and add it to the network array
    dispatchEvent(
      new CustomEvent<DenseLayerConf>('layer-conf-created', {
        detail: denseLayerConf,
        bubbles: true,
        composed: true,
      })
    )

    return denseLayerConf
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get a description of this layer to display in an info card
  getDescription(): string {
    return 'A dense layer, also called fully-connected layer, is a layer whose inside neurons connect to every neuron in the preceding layer.'
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
        activation: <tf.ActivationIdentifier>(
          activationsMap.get(this.conf.activation)
        ),
        name: this.getTensorName(),
      })
      .apply(input)

    // finally apply dropout
    const dropout: tf.SymbolicTensor = <tf.SymbolicTensor>(
      tf.layers
        .dropout({ rate: parseInt(this.trainOptions.dropoutRate) })
        .apply(dense)
    )

    // set this tensor to the dropout tensor and add the layer id
    dropout['layer_id'] = this.conf.layerId
    return dropout
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [globalStyles]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      ${super.render()}
      ${this.conf.pos
        ? html`${map(
            range(this.conf.units),
            (i) => html`
              <c-neuron
                class="neuron"
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
