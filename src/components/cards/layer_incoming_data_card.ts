import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import type { DataSet } from '@/types/data_set'
import { dataSetContext } from '@/contexts/data_set_context'
import type { InputLayer } from '@/components/network/input_layer'

import type { SlChangeEvent, SlSelect } from '@shoelace-style/shoelace'

@customElement('layer-incoming-data-card')
export class LayerIncomingDataCard extends LitElementWw {
  @property()
  layer: InputLayer

  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  @query('#featuresSelect')
  _featuresSelect: SlSelect

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
          <sl-tooltip content="${featureDesc.description}"
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
        <div slot="title">Features</div>
        <div slot="content">
          <sl-select
            id="featuresSelect"
            value=${this.layer.conf.featureKeys.join(' ')}
            multiple
            max-options-visible="100"
            help-text="Assign feature to this layer. Hover over the feature keys in the opened dropdown menu for a description."
            @sl-change="${(_e: SlChangeEvent) => {
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
