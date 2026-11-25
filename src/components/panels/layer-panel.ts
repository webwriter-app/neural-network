import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html, nothing } from 'lit'
import { consume } from '@lit/context'

import { editableContext } from '../contexts'
import type { Settings } from '../../model/app-types'
import { settingsContext } from '../contexts'
import { CLayer } from '../network/c-layer'
import { InputLayer } from '../network/input-layer'
import { DenseLayer } from '../network/dense-layer'
import { OutputLayer } from '../network/output-layer'
import type { ModelConf } from '../../model/network-types'
import { modelConfContext } from '../contexts'
import type { SelectedEle } from '../../model/app-types'
import { selectedEleContext } from '../contexts'

import { CoreModelFeaturesUnavailableCard } from '../cards/core-model-features-unavailable-card'
import { LayerInfoCard } from '../cards/layer-info-card'
import { LayerActionsCard } from '../cards/layer-actions-card'
import { LayerActivationCard } from '../cards/layer-activation-card'
import { LayerNeuronsCard } from '../cards/layer-neurons-card'
import { LayerIncomingConnectionsCard } from '../cards/layer-incoming-connections-card'
import { LayerIncomingDataCard } from '../cards/layer-incoming-data-card'
import { LayerOutgoingConnectionsCard } from '../cards/layer-outgoing-connections-card'
import { LayerOutgoingDataCard } from '../cards/layer-outgoing-data-card'
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
  accessor editable: boolean = false

  @consume({ context: settingsContext, subscribe: true })
  accessor settings: Settings

  @consume({ context: modelConfContext, subscribe: true })
  accessor modelConf: ModelConf

  @consume({ context: selectedEleContext, subscribe: true })
  accessor selectedEle: SelectedEle

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> | typeof nothing {
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
    return nothing
  }
}
