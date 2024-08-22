import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '@/global_styles'

import { editableContext } from '@/contexts/editable_context'
import type { Settings } from '@/types/settings'
import { settingsContext } from '@/contexts/settings_context'
import type { CLayer } from '@/components/network/c_layer'
import type { Activation } from '@/types/activation'
import { NetworkUtils } from '@/utils/network_utils'
import type { ModelConf } from '@/types/model_conf'
import { modelConfContext } from '@/contexts/model_conf_context'

import type { SlSelect, SlChangeEvent } from '@shoelace-style/shoelace'

export @customElement('layer-activation-card') class LayerActivationCard extends LitElementWw {
  @consume({ context: editableContext, subscribe: true })
  accessor editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  accessor settings: Settings

  @consume({ context: modelConfContext, subscribe: true })
  accessor modelConf: ModelConf

  @property({ attribute: false })
  accessor layer: CLayer

  @query('sl-select')
  accessor _selectActivationFormElm: SlSelect

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleChangeActivation(): void {
    const activationName = this._selectActivationFormElm.value
    const activation: Activation = NetworkUtils.activationOptions.find(
      (activation) => activation.name == activationName
    )
    this.layer.setActivation(activation)
    this.dispatchEvent(
      new Event('update-layer-confs', {
        bubbles: true,
        composed: true,
      })
    )
    // we need to request an update, so that when we select another layer with
    // the same activation function as this layers activation function before
    // the update/rerender, lit can detect the changes and rerender
    this.requestUpdate()
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Activation function</div>
        <div slot="content">
          <sl-select
            value=${this.layer.conf.activation.name}
            ?disabled=${this.modelConf.model ||
            (!this.editable && !this.settings.mayChangeActivationFunction)}
            help-text="The selected activation applies to all neurons in this layer."
            @sl-change=${(_e: SlChangeEvent) => {
              this.handleChangeActivation()
            }}
          >
            ${NetworkUtils.activationOptions.map(
              (activation) =>
                html`<sl-option value="${activation.name}"
                  >${activation.name}</sl-option
                >`
            )}
          </sl-select>
          ${Object.hasOwn(this.layer.conf.activation, 'img')
            ? html`<img src=${this.layer.conf.activation.img} />`
            : html``}
          <p>
            After calculating a neuron's value by adding up its weighted input
            values and its bias: ${this.layer.conf.activation.description}
          </p>
          <p>
            Range of possible output values: ${this.layer.conf.activation.range}
          </p>
        </div>
      </c-card>
    `
  }
}
