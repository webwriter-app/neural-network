import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { CLayer } from '@/components/network/c_layer'
import { Neuron } from '@/components/network/neuron'

@customElement('edge-info-card')
export class EdgeInfoCard extends LitElementWw {
  @property()
  sourceLayer: CLayer

  @property()
  targetLayer: CLayer

  @property()
  sourceNeuron: Neuron

  @property()
  targetNeuron: Neuron

  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Info</div>
        <div slot="content">
          <span>
            Selected: Edge connecting
            ${this.sourceNeuron != null
              ? html`
                  <c-network-link .target="${this.sourceNeuron}"
                    >Neuron ${this.sourceNeuron.neuronId}</c-network-link
                  >
                  inside
                `
              : html``}.id
            <c-network-link .target="${this.sourceLayer}"
              >${this.sourceLayer.getName()}</c-network-link
            >
            with
            ${this.targetNeuron != null
              ? html`
                  <c-network-link .target="${this.targetNeuron}"
                    >Neuron ${this.targetNeuron.neuronId}</c-network-link
                  >
                  inside
                `
              : html``}
            <c-network-link .target="${this.targetLayer}"
              >${this.targetLayer.getName()}</c-network-link
            >
          </span>
        </div>
      </c-card>
    `
  }
}
