import { widgetMsg } from '@webwriter/lit/localize'
import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '../global-styles'

import type { CLayerConnectionConf } from '../../model/network-types'
import type { CNetwork } from '../network/network'
import { networkContext } from '../contexts'
import { layerConnectionConfsContext } from '../contexts'
import type { CNeuron } from '../network/neuron'
import { CCard } from '../reusables/c-card'

export class NeuronInputsCard extends LitElementWw {
  private readonly msg = widgetMsg(this);

  static scopedElements = {
    "c-card": CCard
  }
  
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
        <div slot="title">${this.msg('Inputs')}</div>
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
              (layer) => html`<p>${this.msg('- All neurons from')} '${layer!.getName()}'</p>`
            )}
        </div>
      </c-card>
    `
  }
}
