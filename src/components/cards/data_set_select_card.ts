import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html, nothing } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { editableContext } from '@/contexts/editable_context'
import type { Settings } from '@/types/settings'
import { settingsContext } from '@/contexts/settings_context'
import type { DataSet } from '@/types/data_set'
import { dataSetContext } from '@/contexts/data_set_context'
import { availableDataSetsContext } from '@/contexts/available_data_sets_context'

import type {
  SlChangeEvent,
  SlDialog,
  SlSelect,
} from '@shoelace-style/shoelace'

import '@/components/dialogs/manage_data_sets_dialog'
import '@/components/dialogs/create_data_set_dialog'

export @customElement('data-set-select-card') class DataSetSelectCard extends LitElementWw {
  @consume({ context: editableContext, subscribe: true })
  accessor editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  accessor settings: Settings

  @consume({ context: availableDataSetsContext, subscribe: true })
  accessor availableDataSets: DataSet[]

  @consume({ context: dataSetContext, subscribe: true })
  accessor dataSet: DataSet

  @query('#dataSetSelect')
  accessor _dataSetSelect: SlSelect

  @query('manage-data-sets-dialog')
  accessor _manageDataSetsDialog: SlDialog

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleChangeDataSet(): void {
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

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
              void this.handleChangeDataSet()
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
