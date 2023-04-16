import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('learning-rate-card')
class LearningRateCard extends LitElementWw {

  static styles = css`
  `

  render(){
    return html`
      <c-card>
        <div slot="title">
          Learning rate
        </div>
        <div slot="content">
          <form class="learning-rate-form">
            <sl-range label="learning rate" help-text="Controls the learning rate. Short info to learning rate" min="0" max="1" step="0.01"></sl-range>
          </form>
        </div>
      </c-card>
    `;
  }
}