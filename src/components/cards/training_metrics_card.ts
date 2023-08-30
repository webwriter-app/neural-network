import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { choose } from 'lit/directives/choose.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import type { DataSet } from '@/types/data_set'
import { dataSetContext } from '@/contexts/data_set_context'
import type { ModelConf } from '@/types/model_conf'
import { modelConfContext } from '@/contexts/model_conf_context'

@customElement('training-metrics-card')
export class TrainingMetricsCard extends LitElementWw {
  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  @consume({ context: modelConfContext, subscribe: true })
  modelConf: ModelConf

  @query('#trainMetricsContainer')
  _trainMetricsContainer: HTMLDivElement

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
        </div>
      </c-card>
    `
  }
}
