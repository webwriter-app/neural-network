import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import '@/components/cards/training_train_card.js'
import '@/components/cards/training_learning_rate_card.js'
import '@/components/cards/training_dropout_card.js'

@customElement('train-panel')
class TrainPanel extends LitElementWw {

  render(){
    return html`
      <training-train-card></training-train-card>
      <training-learning-rate-card></training-learning-rate-card>
      <training-dropout-card></training-dropout-card>
    `;
  }
}