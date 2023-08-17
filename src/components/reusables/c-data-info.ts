import { LitElement } from 'lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { DataSet } from '@/data_set/data_set'

import { globalStyles } from '@/global_styles'

import { DataSetInput } from '@/types/data_set_input'
import { DataSetLabel } from '@/types/data_set_label'

@customElement('c-data-info')
export class CDataInfo extends LitElement {
  @property()
  type: 'feature' | 'label'

  @property()
  dataProperty: DataSetInput | DataSetLabel

  @property()
  dataSet: DataSet

  static styles: CSSResult[] = globalStyles

  getTooltipContent(): TemplateResult<1> {
    switch (this.type) {
      case 'feature':
        return html` <p>${this.dataProperty.description}</p> `
      case 'label':
        switch (this.dataSet.type) {
          case 'regression':
            return html`
              <p>${this.dataProperty.description}</p>
              <p>Type: regression</p>
            `
          case 'classification':
            return html`
              <p>${this.dataProperty.description}</p>
              <p>Type: classification</p>
              ${'classes' in this.dataProperty
                ? html`
                    ${this.dataProperty.classes.map(
                      (clazz) =>
                        html` <p>${clazz.key}: ${clazz.description}</p> `
                    )}
                  `
                : html``}
            `
          default:
            console.error(`Data set has no type!`)
            return html``
        }
      default:
        console.error(`No or wrong type argument was passed to c-data-info`)
        return html``
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
