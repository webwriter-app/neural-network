import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '@/global_styles'

import type { DataSet } from '@/types/data_set'
import { dataSetContext } from '@/contexts/data_set_context'
import type { CNeuron } from '@/components/network/neuron'

export @customElement('neuron-info-card') class NeuronInfoCard extends LitElementWw {
  @property({ attribute: false })
  accessor neuron: CNeuron

  @consume({ context: dataSetContext, subscribe: true })
  accessor dataSet: DataSet

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Neuron</div>
        <div slot="content">
          <p>
            Name:
            <c-network-link .target=${this.neuron}
              >${this.neuron.getName()}</c-network-link
            >
          </p>
          <p>
            Corresponding layer:
            <c-network-link .target=${this.neuron.layer}
              >${this.neuron.layer.getName()}</c-network-link
            >
          </p>
        </div>
      </c-card>
    `
  }
}
