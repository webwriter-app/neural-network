import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js';

import { StateController } from "@lit-app/state";
import state from '@/state'

import NeuronLayer from "@/network/neuron_layer";
import Layer from "@/network/layer";
import InputLayer from "@/network/input_layer";

@customElement('layer-edit-card')
class LayerEditCard extends LitElementWw {

  state = new StateController(this, state)

  @query('#updateNeuronsForm') _updateNeuronsForm;
  @property() layer: Layer | null;

  async connectedCallback() {
    super.connectedCallback()
    await this.updateComplete
    this._updateNeuronsForm.addEventListener('submit', this._handleSetNeurons.bind(this))
  }

  _handleAddNeuron(e) {
    if (this.layer instanceof NeuronLayer) {
      this.layer.addNeuron()
      state.canvas.fit()
    }
  }

  _handleRemoveNeuron(e) {
    if (this.layer instanceof NeuronLayer) {
      this.layer.removeNeuron()
      state.canvas.fit()
    }
  }

  _handleSetNeurons(e) {
    e.preventDefault();
    const formData = serialize(this._updateNeuronsForm)
    console.log(this)
    if (typeof formData.units !== "string") throw new Error("The number of neurons in the form should be of type string.")
    const units = parseInt(formData.units)
    if (this.layer instanceof NeuronLayer) {
      this.layer.setNeurons(units)
      state.canvas.fit()
    }
    this._updateNeuronsForm.reset()
  }

  _handleChangeInput(e) {
    const layerIDs = this.renderRoot.querySelector('#inputSelect').value.map(id => {return parseInt(id)})
    const layers = state.network.getLayersByIds(layerIDs)
    this.layer.setInputFrom(layers)
  }

  _handleChangeOutput(e) {
    const layerIDs = this.renderRoot.querySelector('#outputSelect').value.map(id => {return parseInt(id)})
    const layers = state.network.getLayersByIds(layerIDs)
    this.layer.setOutputTo(layers)
  }

  _handleDuplicateLayer(e) {
    this.layer.duplicate()
  }

  _handleDeleteLayer(e) {
    state.network.deselect()
    state.network.removeLayer(this.layer)
    state.canvas.fit()
  }
  
  _getInputOptions() {
    const options = state.network.layers.filter((layer) => layer != this.layer)
    return options.map((layer) => html`<sl-option value="${layer.id.toString()}">${layer.getName()}</sl-option>`)
  }

  _getOutputOptions() {
    const options = state.network.layers.filter((layer) => layer != this.layer && !(layer instanceof InputLayer))
    return options.map((layer) => html`<sl-option value="${layer.id.toString()}">${layer.getName()}</sl-option>`)
  }

  // @TODO: somehow make the number of units reactive, so that when removing multiple neurons, the button to remove is disabled when we reach a units value of 1
  render(){
    return html`
      <c-card>
        <div slot="title">
          Edit layer
        </div>
        <div slot="content">
          <div>
            <h3>Neurons</h3>
            <c-button-group>
              <sl-button @click="${this._handleAddNeuron}" variant=primary outline>Add neuron</sl-button>
              <sl-button @click="${this._handleRemoveNeuron}" .disabled=${this.layer instanceof NeuronLayer && this.layer.units.length <= 1} variant=danger outline>Remove neuron</sl-button>
            </c-button-group>
          </div>
          <form id="updateNeuronsForm">
            <c-button-group>
              <sl-input name="units" placeholder="set number of neurons manually" type="number" required></sl-input>
              <sl-button type="submit">Update</sl-button>
            </c-button-group>
          </form>
          <div>
            <h3>Inputs</h3>
            <sl-select id="inputSelect" value=${this.layer.inputFrom.map(layer => layer.id).join(' ')} multiple clearable @sl-change="${this._handleChangeInput}">
              ${this._getInputOptions()}
            </sl-select>
            <h3>Outputs</h3>
            <sl-select id="outputSelect" value=${this.layer.outputTo.map(layer => layer.id).join(' ')} multiple clearable @sl-change="${this._handleChangeOutput}">
              ${this._getOutputOptions()}
            </sl-select>
          </div>
        <div>
          <h3>Layer</h3>
          <c-button-group>
            <sl-button @click="${this._handleDuplicateLayer}">Duplicate</sl-button>
            <sl-button @click="${this._handleDeleteLayer}" variant=danger outline>Delete</sl-button>
          </c-button-group>
        </div>
      </c-card>
    `;
  }
}