import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement, state, property, queryAll } from 'lit/decorators.js'
import { consume } from '@lit/context'

import type { CCanvas } from '@/components/canvas'
import { canvasContext } from '@/contexts/canvas_context'
import type { CLayerConf } from '@/types/c_layer_conf'
import type { CLayerConnectionConf } from '@/types/c_layer_connection_conf'
import type { CNetwork } from '@/components/network/network'
import type { CNeuron } from '@/components/network/neuron'
import { CEdge } from '@/components/network/c_edge'
import { networkContext } from '@/contexts/network_context'
import { layerConfsContext } from '@/contexts/layer_confs_context'

export class CLayerConnection extends LitElementWw {

  static scopedElements = {
    "c-edge": CEdge
  }

  @consume({ context: canvasContext, subscribe: true })
  accessor canvas: CCanvas

  @consume({ context: layerConfsContext, subscribe: true })
  accessor layerConfs: CLayerConf[]

  @consume({ context: networkContext, subscribe: true })
  accessor network: CNetwork

  @property()
  accessor conf: CLayerConnectionConf

  // sometimes lit lifecycle hooks are really frustrating since it may happen
  // that render() is executed even after disconnectedCallback(). If we would
  // render html this would be no problem since it would be removed right after
  // that, but as we add something to cytoscape, this is permanent. So we
  // prevent from rendering to cytoscape after disconnectedCallback was called
  @state()
  accessor doNotRender = false

  @queryAll('c-edge')
  accessor _edges: NodeListOf<CEdge>

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  connectedCallback(): void {
    super.connectedCallback()
    this.doNotRender = false
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.doNotRender = true
  }

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    console.log('RENDERING LAYER CONNECTION')
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
        // get the cytoscape ids of all the neurons to connect from and to
        const sources: CNeuron[] = sourceLayer.getNeurons()
        const targets: CNeuron[] = targetLayer.getNeurons()

        // manually request an update of the edges in case their properties do
        // not change (else they would just disappear e.g. on change of the
        // hyperparameters)
        for (const edge of this._edges) {
          edge.requestUpdate()
        }

        // add an edge from every source id to every target id
        return html`
          ${sources.map(
            (source, sIndex) =>
              html`${targets.map(
                (target, tIndex, tArr) =>
                  html`<c-edge
                    .source=${source}
                    .target=${target}
                    sourceLayerId=${this.conf.sourceLayerId}
                    targetLayerId=${this.conf.targetLayerId}
                    weight=${targetLayer.weights?.[
                      sIndex * tArr.length + tIndex
                    ]}
                  ></c-edge>`
              )}`
          )}
        `
      }
    }
  }
}
