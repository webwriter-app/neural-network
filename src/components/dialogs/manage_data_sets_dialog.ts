import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, css, html } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { consume } from '@lit/context'

import type { DataSet } from '@/types/data_set'
import { dataSetContext } from '@/contexts/data_set_context'
import { availableDataSetsContext } from '@/contexts/available_data_sets_context'

import SlButton from "@shoelace-style/shoelace/dist/components/button/button.component.js"
import SlDialog from "@shoelace-style/shoelace/dist/components/dialog/dialog.component.js"
import SlTag from "@shoelace-style/shoelace/dist/components/tag/tag.component.js"
import { CCard } from '../reusables/c-card'

export class ManageDataSetsDialog extends LitElementWw {

  static scopedElements = {
    "sl-dialog": SlDialog,
    "sl-button": SlButton,
    "sl-tag": SlTag,
    "c-card": CCard
  }

  @consume({ context: dataSetContext, subscribe: true })
  accessor dataSet: DataSet

  @consume({ context: availableDataSetsContext, subscribe: true })
  accessor availableDataSets: DataSet[]

  @query('sl-dialog')
  accessor _dialog: SlDialog

  @query('create-data-set-dialog')
  accessor _createDataSetDialog: SlDialog

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async show() {
    await this._dialog.show()
  }

  async openCreateDataSetDialog() {
    await this._createDataSetDialog.show()
    await this._dialog.hide()
  }

  handleDeleteDataSet(e: MouseEvent) {
    this.dispatchEvent(
      new CustomEvent<string>('delete-data-set', {
        detail: (e.target as any).name,
        bubbles: true,
        composed: true,
      })
    )
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = css`
    sl-dialog::part(body) {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  `

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <sl-dialog label="Manage data sets">
        <sl-button
          variant="primary"
          @click="${(_e: MouseEvent) => this.openCreateDataSetDialog()}"
          >Create a new data set</sl-button
        >
        ${this.availableDataSets.map(
          (dataSet) => html`
            <c-card>
              <div slot="title">${dataSet.name}</div>
              <div slot="content">
                <p>${dataSet.description}</p>
                ${this.dataSet.name == dataSet.name
                  ? html`<sl-tag variant="success">Currently selected</sl-tag>`
                  : html`<sl-button
                      variant="danger"
                      name=${dataSet.name}
                      @click=${(e: MouseEvent) => this.handleDeleteDataSet(e)}
                    >
                      Permanently delete data set
                    </sl-button>`}
              </div>
            </c-card>
          `
        )}
      </sl-dialog>
      <create-data-set-dialog> </create-data-set-dialog>
    `
  }
}
