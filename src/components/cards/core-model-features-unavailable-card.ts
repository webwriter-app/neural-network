import { widgetMsg } from '@webwriter/lit/localize'
import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '../global-styles'

import type { ModelConf } from '../../model/network-types'
import { modelConfContext } from '../contexts'
import { CCard } from '../reusables/c-card'

import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js'
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon.component.js'
import SlTooltip from '@shoelace-style/shoelace/dist/components/tooltip/tooltip.component.js'

import IconLabelCounterclockwise from '@tabler/icons/outline/arrow-back-up.svg'


export class CoreModelFeaturesUnavailableCard extends LitElementWw {
  private readonly msg = widgetMsg(this);
  static scopedElements = {
    'c-card': CCard,
    'sl-tooltip': SlTooltip,
    'sl-icon': SlIcon,
    'sl-button': SlButton,
  }

  @consume({ context: modelConfContext, subscribe: true })
  accessor modelConf: ModelConf

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleDiscardModel(): void {
    this.dispatchEvent(
      new Event('discard-model', {
        bubbles: true,
        composed: true,
      }),
    )
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      ${this.modelConf.model
        ? html` <c-card>
            <div slot="title">${this.msg('Important info')}</div>
            <div slot="content">
              <p>
                ${this.msg(
                  'You decided to train a model with the current configuration. As an effect, all options to edit the configuration have been temporarily removed or disabled to make sure the configuration you see is the same configuration the model uses. If you want to make changes to your configuration, you need to discard the current model first. If you discard your model, you can again perform any changes and train a new model based on the new configuration.',
                )}
              </p>
              <div class="button-group">
                <sl-tooltip
                  content=${this.msg(
                    'Discards the model, which gains you back your editing capabilities',
                  )}
                >
                  <sl-button
                    @click="${(_e: MouseEvent) => this.handleDiscardModel()}"
                  >
                    <sl-icon
                      src=${IconLabelCounterclockwise}
                      label=${this.msg('Discard')}
                    ></sl-icon>
                    ${this.msg('Discard model')}
                  </sl-button>
                </sl-tooltip>
              </div>
            </div>
          </c-card>`
        : html``}
    `
  }
}
