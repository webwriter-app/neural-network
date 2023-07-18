import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { consume } from '@lit-labs/context'
import { Selected, selectedContext } from '@/contexts/selected_context'

import { globalStyles } from '@/global_styles'

import '@/components/cards/edge_info_card'

@customElement('edge-panel')
export class EdgePanel extends LitElementWw {
  @consume({ context: selectedContext, subscribe: true })
  selected: Selected

  static styles: CSSResult[] = [globalStyles]

  getCards(): TemplateResult<1> {
    if (!this.selected.edge) {
      return html``
    }

    return html`
      <edge-info-card
        .sourceLayer=${this.selected.edge.sourceLayer}
        .targetLayer=${this.selected.edge.targetLayer}
        .sourceNeuron=${this.selected.edge.sourceNeuron}
        .targetNeuron=${this.selected.edge.targetNeuron}
      >
      </edge-info-card>
    `
  }

  render(): TemplateResult<1> {
    return html` <c-panel name="edge"> ${this.getCards()} </c-panel> `
  }
}
