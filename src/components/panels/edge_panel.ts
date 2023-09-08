import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { CEdge } from '@/components/network/c_edge'
import type { SelectedEle } from '@/types/selected_ele'
import { selectedEleContext } from '@/contexts/selected_ele_context'

import '@/components/cards/edge_info_card'
import '@/components/cards/edge_weight_card'

@customElement('edge-panel')
export class EdgePanel extends LitElementWw {
  @consume({ context: selectedEleContext, subscribe: true })
  selectedEle: SelectedEle

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
