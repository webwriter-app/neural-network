import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('training-learning-rate-card')
class TrainingLearningRateCard extends LitElementWw {

  static styles = css`
  `

  render(){
    return html`
      <c-card>
        <div slot="title">
          Learning rate
        </div>
        <div slot="content">
          <form>
            <sl-range label="learning rate" help-text="Adjust the speed at which the network learns" min="0" max="1" step="0.01"></sl-range>
          </form>
        </div>
      </c-card>
    `;
  }
}