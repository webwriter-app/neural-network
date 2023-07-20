import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { consume } from '@lit-labs/context'
import { Model, modelContext } from '@/contexts/model_context'
import {
  TrainOptions,
  trainOptionsContext,
} from '@/contexts/train_options_context'
import { dataSetContext } from '@/contexts/data_set_context'
import { DataSet } from '@/data_set/data_set'

import { globalStyles } from '@/global_styles'

@customElement('training-train-card')
export class TrainingTrainCard extends LitElementWw {
  @consume({ context: modelContext, subscribe: true })
  model: Model

  @consume({ context: trainOptionsContext, subscribe: true })
  trainOptions: TrainOptions

  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  _handleReset(): void {
    void this.model.reset()
  }

  _handleTrain(): void {
    void this.model.train()
  }

  _handleStopTraining(): void {
    this.dispatchEvent(
      new Event('stop-training', {
        bubbles: true,
        composed: true,
      })
    )
  }

  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Train</div>
        <div slot="content">
          <div>
            ${this.model.isTraining
              ? html`
                  <sl-progress-bar
                    value="${(this.model.actEpoch /
                      parseInt(this.trainOptions.epochs)) *
                    100}"
                  ></sl-progress-bar>
                  <p>
                    Epoch ${this.model.actEpoch}/${this.trainOptions.epochs} •
                    Batch
                    ${this.model.actBatch}/${Math.ceil(
                      this.dataSet.data.length /
                        parseInt(this.trainOptions.batchSize)
                    )}
                  </p>
                  <sl-tooltip content="Stop training">
                    <sl-button
                      size="large"
                      circle
                      @click="${(_e: MouseEvent) => this._handleStopTraining()}"
                    >
                      <sl-icon name="stop" label="Stop"></sl-icon>
                    </sl-button>
                  </sl-tooltip>
                `
              : html`
                  <sl-tooltip content="Reset model">
                    <sl-button
                      size="large"
                      circle
                      @click="${(_e: MouseEvent) => this._handleReset()}"
                    >
                      <sl-icon
                        name="arrow-counterclockwise"
                        label="Reset"
                      ></sl-icon>
                    </sl-button>
                  </sl-tooltip>
                  <sl-tooltip
                    content="${this.model.model
                      ? 'Continue training'
                      : 'Start training'}"
                  >
                    <sl-button
                      variant="primary"
                      size="large"
                      circle
                      @click="${(_e: MouseEvent) => this._handleTrain()}"
                    >
                      <sl-icon name="play" label="Run"></sl-icon>
                    </sl-button>
                  </sl-tooltip>
                  <sl-tooltip content="Train a single batch">
                    <sl-button size="large" circle>
                      <sl-icon name="fast-forward" label="Next"></sl-icon>
                    </sl-button>
                  </sl-tooltip>
                  <sl-tooltip content="Train a single epoch">
                    <sl-button size="large" circle>
                      <sl-icon name="fast-forward" label="Next"></sl-icon>
                    </sl-button>
                  </sl-tooltip>
                `}
          </div>
        </div>
      </c-card>
    `
  }
}
