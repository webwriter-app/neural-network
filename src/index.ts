import {LitElementWw} from "@webwriter/lit"
import {html, css} from "lit"
import {customElement} from "lit/decorators.js"

import '@/components/panels/canvas_panel'
import '@/components/panels/dataset_panel.ts'
import '@/components/panels/network_panel.ts'
import '@/components/panels/train_panel.ts'
import '@/components/panels/bottom_panel'

@customElement("ww-machinelearningvisualizer")
export class WwMachinelearningvisualizer extends LitElementWw {

  static styles = css`
    * {
      margin: 0;
      padding: 0;
      font-family: var(--sl-font-sans);
    }

    .main {
      height: 100vh
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
      <sl-split-panel vertical style="--max: 300px" primary="end" class="main">
        <div slot="start" class="panel">
          <sl-split-panel style="--max: 500px" primary="end">
            <div slot="start" class="panel">
              <canvas-panel></canvas-panel>
            </div>
            <sl-icon slot="divider" name="grip-vertical"></sl-icon>
            <div slot="end" class="panel" style="padding: 10px">
              <sl-tab-group>
                <sl-tab slot="nav" panel="network">Network</sl-tab>
                <sl-tab slot="nav" panel="dataset">Dataset</sl-tab>
                <sl-tab slot="nav" panel="training">Training</sl-tab>
                <sl-tab-panel name="network"><network-panel></network-panel></sl-tab-panel>
                <sl-tab-panel name="dataset"><dataset-panel></dataset-panel></sl-tab-panel>
                <sl-tab-panel name="training"><train-panel></train-panel></sl-tab-panel>
                </sl-tab-group>
            </div>
          </sl-split-panel>
        </div>
        <sl-icon slot="divider" name="grip-horizontal"></sl-icon>
        <div slot="end" class="panel">
          <bottom-panel></bottom-panel>
        </div>
      </sl-split-panel>
    `
  }
}
