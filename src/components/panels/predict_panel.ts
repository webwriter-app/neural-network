import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { CPanel } from '../reusables/c-panel'
import { PredictCard } from '@/components/cards/predict_card'

export class PredictPanel extends LitElementWw {

  static scopedElements = {
    "c-panel": CPanel,
    "predict-card": PredictCard
  }

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-panel name="predict">
        <predict-card></predict-card>
      </c-panel>
    `
  }
}
