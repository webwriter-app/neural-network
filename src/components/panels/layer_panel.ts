import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { consume } from '@lit-labs/context'
import { Selected, selectedContext } from '@/contexts/selected_context'
import { dataSetContext } from '@/contexts/data_set_context'

import { globalStyles } from '@/global_styles'

import { CLayer } from '@/components/network/c_layer'
import { InputLayer } from '@/components/network/input_layer'
import { DenseLayer } from '@/components/network/dense_layer'
import { OutputLayer } from '@/components/network/output_layer'

import { DataSet } from '@/data_set/data_set'

import '@/components/cards/layer_info_card'
import '@/components/cards/layer_edit_card'
import '@/components/cards/layer_activation_card'
import '@/components/cards/layer_incoming_connections_card'
import '@/components/cards/layer_incoming_data_card'
import '@/components/cards/layer_outgoing_connections_card'
import '@/components/cards/layer_outgoing_data_card'

@customElement('layer-panel')
export class LayerPanel extends LitElementWw {
  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  @consume({ context: selectedContext, subscribe: true })
  selected: Selected

  static styles: CSSResult[] = [globalStyles]

  getCards(): TemplateResult<1> {
    if (!this.selected.layer) {
      return html``
    }

    const layer: CLayer = this.selected.layer
    if (layer instanceof InputLayer) {
      return html`
        <layer-info-card .layer=${layer}></layer-info-card>
        <layer-edit-card
          .layer=${layer}
          .dataSet=${this.dataSet}
        ></layer-edit-card>
        <layer-incoming-data-card
          .layer=${layer}
          .dataSet=${this.dataSet}
        ></layer-incoming-data-card>
        <layer-outgoing-connections-card
          .layer=${layer}
        ></layer-outgoing-connections-card>
      `
    } else if (layer instanceof DenseLayer) {
      return html`
        <layer-info-card .layer=${layer}></layer-info-card>
        <layer-edit-card .layer=${layer}></layer-edit-card>
        <layer-incoming-connections-card
          .layer=${layer}
        ></layer-incoming-connections-card>
        <layer-outgoing-connections-card
          .layer=${layer}
        ></layer-outgoing-connections-card>
        <layer-activation-card .layer=${layer}></layer-activation-card>
      `
    } else if (layer instanceof OutputLayer) {
      return html`
        <layer-info-card .layer=${layer}></layer-info-card>
        <layer-edit-card
          .layer=${layer}
          .dataSet=${this.dataSet}
        ></layer-edit-card>
        <layer-incoming-connections-card
          .layer=${layer}
        ></layer-incoming-connections-card>
        <layer-outgoing-data-card .layer=${layer}></layer-outgoing-data-card>
        <layer-activation-card .layer=${layer}></layer-activation-card>
      `
    }
  }

  render(): TemplateResult<1> {
    return html` <c-panel name="layer"> ${this.getCards()} </c-panel> `
  }
}
