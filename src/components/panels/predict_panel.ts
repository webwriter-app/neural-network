import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import '@/components/cards/predict_card'

export @customElement('predict-panel') class PredictPanel extends LitElementWw {
  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-panel name="predict">
        <predict-card></predict-card>
      </c-panel>
    `
  }
}
