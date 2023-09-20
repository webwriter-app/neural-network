import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import type { DataSet } from '@/types/data_set'
import { dataSetContext } from '@/contexts/data_set_context'
import type { CNeuron } from '@/components/network/neuron'
import { LabelDesc } from '@/types/label_desc'

@customElement('neuron-label-card')
export class NeuronLabelCard extends LitElementWw {
  @property({ attribute: false })
  neuron: CNeuron

  @property({ attribute: false })
  labelDesc: LabelDesc

  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

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
