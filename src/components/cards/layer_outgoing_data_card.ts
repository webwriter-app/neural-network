import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { OutputLayer } from '@/components/network/output_layer'

@customElement('layer-outgoing-data-card')
export class LayerOutgoingDataCard extends LitElementWw {
  @property()
  layer: OutputLayer

  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Outgoing data</div>
        <div slot="content">
          ${this.layer.dataSetLabel.key
            ? html`
                <c-data-info
                  type="label"
                  .dataProperty="${this.layer.dataSetLabel}"
                ></c-data-info>
              `
            : html``}
        </div>
      </c-card>
    `
  }
}
