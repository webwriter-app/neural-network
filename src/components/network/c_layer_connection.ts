import { LitElementWw } from '@webwriter/lit'
import { CSSResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { consume } from '@lit-labs/context'
import { Canvas, canvasContext } from '@/contexts/canvas_context'

import { globalStyles } from '@/global_styles'

import { CLayer } from '@/components/network/c_layer'

@customElement('c-layer-connection')
export class CLayerConnection extends LitElementWw {
  @consume({ context: canvasContext, subscribe: true })
  canvas: Canvas

  @property()
  sourceLayer: CLayer

  @property()
  targetLayer: CLayer

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // completely remove the connection on disconnect
  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeFromCanvas()
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // remove the connection from the canvas
  removeFromCanvas(): void {
    const eles = this.canvas.cy.filter((element) => {
      return (
        element.isEdge() &&
        element.data('sourceLayer') == this.sourceLayer.layerId &&
        element.data('targetLayer') == this.targetLayer.layerId
      )
    }, this)
    eles.remove()
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [globalStyles]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): void {
    // only render the connection if the layers are already rendered
    if (
      this.canvas.cy.getElementById(this.sourceLayer.getCyId()).length &&
      this.canvas.cy.getElementById(this.targetLayer.getCyId()).length
    ) {
      // remove potential previously drawn connection
      this.removeFromCanvas()

      const sourceIds: string[] = this.sourceLayer.getConnectionIds()
      const targetIds: string[] = this.targetLayer.getConnectionIds()

      for (const sourceId of sourceIds) {
        for (const targetId of targetIds) {
          this.canvas.cy.add({
            group: 'edges',
            data: {
              id: `${sourceId}e${targetId}`,
              source: sourceId,
              target: targetId,
              sourceLayer: this.sourceLayer.layerId,
              targetLayer: this.targetLayer.layerId,
            },
          })
        }
      }
    }
  }
}
