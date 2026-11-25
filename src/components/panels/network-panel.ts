import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { consume } from '@lit/context'

import { editableContext } from '../contexts'
import type { Settings } from '../../model/app-types'
import { settingsContext } from '../contexts'
import type { CLayerConf } from '../../model/network-types'
import { layerConfsContext } from '../contexts'
import type { ModelConf } from '../../model/network-types'
import { modelConfContext } from '../contexts'

import { CPanel } from '../reusables/c-panel'
import { CoreModelFeaturesUnavailableCard } from '../cards/core-model-features-unavailable-card'
import { NetworkAddLayerCard } from '../cards/network-add-layer-card'
import { NetworkClearCard } from '../cards/network-clear-card'
import { NetworkInfoCard } from '../cards/network-info-card'

export class NetworkPanel extends LitElementWw {

  static scopedElements = {
    "c-panel": CPanel,
    "core-model-features-unavailable-card": CoreModelFeaturesUnavailableCard,
    "network-add-layer-card": NetworkAddLayerCard,
    "network-clear-card": NetworkClearCard,
    "network-info-card": NetworkInfoCard
  }

  @consume({ context: editableContext, subscribe: true })
  accessor editable: boolean = false

  @consume({ context: settingsContext, subscribe: true })
  accessor settings: Settings

  @consume({ context: layerConfsContext, subscribe: true })
  accessor layerConfs: CLayerConf[]

  @consume({ context: modelConfContext, subscribe: true })
  accessor modelConf: ModelConf

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-panel name="network">
        ${this.modelConf.model
          ? html`<core-model-features-unavailable-card></core-model-features-unavailable-card>`
          : html``}
        <network-info-card></network-info-card>
        ${!this.modelConf.model &&
        (this.editable || this.settings.mayAddAndRemoveLayers)
          ? html`
              <network-add-layer-card> </network-add-layer-card>
              ${this.layerConfs.length
                ? html`<network-clear-card></network-clear-card>`
                : html``}
            `
          : html``}
      </c-panel>
    `
  }
}
