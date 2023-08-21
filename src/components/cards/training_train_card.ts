import { LitElement } from 'lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { ModelConf, modelConfContext } from '@/contexts/model_conf_context'
import {
  TrainOptions,
  trainOptionsContext,
} from '@/contexts/train_options_context'
import { dataSetContext } from '@/contexts/data_set_context'
import { DataSet } from '@/data_set/data_set'

import { SlChangeEvent, SlRange } from '@shoelace-style/shoelace'

@customElement('training-train-card')
export class TrainingTrainCard extends LitElement {
  @consume({ context: modelConfContext, subscribe: true })
  modelConf: ModelConf

  @consume({ context: trainOptionsContext, subscribe: true })
  trainOptions: TrainOptions

  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  @query('#numberOfEpochsRange')
  _numberOfEpochsRange: SlRange

  @state()
  numberOfEpochs: number = 3

  _handleChangeNumberOfEpochs(): void {
    this.numberOfEpochs = this._numberOfEpochsRange.value
  }

  _handleTrain(epochs: number): void {
    this.dispatchEvent(
      new CustomEvent('train-model', {
        detail: epochs,
        bubbles: true,
        composed: true,
      })
    )
  }

  static styles: CSSResult[] = globalStyles

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Train</div>
        <div slot="content">
          ${!this.modelConf.isTraining
            ? html` ${this.modelConf.model
                  ? html`
                      <sl-progress-bar value="100"></sl-progress-bar>
                      <p>✅ Training completed!</p>
                      <p>
                        Feel free to continue training your model for some
                        additional epochs which might get you even better
                        results!
                      </p>
                    `
                  : html``}
                <sl-range
                  id="numberOfEpochsRange"
                  label="Epochs: ${this.numberOfEpochs}"
                  help-text="Number of iterations over the whole training data set"
                  min="1"
                  max="10"
                  step="1"
                  value="${this.numberOfEpochs}"
                  @sl-change="${(_e: SlChangeEvent) =>
                    this._handleChangeNumberOfEpochs()}"
                ></sl-range>
                <div class="button-group">
                  <sl-button
                    variant="primary"
                    size="large"
                    @click="${(_e: MouseEvent) =>
                      this._handleTrain(this.numberOfEpochs)}"
                  >
                    <sl-icon name="play" label="Run"></sl-icon>
                    ${this.numberOfEpochs == 1
                      ? html`Train for 1 epoch`
                      : html` Train for ${this.numberOfEpochs} epochs`}
                  </sl-button>
                </div>`
            : html``}
          ${this.modelConf.isTraining
            ? html`
                <sl-progress-bar
                  value="${(this.modelConf.actEpoch /
                    this.modelConf.totalEpochs) *
                  100}"
                ></sl-progress-bar>
                <p>
                  Epoch ${this.modelConf.actEpoch} • Batch
                  ${this.modelConf.actBatch}/${Math.ceil(
                    this.dataSet.data.length /
                      parseInt(this.trainOptions.batchSize)
                  )}
                </p>
              `
            : html``}
        </div>
      </c-card>
    `
  }
}
