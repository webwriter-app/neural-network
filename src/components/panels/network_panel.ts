import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { editableContext } from '@/contexts/editable_context'
import type { Settings } from '@/types/settings'
import { settingsContext } from '@/contexts/settings_context'
import type { CLayerConf } from '@/types/c_layer_conf'
import { layerConfsContext } from '@/contexts/layer_confs_context'
import type { ModelConf } from '@/types/model_conf'
import { modelConfContext } from '@/contexts/model_conf_context'

import '@/components/cards/core_model_features_unavailable_card'
import '@/components/cards/network_info_card'
import '@/components/cards/network_clear_card'
import '@/components/cards/network_add_layer_card'

@customElement('network-panel')
export class NetworkPanel extends LitElementWw {
  @consume({ context: editableContext, subscribe: true })
  editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  settings: Settings

  @consume({ context: layerConfsContext, subscribe: true })
  layerConfs: CLayerConf[]

  @consume({ context: modelConfContext, subscribe: true })
  modelConf: ModelConf

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
