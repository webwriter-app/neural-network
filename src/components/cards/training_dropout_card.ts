import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('training-dropout-card')
class TrainingDropoutCard extends LitElementWw {

  static styles = css`
  `

  render(){
    return html`
      <c-card>
        <div slot="title">
            Dropout probablity
        </div>
        <div slot="content">
            <form>
                <sl-range label="dropout" help-text="Adjust the probability of neurons being deactivated during training" min="0" max="1" step="0.01"></sl-range>
            </form>
        </div>
      </c-card>
    `;
  }
}