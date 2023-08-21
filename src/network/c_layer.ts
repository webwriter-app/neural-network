import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property, queryAll, state } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { canvasContext } from '@/contexts/canvas_context'
import { Selected, selectedContext } from '@/contexts/selected_context'
import { dataSetContext } from '@/contexts/data_set_context'
import {
  trainOptionsContext,
  TrainOptions,
} from '@/contexts/train_options_context'

import type { CCanvas } from '@/components/canvas'

import * as tf from '@tensorflow/tfjs'

import { DataSet } from '@/data_set/data_set'
import { CLayerConf } from '@/network/c_layer_conf'
import { Activation, actNone } from '@/network/activation'
import { Neuron } from '@/network/neuron'

@customElement('c-layer')
export abstract class CLayer extends LitElementWw {
  @consume({ context: canvasContext, subscribe: true })
  canvas: CCanvas

  @consume({ context: dataSetContext, subscribe: true })
  @property({ attribute: false })
  dataSet: DataSet

  @consume({ context: selectedContext, subscribe: true })
  selected: Selected

  @consume({ context: trainOptionsContext, subscribe: true })
  trainOptions: TrainOptions

  @property({ attribute: false })
  conf: CLayerConf

  @property({ attribute: false })
  tensor: tf.SymbolicTensor

  @property({ attribute: false })
  weights: Float32Array

  @property({ attribute: false })
  bias: Float32Array

  // sometimes lit lifecycle hooks are really frustrating since it may happen
  // that render() is executed even after disconnectedCallback(). If we would
  // render html this would be no problem since it would be removed right after
  // that, but as we add something to cytoscape, this is permanent. So we
  // prevent from rendering to cytoscape after disconnectedCallback was called
  @state()
  doNotRender = false

  @property({ attribute: false })
  time = 0

  @state()
  positionListenerActive: boolean = false

  @queryAll('c-neuron')
  _neurons: NodeListOf<Neuron>

  // a type and description that is displayed as an info for the layer
  static LAYER_TYPE: string
  static LAYER_NAME: string

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  connectedCallback(): void {
    super.connectedCallback()
    this.doNotRender = false
    console.log(this.getName())
    console.log('connected')
  }

  updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties)
    if (!this.positionListenerActive) {
      this.positionListenerActive = true
      // add an event listener that updates the layer position when layer position
      // changes
      this.canvas.cy
        .getElementById(this.getCyId())
        .on('dragfree', (_e) => this.updateInternalPos())
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.doNotRender = true
    this.positionListenerActive = false
    console.log(this.getName())
    console.log('disconnected')
    this.removeFromCanvas()
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> INFORMATION  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get the already rendered neurons. used for layer connections so that the
  // connection class knows where to draw an edge. filtering by rendered neurons
  // is necessary since else, the connection class would attempt to draw a
  // connection from/to a node that does not exist and will throw an error. when
  // neurons are rendered, they trigger a redrawing of the connection
  // afterwards, so eventhough we filter by rendered neurons eventually, after
  // the last neuron has been drawn, all neurons are rendered and thus this
  // method will return all neurons
  getNeurons(): Neuron[] {
    return Array.from(this._neurons).filter((neuron) => neuron.rendered)
  }

  // CANVAS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // return the id of the element in the canvas
  getCyId(): string {
    return `${this.conf.layerId}`
  }

  // update internal position
  updateInternalPos(): void {
    const layerCy = this.canvas.cy.getElementById(this.getCyId())
    /*       const firstNeuronCy = this.canvas.cy.getElementById(
        this.neurons[0].getCyId()
      ) */
    if (layerCy.length /* && firstNeuronCy.length */) {
      this.conf.pos = {
        x: layerCy.position().x,
        y: layerCy.position().y /* firstNeuronCy.position().y */,
      }
      this.dispatchEvent(
        new Event('update-layer-confs', {
          bubbles: true,
          composed: true,
        })
      )
    }
  }

  // remove the previous built layer if exists. these are all nodes with its
  // layer property being this.layerId or edges with either source or target being
  // this.layerId
  removeFromCanvas(): void {
    const ele = this.canvas.cy.getElementById(this.getCyId())
    if (ele.length) {
      ele.remove()
    }
  }

  // LAYER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get a readable name for this layer that is displayed in the UI. do not use
  // the name for referencing purposes
  getName(): string {
    return `${this.conf.layerId} - ${this.conf.LAYER_NAME} ${
      this.conf.activation != actNone ? `(${this.conf.activation.name})` : ``
    }`
  }

  // get a description of the layer that may contain the type and purpose of the
  // layer
  abstract getDescription(): string

  // set the activation function
  setActivation(activation: Activation): void {
    this.conf.activation = activation

    // also update the label of the layer in the canvas
    this.canvas.cy
      .getElementById(`${this.conf.layerId}`)
      .data('label', this.getName())
  }

  // MODEL - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  abstract build(inputs: tf.SymbolicTensor[]): tf.SymbolicTensor

  getTensorName(): string {
    return this.conf.layerId.toString()
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    if (!this.doNotRender && this.canvas?.cy) {
      // layer is only rendered once
      if (!this.canvas.cy.getElementById(this.getCyId()).length)
        // draw the layer
        this.canvas.cy.add({
          group: 'nodes',
          data: {
            id: this.getCyId(),
            label: this.getName(),
            type: 'layer',
            layer: this.conf.layerId,
            layer_type: `${this.conf.LAYER_TYPE}`,
          },
        })

      // add the element to the selected context (which will also take care of
      // selecting the element in cytoscape)
      if (this.selected?.layer == this.getCyId()) {
        this.dispatchEvent(
          new CustomEvent<CLayer>('selected-ele-rendered', {
            detail: this,
            bubbles: true,
            composed: true,
          })
        )
      }
    }
    return html``
  }
}
