import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'
import {
  TrainOptions,
  trainOptionsContext,
} from '@/contexts/train_options_context'
import { Model, modelContext } from '@/contexts/model_context'

import { globalStyles } from '@/global_styles'
import { SlChangeEvent, SlRange } from '@shoelace-style/shoelace'

@customElement('training-hyperparameters-card')
export class TrainingHyperparametersCard extends LitElementWw {
  @consume({ context: trainOptionsContext, subscribe: true })
  trainOptions: TrainOptions

  @consume({ context: modelContext, subscribe: true })
  model: Model

  @query('#learningRateRange')
  _learningRateRange: SlRange

  @query('#dropoutRateRange')
  _dropoutRateRange: SlRange

  _handleChangeLearningRate(): void {
    this.trainOptions.setOption(
      'learningRate',
      this._learningRateRange.value.toString()
    )
  }

  _handleChangeDropoutRate(): void {
    this.trainOptions.setOption(
      'dropoutRate',
      this._dropoutRateRange.value.toString()
    )
  }

  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Hyperparameters</div>
        <div slot="content">
          ${this.model.model
            ? html`<span
                >The options below are currently disabled because these options
                can not be changed in the current model. Reset the model to be
                able to change these options again!</span
              >`
            : html``}
          <sl-range
            id="learningRateRange"
            label="learning rate: ${this.trainOptions.learningRate}"
            help-text="Adjust the speed at which the network learns"
            min="0"
            max="1"
            step="0.01"
            value="${this.trainOptions.learningRate}"
            ?disabled=${this.model.model}
            @sl-change="${(_e: SlChangeEvent) =>
              this._handleChangeLearningRate()}"
          >
          </sl-range>
          <sl-range
            id="dropoutRateRange"
            label="dropout rate: ${this.trainOptions.dropoutRate}"
            help-text="Adjust the probability of neurons being deactivated during training"
            min="0"
            max="1"
            step="0.01"
            value="${this.trainOptions.dropoutRate}"
            ?disabled=${this.model.model}
            @sl-change="${(_e: SlChangeEvent) =>
              this._handleChangeDropoutRate()}"
          >
          </sl-range>
        </div>
      </c-card>
    `
  }
}
