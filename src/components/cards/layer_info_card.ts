import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import type { DataSet } from '@/types/data_set'
import { dataSetContext } from '@/contexts/data_set_context'
import type { CLayer } from '@/components/network/c_layer'

@customElement('layer-info-card')
export class LayerInfoCard extends LitElementWw {
  @property()
  layer: CLayer

  // eventhough we do not directly need the data set in this component, we need
  // to subscribe to data set changes in order to rerender this component
  // (because layer description can change on data set changes)
  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Layer</div>
        <div slot="content">
          <p>
            Name:
            <c-network-link .target="${this.layer}">
              ${this.layer.getName()}
            </c-network-link>
          </p>
          <p>${this.layer.getDescription()}</p>
        </div>
      </c-card>
    `
  }
}
