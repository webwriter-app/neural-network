import {LitElementWw} from "@webwriter/lit"
import {html, css} from "lit"
import {customElement} from "lit/decorators.js"

import { StateController } from "@lit-app/state";
import state from '@/state'

import DatasetFactory from "./dataset/dataset_factory";

import '@/components/panels/canvas_panel'

import '@/components/panels/dataset_panel.ts'
import '@/components/panels/network_panel.ts'
import '@/components/panels/train_panel.ts'
import '@/components/panels/layer_panel.ts'
import '@/components/panels/neuron_panel.ts'
import '@/components/panels/edge_panel.ts'

import '@/components/panels/plots_panel.ts'

@customElement("ww-machinelearningvisualizer")
export class WwMachinelearningvisualizer extends LitElementWw {

  state = new StateController(this, state)

  async connectedCallback() {
    super.connectedCallback()

    // Load the standard dataset
    state.dataset = await DatasetFactory.getDatasetByName("Boston House Pricing")
  }


  static styles = css`
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: var(--sl-font-sans);
    }

    #app {
      height: 100vh;
    }

    #main {
      height: calc(100vh - 300px);
      display: flex;
      flex-direction: row;
      overflow: hidden;
    }

    canvas-panel {
      width: calc(100% - 500px);
      height: 100%;
    }

    .active::part(base) {
      background-color: var(--sl-color-primary-600);
      color: var(--sl-color-neutral-0);
    }

    .panel {
      display: unset;
    }

    .hidden {
      display: none;
    }

    #rightPanelMenu {
      position: fixed;
      top: 10px;
      right: 500px;
      display: grid;
      gap: 10px;
    }

    #rightPanel {
      width: 500px;
      height: 100%;
      overflow: auto;
      padding: 10px;
    }

    #rightPanel {
      width: 500px;
      height: 100%;
      overflow: auto;
      padding: 10px;
    }

    #bottomPanelMenu {
      position: fixed;
      bottom: 300px;
      left: 15px;
      display: flex;
      gap: 10px;
    }

    #bottomPanel {
      height: 300px;
      width: 100%;
      overflow: auto;
      padding: 10px;
    }
  `

  render() {
    return html`
      <div id="main">
        <canvas-panel></canvas-panel>
        <div id="rightPanelMenu">
          <sl-button class="${state.activeRightPanel == 'network' ? 'active' : ''}" @click="${() => {state.activeRightPanel = 'network'}}">Network</sl-button>
          <sl-button class="${state.activeRightPanel == 'dataset' ? 'active' : ''}" @click="${() => {state.activeRightPanel = 'dataset'}}">Dataset</sl-button>
          <sl-button class="${state.activeRightPanel == 'training' ? 'active' : ''}" @click="${() => {state.activeRightPanel = 'training'}}">Training</sl-button>
          ${state.selected == 'layer' ? html`
            <sl-button class="${state.activeRightPanel == 'layer' ? 'active' : ''}" @click="${() => {state.activeRightPanel = 'layer'}}">Layer</sl-button>
          ` : html``}
          ${state.selected == 'neuron' ? html`
            <sl-button class="${state.activeRightPanel == 'neuron' ? 'active' : ''}" @click="${() => {state.activeRightPanel = 'neuron'}}">Neuron</sl-button>
          ` : html``}
          ${state.selected == 'edge' ? html`
            <sl-button class="${state.activeRightPanel == 'edge' ? 'active' : ''}" @click="${() => {state.activeRightPanel = 'edge'}}">Edge</sl-button>
          ` : html``}
        </div>
        <div id="rightPanel">
          <network-panel class="${state.activeRightPanel == 'network' ? 'panel' : 'hidden'}"></network-panel>
          <dataset-panel class="panel ${state.activeRightPanel == 'dataset' ? 'panel' : 'hidden'}"></dataset-panel>
          <train-panel class="panel ${state.activeRightPanel == 'training' ? 'panel' : 'hidden'}"></train-panel>
          <div class="panel ${state.activeRightPanel == 'predict' ? 'panel' : 'hidden'}">Predict</div>
          <layer-panel class="panel ${state.activeRightPanel == 'layer' ? 'panel' : 'hidden'}"></layer-panel>
          <neuron-panel class="panel ${state.activeRightPanel == 'neuron' ? 'panel' : 'hidden'}"></neuron-panel>
          <edge-panel class="panel ${state.activeRightPanel == 'edge' ? 'panel' : 'hidden'}"></edge-panel>
        </div>
      </div>
      <div id="bottomPanelMenu">
        <sl-button class="${state.activeBottomPanel == 'plots' ? 'active' : ''}" @click="${() => {state.activeBottomPanel = 'plots'}}">Plots</sl-button>
        <sl-button class="${state.activeBottomPanel == 'error rate' ? 'active' : ''}" @click="${() => {state.activeBottomPanel = 'error rate'}}">Error rate</sl-button>
      </div>
      <div id="bottomPanel">
        <plots-panel class="${state.activeBottomPanel == 'plots' ? 'panel' : 'hidden'}"></plots-panel>
        <div class="${state.activeBottomPanel == 'error rate' ? 'panel' : 'hidden'}">Error Rate</div>
      </div>
    `
  }
}
