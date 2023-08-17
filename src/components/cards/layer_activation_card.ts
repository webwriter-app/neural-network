import { LitElement } from 'lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'
import { SlSelect, SlChangeEvent } from '@shoelace-style/shoelace'

import { globalStyles } from '@/global_styles'

import { editableContext } from '@/contexts/editable_context'
import { settingsContext, Settings } from '@/contexts/settings_context'
import { ModelConf, modelConfContext } from '@/contexts/model_conf_context'

import { CLayer } from '@/network/c_layer'
import { Activation, activationOptions } from '@/network/activation'

@customElement('layer-activation-card')
export class LayerActivationCard extends LitElement {
  @consume({ context: editableContext, subscribe: true })
  editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  settings: Settings

  @consume({ context: modelConfContext, subscribe: true })
  modelConf: ModelConf

  @property({ attribute: false })
  layer: CLayer

  @query('sl-select')
  _selectActivationFormElm: SlSelect

  handleChangeActivation(): void {
    const activationName = this._selectActivationFormElm.value
    const activation: Activation = activationOptions.find(
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

  static styles: CSSResult[] = globalStyles

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
            ${activationOptions.map(
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
