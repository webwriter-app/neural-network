import { effectiveLanguage, localizeElement, nativeLanguageAttributes } from "../../../localization/localizer";
import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import type { CNeuron } from '@/components/network/neuron'
import { NetworkUtils } from '@/utils/network_utils'
import { CCard } from '../reusables/c-card'

export class NeuronActivationCard extends LitElementWw {
  static override get observedAttributes() { return nativeLanguageAttributes(this, super.observedAttributes); }

  override get lang(): string { return effectiveLanguage(this); }
  override set lang(value: string) { this.setAttribute("lang", value); }
  private readonly msg = localizeElement(this);
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
      this.neuron.layer.conf.activation.name as any,
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
