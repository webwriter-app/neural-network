import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { Position } from '@/types/position'
import {
  ActivationOption,
  activationsMap,
} from '@/components/network/activation'
import { NeuronLayer } from '@/components/network/neuron_layer'
import { OutputLayerConf } from '@/components/network/output_layer_conf'

import { DataSet } from '@/data_set/data_set'
import { spawnAlert } from '@/utils/alerts'

import * as tf from '@tensorflow/tfjs'

@customElement('output-layer')
export class OutputLayer extends NeuronLayer {
  static LAYER_TYPE = 'Output'
  static LAYER_NAME = 'Output layer'

  @property()
  conf: OutputLayerConf

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties)
    if (changedProperties.has('conf')) {
      // check the updated data set keys
      if (!this.conf.dataSetLabel) {
        // if no label was assigned (should in theory not happen), notify the
        // network that this layer wants to be deleted
        this.dispatchEvent(
          new CustomEvent<OutputLayer>('query-layer-deletion', {
            detail: this,
            bubbles: true,
            composed: true,
          })
        )
        spawnAlert({
          message: `Layer ${this.getCyId()} was deleted because no data could be assigned to it!`,
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
      this.conf.dataSetLabel = this.dataSet.label
      this.dispatchEvent(
        new Event('layer-confs-updated', {
          bubbles: true,
          composed: true,
        })
      )
    }
  }

  // FACTORY - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static create({
    activation = 'None',
    pos = null,
  }: {
    activation?: ActivationOption
    pos?: Position
  } = {}): OutputLayerConf {
    // create a new dense layer element with the specified properties
    const outputLayerConf: OutputLayerConf = {
      HTML_TAG: 'output-layer',
      LAYER_TYPE: 'Output',
      LAYER_NAME: 'Output layer',
      activation: activation,
      pos: pos,
      // layer id, data set and data set label will be added by the network
      layerId: undefined,
      dataSetLabel: undefined,
    }

    // emit an layer-conf-created event - the network listens to them, so it can add
    // a unique layer id to the layer and add it to the network array
    dispatchEvent(
      new CustomEvent<OutputLayerConf>('layer-conf-created', {
        detail: outputLayerConf,
        bubbles: true,
        composed: true,
      })
    )

    return outputLayerConf
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // overwrite getName for the outputKey
  getName(): string {
    return `${this.conf.dataSetLabel.key} ${this.conf.LAYER_NAME} ${
      this.conf.activation != 'None' ? `(${this.conf.activation})` : ``
    }`
  }
  // get description
  getDescription(): string {
    let description =
      'An output layer in this simulation is just a normal dense layer, additionally equipped with the ability to output the incoming data out of the network.'
    if (this.dataSet.type == 'classification') {
      description +=
        ' Since the purpose if this layer is to output a classifiction, we should combine it with a softmax activation function in order to provide a probability distribution.'
    }
    return description
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
    const tensor = <tf.SymbolicTensor>tf.layers
      .dense({
        units: Array.from(this._neurons).length,
        activation: <tf.ActivationIdentifier>(
          activationsMap.get(this.conf.activation)
        ),
        name: this.getTensorName(),
      })
      .apply(input)
    tensor['layer_id'] = this.conf.layerId
    return tensor
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [globalStyles]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      ${super.render()}
      ${this.dataSet.type == 'regression'
        ? html`<c-neuron
            class="neuron"
            .layer="${this}"
            neuronId="1"
            .pos="${this.conf.pos}"
            label="${this.conf.dataSetLabel.key}"
            labelPos="top"
            bias="${this.bias ? this.bias[0] : null}"
          ></c-neuron>`
        : html``}
      ${this.dataSet.type == 'classification' && this.conf.dataSetLabel.classes
        ? html`${this.conf.dataSetLabel.classes.map(
            (clazz, i) => html`
              <c-neuron
                class="neuron"
                .layer="${this}"
                neuronId="${i + 1}"
                .pos="${{
                  x:
                    this.conf.pos.x +
                    i *
                      (this.canvas.NEURON_SIZE + this.canvas.NEURON_DISTANCE) -
                    ((this.conf.dataSetLabel.classes.length - 1) *
                      (this.canvas.NEURON_SIZE + this.canvas.NEURON_DISTANCE)) /
                      2,
                  y: this.conf.pos.y,
                }}"
                label="${clazz.key}"
                labelPos="top"
                bias="${this.bias ? this.bias[i] : null}"
              ></c-neuron>
            `
          )}`
        : html``}
    `
  }
}
