import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import './cards/network_card.ts'

@customElement('network-panel')
class NetworkPanel extends LitElementWw {

  static styles = css`
    .network-panel {
      padding: 10px;
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }
  `

  render(){
    return html`
      <div class="network-panel">
        <h1>Network</h1>
        <network-card></network-card>
      </div>
    `;
  }
}