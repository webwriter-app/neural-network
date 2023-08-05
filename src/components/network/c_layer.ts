import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
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
import { CLayerConf } from '@/components/network/c_layer_conf'
import { ActivationOption } from '@/components/network/activation'

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

  @state()
  positionListenerActive: boolean = false

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
        new Event('layer-confs-updated', {
          bubbles: true,
          composed: true,
        })
      )
    }
  }

  // each subclass should specify a function that returns an array of cytoscape
  // node ids that should be connected to other allow to allow flexibility in
  // whether connecting the layer as a whole, all neurons in the layer or
  // anything other
  abstract getConnectionIds(): string[]

  // remove the previous built layer if exists. these are all nodes with its
  // layer property being this.layerId or edges with either source or target being
  // this.layerId
  removeFromCanvas(): void {
    const eles = this.canvas.cy.filter((element) => {
      return element.isNode() && element.data('layer') == this.conf.layerId
    }, this)
    eles.remove()
  }

  // LAYER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get a readable name for this layer that is displayed in the UI. do not use
  // the name for referencing purposes
  getName(): string {
    return `${this.conf.layerId} - ${this.conf.LAYER_NAME} ${
      this.conf.activation != 'None' ? `(${this.conf.activation})` : ``
    }`
  }

  // get a description of the layer that may contain the type and purpose of the
  // layer
  abstract getDescription(): string

  // set the activation function
  setActivation(activation: ActivationOption): void {
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
  static styles: CSSResult[] = [globalStyles]

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
      // select the layer
      console.log(this.selected?.layer?.conf?.layerId == this.conf?.layerId)
      if (this.selected?.layer?.conf?.layerId == this.conf?.layerId) {
        console.log(this.canvas.cy.getElementById(this.getCyId()))
        //this.canvas.cy.getElementById(this.getCyId()).select()
      }
      return html``
    }
  }
}
