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

@customElement('canvas-quick-actions-card')
class CanvasQuickActions extends LitElementWw {

  state = new StateController(this, state)

  _handleImport(e) {

  }

  _handleExport(e) {
    
  }

  async _handleClear(e?) {
    state.canvas.clear()
    state.network = new NeuralNet()
    state.dataset = await DatasetFactory.getDatasetByName(state.dataset.name)
    spawnAlert("The canvas has been cleared!")
  }

  async _handleCreateFeedForwardNetwork(e) {

    await this._handleClear()
    
    const inputLayer = new InputLayer({
      pos: {x: -400, y: 140}
    })
    inputLayer.assignInputs(state.dataset.getNonAssignedInputKeys())
    const denseLayer1 = new DenseLayer({
      inputFrom: [inputLayer],
      units: 5,
      pos: {x: 0, y: 0}
    })
    const denseLayer2 = new DenseLayer({
      inputFrom: [denseLayer1],
      pos: {x: 400, y: -150}
    })
    const denseLayer3 = new DenseLayer({
      inputFrom: [denseLayer1],
      units: 3,
      pos: {x: 400, y: 400}
    })
    const outputLayer = new OutputLayer({
      inputFrom: [denseLayer2, denseLayer3],
      pos: {x: 800, y: 175}
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
            <sl-button @click="${this._handleImport}">Import</sl-button>
            <sl-button @click="${this._handleExport}">Export</sl-button>
            <sl-button @click="${this._handleClear}" variant=danger outline>Clear</sl-button>
          </c-button-group>
          <sl-button @click="${this._handleCreateFeedForwardNetwork}" variant=primary outline>Create feed forward network</sl-button>
        </div>
      </c-card>
    `;
  }
}