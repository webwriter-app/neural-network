import { widgetMsg } from '@webwriter/lit/localize'
import { DataSetUtils } from '../data-sets/data-set-utils'
import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { property } from 'lit/decorators.js'

import { globalStyles } from '../global-styles'

import type { DataSet } from '../../model/data-types'
import type { FeatureDesc } from '../../model/data-types'
import type { LabelDesc } from '../../model/data-types'

import SlTooltip from "@shoelace-style/shoelace/dist/components/tooltip/tooltip.component.js"
import SlTag from "@shoelace-style/shoelace/dist/components/tag/tag.component.js"

export class CDataInfo extends LitElementWw {
  private readonly msg = widgetMsg(this);
  
  static scopedElements = {
    "sl-tooltip": SlTooltip,
    "sl-tag": SlTag
  }

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
        return html` <p>${DataSetUtils.localizeText(this.dataSet, this.dataDesc.description, this.msg)}</p> `
      case 'label':
        switch (this.dataSet.type) {
          case 'regression':
            return html`
              <p>${DataSetUtils.localizeText(this.dataSet, this.dataDesc.description, this.msg)}</p>
              <p>${this.msg('Type: regression')}</p>
            `
          case 'classification':
            return html`
              <p>${DataSetUtils.localizeText(this.dataSet, this.dataDesc.description, this.msg)}</p>
              <p>${this.msg('Type: classification')}</p>
              ${'classes' in this.dataDesc
                ? html`
                    ${this.dataDesc.classes?.map(
                      (clazz) =>
                        html`
                          <p>${clazz.id?.toString()}: ${DataSetUtils.localizeText(this.dataSet, clazz.description, this.msg)}</p>
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
