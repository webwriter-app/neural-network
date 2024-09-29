import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { property } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { editableContext } from '@/contexts/editable_context'
import type { Settings } from '@/types/settings'
import { settingsContext } from '@/contexts/settings_context'
import type { DataSet } from '@/types/data_set'
import { dataSetContext } from '@/contexts/data_set_context'
import type { ModelConf } from '@/types/model_conf'
import { modelConfContext } from '@/contexts/model_conf_context'

import { CoreModelFeaturesUnavailableCard } from '@/components/cards/core_model_features_unavailable_card'
import { DataSetInfoCard } from '@/components/cards/data_set_info_card'
import { PlotsCard } from '@/components/cards/plots_card'
import { DataSetSelectCard } from '@/components/cards/data_set_select_card'
import { CPanel } from '../reusables/c-panel'

export class DataSetPanel extends LitElementWw {

  static scopedElements = {
    "c-panel": CPanel,
    "core-model-features-unavailable-card": CoreModelFeaturesUnavailableCard,
    "data-set-info-card": DataSetInfoCard,
    "plots-card": PlotsCard,
    "data-set-select-card": DataSetSelectCard
  }

  @property({ attribute: true, reflect: true })
  accessor selectedFeatureKey: string | null

  @consume({ context: editableContext, subscribe: true })
  accessor editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  accessor settings: Settings

  @consume({ context: dataSetContext, subscribe: true })
  accessor dataSet: DataSet

  @consume({ context: modelConfContext, subscribe: true })
  accessor modelConf: ModelConf

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('dataSet')) {
      this.selectedFeatureKey = null
    }
  }

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-panel name="dataSet">
        ${this.modelConf.model &&
        (this.editable || this.settings.maySelectDataSet)
          ? html`<core-model-features-unavailable-card></core-model-features-unavailable-card>`
          : html``}
        ${!this.modelConf.model &&
        (this.editable || this.settings.maySelectDataSet)
          ? html` <data-set-select-card></data-set-select-card> `
          : html``}
        ${this.dataSet
          ? html`
              <data-set-info-card
                @select-data-desc="${(e: CustomEvent<string>) => {
                  this.selectedFeatureKey = e.detail
                }}"
              ></data-set-info-card>
            `
          : ``}
        ${this.editable || this.settings.showPlots
          ? html`
              <plots-card .featureKey="${this.selectedFeatureKey}"></plots-card>
            `
          : html``}
      </c-panel>
    `
  }
}
