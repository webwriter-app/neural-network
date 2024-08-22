import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '@/global_styles'

import type { DataSet } from '@/types/data_set'
import { dataSetContext } from '@/contexts/data_set_context'
import type { CNeuron } from '@/components/network/neuron'
import { FeatureDesc } from '@/types/feature_desc'

export @customElement('neuron-feature-card') class NeuronFeatureCard extends LitElementWw {
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
        <div slot="title">Assigned feature (input)</div>
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
