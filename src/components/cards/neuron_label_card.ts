import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '@/global_styles'

import type { DataSet } from '@/types/data_set'
import { dataSetContext } from '@/contexts/data_set_context'
import type { CNeuron } from '@/components/network/neuron'
import { LabelDesc } from '@/types/label_desc'
import { CCard } from '../reusables/c-card'
import { CDataInfo } from '../reusables/c-data-info'

export class NeuronLabelCard extends LitElementWw {

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
        <div slot="title">Label (output)</div>
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
