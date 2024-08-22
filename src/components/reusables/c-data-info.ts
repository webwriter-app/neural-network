import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import type { DataSet } from '@/types/data_set'
import type { FeatureDesc } from '@/types/feature_desc'
import type { LabelDesc } from '@/types/label_desc'

export @customElement('c-data-info') class CDataInfo extends LitElementWw {
  @property()
  accessor type: 'feature' | 'label'

  @property()
  accessor dataDesc: FeatureDesc | LabelDesc

  @property()
  accessor dataSet: DataSet

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  getTooltipContent(): TemplateResult<1> {
    switch (this.type) {
      case 'feature':
        return html` <p>${this.dataDesc.description}</p> `
      case 'label':
        switch (this.dataSet.type) {
          case 'regression':
            return html`
              <p>${this.dataDesc.description}</p>
              <p>Type: regression</p>
            `
          case 'classification':
            return html`
              <p>${this.dataDesc.description}</p>
              <p>Type: classification</p>
              ${'classes' in this.dataDesc
                ? html`
                    ${this.dataDesc.classes.map(
                      (clazz) =>
                        html`
                          <p>${clazz.id.toString()}: ${clazz.description}</p>
                        `
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
        <sl-tag pill> ${this.dataDesc.key} </sl-tag>
      </sl-tooltip>
    `
  }
}
