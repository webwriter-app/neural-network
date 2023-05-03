import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { StateController } from "@lit-app/state";
import state from '@/state'

import Layer from "@/network/layer"
import Neuron from "@/network/neuron"

@customElement('c-network-link')
class CNetworkLink extends LitElementWw {

  state = new StateController(this, state)

  @property({ type: Boolean }) disabled: boolean
  @property({ type: String }) target: Layer | Neuron

  /* STYLES */
  static styles = css`

  `

  _handleClick(e) {
    state.canvas.cy.getElementById(this.target.getCyId()).select()
  }

  render(){
    return html`
      <sl-button size="small" pill @click="${this._handleClick}"><slot></sl-button>
    `;
  }
}