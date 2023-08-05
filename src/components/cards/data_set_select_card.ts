import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, nothing } from 'lit'
import { customElement, query, property } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { SlChangeEvent, SlDialog, SlSelect } from '@shoelace-style/shoelace'

import { globalStyles } from '@/global_styles'

import { availableDataSetsContext } from '@/contexts/available_data_sets_context'

import '@/components/dialogs/create_data_set_dialog'

import type { DataSet } from '@/data_set/data_set'

@customElement('data-set-select-card')
export class DataSetSelectCard extends LitElementWw {
  @consume({ context: availableDataSetsContext, subscribe: true })
  availableDataSets: DataSet[]

  @property({ attribute: false })
  dataSet: DataSet

  @query('#dataSetSelect')
  _dataSetSelect: SlSelect

  @query('create-data-set-dialog')
  _createDataSetDialog: SlDialog

  _handleChangeDataSet(): void {
    const newDataSet = this.availableDataSets.find(
      (option) => option.name == decodeURI(<string>this._dataSetSelect.value)
    )
    this.dispatchEvent(
      new CustomEvent<DataSet>('change-data-set', {
        detail: newDataSet,
        bubbles: true,
        composed: true,
      })
    )
  }

  async openCreateDataSetDialog() {
    await this._createDataSetDialog.show()
  }

  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Select data set</div>
        <div slot="content">
          <sl-select
            .value="${this.dataSet ? encodeURI(this.dataSet.name) : nothing}"
            id="dataSetSelect"
            placeholder="Select a data set"
            @sl-change="${(_e: SlChangeEvent) => {
              void this._handleChangeDataSet()
            }}"
          >
            ${this.availableDataSets.map(
              (option) =>
                html`<sl-option .value="${encodeURI(option.name)}"
                  >${option.name}</sl-option
                >`
            )}
          </sl-select>
          <sl-button
            @click="${(_e: MouseEvent) => this.openCreateDataSetDialog()}"
            >Create a new data set</sl-button
          >
        </div>
      </c-card>
      <create-data-set-dialog> </create-data-set-dialog>
    `
  }
}
