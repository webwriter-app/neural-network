import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import NeuralNet from "@/network/net"

@customElement('training-train-card')
class TrainingTrainCard extends LitElementWw {

  @property() network: NeuralNet

  _handleTrainStep() {
    this.network.train()
  }

  static styles = css`

  `

  render(){
    return html`
      <c-card>
        <div slot="title">
          Train
        </div>
        <div slot="content">
          <div>
            <sl-button variant="default" size="large" circle>
              <sl-icon name="arrow-counterclockwise" label="Reset"></sl-icon>
            </sl-button>
            <sl-button variant="primary" size="large" circle @click="${this._handleTrainStep}">
              <sl-icon name="play" label="Run"></sl-icon>
            </sl-button>
            <sl-button variant="default" size="large" circle>
              <sl-icon name="fast-forward" label="Next"></sl-icon>
            </sl-button>
          </div>
        </div>
      </c-card>
    `;
  }
}