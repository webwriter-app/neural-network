import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { editableContext } from '@/contexts/editable_context'
import { settingsContext, Settings } from '@/contexts/settings_context'
import type { DataSet } from '@/types/data_set'
import { dataSetContext } from '@/contexts/data_set_context'
import { ModelConf, modelConfContext } from '@/contexts/model_conf_context'

import '@/components/cards/core_model_features_unavailable_card'
import '@/components/cards/data_set_info_card'
import '@/components/cards/plots_card'
import '@/components/cards/data_set_select_card'

@customElement('data-set-panel')
export class DataSetPanel extends LitElementWw {
  @property({ attribute: true, reflect: true })
  selectedInputKey: string | null

  @consume({ context: editableContext, subscribe: true })
  editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  settings: Settings

  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  @consume({ context: modelConfContext, subscribe: true })
  modelConf: ModelConf

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('dataSet')) {
      this.selectedInputKey = null
    }
  }

  static styles: CSSResult[] = globalStyles

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
                @clicked-data-property="${(e: CustomEvent<string>) => {
                  this.selectedInputKey = e.detail
                }}"
              ></data-set-info-card>
            `
          : ``}
        ${this.editable || this.settings.showPlots
          ? html`
              <plots-card .inputKey="${this.selectedInputKey}"></plots-card>
            `
          : html``}
      </c-panel>
    `
  }
}
