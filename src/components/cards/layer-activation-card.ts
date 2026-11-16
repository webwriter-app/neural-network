import { widgetMsg } from '@webwriter/lit/localize'
import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '../global-styles'

import { editableContext } from '../contexts'
import type { Settings } from '../../model/app-types'
import { settingsContext } from '../contexts'
import type { CLayer } from '../network/c-layer'
import type { Activation } from '../../model/network-types'
import { NetworkUtils } from '../network/network-utils'
import type { ModelConf } from '../../model/network-types'
import { modelConfContext } from '../contexts'

import { CCard } from '../reusables/c-card'
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select.component.js'
import SlOption from '@shoelace-style/shoelace/dist/components/option/option.component.js'

export class LayerActivationCard extends LitElementWw {
  private readonly msg = widgetMsg(this);
  static scopedElements = {
    'c-card': CCard,
    'sl-select': SlSelect,
    'sl-option': SlOption,
  }

  @consume({ context: editableContext, subscribe: true })
  accessor editable: boolean = false

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
    const activation: Activation = NetworkUtils.getActivation(activationName as string)!
    this.layer.setActivation(activation)
    this.dispatchEvent(
      new Event('update-layer-confs', {
        bubbles: true,
        composed: true,
      }),
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
    const translate = this.msg as (text: string) => string
    const activation = NetworkUtils.getActivation(
      this.layer.conf.activation.name,
    )
    return html`
      <c-card>
        <div slot="title">${this.msg('Activation function')}</div>
        <div slot="content">
          <sl-select
            value=${this.layer.conf.activation.name}
            ?disabled=${this.modelConf.model ||
            (!this.editable && !this.settings.mayChangeActivationFunction)}
            help-text=${this.msg(
              'The selected activation applies to all neurons in this layer.',
            )}
            @sl-change=${(_e: Event) => {
              this.handleChangeActivation()
            }}
          >
            ${NetworkUtils.activationOptions.map(
              (activation) =>
                html`<sl-option value="${activation.name}"
                  >${translate(activation.name)}</sl-option
                >`,
            )}
          </sl-select>
          ${activation?.img
            ? html`<img src=${activation.img} alt=${translate(activation.name)} />`
            : html``}
          <p>
            ${this.msg(
              "After calculating a neuron's value by adding up its weighted input values and its bias:",
            )}${' '}${translate(this.layer.conf.activation.description)}
          </p>
          <p>
            ${this.msg('Range of possible output values:')}${' '}${this.layer.conf
              .activation.range}
          </p>
        </div>
      </c-card>
    `
  }
}
