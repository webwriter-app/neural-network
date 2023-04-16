import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('train-card')
class TrainCard extends LitElementWw {

  static styles = css`

    sl-radio-button {
      display: flex;
      gap: 30px;
    }
  `

  render(){
    return html`
      <c-card>
        <div slot="title">
          Train
        </div>
        <div slot="content">
          <sl-radio-group label="Training duration" name="a" value="1">
            <sl-radio-button pill size="medium" value="step">single step</sl-radio-button>
            <sl-radio-button pill size="medium" value="epoch">one epoch</sl-radio-button>
            <sl-tooltip content="Instead of executing a fixed amount of training steps, repeat training up until the error is below {low error value}">
              <sl-radio-button pill size="medium" value="auto">
                auto
                <sl-icon name="question-circle" slot="suffix"></sl-icon>
              </sl-radio-button>
            </sl-tooltip>
          </sl-radio-group>
          <sl-switch>Start training from beginning</sl-switch>
          <sl-button variant="primary" style="width: 100%">Train</sl-button>
        </div>
      </c-card>
    `;
  }
}