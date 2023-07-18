import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import '@/components/cards/training_train_card.js'
import '@/components/cards/training_hyperparameters_card.js'

@customElement('train-panel')
export class TrainPanel extends LitElementWw {
  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-panel name="train">
        <training-train-card></training-train-card>
        <training-hyperparameters-card></training-hyperparameters-card>
      </c-panel>
    `
  }
}
