import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import Layer from "@/network/layer";
import InputLayer from "@/network/input_layer";
import DenseLayer from "@/network/dense_layer";
import OutputLayer from "@/network/output_layer";

@customElement('canvas-add-layer-card')
class CanvasAddLayerCard extends LitElementWw {

  _handleAddInputLayer(e) {
    new InputLayer({})
  }

  _handleAddDenseLayer(e) {
    new DenseLayer({})
  }

  _handleAddOutputLayer(e) {
    new OutputLayer({})
  }

  render(){
    return html`
      <c-card>
        <div slot="title">
          <sl-tooltip content="For maximum editing flexability, you can manually add layers. After adding a layer you can click on it in the graph to specify its input and output layer(s)">
            Add layer <sl-icon name="question-circle"></sl-icon>
          </sl-tooltip>
        </div>
        <div slot="content">
          <c-button-group>
            <sl-button @click="${this._handleAddInputLayer}">Input</sl-button>
            <sl-button @click="${this._handleAddDenseLayer}">Dense</sl-button>
            <sl-button @click="${this._handleAddOutputLayer}">Output</sl-button>
          </c-button-group>
        </div>
      </c-card>
    `;
  }
}