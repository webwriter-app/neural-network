import { LitElement } from 'lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { ModelConf, modelConfContext } from '@/contexts/model_conf_context'
import {
  TrainOptions,
  trainOptionsContext,
} from '@/contexts/train_options_context'
import { dataSetContext } from '@/contexts/data_set_context'
import { DataSet } from '@/data_set/data_set'

@customElement('training-train-card')
export class TrainingTrainCard extends LitElement {
  @consume({ context: modelConfContext, subscribe: true })
  modelConf: ModelConf

  @consume({ context: trainOptionsContext, subscribe: true })
  trainOptions: TrainOptions

  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  _handleReset(): void {
    this.dispatchEvent(
      new Event('reset-model', {
        bubbles: true,
        composed: true,
      })
    )
  }

  _handleTrain(): void {
    this.dispatchEvent(
      new Event('train-model', {
        bubbles: true,
        composed: true,
      })
    )
  }

  _handleStopTraining(): void {
    this.dispatchEvent(
      new Event('stop-training', {
        bubbles: true,
        composed: true,
      })
    )
  }

  static styles: CSSResult[] = globalStyles

  getContent(): TemplateResult<1> {}

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Train</div>
        <div slot="content">
          ${!this.modelConf.model && !this.modelConf.isTraining
            ? html` <sl-tooltip
                content="${this.modelConf.model
                  ? 'Continue training'
                  : 'Start training'}"
              >
                <sl-button
                  variant="primary"
                  size="large"
                  @click="${(_e: MouseEvent) => this._handleTrain()}"
                >
                  <sl-icon name="play" label="Run"></sl-icon>
                  Run training
                </sl-button>
              </sl-tooltip>`
            : html``}
          ${this.modelConf.isTraining
            ? html`
                <sl-progress-bar
                  value="${(this.modelConf.actEpoch /
                    parseInt(this.trainOptions.epochs)) *
                  100}"
                ></sl-progress-bar>
                <p>
                  Epoch ${this.modelConf.actEpoch}/${this.trainOptions.epochs} •
                  Batch
                  ${this.modelConf.actBatch}/${Math.ceil(
                    this.dataSet.data.length /
                      parseInt(this.trainOptions.batchSize)
                  )}
                </p>
                <sl-button
                  circle
                  size="large"
                  @click="${(_e: MouseEvent) => this._handleStopTraining()}"
                >
                  <sl-icon name="stop" label="Stop"></sl-icon>
                </sl-button>
              `
            : html``}
          ${this.modelConf.model && !this.modelConf.isTraining
            ? html`
                <span>Training done</span>
                <div class="button-group">
                  <sl-tooltip
                    content="Resets the model, so you can edit the network and settings again and are able to start a new training"
                  >
                    <sl-button
                      @click="${(_e: MouseEvent) => this._handleReset()}"
                    >
                      <sl-icon
                        name="arrow-counterclockwise"
                        label="Reset"
                      ></sl-icon>
                      Reset
                    </sl-button>
                  </sl-tooltip>
                </div>
              `
            : html``}
        </div>
      </c-card>
    `
  }
}
