import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

import NeuralNet from "@/network/net";
import InputLayer from "@/network/input_layer";
import DenseLayer from "@/network/dense_layer";
import SoftmaxLayer from "@/network/softmax_layer";

import spawnAlert from '@/alerts'

import networkState from "@/state/network_state";
import canvasState from "@/state/canvas_state";
import idState from "@/state/id_state";


@customElement('canvas-quick-actions-card')
class CanvasQuickActions extends LitElementWw {

  _handleClear(e) {
    canvasState.clear()
    idState.reset()
    networkState.setNet(null)

    spawnAlert("The canvas has been cleared!")
  }

  _handleCreateFeedForwardNetwork(e) {

    // clear the canvas from previously built networks
    canvasState.clear()
    console.log("cleared")
    
    /*const inputLayer = new InputLayer({})*/
    const denseLayer1 = new DenseLayer({
      inputFrom: [/*inputLayer*/],
      units: 5,
      pos: {
        x: 0,
        y: 0
      }
    })
    const denseLayer2 = new DenseLayer({
      inputFrom: [denseLayer1],
      pos: {
        x: 200,
        y: 0
      }
    })
    const denseLayer3 = new DenseLayer({
      inputFrom: [denseLayer1],
      units: 3,
      pos: {
        x: 200,
        y: 300
      }
    })
    /*const softmaxLayer = new SoftmaxLayer({
      inputFrom: [denseLayer2]
    })*/

    let network = new NeuralNet({
      layers: [/*inputLayer,*/ denseLayer1, denseLayer2, denseLayer3/*, softmaxLayer*/]
    })

    networkState.setNet(network)
    canvasState.fit()

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