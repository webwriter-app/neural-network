import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { DataSetInput } from '@/types/data_set_input'
import { DataSetLabel } from '@/types/data_set_label'
import {
  DataSetClassificationLabel,
  isClassificationLabel,
} from '@/types/data_set_classification_label'
import { isRegressionLabel } from '@/types/data_set_regression_label'

@customElement('c-data-info')
export class CDataInfo extends LitElementWw {
  @property({ type: Object }) dataProperty: DataSetInput | DataSetLabel

  static styles: CSSResult[] = [globalStyles]

  getTooltipContent(): TemplateResult<1> {
    if (!this.dataProperty['type']) {
      return html` <p>${this.dataProperty.description}</p> `
    } else {
      if (isRegressionLabel(<DataSetLabel>this.dataProperty)) {
        return html`
          <p>Type: regression</p>
          <p>${this.dataProperty.description}</p>
        `
      } else if (isClassificationLabel(<DataSetLabel>this.dataProperty)) {
        return html`
          <p>Type: classification</p>
          <p>${this.dataProperty.description}</p>
          ${(<DataSetClassificationLabel>this.dataProperty).classes.map(
            (clazz) => html` <p>${clazz.key}: ${clazz.description}</p> `
          )}
        `
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
