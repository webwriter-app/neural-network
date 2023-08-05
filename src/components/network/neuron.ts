import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { canvasContext } from '@/contexts/canvas_context'
import { dataSetContext } from '@/contexts/data_set_context'
import { DataSet } from '@/data_set/data_set'

import type { CCanvas } from '@/components/canvas'

import { NeuronLayer } from '@/components/network/neuron_layer'
import { Position } from '@/types/position'

@customElement('c-neuron')
export class Neuron extends LitElementWw {
  @consume({ context: canvasContext, subscribe: true })
  canvas: CCanvas

  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  // reference to the layer
  @property()
  layer: NeuronLayer

  // position
  @property()
  pos: Position

  // the id of the neuron in this layer. first neuron added gets id 1; not to be
  // confused with the id of the corresponding node in the cytoscape canvas
  // (CyId), which can be requested using a method
  @property()
  neuronId: number

  // key of the corresponding dataSet input or label as a label beneath
  @property()
  label: string
  @property()
  labelPos: 'bottom' | 'top'

  // bias of the neuron that is to be trained
  @property()
  bias: number

  // if the neuron has been rendered for the first time
  @state()
  rendered = false

  // same as in c_layer, explanation see there
  @state()
  doNotRender = false

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  connectedCallback(): void {
    super.connectedCallback()
    this.doNotRender = false
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.doNotRender = true
    this.removeFromCanvas()
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
    // only render if doNotRender flag is not set
    // and the parent (the layer) exists
    if (
      !this.doNotRender &&
      this.canvas.cy.getElementById(this.layer.getCyId()).length
    ) {
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
            textPos: this.labelPos,
            layer: this.layer.conf.layerId,
            neuron: this.neuronId,
            label: this.label,
          },
        })

        neuronParent = `${this.getCyId()}w`
        wrapped = true
      }

      // display all bias values in the same format
      let biasLabel: string
      if (!this.bias) {
        biasLabel = ''
      } else if (!isFinite(this.bias)) {
        biasLabel = this.bias.toString()
      } else {
        biasLabel = (this.bias < 0 ? '' : '+') + this.bias
        biasLabel = biasLabel.substring(0, 6)
        if (biasLabel.indexOf('.') != -1) {
          biasLabel = biasLabel.padEnd(6, '0')
        }
      }

      /// add the neuron to the canvas
      this.canvas.cy.add({
        group: 'nodes',
        grabbable: false,
        data: {
          id: this.getCyId(),
          parent: neuronParent,
          type: 'neuron',
          layer: this.layer.conf.layerId,
          neuron: this.neuronId,
          label: biasLabel,
          wrapped: `${String(wrapped)}`,
        },
        position: this.pos,
      })

      // confirm that this neuron has rendered (important for the layer
      // connections that rely on the neurons)
      this.rendered = true

      // notify the network that the parent layer changed its neurons and thus,
      // connections from and to this layer have to be rerendered
      this.dispatchEvent(
        new CustomEvent<number>('layer-updated', {
          detail: this.layer.conf.layerId,
          bubbles: true,
          composed: true,
        })
      )
    }

    return html``
  }
}
