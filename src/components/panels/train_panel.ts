import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { editableContext } from '@/contexts/editable_context'
import { settingsContext, Settings } from '@/contexts/settings_context'
import { ModelConf, modelConfContext } from '@/contexts/model_conf_context'

import '@/components/cards/training_train_card.js'
import '@/components/cards/training_metrics_card'
import '@/components/cards/training_hyperparameters_card.js'

@customElement('train-panel')
export class TrainPanel extends LitElementWw {
  @consume({ context: editableContext, subscribe: true })
  editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  settings: Settings

  @consume({ context: modelConfContext, subscribe: true })
  modelConf: ModelConf

  static styles: CSSResult[] = globalStyles

  render(): TemplateResult<1> {
    return html`
      <c-panel name="train">
        ${this.modelConf.model && (this.editable || this.settings.mayImport)
          ? html`<core-model-features-unavailable-card></core-model-features-unavailable-card>`
          : html``}
        <training-train-card></training-train-card>
        <training-metrics-card
          class="${!this.modelConf.model ? 'hidden' : ''}"
        ></training-metrics-card>
        <training-hyperparameters-card></training-hyperparameters-card>
      </c-panel>
    `
  }
}
