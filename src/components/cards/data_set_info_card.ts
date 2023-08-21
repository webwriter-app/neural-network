import { LitElement } from 'lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { DataSet, getData } from '@/data_set/data_set'
import { DataSetInput } from '@/types/data_set_input'
import { dataSetContext } from '@/contexts/data_set_context'

@customElement('data-set-info-card')
export class DataSetInfoCard extends LitElement {
  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  getData = getData

  _handleSelectDataProperty(input: DataSetInput): void {
    this.dispatchEvent(
      new CustomEvent<string>('clicked-data-property', {
        detail: input.key,
      })
    )
  }

  static styles: CSSResult[] = [
    ...globalStyles,
    css`
      .clickable:hover {
        cursor: pointer;
      }
    `,
  ]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">${this.dataSet.name}</div>
        <div slot="content">
          <div>
            <p>${this.dataSet.description}</p>
            <h2>Inputs</h2>
            <div class="tag-group">
              ${this.dataSet.inputs.map(
                (input) => html`
                  <c-data-info
                    type="feature"
                    .dataProperty="${input}"
                    .dataSet="${this.dataSet}"
                    class="clickable"
                    @click="${(_e: MouseEvent) =>
                      this._handleSelectDataProperty(input)}"
                  ></c-data-info>
                `
              )}
            </div>
            <h2>Output</h2>
            <div class="data-pills">
              <c-data-info
                type="label"
                .dataProperty="${this.dataSet.label}"
                .dataSet="${this.dataSet}"
              ></c-data-info>
            </div>
          </div>
          <sl-details summary="View raw data">
            <div style="max-height: 200px; overflow-y: auto;">
              ${this.getData().map(
                (dataItem) =>
                  html`<p>
                    ${dataItem.inputs.map((input) => html`${input} `)} →
                    ${dataItem.label}
                  </p>`
              )}
            </div>
          </sl-details>
        </div>
      </c-card>
    `
  }
}
