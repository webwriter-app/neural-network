import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { property } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { editableContext } from '../contexts'
import type { Settings } from '../../model/app-types'
import { settingsContext } from '../contexts'
import type { DataSet } from '../../model/data-types'
import { dataSetContext } from '../contexts'
import type { ModelConf } from '../../model/network-types'
import { modelConfContext } from '../contexts'

import { CoreModelFeaturesUnavailableCard } from '../cards/core-model-features-unavailable-card'
import { DataSetInfoCard } from '../cards/data-set-info-card'
import { PlotsCard } from '../cards/plots-card'
import { DataSetSelectCard } from '../cards/data-set-select-card'
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
  accessor editable: boolean = false

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
