import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import type { CNeuron } from '@/components/network/neuron'
import { CCard } from '../reusables/c-card'
import { CNetworkLink } from '../reusables/c-network-link'

export class EdgeInfoCard extends LitElementWw {

  static scopedElements = {
    "c-card": CCard,
    "c-network-link": CNetworkLink
  }

  @property({ attribute: false })
  accessor source: CNeuron

  @property({ attribute: false })
  accessor target: CNeuron

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
