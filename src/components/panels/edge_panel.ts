import { LitElement } from 'lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { networkContext } from '@/contexts/network_context'
import {
  SelectedEle,
  selectedEleContext,
} from '@/contexts/selected_ele_context'

import type { Network } from '@/network/network'
import { CEdge } from '@/network/c_edge'

import '@/components/cards/edge_info_card'
import '@/components/cards/edge_weight_card'

@customElement('edge-panel')
export class EdgePanel extends LitElement {
  @consume({ context: networkContext, subscribe: true })
  network: Network

  @consume({ context: selectedEleContext, subscribe: true })
  selectedEle: SelectedEle

  static styles: CSSResult[] = globalStyles

  render(): TemplateResult<1> {
    if (this.selectedEle && this.selectedEle instanceof CEdge) {
      const edge: CEdge = this.selectedEle
      return html`
        <c-panel name="edge">
          <edge-info-card .source=${edge.source} .target=${edge.target}>
          </edge-info-card>
          ${edge.weight
            ? html`<edge-weight-card .weight=${edge.weight}></edge-weight-card>`
            : html``}
        </c-panel>
      `
    }
  }
}
