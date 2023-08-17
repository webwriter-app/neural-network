import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, css, html } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { SlDialog } from '@shoelace-style/shoelace'

import { dataSetContext } from '@/contexts/data_set_context'
import { availableDataSetsContext } from '@/contexts/available_data_sets_context'

import type { DataSet } from '@/data_set/data_set'

@customElement('manage-data-sets-dialog')
export class ManageDataSetsDialog extends LitElementWw {
  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  @consume({ context: availableDataSetsContext, subscribe: true })
  availableDataSets: DataSet[]

  // QUERY - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @query('sl-dialog')
  _dialog: SlDialog

  @query('create-data-set-dialog')
  _createDataSetDialog: SlDialog

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async show() {
    await this._dialog.show()
  }

  async openCreateDataSetDialog() {
    await this._createDataSetDialog.show()
  }

  handleDeleteDataSet(e: MouseEvent) {
    this.dispatchEvent(
      new CustomEvent<string>('delete-data-set', {
        detail: <string>e.target.name,
        bubbles: true,
        composed: true,
      })
    )
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [
    ...globalStyles,
    css`
      sl-dialog::part(body) {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
    `,
  ]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <sl-dialog label="Manage data sets">
        <div class="button-group">
          <sl-button
            variant="primary"
            @click="${(_e: MouseEvent) => this.openCreateDataSetDialog()}"
            >Create a new data set</sl-button
          >
        </div>
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
