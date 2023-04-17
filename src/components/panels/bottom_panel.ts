import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('bottom-panel')
class BottomPanel extends LitElementWw {

  static styles = css`
    .bottom-panel {
      padding: 10px;
    }
  `

  render(){
    return html`
        <div class="bottom-panel">
        <sl-tab-group>
            <sl-tab slot="nav" panel="console">Console</sl-tab>
            <sl-tab slot="nav" panel="predict">Predict</sl-tab>
            <sl-tab slot="nav" panel="error-rate">Error rate</sl-tab>
            <sl-tab slot="nav" panel="another-visual">Another visual</sl-tab>

            <sl-tab-panel name="console">This is a console.</sl-tab-panel>
            <sl-tab-panel name="predict">Test the network.</sl-tab-panel>
            <sl-tab-panel name="error-rate">View a graphic development of the error rate</sl-tab-panel>
            <sl-tab-panel name="another-visual">Another visualization</sl-tab-panel>
        </sl-tab-group>
        </div>
    `;
  }
}