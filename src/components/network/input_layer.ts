import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import type { DataSet } from '@/types/data_set'
import type { InputLayerConf } from '@/types/input_layer_conf'
import type { Position } from '@/types/position'
import type { Activation } from '@/types/activation'
import { CLayer } from '@/components/network/c_layer'
import { NetworkUtils } from '@/utils/network_utils'

import { AlertUtils } from '@/utils/alert_utils'

import * as tf from '@tensorflow/tfjs'

// an input layer is a special type of a neuron layer. We do not allow
// activation functions and provide methods to assign input data from the
// dataSet to this input layer. We do not allow manual editing of the neurons
// and other layers can not connect to an input layer. Neurons in the input
// layer are marked with the name of the associated input
@customElement('input-layer')
export class InputLayer extends CLayer {
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
        this.delete()
        AlertUtils.spawn({
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
        new Event('update-layer-confs', {
          bubbles: true,
          composed: true,
        })
      )
    }
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> INFO - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // overwrite getName function because activation function is always 'None' for
  // input layer
  getName(): string {
    return `${this.conf.layerId} - ${this.conf.LAYER_NAME}`
  }

  // get description
  getDescription(): string {
    return 'An input layer is a layer that just takes data provided from outside the network and passes it on to the next layer(s)'
  }

  // -> CREATING - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // creates a new input layer with the optionally specified properties
  static create({
    activation = NetworkUtils.actNone,
    dataSetKeys = undefined,
    pos = undefined,
  }: {
    activation?: Activation
    dataSetKeys?: string[]
    pos?: Position
  } = {}): InputLayerConf {
    // create a new dense layer configuration with the specified properties
    const inputLayerConf: InputLayerConf = {
      HTML_TAG: 'input-layer',
      LAYER_TYPE: 'Input',
      LAYER_NAME: 'Input layer',
      activation: activation,
      pos: pos,
      firstSpawn: true,
      // layer id and data set keys will be added by the layer
      layerId: undefined,
      dataSetKeys: dataSetKeys,
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
      this.canvas.getHeight(this.getCyId()) + this.canvas.LAYER_DISTANCE
    InputLayer.create({
      activation: this.conf.activation,
      dataSetKeys: this.conf.dataSetKeys,
      pos: newPos,
    })
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
  static styles: CSSResult[] = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      ${super.render()}
      ${this.conf.pos
        ? html`${this.conf.dataSetKeys.map(
            (dataSetKey, i) => html`
              <c-neuron
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
