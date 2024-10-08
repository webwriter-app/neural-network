import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { editableContext } from '@/contexts/editable_context'
import type { Settings } from '@/types/settings'
import { settingsContext } from '@/contexts/settings_context'
import { CLayer } from '@/components/network/c_layer'
import { InputLayer } from '@/components/network/input_layer'
import { DenseLayer } from '@/components/network/dense_layer'
import { OutputLayer } from '@/components/network/output_layer'
import type { ModelConf } from '@/types/model_conf'
import { modelConfContext } from '@/contexts/model_conf_context'
import type { SelectedEle } from '@/types/selected_ele'
import { selectedEleContext } from '@/contexts/selected_ele_context'

import { CoreModelFeaturesUnavailableCard } from '@/components/cards/core_model_features_unavailable_card'
import { LayerInfoCard } from '@/components/cards/layer_info_card'
import { LayerActionsCard } from '@/components/cards/layer_actions_card'
import { LayerActivationCard } from '@/components/cards/layer_activation_card'
import { LayerNeuronsCard } from '@/components/cards/layer_neurons_card'
import { LayerIncomingConnectionsCard } from '@/components/cards/layer_incoming_connections_card'
import { LayerIncomingDataCard } from '@/components/cards/layer_incoming_data_card'
import { LayerOutgoingConnectionsCard } from '@/components/cards/layer_outgoing_connections_card'
import { LayerOutgoingDataCard } from '@/components/cards/layer_outgoing_data_card'
import { CPanel } from '../reusables/c-panel'

export class LayerPanel extends LitElementWw {

  static scopedElements = {
    "c-panel": CPanel,
    'core-model-features-unavailable-card': CoreModelFeaturesUnavailableCard,
    'layer-info-card': LayerInfoCard,
    'layer-actions-card': LayerActionsCard,
    'layer-activation-card': LayerActivationCard,
    'layer-neurons-card': LayerNeuronsCard,
    'layer-incoming-connections-card': LayerIncomingConnectionsCard,
    'layer-incoming-data-card': LayerIncomingDataCard,
    'layer-outgoing-connections-card': LayerOutgoingConnectionsCard,
    'layer-outgoing-data-card': LayerOutgoingDataCard,
  }

  @consume({ context: editableContext, subscribe: true })
  accessor editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  accessor settings: Settings

  @consume({ context: modelConfContext, subscribe: true })
  accessor modelConf: ModelConf

  @consume({ context: selectedEleContext, subscribe: true })
  accessor selectedEle: SelectedEle

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
