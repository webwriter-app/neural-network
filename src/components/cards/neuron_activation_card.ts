import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import type { CNeuron } from '@/components/network/neuron'
import { CCard } from '../reusables/c-card'
import { msg } from '@lit/localize'

export class NeuronActivationCard extends LitElementWw {
  static scopedElements = {
    'c-card': CCard,
  }

  @property({ attribute: false })
  accessor neuron: CNeuron

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">${msg('Activation function')}</div>
        <div slot="content">
          <p>Activation: ${this.neuron.layer.conf.activation.name}</p>
          ${Object.hasOwn(this.neuron.layer.conf.activation, 'img')
            ? html`<img src=${this.neuron.layer.conf.activation.img} />`
            : html``}
          <p>
            ${msg(
              "After calculating a neuron's value by adding up its weighted input values and its bias:",
            )}
            ${this.neuron.layer.conf.activation.description}
          </p>
          <p>
            ${msg('Range of possible output values:')}
            ${this.neuron.layer.conf.activation.range}
          </p>
        </div>
      </c-card>
    `
  }
}
