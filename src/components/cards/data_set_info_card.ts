import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'
import { DataSet } from '@/data_set/data_set'
import { DataSetInput } from '@/types/data_set_input'

@customElement('data-set-info-card')
export class DataSetInfoCard extends LitElementWw {
  @property()
  dataSet: DataSet

  _handleSelectDataProperty(input: DataSetInput): void {
    this.dispatchEvent(
      new CustomEvent<string>('clicked-data-property', {
        detail: input.key,
      })
    )
  }

  static styles: CSSResult[] = [
    globalStyles,
    css`
      .data-pills {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 5px;
      }

      .clickable:hover {
        cursor: pointer;
      }
    `,
  ]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Info</div>
        <div slot="content">
          <div>
            <p>${this.dataSet.description}</p>
            <h2>Inputs</h2>
            <div class="data-pills">
              ${this.dataSet.inputs.map(
                (input) => html`
                  <c-data-info
                    .dataProperty="${input}"
                    class="clickable"
                    @click="${(_e: MouseEvent) =>
                      this._handleSelectDataProperty(input)}"
                  ></c-data-info>
                `
              )}
            </div>
            <h2>Output</h2>
            <div class="data-pills">
              <c-data-info .dataProperty="${this.dataSet.label}"></c-data-info>
            </div>
          </div>
        </div>
      </c-card>
    `
  }
}
