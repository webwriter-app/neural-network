import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { consume } from '@lit-labs/context'
import { dataSetContext } from '@/contexts/data_set_context'
import { DataSet } from '@/data_set/data_set'

import { globalStyles } from '@/global_styles'

import { DataSetInput } from '@/types/data_set_input'
import { DataSetLabel } from '@/types/data_set_label'

@customElement('c-data-info')
export class CDataInfo extends LitElementWw {
  @property({ type: String })
  type: 'feature' | 'label'

  @property({ type: Object })
  dataProperty: DataSetInput | DataSetLabel

  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  static styles: CSSResult[] = [globalStyles]

  getTooltipContent(): TemplateResult<1> {
    if (!this.dataProperty['type']) {
      return html` <p>${this.dataProperty.description}</p> `
    } else {
      switch (this.dataSet.type) {
        case 'regression':
          return html`
            <p>Type: regression</p>
            <p>${this.dataProperty.description}</p>
          `
        case 'classification':
          return html`
            <p>Type: classification</p>
            <p>${this.dataProperty.description}</p>
            ${'classes' in this.dataProperty
              ? html`
                  ${this.dataProperty.classes.map(
                    (clazz) => html` <p>${clazz.key}: ${clazz.description}</p> `
                  )}
                `
              : html``}
          `
        default:
          console.error(`Data set has no type!`)
          return html``
      }
    }
  }

  render(): TemplateResult<1> {
    return html`
      <sl-tooltip>
        <div slot="content">${this.getTooltipContent()}</div>
        <sl-tag pill> ${this.dataProperty.key} </sl-tag>
      </sl-tooltip>
    `
  }
}
