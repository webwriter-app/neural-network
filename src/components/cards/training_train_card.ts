import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('training-train-card')
class TrainingTrainCard extends LitElementWw {

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
            <sl-button variant="primary" size="large" circle>
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