import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '@/global_styles'

import { editableContext } from '@/contexts/editable_context'
import type { Settings } from '@/types/settings'
import { settingsContext } from '@/contexts/settings_context'
import type { TrainOptions } from '@/types/train_options'
import { trainOptionsContext } from '@/contexts/train_options_context'
import type { ModelConf } from '@/types/model_conf'
import { modelConfContext } from '@/contexts/model_conf_context'

import type { SlChangeEvent } from '@shoelace-style/shoelace'
import { CCard } from '../reusables/c-card'

import SlRadioGroup from "@shoelace-style/shoelace/dist/components/radio-group/radio-group.component.js"
import SlRadioButton from "@shoelace-style/shoelace/dist/components/radio-button/radio-button.component.js"
import SlRange from "@shoelace-style/shoelace/dist/components/range/range.component.js"

export class TrainingHyperparametersCard extends LitElementWw {

  static scopedElements = {
    "c-card": CCard,
    "sl-radio-group": SlRadioGroup,
    "sl-radio-button": SlRadioButton,
    "sl-range": SlRange
  }

  @consume({ context: editableContext, subscribe: true })
  accessor editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  accessor settings: Settings

  @consume({ context: trainOptionsContext, subscribe: true })
  accessor trainOptions: TrainOptions

  @consume({ context: modelConfContext, subscribe: true })
  accessor modelConf: ModelConf

  private batchSizeOptions: number[] = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512]
  @query('#batchSizeRadioGroup')
  accessor _batchSizeRadioGroup: SlRadioGroup

  private learningRateOptions: number[] = [0.0001, 0.001, 0.01, 0.1, 1]
  @query('#learningRateRadioGroup')
  accessor _learningRateRadioGroup: SlRadioGroup

  @query('#dropoutRateRange')
  accessor _dropoutRateRange: SlRange

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
          value: this._learningRateRadioGroup.value,
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
          <div
            class="hscroll-container ${this.modelConf.model ||
            (!this.editable && !this.settings.mayEditLearningRate)
              ? 'hidden'
              : ``}"
          >
            <sl-radio-group
              id="learningRateRadioGroup"
              value="${this.trainOptions.learningRate}"
              @sl-change="${(_e: SlChangeEvent) =>
                this.handleChangeLearningRate()}"
            >
              ${this.learningRateOptions.map((learningRate) => {
                return html`
                  <sl-radio-button size="small" value="${learningRate}"
                    >${learningRate}</sl-radio-button
                  >
                `
              })}
            </sl-radio-group>
          </div>
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
