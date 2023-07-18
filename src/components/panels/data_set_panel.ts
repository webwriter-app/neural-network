import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { consume } from '@lit-labs/context'
import { dataSetContext } from '@/contexts/data_set_context'

import { DataSet } from '@/data_set/data_set'

import '@/components/cards/data_set_info_card'
import '@/components/cards/plots_card'
import '@/components/cards/data_set_select_card'

@customElement('data-set-panel')
export class DataSetPanel extends LitElementWw {
  @property({ attribute: true, reflect: true })
  selectedInputKey: string | null

  @consume({ context: dataSetContext, subscribe: true })
  @property({ attribute: false })
  dataSet: DataSet

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('dataSet')) {
      this.selectedInputKey = null
    }
  }

  _handleClickedDataProperty(e: CustomEvent<string>) {
    this.selectedInputKey = e.detail
  }

  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-panel name="dataSet">
        <data-set-select-card .dataSet="${this.dataSet}"></data-set-select-card>
        ${this.dataSet
          ? html`
              <data-set-info-card
                .dataSet="${this.dataSet}"
                @clicked-data-property="${(e: CustomEvent<string>) => {
                  this._handleClickedDataProperty(e)
                }}"
              ></data-set-info-card>
            `
          : ``}
        <plots-card
          .dataSet="${this.dataSet}"
          .inputKey="${this.selectedInputKey}"
        ></plots-card>
      </c-panel>
    `
  }
}
