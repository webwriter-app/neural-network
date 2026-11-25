import { widgetMsg } from '@webwriter/lit/localize'
import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { query } from 'lit/decorators.js'
import { choose } from 'lit/directives/choose.js'
import { consume } from '@lit/context'

import { globalStyles } from '../global-styles'

import type { DataSet } from '../../model/data-types'
import { dataSetContext } from '../contexts'
import type { ModelConf } from '../../model/network-types'
import { modelConfContext } from '../contexts'
import { CCard } from '../reusables/c-card'

import SlDetails from '@shoelace-style/shoelace/dist/components/details/details.component.js'

export class TrainingMetricsCard extends LitElementWw {
  private readonly msg = widgetMsg(this);
  static scopedElements = {
    'c-card': CCard,
    'sl-details': SlDetails,
  }

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
      },
    )
    this.dispatchEvent(event)
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">${this.msg('Metrics')}</div>
        <div slot="content">
          ${choose(
            this.dataSet.type,
            [
              [
                'classification',
                () =>
                  html`<p>${this.msg('Loss: Categorical Crossentropy')}</p>
                    <p>
                      ${this.msg(
                        'Accuracy: In what percentage of the tests was the right class predicted?',
                      )}
                    </p> `,
              ],
              [
                'regression',
                () => html`<p>${this.msg('Loss: Mean Squared Error')}</p>`,
              ],
            ],
            () => html`<h1>${this.msg('Error')}</h1>`,
          )}
          <div id="trainMetricsContainer"></div>
          <sl-details
            summary=${this.msg(
              'What is the difference between the two lines in a graph?',
            )}
          >
            <p>
              ${this.msg(
                "For val_..., the metric is calculated on the validation data set while for the data without val as a prefix the metric is calculated on the training data set. The metrics for the validation data set can be seen as more meaningful since this is the data the network does not 'know'.",
              )}
            </p>
          </sl-details>
        </div>
      </c-card>
    `
  }
}
