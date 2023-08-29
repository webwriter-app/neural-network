import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, css, html } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { choose } from 'lit/directives/choose.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import type { Network } from '@/components/network/network'
import { networkContext } from '@/contexts/network_context'

import type { DataSet } from '@/types/data_set'
import type { DataSetInput } from '@/types/data_set_input'
import { dataSetContext } from '@/contexts/data_set_context'
import { DataSetUtils } from '@/utils/data_set_utils'
import type { ModelConf } from '@/types/model_conf'
import { modelConfContext } from '@/contexts/model_conf_context'
import { ModelUtils } from '@/utils/model_utils'

import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js'

@customElement('predict-card')
export class PredictCard extends LitElementWw {
  @consume({ context: networkContext, subscribe: true })
  network: Network

  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  @consume({ context: modelConfContext, subscribe: true })
  modelConf: ModelConf

  @query('#predictForm')
  _predictForm: HTMLFormElement

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async connectedCallback() {
    super.connectedCallback()
    await this.updateComplete
    this._predictForm.addEventListener('submit', (e: SubmitEvent) =>
      this.handlePredict(e)
    )
  }

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
      })
    )
  }

  prepareNewPrediction(): void {
    this._predictForm.reset()
    this.dispatchEvent(
      new Event('delete-prediction', {
        bubbles: true,
        composed: true,
      })
    )
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [
    ...globalStyles,
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
    const requiredInputs: Set<DataSetInput> = new Set()
    for (const inputLayer of this.network.getInputLayers()) {
      for (const dataSetInput of DataSetUtils.getDataSetInputsByKeys(
        this.dataSet,
        inputLayer.conf.dataSetKeys
      )) {
        requiredInputs.add(dataSetInput)
      }
    }

    return html`
      <c-card>
        <div slot="title">Predict</div>
        <form slot="content" id="predictForm">
          <h2>Inputs</h2>
          <div class="inputs-grid">
            ${Array.from(requiredInputs).map(
              (input) => html`
                <div>
                  <c-data-info
                    type="feature"
                    .dataProperty="${input}"
                    .dataSet="${this.dataSet}"
                  ></c-data-info>
                  <sl-input
                    name="${input['key']}"
                    ?disabled="${this.modelConf.predictedValue}"
                    type="number"
                    required
                  ></sl-input>
                </div>
              `
            )}
          </div>
          ${this.modelConf.predictedValue
            ? html`<h2>Predicted label</h2>
                <span>
                  <c-data-info
                    type="label"
                    .dataProperty="${this.dataSet.label}"
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
                              ...(<number[]>this.modelConf.predictedValue)
                            )
                          )
                          return html`${this.dataSet.label.classes[index].key}
                          with a probability of
                          ${ModelUtils.formatWeight(
                            (<number[]>this.modelConf.predictedValue)[index]
                          )} `
                        },
                      ],
                      [
                        'regression',
                        () =>
                          html`${ModelUtils.formatWeight(
                            <number>this.modelConf.predictedValue
                          )}`,
                      ],
                    ],
                    () => html`<h1>Error</h1>`
                  )}
                </span>
                <sl-button
                  @click="${(_e: MouseEvent) => this.prepareNewPrediction()}"
                >
                  Make another prediction
                </sl-button>`
            : html`<sl-button variant="primary" type="submit">
                Predict
                <sl-icon slot="suffix" name="send"></sl-icon>
              </sl-button>`}
        </form>
      </c-card>
    `
  }
}
