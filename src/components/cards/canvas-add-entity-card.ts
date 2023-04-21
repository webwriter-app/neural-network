import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import FeedForwardEntity from "@/network/feedforward-entity";

@customElement('canvas-add-entity-card')
class CanvasAddEntityCard extends LitElementWw {

  _handleAddFeedForwardEntity(e) {
    let ffentity = new FeedForwardEntity()
  }

  render(){
    return html`
      <c-card>
        <div slot="title">
          <sl-tooltip content="For maximum editing flexability, you can manually add a data input, output and network 
          components like feed forward networks, RNNs or single neurons in between!">
            Add a new network entity <sl-icon name="question-circle"></sl-icon>
          </sl-tooltip>
        </div>
        <div slot="content">
          <sl-button @click="${this._handleAddInput}">Add data input</sl-button>
          <sl-button @click="${this._handleAddInput}">Add output</sl-button>
          <sl-button @click="${this._handleAddFeedForwardEntity}">Add feed forward entity</sl-button>
        </div>
      </c-card>
    `;
  }
}