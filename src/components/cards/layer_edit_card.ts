import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js';
import { observeState } from 'lit-element-state';
import networkState from '@/state/network_state.js';
import canvasState from "@/state/canvas_state";

import NeuronLayer from "@/network/neuron_layer";
import Layer from "@/network/layer";
import spawnAlert from "@/alerts";

@customElement('layer-edit-card')
class LayerEditCard extends observeState(LitElementWw) {

  @property() layer: Layer | null

  async connectedCallback() {
    super.connectedCallback()
    await this.updateComplete
    const form = this.renderRoot.querySelector('#updateNeuronsForm');
    form.addEventListener('submit', event => {
      event.preventDefault();
      const formData = serialize(form)
      if (typeof formData.units !== "string") throw new Error("The number of neurons in the form should be of type string.")
      const units = parseInt(formData.units)
      if (this.layer instanceof NeuronLayer) {
        this.layer.setNeurons(units)
        canvasState.fit()
      }
      form.reset()
    });

  }

  _handleAddNeuron(e) {
    if (this.layer instanceof NeuronLayer) {
      this.layer.addNeuron()
      canvasState.fit()
    }
  }

  _handleRemoveNeuron(e) {
    if (this.layer instanceof NeuronLayer) {
      this.layer.removeNeuron()
      canvasState.fit()
    }
  }
  
  _handleDeleteLayer(e) {
    networkState.net.removeLayer(this.layer)
  }

  // @TODO: somehow make the number of units reactive, so that when removing multiple neurons, the button to remove is disabled when we reach a units value of 1
  render(){
    return html`
      <c-card>
        <div slot="title">
          Edit layer
        </div>
        <div slot="content">
          <h3>Neurons</h3>
          <c-button-group>
            <sl-button @click="${this._handleAddNeuron}" variant=primary outline>Add neuron</sl-button>
            <sl-button @click="${this._handleRemoveNeuron}" .disabled=${this.layer instanceof NeuronLayer && this.layer.units <= 1} variant=danger outline>Remove neuron</sl-button>
          </c-button-group>
          <form id="updateNeuronsForm">
            <c-button-group>
              <sl-input name="units" placeholder="set number of neurons manually" type="number" required></sl-input>
              <sl-button type="submit">Update</sl-button>
            </c-button-group>
          </form>
          <div>
            <h3>Inputs</h3>
            <sl-select value="dense3" multiple clearable>
              <sl-option value="dense3">Dense 3</sl-option>
              <sl-option value="dense4">Dense 4</sl-option>
            </sl-select>
          </div>
          <sl-button @click="${this._handleDeleteLayer}" variant=danger outline>Delete layer</sl-button>
        </div>
      </c-card>
    `;
  }
}