import { DataSetUtils } from '../data-sets/data-set-utils'
import { widgetMsg } from '@webwriter/lit/localize'
import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html, nothing } from 'lit'
import { query } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { editableContext } from '../contexts'
import type { Settings } from '../../model/app-types'
import { settingsContext } from '../contexts'
import type { DataSet } from '../../model/data-types'
import { dataSetContext } from '../contexts'
import { availableDataSetsContext } from '../contexts'

import type SlDialog from "@shoelace-style/shoelace/dist/components/dialog/dialog.component.js"

import { ManageDataSetsDialog } from '../dialogs/manage-data-sets-dialog'
import { CCard } from '../reusables/c-card'
import { CreateDataSetDialog } from '../dialogs/create-data-set-dialog'

import SlSelect from '@shoelace-style/shoelace/dist/components/select/select.component.js'
import SlOption from '@shoelace-style/shoelace/dist/components/option/option.component.js'
import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js'

export class DataSetSelectCard extends LitElementWw {
  private readonly msg = widgetMsg(this);
  static scopedElements = {
    'c-card': CCard,
    'manage-data-sets-dialog': ManageDataSetsDialog,
    'create-data-set-dialog': CreateDataSetDialog,
    'sl-select': SlSelect,
    'sl-option': SlOption,
    'sl-button': SlButton,
  }

  @consume({ context: editableContext, subscribe: true })
  accessor editable: boolean = false

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
      (option) => option.name == decodeURI(<string>this._dataSetSelect.value),
    )
    this.dispatchEvent(
      new CustomEvent<DataSet>('select-data-set', {
        detail: newDataSet,
        bubbles: true,
        composed: true,
      }),
    )
  }

  async openManageDataSetsDialog() {
    await this._manageDataSetsDialog.show()
  }

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">${this.msg('Select data set')}</div>
        <div slot="content">
          <sl-select
            .value="${this.dataSet ? encodeURI(this.dataSet.name) : nothing}"
            id="dataSetSelect"
            placeholder=${this.msg('"Select a data set"')}
            @sl-change="${(_e: Event) => {
              void this.handleChangeDataSet()
            }}"
          >
            ${this.availableDataSets.map(
              (option) =>
                html`<sl-option .value="${encodeURI(option.name)}"
                  >${DataSetUtils.localizeText(option, option.name, this.msg)}</sl-option
                >`,
            )}
          </sl-select>
          ${this.editable || this.settings.mayManageDataSets
            ? html`
                <sl-button
                  @click="${(_e: MouseEvent) =>
                    this.openManageDataSetsDialog()}"
                  >${this.msg('Manage data sets')}</sl-button
                >
              `
            : html``}
        </div>
      </c-card>
      <manage-data-sets-dialog> </manage-data-sets-dialog>
    `
  }
}
