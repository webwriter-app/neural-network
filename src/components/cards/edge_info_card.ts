import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { CLayer } from '@/network/c_layer'
import { Neuron } from '@/network/neuron'

@customElement('edge-info-card')
export class EdgeInfoCard extends LitElementWw {
  @property({ attribute: false })
  source: CLayer | Neuron

  @property({ attribute: false })
  target: CLayer | Neuron

  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Edge</div>
        <div slot="content">
          <p>
            From:
            <c-network-link .target="${this.source}"
              >${this.source.getName()}</c-network-link
            >
          </p>
          <p>
            To:
            <c-network-link .target="${this.target}"
              >${this.target.getName()}</c-network-link
            >
          </p>
        </div>
      </c-card>
    `
  }
}
