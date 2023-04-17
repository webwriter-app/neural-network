import {LitElementWw} from "@webwriter/lit"
import {html, css, CSSResultGroup} from "lit"
import {customElement, state} from "lit/decorators.js"

import './components/top_bar.ts'
import './components/graph_panel.js'
import './components/right_panel.ts'
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
      overflow: auto;
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
                <graph-panel
                  .net = "${this._net}"
                  @selected-layer="${(e) => { this._selectedLayer = e.detail.id; this._selectedNeuron = null }}"
                  @selected-neuron="${(e) => { this._selectedLayer = null; this._selectedNeuron = e.detail.id }}"
                  @deselected="${(e) => { this._selectedLayer = null; this._selectedNeuron = null }}"
                ></graph-panel>
              </div>
              <sl-icon slot="divider" name="grip-vertical"></sl-icon>
              <div slot="end" class="panel">
                <right-panel></right-panel>
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
