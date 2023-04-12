import {LitElementWw} from "@webwriter/lit"
import {html, css, CSSResultGroup} from "lit"
import {customElement} from "lit/decorators.js"

import './components/top_bar.ts'
import './components/network_panel.ts'
import './components/train_panel.ts'
import './components/bottom_panel.ts'

@customElement("ww-machinelearningvisualizer")
export class WwMachinelearningvisualizer extends LitElementWw {

  static styles = css`
    * {
      margin: 0;
      padding: 0;
      font-family: var(--sl-font-sans);
    }

    .header {
      height: 60px;
    }

    :host(:not([editable])) .header {
      display: none;
    }

    .main {
      height: calc(100vh - 60px - 16px); /* minus top bar size + body margin */
    }

    :host(:not([editable])) .main {
      height: calc(100vh - 16px);
    }

    sl-split-panel {
      --divider-width: 10px;
      height: 100%;
    }

    sl-split-panel::part(divider) {
      border-radius: 9999px;
    }

    .panel {
      overflow-y: scroll;
      overflow-x: clip;
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    .panel::-webkit-scrollbar{
      display: none;
    }
  `

  render() {
    return html`
      <div class="header">
        <top-bar></top-bar>
      </div>
      <div class="main">
        <sl-split-panel vertical style="--max: 300px" primary="end">
          <div slot="start" class="panel">
            <sl-split-panel style="--max: 500px" primary="end">
              <div slot="start" class="panel">
                <network-panel></network-panel>
              </div>
              <sl-icon slot="divider" name="grip-vertical"></sl-icon>
              <div slot="end" class="panel">
                <train-panel></train-panel>
              </div>
            </sl-split-panel>
          </div>
          <sl-icon slot="divider" name="grip-horizontal"></sl-icon>
          <div slot="end" class="panel">
            <bottom-panel></bottom-panel>
          </div>
        </sl-split-panel>
      </div>
      
    `
  }
}
