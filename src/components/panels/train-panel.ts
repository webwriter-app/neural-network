import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '../global-styles'

import { editableContext } from '../contexts'
import type { Settings } from '../../model/app-types'
import { settingsContext } from '../contexts'
import type { ModelConf } from '../../model/network-types'
import { modelConfContext } from '../contexts'

import { CPanel } from '../reusables/c-panel'
import { TrainingTrainCard } from '../cards/training-train-card.js'
import { TrainingMetricsCard } from '../cards/training-metrics-card'
import { TrainingHyperparametersCard } from '../cards/training-hyperparameters-card.js'

export class TrainPanel extends LitElementWw {

  static scopedElements = {
    "c-panel": CPanel,
    "training-train-card": TrainingTrainCard,
    "training-metrics-card": TrainingMetricsCard,
    "training-hyperparameters-card": TrainingHyperparametersCard
  }

  @consume({ context: editableContext, subscribe: true })
  accessor editable: boolean = false

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
