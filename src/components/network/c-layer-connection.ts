import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html, nothing } from 'lit'
import { property, queryAll } from 'lit/decorators.js'
import { consume } from '@lit/context'

import type { CLayerConnectionConf } from '../../model/network-types'
import type { CNetwork } from './network'
import type { CNeuron } from './neuron'
import { CEdge } from './c-edge'
import { networkContext } from '../contexts'

// The connection between two layers: one edge element from every neuron of the
// source layer to every neuron of the target layer.
export class CLayerConnection extends LitElementWw {

  static scopedElements = {
    "c-edge": CEdge
  }

  @consume({ context: networkContext, subscribe: true })
  accessor network: CNetwork

  @property({ attribute: false })
  accessor conf: CLayerConnectionConf

  @queryAll('c-edge')
  accessor _edges: NodeListOf<CEdge>

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> | typeof nothing {
    const sourceLayer = this.network.getLayerById(this.conf.sourceLayerId)
    const targetLayer = this.network.getLayerById(this.conf.targetLayerId)
    if (!sourceLayer || !targetLayer) return nothing

    const sources: CNeuron[] = sourceLayer.getNeurons()
    const targets: CNeuron[] = targetLayer.getNeurons()

    // the kernel of the target layer holds the rows of its sources one after
    // the other
    let rowOffset = 0
    for (const other of this.network.getSourcesFor(targetLayer)) {
      if (other === sourceLayer) break
      rowOffset += other.getNeurons().length
    }

    // manually request an update of the edges in case their properties do not
    // change (else they would not notice e.g. a change of the hyperparameters)
    for (const edge of this._edges) {
      edge.requestUpdate()
    }

    // add an edge from every source neuron to every target neuron
    return html`
      ${sources.map(
        (source, sIndex) =>
          html`${targets.map(
            (target, tIndex, tArr) =>
              html`<c-edge
                .source=${source}
                .target=${target}
                .sourceLayerId=${this.conf.sourceLayerId}
                .targetLayerId=${this.conf.targetLayerId}
                .weight=${targetLayer.weights?.[
                  (rowOffset + sIndex) * tArr.length + tIndex
                ]}
              ></c-edge>`
          )}`
      )}
    `
  }
}
