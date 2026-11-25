import { widgetMsg } from '@webwriter/lit/localize'
import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, css, html } from 'lit'
import { query } from 'lit/decorators.js'
import { choose } from 'lit/directives/choose.js'
import { consume } from '@lit/context'

import { globalStyles } from '../global-styles'

import type { CNetwork } from '../network/network'
import { networkContext } from '../contexts'

import type { DataSet } from '../../model/data-types'
import type { FeatureDesc } from '../../model/data-types'
import { dataSetContext } from '../contexts'
import { DataSetUtils } from '../data-sets/data-set-utils'
import type { ModelConf } from '../../model/network-types'
import { modelConfContext } from '../contexts'
import { ModelUtils } from '../../model/model-utils'

import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js'
import { CCard } from '../reusables/c-card'
import { CDataInfo } from '../reusables/c-data-info'

import SlInput from '@shoelace-style/shoelace/dist/components/input/input.component.js'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon.component.js'
import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js'
import IconSend from '@tabler/icons/outline/send.svg'

export class PredictCard extends LitElementWw {
  private readonly msg = widgetMsg(this);
  static scopedElements = {
    'c-card': CCard,
    'c-data-info': CDataInfo,
    'sl-input': SlInput,
    'sl-button': SlButton,
    'sl-icon': SlIcon,
  }

  @consume({ context: networkContext, subscribe: true })
  accessor network: CNetwork

  @consume({ context: dataSetContext, subscribe: true })
  accessor dataSet: DataSet

  @consume({ context: modelConfContext, subscribe: true })
  accessor modelConf: ModelConf

  @query('#predictForm')
  accessor _predictForm: HTMLFormElement

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handlePredict(e: SubmitEvent): void {
    e.preventDefault()
    const formData = <Record<string, string>>serialize(this._predictForm)
    const inputs: Record<string, number> = {}
    Object.keys(formData).forEach((k) => {
      inputs[k] = parseFloat(formData[k])
    })
    this.dispatchEvent(
      new CustomEvent<Record<string, number>>('predict-model', {
        detail: inputs,
        bubbles: true,
        composed: true,
      }),
    )
  }

  prepareNewPrediction(): void {
    this._predictForm.reset()
    this.dispatchEvent(
      new Event('delete-prediction', {
        bubbles: true,
        composed: true,
      }),
    )
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [
    globalStyles,
    css`
      :host {
        position: relative;
        width: 100%;
      }

      .inputs-grid {
        width: 100%;
        display: grid;
        gap: 10px;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
        overflow: hidden;
      }
    `,
  ]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    const requiredFeatureDescs: Set<FeatureDesc> = new Set()
    for (const inputLayer of this.network.getInputLayers()) {
      for (const dataSetInput of DataSetUtils.getFeatureDescsByKeys(
        this.dataSet,
        inputLayer.conf.featureKeys,
      )) {
        requiredFeatureDescs.add(dataSetInput)
      }
    }

    return html`
      <c-card>
        <div slot="title">${this.msg('Predict')}</div>
        <form slot="content" id="predictForm" @submit=${this.handlePredict}>
          <h2>Inputs</h2>
          <div class="inputs-grid">
            ${Array.from(requiredFeatureDescs).map(
              (featureDesc) => html`
                <div>
                  <c-data-info
                    type="feature"
                    .dataDesc="${featureDesc}"
                    .dataSet="${this.dataSet}"
                  ></c-data-info>
                  <sl-input
                    name="${featureDesc['key']}"
                    ?disabled="${this.modelConf.predictedValue}"
                    type="number"
                    required
                  ></sl-input>
                </div>
              `,
            )}
          </div>
          ${this.modelConf.predictedValue
            ? html`<h2>${this.msg('Predicted label')}</h2>
                <span>
                  <c-data-info
                    type="label"
                    .dataDesc="${this.dataSet.labelDesc}"
                    .dataSet="${this.dataSet}"
                  ></c-data-info>
                  ${choose(
                    this.dataSet.type,
                    [
                      [
                        'classification',
                        () => {
                          const index = (<number[]>(
                            this.modelConf.predictedValue
                          )).indexOf(
                            Math.max(
                              ...(<number[]>this.modelConf.predictedValue),
                            ),
                          )
                          return html`${this.dataSet.labelDesc.classes![
                            index
                          ].id?.toString()}
                          ${this.msg('with a probability of')}
                          ${ModelUtils.formatWeight(
                            (<number[]>this.modelConf.predictedValue)[index],
                          )} `
                        },
                      ],
                      [
                        'regression',
                        () =>
                          html`${ModelUtils.formatWeight(
                            <number>this.modelConf.predictedValue,
                          )}`,
                      ],
                    ],
                    () => html`<h1>${this.msg('Error')}</h1>`,
                  )}
                </span>
                <sl-button
                  @click="${(_e: MouseEvent) => this.prepareNewPrediction()}"
                >
                  ${this.msg('Make another prediction')}
                </sl-button>`
            : html`<sl-button variant="primary" type="submit">
                ${this.msg('Predict')}
                <sl-icon slot="suffix" src=${IconSend}></sl-icon>
              </sl-button>`}
        </form>
      </c-card>
    `
  }
}
