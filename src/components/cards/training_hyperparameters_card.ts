import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, query } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'
import { SlChangeEvent, SlRange } from '@shoelace-style/shoelace'

@customElement('training-hyperparameters-card')
export class TrainingHyperparametersCard extends LitElementWw {
  @query('#learningRateRange')
  _learningRateRange: SlRange

  @query('#dropoutRateRange')
  _dropoutRateRange: SlRange

  _handleChangeLearningRate(): void {
    console.log(this._learningRateRange.value)
  }

  _handleChangeDropoutRate(): void {
    console.log(this._dropoutRateRange.value)
  }

  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Hyperparameters</div>
        <div slot="content">
          <sl-range
            id="learningRateRange"
            label="learning rate"
            help-text="Adjust the speed at which the network learns"
            min="0"
            max="1"
            step="0.01"
            @sl-change="${(_e: SlChangeEvent) =>
              this._handleChangeLearningRate()}"
          >
          </sl-range>
          <sl-range
            id="dropoutRateRange"
            label="dropout rate"
            help-text="Adjust the probability of neurons being deactivated during training"
            min="0"
            max="1"
            step="0.01"
            @sl-change="${(_e: SlChangeEvent) =>
              this._handleChangeDropoutRate()}"
          >
          </sl-range>
        </div>
      </c-card>
    `
  }
}
