import { LitElement } from 'lit'
import { CSSResult, TemplateResult, html, nothing } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { SlChangeEvent, SlDialog, SlSelect } from '@shoelace-style/shoelace'

import { globalStyles } from '@/global_styles'

import { editableContext } from '@/contexts/editable_context'
import { settingsContext, Settings } from '@/contexts/settings_context'
import { dataSetContext } from '@/contexts/data_set_context'
import { availableDataSetsContext } from '@/contexts/available_data_sets_context'

import type { DataSet } from '@/data_set/data_set'

import '@/components/dialogs/manage_data_sets_dialog'
import '@/components/dialogs/create_data_set_dialog'

@customElement('data-set-select-card')
export class DataSetSelectCard extends LitElement {
  @consume({ context: editableContext, subscribe: true })
  editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  settings: Settings

  @consume({ context: availableDataSetsContext, subscribe: true })
  availableDataSets: DataSet[]

  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  @query('#dataSetSelect')
  _dataSetSelect: SlSelect

  @query('manage-data-sets-dialog')
  _manageDataSetsDialog: SlDialog

  _handleChangeDataSet(): void {
    const newDataSet = this.availableDataSets.find(
      (option) => option.name == decodeURI(<string>this._dataSetSelect.value)
    )
    this.dispatchEvent(
      new CustomEvent<DataSet>('select-data-set', {
        detail: newDataSet,
        bubbles: true,
        composed: true,
      })
    )
  }

  async openManageDataSetsDialog() {
    await this._manageDataSetsDialog.show()
  }

  static styles: CSSResult[] = globalStyles

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
          ${this.editable || this.settings.mayManageDataSets
            ? html`
                <sl-button
                  @click="${(_e: MouseEvent) =>
                    this.openManageDataSetsDialog()}"
                  >Manage data sets</sl-button
                >
              `
            : html``}
        </div>
      </c-card>
      <manage-data-sets-dialog> </manage-data-sets-dialog>
    `
  }
}
