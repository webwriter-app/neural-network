import { LitElement } from 'lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { editableContext } from '@/contexts/editable_context'
import { settingsContext, Settings } from '@/contexts/settings_context'
import { layerConfsContext } from '@/contexts/layer_confs_context'
import { networkContext } from '@/contexts/network_context'
import { ModelConf, modelConfContext } from '@/contexts/model_conf_context'

import type { Network } from '@/network/network'
import { CLayerConf } from '@/network/c_layer_conf'

@customElement('network-info-card')
export class NetworkInfoCard extends LitElement {
  @consume({ context: editableContext, subscribe: true })
  editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  settings: Settings

  @consume({ context: layerConfsContext, subscribe: true })
  layerConfs: CLayerConf[]

  @consume({ context: networkContext, subscribe: true })
  network: Network

  @consume({ context: modelConfContext, subscribe: true })
  modelConf: ModelConf

  static styles: CSSResult[] = globalStyles

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Network</div>
        <div slot="content">
          ${this.layerConfs.length
            ? html`<p>
                Your network currently contains ${this.layerConfs.length}
                layers.
              </p>`
            : html`<p>Your network is currently empty.</p>`}
          ${!this.modelConf.model &&
          (this.editable || this.settings.mayAddAndRemoveLayers)
            ? html`
                ${!this.network.getInputLayers().length
                  ? html`
                      <p>
                        You currently do not have an input layer. Drag one onto
                        the canvas!
                      </p>
                    `
                  : html``}
                ${!this.network.getOutputLayer()
                  ? html`
                      <p>
                        You currently do not have an output layer. Drag one onto
                        the canvas!
                      </p>
                    `
                  : html``}
              `
            : html``}
          ${!this.modelConf.model &&
          (this.editable || this.settings.mayChangeLayerConnections)
            ? html`
                <p>
                  Always make sure to connect your layers such that there is a
                  path from your input layer(s) to your output layer! Therefore
                  select a layer in the canvas and select its incoming or
                  outgoing connections
                </p>
              `
            : html``}
        </div>
      </c-card>
    `
  }
}
