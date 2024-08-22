import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { choose } from 'lit/directives/choose.js'
import { consume } from '@lit/context'

import { globalStyles } from '@/global_styles'

import type { DataSet } from '@/types/data_set'
import { dataSetContext } from '@/contexts/data_set_context'
import type { ModelConf } from '@/types/model_conf'
import { modelConfContext } from '@/contexts/model_conf_context'

export @customElement('training-metrics-card') class TrainingMetricsCard extends LitElementWw {
  @consume({ context: dataSetContext, subscribe: true })
  accessor dataSet: DataSet

  @consume({ context: modelConfContext, subscribe: true })
  accessor modelConf: ModelConf

  @query('#trainMetricsContainer')
  accessor _trainMetricsContainer: HTMLDivElement

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  firstUpdated(): void {
    const event = new CustomEvent<HTMLDivElement>(
      'set-train-metrics-container',
      {
        detail: this._trainMetricsContainer,
        bubbles: true,
        composed: true,
      }
    )
    this.dispatchEvent(event)
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Metrics</div>
        <div slot="content">
          ${choose(
            this.dataSet.type,
            [
              [
                'classification',
                () =>
                  html`<p>Loss: Categorical Crossentropy</p>
                    <p>
                      Accuracy: In what percentage of the tests was the right
                      class predicted?
                    </p> `,
              ],
              ['regression', () => html`<p>Loss: Mean Squared Error</p>`],
            ],
            () => html`<h1>Error</h1>`
          )}
          <div id="trainMetricsContainer"></div>
          <sl-details
            summary="What is the difference between the two lines in a graph?"
          >
            <p>
              For val_..., the metric is calculated on the validation data set
              while for the data without val as a prefix the metric is
              calculated on the training data set. The metrics for the
              validation data set can be seen as more meaningful since this is
              the data the network does not 'know'.
            </p>
          </sl-details>
        </div>
      </c-card>
    `
  }
}
