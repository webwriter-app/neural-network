import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import '@/components/cards/predict_card'

@customElement('predict-panel')
export class PredictPanel extends LitElementWw {
  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-panel name="predict">
        <predict-card></predict-card>
      </c-panel>
    `
  }
}
