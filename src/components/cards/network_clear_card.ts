import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

@customElement('network-clear-card')
export class NetworkClearCard extends LitElementWw {
  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleClear() {
    this.dispatchEvent(
      new CustomEvent('clear-network', { bubbles: true, composed: true })
    )
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Clear</div>
        <div slot="content">
          <sl-button
            @click="${(_e: MouseEvent) => {
              void this.handleClear()
            }}"
          >
            <sl-icon slot="prefix" name="trash"></sl-icon>
            Clear network
          </sl-button>
          <p>This will remove every layer from the network.</p>
        </div>
      </c-card>
    `
  }
}
