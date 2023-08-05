import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { consume } from '@lit-labs/context'
import { dataSetContext } from '@/contexts/data_set_context'
import { DataSet } from '@/data_set/data_set'

import { CLayer } from '@/components/network/c_layer'

@customElement('layer-info-card')
export class LayerInfoCard extends LitElementWw {
  @property() layer: CLayer

  // eventhough we do not directly need the data set in this component, we need
  // to subscribe to data set changes in order to rerender this component
  // (because layer description can change on data set changes)
  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Info</div>
        <div slot="content">
          <span>
            Selected:
            <c-network-link .target="${this.layer}">
              ${this.layer.getName()}
            </c-network-link>
          </span>
          <span> ${this.layer.getDescription()} </span>
        </div>
      </c-card>
    `
  }
}
