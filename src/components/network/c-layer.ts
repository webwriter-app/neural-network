import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { property, queryAll } from 'lit/decorators.js'
import { consume } from '@lit/context'
import { widgetMsg } from '@webwriter/lit/localize'
import { str } from '@lit/localize'

import type { DataSet } from '../../model/data-types'
import { dataSetContext } from '../contexts'
import type { CLayerConf } from '../../model/network-types'
import type { Activation } from '../../model/network-types'
import type { CNeuron } from './neuron'
import type { TrainOptions } from '../../model/network-types'
import { trainOptionsContext } from '../contexts'
import type { Selected } from '../../model/app-types'
import { selectedContext } from '../contexts'

import * as tf from '@tensorflow/tfjs'

import { AlertUtils } from '../../model/alert-utils'
import { layerName } from './layer-name'
import { describeNeurons } from '../../model/network-layout'

export abstract class CLayer<Conf extends CLayerConf = CLayerConf> extends LitElementWw {
  protected readonly msg = widgetMsg(this)

  // the data set is stored as a property for the layer to realize changes in
  // the data set in lifecycle hooks and respond to them
  @consume({ context: dataSetContext, subscribe: true })
  @property({ attribute: false })
  accessor dataSet: DataSet

  @consume({ context: selectedContext, subscribe: true })
  accessor selected: Selected

  @consume({ context: trainOptionsContext, subscribe: true })
  accessor trainOptions: TrainOptions

  @property({ attribute: false })
  accessor conf: Conf

  @property({ attribute: false })
  accessor tensor: tf.SymbolicTensor | undefined

  @property({ attribute: false })
  accessor weights: Float32Array | undefined

  @property({ attribute: false })
  accessor bias: Float32Array | undefined

  @queryAll('c-neuron')
  accessor _neurons: NodeListOf<CNeuron>

  // a type and description that is displayed as an info for the layer
  static LAYER_TYPE: string
  static LAYER_NAME: string

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  connectedCallback(): void {
    super.connectedCallback()
    if (this.conf.firstSpawn) {
      AlertUtils.spawn({
        message: this.msg(str`'${this.getName()}' has been created!`),
        variant: 'success',
        icon: 'check-circle',
      })
      this.conf.firstSpawn = false
      this.dispatchEvent(
        new Event('update-layer-confs', {
          bubbles: true,
          composed: true,
        })
      )
    }
  }

  updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties)
    // the weights and biases are drawn in the connections and the canvas
    if (changedProperties.has('weights') || changedProperties.has('bias')) {
      this.dispatchEvent(
        new CustomEvent<number>('layer-updated', {
          detail: this.conf.layerId,
          bubbles: true,
          composed: true,
        })
      )
    }
    if (this.selected?.layer == this.getId()) {
      this.dispatchEvent(
        new CustomEvent<CLayer>('selected-ele-rendered', {
          detail: this,
          bubbles: true,
          composed: true,
        })
      )
    }
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> INFORMATION  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get the neurons of the layer. used for layer connections
  getNeurons(): CNeuron[] {
    return Array.from(this._neurons)
  }

  // get a readable name for this layer that is displayed in the UI. do not use
  // the name for referencing purposes (can be overwritten by the
  // implementations)
  getName(): string {
    return layerName(this.conf, this.msg)
  }

  // get a description of the layer that may contain the type and purpose of the
  // layer (to be overwritten by the implementations)
  getDescription(): string {
    return ''
  }

  // -> ACTIONS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // set the activation function
  setActivation(activation: Activation): void {
    this.conf.activation = activation
  }

  // duplicates the layer by creating a copy of this layer with changes in
  // position and id
  abstract duplicate(): void

  // completely deletes the layer
  delete(): void {
    dispatchEvent(
      new CustomEvent<CLayer>('query-layer-deletion', {
        detail: this,
        bubbles: true,
        composed: true,
      })
    )
  }

  // -> ID - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // the id of the layer in the selection
  getId(): string {
    return `${this.conf.layerId}`
  }

  // -> MODEL  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // every layer needs to implement a build function that takes the layer
  // configuration into account and builds a symbolic tensor that is then used
  // in the model.
  abstract build(inputs: tf.SymbolicTensor[]): tf.SymbolicTensor

  // in the build method, layers are supposed to call this method to get a
  // unique name for the corresponding layer. currently not important
  getTensorName(): string {
    return this.conf.layerId.toString()
  }

  // -> MISC - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  openCorrespondingPanel(): void {
    this.dispatchEvent(
      new CustomEvent<string>('open-panel', {
        detail: 'layer',
        bubbles: true,
        composed: true,
      })
    )
  }

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // the canvas draws the layer; these elements are what the connections, the
  // panels and the model refer to
  render(): TemplateResult<1> {
    return html`${describeNeurons(this.conf, this.dataSet, this.bias).map(
      (neuron) => html`
        <c-neuron
          .layer=${this}
          .neuronId=${neuron.neuronId}
          .key=${neuron.key}
          .keyPos=${neuron.keyPos}
          .bias=${neuron.bias}
        ></c-neuron>
      `
    )}`
  }
}
