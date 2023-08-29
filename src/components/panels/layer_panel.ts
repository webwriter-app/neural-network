import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { editableContext } from '@/contexts/editable_context'
import type { Settings } from '@/types/settings'
import { settingsContext } from '@/contexts/settings_context'
import { networkContext } from '@/contexts/network_context'
import { ModelConf, modelConfContext } from '@/contexts/model_conf_context'
import {
  SelectedEle,
  selectedEleContext,
} from '@/contexts/selected_ele_context'

import type { Network } from '@/components/network/network'
import { CLayer } from '@/components/network/c_layer'
import { InputLayer } from '@/components/network/input_layer'
import { DenseLayer } from '@/components/network/dense_layer'
import { OutputLayer } from '@/components/network/output_layer'

import '@/components/cards/core_model_features_unavailable_card'
import '@/components/cards/layer_info_card'
import '@/components/cards/layer_actions_card'
import '@/components/cards/layer_activation_card'
import '@/components/cards/layer_neurons_card'
import '@/components/cards/layer_incoming_connections_card'
import '@/components/cards/layer_incoming_data_card'
import '@/components/cards/layer_outgoing_connections_card'
import '@/components/cards/layer_outgoing_data_card'

@customElement('layer-panel')
export class LayerPanel extends LitElementWw {
  @consume({ context: editableContext, subscribe: true })
  editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  settings: Settings

  @consume({ context: networkContext, subscribe: true })
  network: Network

  @consume({ context: modelConfContext, subscribe: true })
  modelConf: ModelConf

  @consume({ context: selectedEleContext, subscribe: true })
  selectedEle: SelectedEle

  static styles: CSSResult[] = globalStyles

  render(): TemplateResult<1> {
    if (this.selectedEle && this.selectedEle instanceof CLayer) {
      const layer: CLayer = this.selectedEle
      return html`
        <c-panel name="layer">
          ${this.modelConf.model
            ? html`<core-model-features-unavailable-card></core-model-features-unavailable-card>`
            : html``}
          <layer-info-card .layer=${layer}></layer-info-card>
          ${!this.modelConf.model &&
          (this.editable || this.settings.mayAddAndRemoveLayers)
            ? html` <layer-actions-card .layer=${layer}></layer-actions-card>`
            : html``}
          ${layer instanceof InputLayer
            ? html`
                ${!this.modelConf.model &&
                (this.editable || this.settings.maySelectDataOnInputLayer)
                  ? html` <layer-incoming-data-card
                      .layer=${layer}
                    ></layer-incoming-data-card>`
                  : html``}
              `
            : html`
                ${!this.modelConf.model &&
                (this.editable || this.settings.mayChangeLayerConnections)
                  ? html` <layer-incoming-connections-card
                      .layer=${layer}
                    ></layer-incoming-connections-card>`
                  : html``}
              `}
          ${layer instanceof DenseLayer &&
          !this.modelConf.model &&
          (this.editable || this.settings.mayChangeNeurons)
            ? html` <layer-neurons-card .layer=${layer}></layer-neurons-card>`
            : html``}
          ${!(layer instanceof InputLayer)
            ? html`<layer-activation-card
                .layer=${layer}
              ></layer-activation-card>`
            : html``}
          ${layer instanceof OutputLayer
            ? html`<layer-outgoing-data-card
                .layer=${layer}
              ></layer-outgoing-data-card>`
            : html`${!this.modelConf.model &&
              (this.editable || this.settings.mayChangeLayerConnections)
                ? html` <layer-outgoing-connections-card
                    .layer=${layer}
                  ></layer-outgoing-connections-card>`
                : html``}`}
        </c-panel>
      `
    }
  }
}
