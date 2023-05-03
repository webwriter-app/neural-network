import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import InputLayer from "@/network/input_layer";
import DenseLayer from "@/network/dense_layer";
import OutputLayer from "@/network/output_layer";

@customElement('network-add-layer-card')
class NetworkAddLayerCard extends LitElementWw {

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
          Add layer
        </div>
        <div slot="content">
          <c-button-group>
            <sl-button @click="${this._handleAddInputLayer}">
              <sl-icon slot="prefix" name="plus-lg"></sl-icon>
              Input
            </sl-button>
            <sl-button @click="${this._handleAddDenseLayer}">
              <sl-icon slot="prefix" name="plus-lg"></sl-icon>
              Dense
            </sl-button>
            <sl-button @click="${this._handleAddOutputLayer}">
              <sl-icon slot="prefix" name="plus-lg"></sl-icon>
              Output
            </sl-button>
          </c-button-group>
        </div>
      </c-card>
    `;
  }
}