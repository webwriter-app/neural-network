import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { consume } from '@lit/context'

import type { DataSet } from '@/types/data_set'
import { dataSetContext } from '@/contexts/data_set_context'
import type { OutputLayer } from '@/components/network/output_layer'

export @customElement('layer-outgoing-data-card') class LayerOutgoingDataCard extends LitElementWw {
  @property()
  accessor layer: OutputLayer

  @consume({ context: dataSetContext, subscribe: true })
  accessor dataSet: DataSet

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Outgoing data</div>
        <div slot="content">
          ${this.layer.conf.dataSetLabel.key
            ? html`
                <c-data-info
                  type="label"
                  .dataDesc="${this.layer.conf.dataSetLabel}"
                  .dataSet="${this.dataSet}"
                ></c-data-info>
              `
            : html``}
        </div>
      </c-card>
    `
  }
}
