import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import type { CCanvas } from '@/components/canvas'
import { canvasContext } from '@/contexts/canvas_context'
import type { DataSet } from '@/types/data_set'
import { dataSetContext } from '@/contexts/data_set_context'
import type { Selected } from '@/types/selected'
import { selectedContext } from '@/contexts/selected_context'
import type { CLayer } from '@/components/network/c_layer'
import type { Position } from '@/types/position'
import { ModelUtils } from '@/utils/model_utils'

@customElement('c-neuron')
export class Neuron extends LitElementWw {
  @consume({ context: canvasContext, subscribe: true })
  canvas: CCanvas

  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  @consume({ context: selectedContext, subscribe: true })
  selected: Selected

  // reference to the layer
  @property()
  layer: CLayer

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
  // -> INFO - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // return the id of the element in the canvas
  getCyId(): string {
    return `${this.layer.getCyId()}n${this.neuronId}`
  }

  getName(): string {
    return `Neuron ${this.neuronId} inside ${this.layer.getName()}`
  }

  // -> CANVAS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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

  // -> MISC - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  openCorrespondingPanel(): void {
    this.dispatchEvent(
      new CustomEvent<string>('open-panel', {
        detail: 'neuron',
        bubbles: true,
        composed: true,
      })
    )
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = globalStyles

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
          label: ModelUtils.formatWeight(this.bias),
          wrapped: `${String(wrapped)}`,
        },
        position: this.pos,
      })

      // confirm that this neuron has rendered (important for the layer
      // connections that rely on the neurons)
      this.rendered = true

      // add the element to the selected context (which will also take care of
      // selecting the element in cytoscape)
      if (this.selected?.neuron == this.getCyId()) {
        this.dispatchEvent(
          new CustomEvent<Neuron>('selected-ele-rendered', {
            detail: this,
            bubbles: true,
            composed: true,
          })
        )
      }

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
