import { LitElementWw } from '@webwriter/lit'
import { CSSResult } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { canvasContext } from '@/contexts/canvas_context'
import { Selected, selectedContext } from '@/contexts/selected_context'
import type { CCanvas } from '@/components/canvas'
import { Neuron } from '@/network/neuron'

@customElement('c-edge')
export class CEdge extends LitElementWw {
  @consume({ context: canvasContext, subscribe: true })
  canvas: CCanvas

  @consume({ context: selectedContext, subscribe: true })
  selected: Selected

  @property()
  source: Neuron

  @property()
  target: Neuron

  @property()
  sourceLayerId: number

  @property()
  targetLayerId: number

  @property()
  weight: number

  @state()
  doNotRender = false

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  connectedCallback(): void {
    super.connectedCallback()
    this.doNotRender = false
  }

  // remove the edge on disconnect
  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.doNotRender = true
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get the unique cytoscape id for this edge
  getCyId(): string {
    return `${this.source.getCyId()}e${this.target.getCyId()}`
  }

  // remove the edge from the canvas
  removeFromCanvas(): void {
    const ele = this.canvas.cy.getElementById(this.getCyId())
    if (ele.length) {
      ele.remove()
    }
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): void {
    console.log('RENDER EDGE')
    if (!this.doNotRender) {
      this.removeFromCanvas()
      this.canvas.cy.add({
        group: 'edges',
        data: {
          id: this.getCyId(),
          source: this.source.getCyId(),
          target: this.target.getCyId(),
          sourceLayer: this.sourceLayerId,
          targetLayer: this.targetLayerId,
          weight: this.weight,
        },
      })

      // add the element to the selected context (which will also take care of
      // selecting the element in cytoscape)
      if (this.selected?.edge == this.getCyId()) {
        this.dispatchEvent(
          new CustomEvent<CEdge>('selected-ele-rendered', {
            detail: this,
            bubbles: true,
            composed: true,
          })
        )
      }
    }
  }
}
