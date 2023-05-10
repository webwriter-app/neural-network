import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('network-quick-actions-card')
class NetworkQuickActions extends LitElementWw {

  _handleImport(e) {

  }

  _handleExport(e) {
    
  }

  _handleClear(e) {
    this.dispatchEvent(new CustomEvent('handle-clear'))
  }

  _handleCreateFeedForwardNetwork(e) {
    this.dispatchEvent(new CustomEvent('handle-create-feed-forward'))
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