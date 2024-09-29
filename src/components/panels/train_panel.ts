import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '@/global_styles'

import { editableContext } from '@/contexts/editable_context'
import type { Settings } from '@/types/settings'
import { settingsContext } from '@/contexts/settings_context'
import type { ModelConf } from '@/types/model_conf'
import { modelConfContext } from '@/contexts/model_conf_context'

import { CPanel } from '../reusables/c-panel'
import { TrainingTrainCard } from '@/components/cards/training_train_card.js'
import { TrainingMetricsCard } from '@/components/cards/training_metrics_card'
import { TrainingHyperparametersCard } from '@/components/cards/training_hyperparameters_card.js'

export class TrainPanel extends LitElementWw {

  static scopedElements = {
    "c-panel": CPanel,
    "training-train-card": TrainingTrainCard,
    "training-metrics-card": TrainingMetricsCard,
    "training-hyperparameters-card": TrainingHyperparametersCard
  }

  @consume({ context: editableContext, subscribe: true })
  accessor editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  accessor settings: Settings

  @consume({ context: modelConfContext, subscribe: true })
  accessor modelConf: ModelConf

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-panel name="train">
        <training-train-card></training-train-card>
        <training-metrics-card
          class="${!this.modelConf.model ? 'hidden' : ''}"
        ></training-metrics-card>
        ${this.modelConf.model && (this.editable || this.settings.mayImport)
          ? html`<core-model-features-unavailable-card></core-model-features-unavailable-card>`
          : html``}
        <training-hyperparameters-card></training-hyperparameters-card>
      </c-panel>
    `
  }
}
