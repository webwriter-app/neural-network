import { widgetMsg } from '@webwriter/lit/localize'
import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '../global-styles'

import type { DataSet } from '../../model/data-types'
import { dataSetContext } from '../contexts'
import type { CNeuron } from '../network/neuron'
import { CCard } from '../reusables/c-card'
import { CNetworkLink } from '../reusables/c-network-link'

export class NeuronInfoCard extends LitElementWw {
  private readonly msg = widgetMsg(this);
  static scopedElements = {
    'c-card': CCard,
    'c-network-link': CNetworkLink,
  }

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
        <div slot="title">${this.msg('Neuron')}</div>
        <div slot="content">
          <p>
            Name:
            <c-network-link .target=${this.neuron}
              >${this.neuron.getName()}</c-network-link
            >
          </p>
          <p>
            ${this.msg('Corresponding layer:')}
            <c-network-link .target=${this.neuron.layer}
              >${this.neuron.layer.getName()}</c-network-link
            >
          </p>
        </div>
      </c-card>
    `
  }
}
