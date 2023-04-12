import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('learning-rate-card')
class LearningRateCard extends LitElementWw {

  static styles = css`

    .learning-rate-card {
      width: 100%;
    }

    .learning-rate-card .body {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;  
    }

    .learning-rate-card [slot='header'] {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    :host(:not([editable])) div[slot="header"] {
      display: none
    }

    .learning-rate-card sl-icon-button {
      font-size: var(--sl-font-size-medium);
    }
  `

  render(){
    return html`
      <sl-card class="learning-rate-card">
        <div slot="header">
          Learning rate
          <sl-icon-button name="gear" label="Settings"></sl-icon-button>
        </div>
        <div class="body">
          <form class="learning-rate-form">
            <sl-range label="learning rate" help-text="Controls the learning rate. Short info to learning rate" min="0" max="1" step="0.01"></sl-range>
          </form>
        </div>
      </sl-card>
    `;
  }
}