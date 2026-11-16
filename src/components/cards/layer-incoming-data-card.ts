import { DataSetUtils } from '../data-sets/data-set-utils'
import { widgetMsg } from '@webwriter/lit/localize'
import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { consume } from '@lit/context'

import type { DataSet } from '../../model/data-types'
import { dataSetContext } from '../contexts'
import type { InputLayer } from '../network/input-layer'

import SlSelect from "@shoelace-style/shoelace/dist/components/select/select.component.js"
import { CCard } from '../reusables/c-card'

export class LayerIncomingDataCard extends LitElementWw {
  private readonly msg = widgetMsg(this);
  
  static scopedElements = {
    "c-card": CCard,
    "sl-select": SlSelect
  }
  
  @property()
  accessor layer: InputLayer

  @consume({ context: dataSetContext, subscribe: true })
  accessor dataSet: DataSet

  @query('#featuresSelect')
  accessor _featuresSelect: SlSelect

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleChangeFeatures(): void {
    const featureKeys: string[] = <string[]>this._featuresSelect.value
    this.layer.conf.featureKeys = featureKeys
    this.dispatchEvent(
      new Event('update-layer-confs', {
        bubbles: true,
        composed: true,
      })
    )
  }

  getFeatureOptions(): TemplateResult<1>[] {
    return this.dataSet.featureDescs.map(
      (featureDesc) => html`
        <sl-option value="${featureDesc.key}">
          <sl-tooltip content="${DataSetUtils.localizeText(this.dataSet, featureDesc.description, this.msg)}"
            >${featureDesc.key}</sl-tooltip
          >
        </sl-option>
      `
    )
  }

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">${this.msg('Features')}</div>
        <div slot="content">
          <sl-select
            id="featuresSelect"
            value=${this.layer.conf.featureKeys.join(' ')}
            multiple
            max-options-visible="100"
            help-text=${this.msg('Assign feature to this layer. Hover over the feature keys in the opened dropdown menu for a description.')}
            @sl-change="${(_e: Event) => {
              this.handleChangeFeatures()
            }}"
          >
            ${this.getFeatureOptions()}
          </sl-select>
        </div>
      </c-card>
    `
  }
}
