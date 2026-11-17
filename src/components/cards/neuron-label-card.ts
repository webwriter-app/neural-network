import { widgetMsg } from '@webwriter/lit/localize'
import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { property } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '../global-styles'

import type { DataSet } from '../../model/data-types'
import { dataSetContext } from '../contexts'
import type { CNeuron } from '../network/neuron'
import { LabelDesc } from '../../model/data-types'
import { CCard } from '../reusables/c-card'
import { CDataInfo } from '../reusables/c-data-info'

export class NeuronLabelCard extends LitElementWw {
  private readonly msg = widgetMsg(this);

  static scopedElements = {
    "c-card": CCard,
    "c-card-info": CDataInfo
  }
  
  @property({ attribute: false })
  accessor neuron: CNeuron

  @property({ attribute: false })
  accessor labelDesc: LabelDesc

  @consume({ context: dataSetContext, subscribe: true })
  accessor dataSet: DataSet

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">${this.msg('Label (output)')}</div>
        <div slot="content">
          <c-data-info
            type="label"
            .dataDesc=${this.labelDesc}
            .dataSet=${this.dataSet}
          ></c-data-info>
        </div>
      </c-card>
    `
  }
}
