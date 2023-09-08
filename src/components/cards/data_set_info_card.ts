import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import type { DataSet } from '@/types/data_set'
import type { FeatureDesc } from '@/types/feature_desc'
import { dataSetContext } from '@/contexts/data_set_context'
import { DataSetUtils } from '@/utils/data_set_utils'

@customElement('data-set-info-card')
export class DataSetInfoCard extends LitElementWw {
  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleSelectDataDesc(featureDesc: FeatureDesc): void {
    this.dispatchEvent(
      new CustomEvent<string>('select-data-desc', {
        detail: featureDesc.key,
      })
    )
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [
    globalStyles,
    css`
      .clickable:hover {
        cursor: pointer;
      }
    `,
  ]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">${this.dataSet.name}</div>
        <div slot="content">
          <p>${this.dataSet.description}</p>
          <h2>Features</h2>
          <div class="tag-group">
            ${this.dataSet.featureDescs.map(
              (featureDesc) => html`
                <c-data-info
                  type="feature"
                  .dataDesc="${featureDesc}"
                  .dataSet="${this.dataSet}"
                  class="clickable"
                  @click="${(_e: MouseEvent) =>
                    this.handleSelectDataDesc(featureDesc)}"
                ></c-data-info>
              `
            )}
          </div>
          <h2>Label</h2>
          <div class="data-pills">
            <c-data-info
              type="label"
              .dataDesc="${this.dataSet.labelDesc}"
              .dataSet="${this.dataSet}"
            ></c-data-info>
          </div>
          <sl-details summary="View raw data">
            <div style="max-height: 200px; overflow-y: auto;">
              ${DataSetUtils.getData(this.dataSet).map(
                (dataItem) =>
                  html`<p>
                    ${dataItem.features.map((feature) => html`${feature} `)} →
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
