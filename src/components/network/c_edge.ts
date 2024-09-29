import { LitElementWw } from '@webwriter/lit'
import { customElement, property, state } from 'lit/decorators.js'
import { consume } from '@lit/context'

import type { CCanvas } from '@/components/canvas'
import { canvasContext } from '@/contexts/canvas_context'
import type { CNeuron } from '@/components/network/neuron'
import type { Selected } from '@/types/selected'
import { selectedContext } from '@/contexts/selected_context'

export class CEdge extends LitElementWw {
  @consume({ context: canvasContext, subscribe: true })
  accessor canvas: CCanvas

  @consume({ context: selectedContext, subscribe: true })
  accessor selected: Selected

  @property()
  accessor source: CNeuron

  @property()
  accessor target: CNeuron

  @property()
  accessor sourceLayerId: number

  @property()
  accessor targetLayerId: number

  @property()
  accessor weight: number

  @state()
  accessor doNotRender = false

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
  // -> INFO - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get the unique cytoscape id for this edge
  getCyId(): string {
    return `${this.source.getCyId()}e${this.target.getCyId()}`
  }

  // -> CANVAS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // remove the edge from the canvas
  removeFromCanvas(): void {
    const ele = this.canvas.cy.getElementById(this.getCyId())
    if (ele.length) {
      ele.remove()
    }
  }

  // -> MISC - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  openCorrespondingPanel(): void {
    this.dispatchEvent(
      new CustomEvent<string>('open-panel', {
        detail: 'edge',
        bubbles: true,
        composed: true,
      })
    )
  }

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
