import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import './cards/train_card.ts'
import './cards/learning_rate_card.ts'

@customElement('train-panel')
class TrainPanel extends LitElementWw {

  static styles = css`
    .train-panel {
      padding: 10px;
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }
  `

  render(){
    return html`
        <div class="train-panel">
            <h1>Train</h1>
            <train-card></train-card>
            <learning-rate-card></learning-rate-card>
            <p>Note: Changing the settings below will require training to start from the beginning!</p>
        </div>
    `;
  }
}