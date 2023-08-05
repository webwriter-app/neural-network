import { LitElementWw } from '@webwriter/lit'
import { CSSResult } from 'lit'
import { customElement, state, property } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { canvasContext } from '@/contexts/canvas_context'
import { networkContext } from '@/contexts/network_context'
import { layerConfsContext } from '@/contexts/layer_confs_context'

import type { CCanvas } from '@/components/canvas'

import { Network } from '@/components/network/network'
import { CLayerConf } from '@/components/network/c_layer_conf'
import { CLayerConnectionConf } from '@/components/network/c_layer_connection_conf'

@customElement('c-layer-connection')
export class CLayerConnection extends LitElementWw {
  @consume({ context: canvasContext, subscribe: true })
  canvas: CCanvas

  @consume({ context: layerConfsContext, subscribe: true })
  layerConfs: CLayerConf[]

  @consume({ context: networkContext, subscribe: true })
  network: Network

  @property()
  conf: CLayerConnectionConf

  // sometimes lit lifecycle hooks are really frustrating since it may happen
  // that render() is executed even after disconnectedCallback(). If we would
  // render html this would be no problem since it would be removed right after
  // that, but as we add something to cytoscape, this is permanent. So we
  // prevent from rendering to cytoscape after disconnectedCallback was called
  @state()
  doNotRender = false

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  connectedCallback(): void {
    super.connectedCallback()
    this.doNotRender = false
  }

  // completely remove the connection on disconnect
  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.doNotRender = true
    this.removeFromCanvas()
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // remove the connection from the canvas
  removeFromCanvas(): void {
    const eles = this.canvas.cy.filter((element) => {
      return (
        element.isEdge() &&
        element.data('sourceLayer') == this.conf.sourceLayerId &&
        element.data('targetLayer') == this.conf.sourceLayerId
      )
    }, this)
    eles.remove()
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [globalStyles]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): void {
    if (!this.doNotRender) {
      // get layers from network
      const sourceLayer = this.network.getLayerById(this.conf.sourceLayerId)
      const targetLayer = this.network.getLayerById(this.conf.targetLayerId)
      if (!sourceLayer || !targetLayer) {
        throw new Error('layer not found by id')
      }
      // only render the connection if the layers are already rendered
      if (
        this.canvas.cy.getElementById(sourceLayer.getCyId()).length &&
        this.canvas.cy.getElementById(targetLayer.getCyId()).length
      ) {
        // remove potential previously drawn connection
        this.removeFromCanvas()

        // get the ids of all the cytoscape elements to connect from and to
        const sourceIds: string[] = sourceLayer.getConnectionIds()
        const targetIds: string[] = targetLayer.getConnectionIds()

        // connect every source id to every target id
        let i = 0
        for (const sourceId of sourceIds) {
          for (const targetId of targetIds) {
            this.canvas.cy.add({
              group: 'edges',
              data: {
                id: `${sourceId}e${targetId}`,
                source: sourceId,
                target: targetId,
                sourceLayer: this.conf.sourceLayerId,
                targetLayer: this.conf.targetLayerId,
                weight: targetLayer.weights?.[i],
              },
            })
            i++
          }
        }
      }
    }
  }
}
