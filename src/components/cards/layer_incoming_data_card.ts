import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { SlChangeEvent, SlSelect } from '@shoelace-style/shoelace'

import { globalStyles } from '@/global_styles'

import { dataSetContext } from '@/contexts/data_set_context'
import type { DataSet } from '@/data_set/data_set'

import { InputLayer } from '@/network/input_layer'

@customElement('layer-incoming-data-card')
export class LayerIncomingDataCard extends LitElementWw {
  @property()
  layer: InputLayer

  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  @query('#inputDataSelect')
  _inputDataSelect: SlSelect

  _handleChangeInputData(): void {
    const inputKeys: string[] = <string[]>this._inputDataSelect.value
    this.layer.conf.dataSetKeys = inputKeys
    this.dispatchEvent(
      new Event('update-layer-confs', {
        bubbles: true,
        composed: true,
      })
    )
  }

  getInputOptions(): TemplateResult<1>[] {
    return this.dataSet.inputs.map(
      (input) => html`
        <sl-option value="${input.key}">
          <sl-tooltip content="${input.description}">${input.key}</sl-tooltip>
        </sl-option>
      `
    )
  }

  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Incoming data</div>
        <div slot="content">
          <sl-select
            id="inputDataSelect"
            value=${this.layer.conf.dataSetKeys.join(' ')}
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
