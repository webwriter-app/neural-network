import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, nothing } from 'lit'
import { customElement, query, property } from 'lit/decorators.js'

import { SlChangeEvent, SlSelect } from '@shoelace-style/shoelace'

import { globalStyles } from '@/global_styles'

import { DataSetFactory } from '@/data_set/data_set_factory'
import { DataSet } from '@/data_set/data_set'

@customElement('data-set-select-card')
export class DataSetSelectCard extends LitElementWw {
  @property()
  dataSet: DataSet

  @query('#dataSetSelect')
  _dataSetSelect: SlSelect

  async _handleChangeDataSet(): Promise<void> {
    const newDataSet = await DataSetFactory.getDataSetByName(
      decodeURI(<string>this._dataSetSelect.value)
    )
    const event = new CustomEvent<DataSet>('change-data-set', {
      detail: newDataSet,
      bubbles: true,
      composed: true,
    })
    this.dispatchEvent(event)
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
            ${DataSetFactory.getOptions().map(
              (option) =>
                html`<sl-option .value="${encodeURI(option)}"
                  >${option}</sl-option
                >`
            )}
          </sl-select>
          <sl-button disabled>Create your own data set</sl-button>
        </div>
      </c-card>
    `
  }
}
