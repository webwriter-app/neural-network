import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

import { SlChangeEvent, SlSelect } from '@shoelace-style/shoelace'

import { globalStyles } from '@/global_styles'

import { InputLayer } from '@/components/network/input_layer'
import { DataSet } from '@/data_set/data_set'

@customElement('layer-incoming-data-card')
export class LayerIncomingDataCard extends LitElementWw {
  @property()
  layer: InputLayer

  @property()
  dataSet: DataSet

  @query('#inputDataSelect')
  _inputDataSelect: SlSelect

  _handleChangeInputData(): void {
    const inputKeys: string[] = <string[]>this._inputDataSelect.value
    this.layer.dataSetKeys = inputKeys
  }

  getInputOptions(): TemplateResult<1> {
    const selectedOptions = this.layer.getAssignedInputs().map(
      (key) => html`
        <sl-option value="${key}">
          <sl-tooltip content="${this.dataSet.getInputByKey(key).description}"
            >${key}</sl-tooltip
          >
        </sl-option>
      `
    )
    console.log(selectedOptions)
    const unselectedOptions = this.dataSet.getNonAssignedInputKeys().map(
      (key) => html`
        <sl-option .value="${key}">
          <sl-tooltip content="${this.dataSet.getInputByKey(key).description}"
            >${key}</sl-tooltip
          >
        </sl-option>
      `
    )
    console.log(unselectedOptions)
    return html`${selectedOptions} ${unselectedOptions}`
  }

  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Incoming data</div>
        <div slot="content">
          <sl-select
            id="inputDataSelect"
            value=${this.layer.getAssignedInputs().join(' ')}
            multiple
            max-options-visible="100"
            help-text="Assign input data to this layer"
            @sl-change="${(_e: SlChangeEvent) => {
              this._handleChangeInputData()
            }}"
          >
            ${this.getInputOptions()}
          </sl-select>
        </div>
      </c-card>
    `
  }
}
