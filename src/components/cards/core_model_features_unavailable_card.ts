import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { ModelConf, modelConfContext } from '@/contexts/model_conf_context'

@customElement('core-model-features-unavailable-card')
export class CoreModelFeaturesUnavailableCard extends LitElementWw {
  @consume({ context: modelConfContext, subscribe: true })
  modelConf: ModelConf

  _handleDiscardModel(): void {
    this.dispatchEvent(
      new Event('discard-model', {
        bubbles: true,
        composed: true,
      })
    )
  }

  static styles: CSSResult[] = globalStyles

  render(): TemplateResult<1> {
    return html`
      ${this.modelConf.model
        ? html` <c-card>
            <div slot="title">Important info</div>
            <div slot="content">
              <p>
                You decided to train a model with the current configuration. As
                an effect, all options to edit the configuration have been
                temporarily removed or disabled to make sure the configuration
                you see is the same configuration the model uses. If you want to
                make changes to your configuration, you need to discard the
                current model first. If you discard your model, you can again
                perform any changes and train a new model based on the new
                configuration.
              </p>
              <div class="button-group">
                <sl-tooltip
                  content="Discards the model, which gains you back your editing capabilities"
                >
                  <sl-button
                    @click="${(_e: MouseEvent) => this._handleDiscardModel()}"
                  >
                    <sl-icon
                      name="arrow-counterclockwise"
                      label="Discard"
                    ></sl-icon>
                    Discard model
                  </sl-button>
                </sl-tooltip>
              </div>
            </div>
          </c-card>`
        : html``}
    `
  }
}
