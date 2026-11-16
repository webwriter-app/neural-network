import { widgetMsg } from '@webwriter/lit/localize'
import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '../global-styles'

import type { CNeuron } from '../network/neuron'
import { NetworkUtils } from '../network/network-utils'
import { CCard } from '../reusables/c-card'

export class NeuronActivationCard extends LitElementWw {
  private readonly msg = widgetMsg(this);
  static scopedElements = {
    'c-card': CCard,
  }

  @property({ attribute: false })
  accessor neuron: CNeuron

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    const translate = this.msg as (text: string) => string
    const activation = NetworkUtils.getActivation(
      this.neuron.layer.conf.activation.name,
    )
    return html`
      <c-card>
        <div slot="title">${this.msg('Activation function')}</div>
        <div slot="content">
          <p>${this.msg('Activation:')} ${translate(this.neuron.layer.conf.activation.name)}</p>
          ${activation?.img
            ? html`<img src=${activation.img} alt=${translate(activation.name)} />`
            : html``}
          <p>
            ${this.msg(
              "After calculating a neuron's value by adding up its weighted input values and its bias:",
            )}
            ${translate(this.neuron.layer.conf.activation.description)}
          </p>
          <p>
            ${this.msg('Range of possible output values:')}
            ${this.neuron.layer.conf.activation.range}
          </p>
        </div>
      </c-card>
    `
  }
}
