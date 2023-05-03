import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { StateController } from "@lit-app/state";
import state from '@/state'

import NeuralNet from "@/network/net";
import InputLayer from "@/network/input_layer";
import DenseLayer from "@/network/dense_layer";
import OutputLayer from "@/network/output_layer";

import spawnAlert from '@/alerts'
import DatasetFactory from "@/dataset/dataset_factory";

@customElement('network-quick-actions-card')
class NetworkQuickActions extends LitElementWw {

  state = new StateController(this, state)

  _handleImport(e) {

  }

  _handleExport(e) {
    
  }

  async _handleClear(e?) {
    state.network.cleanup()
    spawnAlert("The canvas has been cleared!")
    if (state.dataset.name) {
      state.dataset = await DatasetFactory.getDatasetByName(state.dataset.name)
    } else {
      state.dataset = await DatasetFactory.getDatasetByName(DatasetFactory.getOptions()[0])
    }
    state.network = new NeuralNet()
  }

  async _handleCreateFeedForwardNetwork(e) {

    await this._handleClear()
    
    const inputLayer = new InputLayer({
      pos: {x: 0, y: 0}
    })
    const denseLayer1 = new DenseLayer({
      inputFrom: [inputLayer],
      units: 5,
      pos: {x: 500, y: -300}
    })
    const denseLayer2 = new DenseLayer({
      inputFrom: [denseLayer1],
      pos: {x: 300, y: -600}
    })
    const denseLayer3 = new DenseLayer({
      inputFrom: [denseLayer1],
      units: 3,
      pos: {x: 1200, y: -600}
    })
    const outputLayer = new OutputLayer({
      inputFrom: [denseLayer2, denseLayer3],
      pos: {x: 900, y: -900}
    })

    state.canvas.fit()

    spawnAlert("A feed forward network has been created!")
  }

  render(){
    return html`
      <c-card>
        <div slot="title">
          <sl-tooltip content="Quickly setup a network in a few click. Also sets up data input and output. Note: All previous changes to the network will be lost!">
            Quick actions <sl-icon name="question-circle"></sl-icon>
          </sl-tooltip>
        </div>
        <div slot="content">
          <c-button-group>
            <sl-button @click="${this._handleImport}">
              <sl-icon slot="prefix" name="file-earmark-arrow-up"></sl-icon>
              Import
            </sl-button>
            <sl-button @click="${this._handleExport}">
              <sl-icon slot="prefix" name="file-earmark-arrow-down"></sl-icon>
              Export
            </sl-button>
            <sl-button @click="${this._handleClear}" variant=danger outline>
              <sl-icon slot="prefix" name="trash"></sl-icon>
              Clear
            </sl-button>
          </c-button-group>
          <sl-button @click="${this._handleCreateFeedForwardNetwork}" variant=primary outline>
            <sl-icon slot="prefix" name="file-earmark-plus"></sl-icon>
            Create feed forward network
          </sl-button>
        </div>
      </c-card>
    `;
  }
}