import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

import { consume } from '@lit-labs/context'
import { Canvas, canvasContext } from '@/contexts/canvas_context'
import { dataSetContext } from '@/contexts/data_set_context'
import { DataSet } from '@/data_set/data_set'

import { globalStyles } from '@/global_styles'
import { NeuronLayer } from '@/components/network/neuron_layer'

import { InputLayer } from './input_layer'

@customElement('c-neuron')
export class Neuron extends LitElementWw {
  @consume({ context: canvasContext, subscribe: true })
  canvas: Canvas

  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  // reference to the layer
  @property()
  layer: NeuronLayer

  // the id of the neuron in this layer. first neuron added gets id 1; not to be
  // confused with the id of the corresponding node in the cytoscape canvas
  // (CyId), which can be requested using a method
  @property()
  neuronId: number

  // key of the corresponding dataSet input or label as a label beneath
  @property()
  label: string

  // value of the neuron between 0 and 1 that is to be trained
  @state()
  value: number

  // if the neuron has been rendered for the first time
  @state()
  rendered = false

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  connectedCallback(): void {
    super.connectedCallback()
    this.value = Math.random()
  }

  firstUpdated() {
    if (this.label) {
      this.dataSet.assignKey(this.label, this.layer)
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    if (this.label) {
      this.dataSet.unassignKey(this.label)
    }
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // return the id of the element in the canvas
  getCyId(): string {
    return `${this.layer.getCyId()}n${this.neuronId}`
  }

  // remove the neuron from the canvas
  removeFromCanvas(): void {
    // find the neuron in the canvas
    const neuronCy = this.canvas.cy.getElementById(this.getCyId())

    // if the neuron exists in the canvas, remove it
    if (neuronCy.length) {
      // shift the layer back to the right (except the first neuron since we
      // also did not shift to the left)
      if (this.neuronId != 1) {
        this.canvas.cy
          .getElementById(this.layer.getCyId())
          .shift(
            'x',
            (this.canvas.NEURON_SIZE + this.canvas.NEURON_DISTANCE) / 2
          )
      }

      // remove the neuron from the canvas
      neuronCy.remove()

      // also remove the wrapper if it exists
      const neuronWrapperCy = this.canvas.cy.getElementById(
        `${this.getCyId()}w`
      )
      if (neuronWrapperCy) {
        neuronWrapperCy.remove()
      }
    }
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [globalStyles]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    // remove the previously built neuron if exists
    this.removeFromCanvas()

    // for the input and output layers we add a wrapper around the neuron that
    // indicates that this node is input/output and in order to display an
    // additional label
    let neuronParent: string = this.layer.getCyId()
    let wrapped = false
    if (this.label) {
      this.canvas.cy.add({
        group: 'nodes',
        grabbable: false,
        selectable: false,
        data: {
          id: `${this.getCyId()}w`,
          parent: neuronParent,
          type: 'neuron-wrapper',
          layer: this.layer.layerId,
          neuron: this.neuronId,
          label: this.label,
        },
        css: {
          'z-index': this.layer.layerId * 3 + 1,
        },
      })

      neuronParent = `${this.getCyId()}w`
      wrapped = true
    }

    /// add the neuron to the canvas
    this.canvas.cy.add({
      group: 'nodes',
      grabbable: false,
      data: {
        id: this.getCyId(),
        parent: neuronParent,
        type: 'neuron',
        layer: this.layer.layerId,
        neuron: this.neuronId,
        label: `${this.value}`.substring(0, 3),
        wrapped: `${String(wrapped)}`,
      },
      position: this.layer.getPositionForUnit(this.neuronId),
      css: {
        'z-index': this.layer.layerId * 3 + 2,
      },
    })

    // confirm that this neuron has rendered (important for the layer
    // connections that rely on the neurons)
    this.rendered = true

    // shift the layer to the left (except the first neuron since that should
    // resemble the initial position)
    if (this.neuronId != 1) {
      this.canvas.cy
        .getElementById(this.layer.getCyId())
        .shift(
          'x',
          -(this.canvas.NEURON_SIZE + this.canvas.NEURON_DISTANCE) / 2
        )
    }

    if (this.layer instanceof InputLayer)
      console.log('shifted neuron for ' + this.label + ' left')

    // notify the network that the parent layer changed its neurons and thus,
    // connections from and to this layer have to be rerendered
    this.dispatchEvent(
      new CustomEvent<number>('layer-updated', {
        detail: this.layer.layerId,
        bubbles: true,
        composed: true,
      })
    )

    return html``
  }
}
