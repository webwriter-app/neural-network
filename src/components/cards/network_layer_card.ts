import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('network-layer-card')
class NetworkLayerCard extends LitElementWw {

  @property()
  net
  @property()
  selectedLayer

  /* STYLES */
  static styles = css`

    #cytoscapeCanvasWrapper {
      height: 400px;
      width: calc(100% + 40px);
      resize: vertical;
      overflow: auto;
      margin: -20px;
    }

    #cytoscapeCanvas{
      height: calc(100% - 10px);
      width: 100%;
    }
  `

  /* RENDERING */
  getOptions() {
    if (this.selectedLayer == 0) {
      return html`
        <sl-button @click="${this._handleAddLayerAfter}">Insert new layer after this layer</sl-button>
        <sl-button @click="${this._handleAddNeuron}">Add neuron</sl-button>
      `
    } else if (this.selectedLayer == this.net.config.hiddenLayers.length + 1) {
      return html`
        <sl-button @click="${this._handleAddLayerBefore}">Insert new layer before this layer</sl-button>
        <sl-button @click="${this._handleAddNeuron}">Add neuron</sl-button>
      `
    } else {
      return html`
        <sl-button @click="${this._handleAddLayerBefore}">Insert new layer before this layer</sl-button>
        <sl-button @click="${this._handleAddLayerAfter}">Insert new layer after this layer</sl-button>
        <sl-button @click="${this._handleAddNeuron}">Add neuron</sl-button>
      `
    }
  }
  _handleAddLayerBefore(e) {
    this.net.insertLayer({before: this.selectedLayer})
  }
  _handleAddLayerAfter(e) {
    this.net.insertLayer({after: this.selectedLayer})
  }
  _handleAddNeuron(e) {
    this.net.addNeuronToLayer(this.selectedLayer)
  }

  render(){
    return html`
      <c-card>
        <div slot="title">
          Edit selected layer "${this.selectedLayer}"
        </div>
        <div slot="content">
          ${this.getOptions()}
        </div>
      </c-card>
    `;
  }
}