import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '@/global_styles'

import type { CLayerConnectionConf } from '@/types/c_layer_connection_conf'
import type { CNetwork } from '@/components/network/network'
import { networkContext } from '@/contexts/network_context'
import { layerConnectionConfsContext } from '@/contexts/layer_con_confs_context'
import type { CNeuron } from '@/components/network/neuron'

export @customElement('neuron-inputs-card') class NeuronInputsCard extends LitElementWw {
  @property({ attribute: false })
  accessor neuron: CNeuron

  @consume({ context: layerConnectionConfsContext, subscribe: true })
  accessor layerConnectionConfs: CLayerConnectionConf[]

  @consume({ context: networkContext, subscribe: true })
  accessor network: CNetwork

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Inputs</div>
        <div slot="content">
          ${this.layerConnectionConfs
            .filter(
              (layerConnection) =>
                layerConnection.targetLayerId === this.neuron.layer.conf.layerId
            )
            .map((layerConnectionConf) =>
              this.network.getLayerById(layerConnectionConf.sourceLayerId)
            )
            .map(
              (layer) => html`<p>- All neurons from '${layer.getName()}'</p>`
            )}
        </div>
      </c-card>
    `
  }
}
