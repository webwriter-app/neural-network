import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { Position } from '@/types/position'
import { ActivationOption } from '@/components/network/activation'
import { InputLayerConf } from '@/components/network/input_layer_conf'
import { NeuronLayer } from '@/components/network/neuron_layer'
import { spawnAlert } from '@/utils/alerts'

import { DataSet } from '@/data_set/data_set'

import * as tf from '@tensorflow/tfjs'

// an input layer is a special type of a neuron layer. We do not allow
// activation functions and provide methods to assign input data from the
// dataSet to this input layer. We do not allow manual editing of the neurons
// and other layers can not connect to an input layer. Neurons in the input
// layer are marked with the name of the associated input
@customElement('input-layer')
export class InputLayer extends NeuronLayer {
  @property()
  conf: InputLayerConf

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties)
    if (changedProperties.has('conf')) {
      // check the updated data set keys
      if (!this.conf.dataSetKeys.length) {
        // if no key was assigned, notify the network that this layer wants to
        // be deleted
        this.dispatchEvent(
          new CustomEvent<InputLayer>('query-layer-deletion', {
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
      this.conf.dataSetKeys = this.dataSet.inputs.map((input) => input.key)
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
  } = {}): InputLayerConf {
    // create a new dense layer configuration with the specified properties
    const inputLayerConf: InputLayerConf = {
      HTML_TAG: 'input-layer',
      LAYER_TYPE: 'Input',
      LAYER_NAME: 'Input layer',
      activation: activation,
      pos: pos,
      // layer id, data set and data set keys will be added by the layer
      layerId: undefined,
      dataSetKeys: undefined,
    }

    // emit an layer-conf-created event - the network listens to them, so it can add
    // a unique layer id to the layer conf and add it to the network array
    dispatchEvent(
      new CustomEvent<InputLayerConf>('layer-conf-created', {
        detail: inputLayerConf,
        bubbles: true,
        composed: true,
      })
    )

    return inputLayerConf
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // overwrite getName function because activation function is always 'None' for
  // input layer
  getName(): string {
    return `${this.conf.layerId} - ${this.conf.LAYER_NAME}`
  }

  // get description
  getDescription(): string {
    return 'An input layer is a layer that just takes data provided from outside the network and passes it on to the next layer(s)'
  }

  // -> DATASET  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // assigning inputs
  getAssignedInputs(): string[] {
    return Array.from(this._neurons).map((neuron) => neuron.label)
  }

  // -> BUILD  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  build(inputs: tf.SymbolicTensor[]): tf.SymbolicTensor {
    <[]>inputs
    //  create our input tensor
    const tensor = tf.input({
      shape: [this.conf.dataSetKeys.length],
      name: this.getTensorName(),
    })
    tensor['layer_id'] = this.conf.layerId
    return tensor
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [globalStyles]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      ${super.render()}
      ${this.conf.pos
        ? html`${this.conf.dataSetKeys.map(
            (dataSetKey, i) => html`
              <c-neuron
                class="neuron"
                .layer="${this}"
                neuronId="${i + 1}"
                .pos="${{
                  x:
                    this.conf.pos.x +
                    i *
                      (this.canvas.NEURON_SIZE + this.canvas.NEURON_DISTANCE) -
                    ((this.conf.dataSetKeys.length - 1) *
                      (this.canvas.NEURON_SIZE + this.canvas.NEURON_DISTANCE)) /
                      2,
                  y: this.conf.pos.y,
                }}"
                label="${dataSetKey}"
                labelPos="bottom"
              ></c-neuron>
            `
          )}`
        : html``}
    `
  }
}
