import { widgetMsg } from '@webwriter/lit/localize'
import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '../global-styles'

import type { DataSet } from '../../model/data-types'
import { dataSetContext } from '../contexts'
import type { TrainOptions } from '../../model/network-types'
import { trainOptionsContext } from '../contexts'
import type { ModelConf } from '../../model/network-types'
import { modelConfContext } from '../contexts'

import { CCard } from '../reusables/c-card'

import SlProgressBar from '@shoelace-style/shoelace/dist/components/progress-bar/progress-bar.component.js'
import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js'
import SlRange from '@shoelace-style/shoelace/dist/components/range/range.component.js'
import IconPlay from '@tabler/icons/outline/player-play.svg'

export class TrainingTrainCard extends LitElementWw {
  private readonly msg = widgetMsg(this);
  static scopedElements = {
    'c-card': CCard,
    'sl-progress-bar': SlProgressBar,
    'sl-button': SlButton,
    'sl-range': SlRange,
  }

  @consume({ context: modelConfContext, subscribe: true })
  accessor modelConf: ModelConf

  @consume({ context: trainOptionsContext, subscribe: true })
  accessor trainOptions: TrainOptions

  @consume({ context: dataSetContext, subscribe: true })
  accessor dataSet: DataSet

  @query('#numberOfEpochsRange')
  accessor _numberOfEpochsRange: SlRange

  @state()
  accessor numberOfEpochs: number = 3

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleChangeNumberOfEpochs(): void {
    this.numberOfEpochs = this._numberOfEpochsRange.value
  }

  handleTrain(epochs: number): void {
    this.dispatchEvent(
      new CustomEvent('train-model', {
        detail: epochs,
        bubbles: true,
        composed: true,
      }),
    )
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">${this.msg('Train')}</div>
        <div slot="content">
          ${!this.modelConf.isTraining
            ? html`
                ${this.modelConf.model
                  ? html`
                      <sl-progress-bar value="100"></sl-progress-bar>
                      <p>✅ ${this.msg('Training completed!')}</p>
                      <p>
                        ${this.msg(
                          'Feel free to continue training your model for some additional epochs which might get you even better results!',
                        )}
                      </p>
                    `
                  : html``}
                <sl-range
                  id="numberOfEpochsRange"
                  label="${this.msg('Epochs')}: ${this.numberOfEpochs}"
                  help-text=${this.msg('Number of iterations over the whole training data set')}
                  min="1"
                  max="10"
                  step="1"
                  value="${this.numberOfEpochs}"
                  @sl-change="${(_e: Event) =>
                    this.handleChangeNumberOfEpochs()}"
                ></sl-range>
                <sl-button
                  variant="primary"
                  size="large"
                  @click="${(_e: MouseEvent) =>
                    this.handleTrain(this.numberOfEpochs)}"
                >
                  <sl-icon src=${IconPlay} label=${this.msg('Run')}></sl-icon>
                  ${this.numberOfEpochs == 1
                    ? html`${this.msg('Train for 1 epoch')}`
                    : html`${this.msg('Train for')} ${this.numberOfEpochs} ${this.msg('epochs')}`}
                </sl-button>
              `
            : html``}
          ${this.modelConf.isTraining
            ? html`
                <sl-progress-bar
                  value="${(this.modelConf.actEpoch /
                    this.modelConf.totalEpochs) *
                  100}"
                ></sl-progress-bar>
                <p>
                  ${this.msg('Epoch')} ${this.modelConf.actEpoch} • ${this.msg('Batch')}
                  ${this.modelConf.actBatch}/${Math.ceil(
                    this.dataSet.data.length /
                      parseInt(this.trainOptions.batchSize),
                  )}
                </p>
              `
            : html``}
        </div>
      </c-card>
    `
  }
}
