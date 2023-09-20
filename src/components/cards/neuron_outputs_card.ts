import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import type { CLayerConnectionConf } from '@/types/c_layer_connection_conf'
import type { CNetwork } from '@/components/network/network'
import { networkContext } from '@/contexts/network_context'
import { layerConnectionConfsContext } from '@/contexts/layer_con_confs_context'
import type { CNeuron } from '@/components/network/neuron'

@customElement('neuron-outputs-card')
export class NeuronOutputsCard extends LitElementWw {
  @property({ attribute: false })
  neuron: CNeuron

  @consume({ context: layerConnectionConfsContext, subscribe: true })
  layerConnectionConfs: CLayerConnectionConf[]

  @consume({ context: networkContext, subscribe: true })
  network: CNetwork

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Outputs</div>
        <div slot="content">
          ${this.layerConnectionConfs
            .filter(
              (layerConnection) =>
                layerConnection.sourceLayerId === this.neuron.layer.conf.layerId
            )
            .map((layerConnectionConf) =>
              this.network.getLayerById(layerConnectionConf.targetLayerId)
            )
            .map(
              (layer) => html`<p>- All neurons from '${layer.getName()}'</p>`
            )}
        </div>
      </c-card>
    `
  }
}
