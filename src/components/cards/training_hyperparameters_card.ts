import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { editableContext } from '@/contexts/editable_context'
import type { Settings } from '@/types/settings'
import { settingsContext } from '@/contexts/settings_context'
import type { TrainOptions } from '@/types/train_options'
import { trainOptionsContext } from '@/contexts/train_options_context'
import type { ModelConf } from '@/types/model_conf'
import { modelConfContext } from '@/contexts/model_conf_context'

import type {
  SlChangeEvent,
  SlRadioGroup,
  SlRange,
} from '@shoelace-style/shoelace'

@customElement('training-hyperparameters-card')
export class TrainingHyperparametersCard extends LitElementWw {
  @consume({ context: editableContext, subscribe: true })
  editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  settings: Settings

  @consume({ context: trainOptionsContext, subscribe: true })
  trainOptions: TrainOptions

  @consume({ context: modelConfContext, subscribe: true })
  modelConf: ModelConf

  private batchSizeOptions: number[] = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512]
  @query('#batchSizeRadioGroup')
  _batchSizeRadioGroup: SlRadioGroup

  @query('#learningRateRange')
  _learningRateRange: SlRange

  @query('#dropoutRateRange')
  _dropoutRateRange: SlRange

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleChangeBatchSize(): void {
    this.dispatchEvent(
      new CustomEvent<{
        option: string
        value: string
      }>('set-train-option', {
        detail: {
          option: 'batchSize',
          value: this._batchSizeRadioGroup.value,
        },
        bubbles: true,
        composed: true,
      })
    )
  }

  handleChangeLearningRate(): void {
    this.dispatchEvent(
      new CustomEvent<{
        option: string
        value: string
      }>('set-train-option', {
        detail: {
          option: 'learningRate',
          value: this._learningRateRange.value.toString(),
        },
        bubbles: true,
        composed: true,
      })
    )
  }

  handleChangeDropoutRate(): void {
    this.dispatchEvent(
      new CustomEvent<{
        option: string
        value: string
      }>('set-train-option', {
        detail: {
          option: 'dropoutRate',
          value: this._dropoutRateRange.value.toString(),
        },
        bubbles: true,
        composed: true,
      })
    )
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Hyperparameters</div>
        <div slot="content">
          <label for="batchSizeRadioGroup"
            >Batch size: ${this.trainOptions.batchSize}</label
          >
          <div
            class="hscroll-container ${this.modelConf.model ||
            (!this.editable && !this.settings.mayEditBatchSize)
              ? 'hidden'
              : ``}"
          >
            <sl-radio-group
              id="batchSizeRadioGroup"
              value="${this.trainOptions.batchSize}"
              @sl-change="${(_e: SlChangeEvent) =>
                this.handleChangeBatchSize()}"
            >
              ${this.batchSizeOptions.map((batchSize) => {
                return html`
                  <sl-radio-button size="small" value="${batchSize}"
                    >${batchSize}</sl-radio-button
                  >
                `
              })}
            </sl-radio-group>
          </div>
          <label for="learningRateRange"
            >Learning rate: ${this.trainOptions.learningRate}</label
          >
          <sl-range
            id="learningRateRange"
            class="${this.modelConf.model ||
            (!this.editable && !this.settings.mayEditLearningRate)
              ? 'hidden'
              : ``}"
            help-text="Adjust the speed at which the network learns"
            min="0"
            max="0.1"
            step="0.001"
            value="${this.trainOptions.learningRate}"
            @sl-change="${(_e: SlChangeEvent) =>
              this.handleChangeLearningRate()}"
          >
          </sl-range>
          <label for="dropoutRateRange"
            >Dropout rate: ${this.trainOptions.dropoutRate}</label
          >
          <sl-range
            id="dropoutRateRange"
            class="${this.modelConf.model ||
            (!this.editable && !this.settings.mayEditDropoutRate)
              ? 'hidden'
              : ``}"
            help-text="Adjust the probability of neurons being deactivated during training"
            min="0"
            max="1"
            step="0.01"
            value="${this.trainOptions.dropoutRate}"
            @sl-change="${(_e: SlChangeEvent) =>
              this.handleChangeDropoutRate()}"
          >
          </sl-range>
        </div>
      </c-card>
    `
  }
}
