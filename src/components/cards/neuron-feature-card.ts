import { widgetMsg } from '@webwriter/lit/localize'
import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '../global-styles'

import type { DataSet } from '../../model/data-types'
import { dataSetContext } from '../contexts'
import type { CNeuron } from '../network/neuron'
import { FeatureDesc } from '../../model/data-types'
import { CCard } from '../reusables/c-card'
import { CDataInfo } from '../reusables/c-data-info'

export class NeuronFeatureCard extends LitElementWw {
  private readonly msg = widgetMsg(this);

  static scopedElements = {
    "c-card": CCard,
    "c-data-info": CDataInfo
  }
  
  @property({ attribute: false })
  accessor neuron: CNeuron

  @property({ attribute: false })
  accessor featureDesc: FeatureDesc

  @consume({ context: dataSetContext, subscribe: true })
  accessor dataSet: DataSet

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">${this.msg('Assigned feature (input)')}</div>
        <div slot="content">
          <c-data-info
            type="feature"
            .dataDesc=${this.featureDesc}
            .dataSet=${this.dataSet}
          ></c-data-info>
        </div>
      </c-card>
    `
  }
}
