import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html, nothing } from 'lit'
import { consume } from '@lit/context'

import { CEdge } from '../network/c-edge'
import type { SelectedEle } from '../../model/app-types'
import { selectedEleContext } from '../contexts'

import { CPanel } from '../reusables/c-panel'
import { EdgeInfoCard } from '../cards/edge-info-card'
import { EdgeWeightCard } from '../cards/edge-weight-card'

export class EdgePanel extends LitElementWw {

  static scopedElements = {
    "c-panel": CPanel,
    "edge-info-card": EdgeInfoCard,
    "edge-weight-card": EdgeWeightCard
  }

  @consume({ context: selectedEleContext, subscribe: true })
  accessor selectedEle: SelectedEle

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> | typeof nothing {
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
    return nothing
  }
}
