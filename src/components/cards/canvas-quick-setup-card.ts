import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

import NeuralNet from "@/network/net";
import InputLayer from "@/network/input_layer";
import DenseLayer from "@/network/dense_layer";
import SoftmaxLayer from "@/network/softmax_layer";

import Activation from "@/types/activation";

import spawnAlert from '@/alerts'

import networkState from "@/state/network_state";


@customElement('canvas-quick-setup-card')
class CanvasQuickSetup extends LitElementWw {

  _handleCreateFeedForwardNetwork(e) {
    /*const inputLayer = new InputLayer({})*/
    const denseLayer1 = new DenseLayer({
      inputFrom: [/*inputLayer*/],
      units: 5
    })
    const denseLayer2 = new DenseLayer({
      inputFrom: [denseLayer1],
    })
    const denseLayer3 = new DenseLayer({
      inputFrom: [denseLayer1],
      units: 3
    })
    /*const softmaxLayer = new SoftmaxLayer({
      inputFrom: [denseLayer2]
    })*/

    let network = new NeuralNet({
      layers: [/*inputLayer,*/ denseLayer1, denseLayer2, denseLayer3/*, softmaxLayer*/]
    })

    networkState.net = network
  }

  render(){
    return html`
      <c-card>
        <div slot="title">
          <sl-tooltip content="Quickly setup a network in a few click. Also sets up data input and output. Note: All previous changes to the network will be lost!">
            Quick setup <sl-icon name="question-circle"></sl-icon>
          </sl-tooltip>
        </div>
        <div slot="content">
          <c-button-group>
            <sl-button @click="${this._handleImport}" variant=primary>Import</sl-button>
            <sl-button @click="${this._handleExport}">Export</sl-button>
          </c-button-group>
          <sl-button @click="${this._handleCreateFeedForwardNetwork}" variant=primary>Create feed forward network</sl-button>
        </div>
      </c-card>
    `;
  }
}