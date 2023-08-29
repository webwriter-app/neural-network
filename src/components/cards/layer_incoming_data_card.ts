import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import type { DataSet } from '@/types/data_set'
import { dataSetContext } from '@/contexts/data_set_context'
import type { InputLayer } from '@/components/network/input_layer'

import type { SlChangeEvent, SlSelect } from '@shoelace-style/shoelace'

@customElement('layer-incoming-data-card')
export class LayerIncomingDataCard extends LitElementWw {
  @property()
  layer: InputLayer

  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  @query('#inputDataSelect')
  _inputDataSelect: SlSelect

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleChangeInputData(): void {
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

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
              this.handleChangeInputData()
            }}"
          >
            ${this.getInputOptions()}
          </sl-select>
        </div>
      </c-card>
    `
  }
}
