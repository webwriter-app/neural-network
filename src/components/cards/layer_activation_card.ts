import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

import { SlSelect, SlChangeEvent } from '@shoelace-style/shoelace'

import { globalStyles } from '@/global_styles'

import { CLayer } from '@/components/network/c_layer'
import {
  ActivationOption,
  activationOptions,
} from '@/components/network/activation'

@customElement('layer-activation-card')
export class LayerActivationCard extends LitElementWw {
  @property()
  layer: CLayer

  @query('sl-select')
  _selectActivationFormElm: SlSelect

  _handleChangeActivation(): void {
    this.layer.setActivation(
      <ActivationOption>this._selectActivationFormElm.value
    )
  }

  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Activation function</div>
        <div slot="content">
          <sl-select
            .value="${this.layer.activation}"
            help-text="The selected activation will be applied to all neurons in this layer."
            @sl-change="${(_e: SlChangeEvent) => {
              this._handleChangeActivation()
            }}"
          >
            ${activationOptions.map(
              (option) =>
                html`<sl-option .value="${option}">${option}</sl-option>`
            )}
          </sl-select>
        </div>
      </c-card>
    `
  }
}
