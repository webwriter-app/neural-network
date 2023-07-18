import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { consume } from '@lit-labs/context'
import { Canvas, canvasContext } from '@/contexts/canvas_context'

import { globalStyles } from '@/global_styles'

import * as tf from '@tensorflow/tfjs'

import { ActivationOption } from '@/components/network/activation'

import { spawnAlert } from '@/utils/alerts'

@customElement('c-layer')
export abstract class CLayer extends LitElementWw {
  // to not have any typescript errors when referencing static properthis via
  // instance.constructor
  declare ['constructor']: typeof CLayer

  @consume({ context: canvasContext, subscribe: true })
  canvas: Canvas

  @property()
  layerId: number

  @property()
  activation: ActivationOption

  // tensor
  @property()
  tensor: tf.SymbolicTensor = null

  @property()
  alert = true

  // a type and description that is displayed as an info for the layer
  static LAYER_TYPE: string
  static LAYER_NAME: string

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  connectedCallback(): void {
    super.connectedCallback()
    if (this.alert) {
      spawnAlert({
        message: `${this.getName()} has been created!`,
        variant: 'success',
        icon: 'check-circle',
      })
    }
  }

  disconnectedCallback(): void {
    this.removeFromCanvas()
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // CANVAS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // return the id of the element in the canvas
  getCyId(): string {
    return `${this.layerId}`
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
      return element.isNode() && element.data('layer') == this.layerId
    }, this)
    eles.remove()
  }

  // LAYER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get a readable name for this layer that is displayed in the UI. do not use
  // the name for referencing purposes
  getName(): string {
    return `${this.layerId} - ${this.constructor.LAYER_NAME} ${
      this.activation != 'None' ? `(${this.activation})` : ``
    }`
  }

  // duplicates the layer - by default this method spawns only an error message
  // but layers that allow duplication can overwrite it and create a new layer
  // node and fire an event for the network to add this layer
  duplicate(): void {
    spawnAlert({
      message: `Layer '${this.getName()}' can not be duplicated!`,
      variant: 'warning',
      icon: 'x-circle',
    })
  }

  // get a description of the layer that may contain the type and purpose of the
  // layer
  abstract getDescription(): string

  // set the activation function
  setActivation(activation: ActivationOption): void {
    this.activation = activation

    // also update the label of the layer in the canvas
    this.canvas.cy
      .getElementById(`${this.layerId}`)
      .data('label', this.getName())
  }

  // BUILDING  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //abstract build(): void

  getTensorName(): string {
    return this.getName()
      .replace(/\s+/g, '')
      .replace(/[^\w ]/g, '')
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [globalStyles]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    // layer is only rendered once
    if (!this.canvas.cy.getElementById(this.getCyId()).length)
      // draw the layer
      this.canvas.cy.add({
        group: 'nodes',
        data: {
          id: this.getCyId(),
          label: this.getName(),
          type: 'layer',
          layer: this.layerId,
          layer_type: `${this.constructor.LAYER_TYPE}`,
        },
        css: {
          'z-index': this.layerId * 3,
        },
      })
    return html``
  }
}
