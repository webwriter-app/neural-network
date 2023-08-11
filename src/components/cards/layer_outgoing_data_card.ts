import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { dataSetContext } from '@/contexts/data_set_context'
import type { DataSet } from '@/data_set/data_set'

import { OutputLayer } from '@/network/output_layer'

@customElement('layer-outgoing-data-card')
export class LayerOutgoingDataCard extends LitElementWw {
  @property()
  layer: OutputLayer

  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Outgoing data</div>
        <div slot="content">
          ${this.layer.conf.dataSetLabel.key
            ? html`
                <c-data-info
                  type="label"
                  .dataProperty="${this.layer.conf.dataSetLabel}"
                  .dataSet="${this.dataSet}"
                ></c-data-info>
              `
            : html``}
        </div>
      </c-card>
    `
  }
}
