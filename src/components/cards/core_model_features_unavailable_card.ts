import { LitElement } from 'lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { ModelConf, modelConfContext } from '@/contexts/model_conf_context'

@customElement('core-model-features-unavailable-card')
export class CoreModelFeaturesUnavailableCard extends LitElement {
  @consume({ context: modelConfContext, subscribe: true })
  modelConf: ModelConf

  _handleReset(): void {
    this.dispatchEvent(
      new Event('reset-model', {
        bubbles: true,
        composed: true,
      })
    )
  }

  static styles: CSSResult[] = globalStyles

  getContent(): TemplateResult<1> {}

  render(): TemplateResult<1> {
    return html`
      ${this.modelConf.model
        ? html` <c-card>
            <div slot="title">Important info</div>
            <div slot="content">
              <p>
                You are currently in read-only mode with all network and data
                set realted editing options disabled. This is because you
                decided to train a model with the current configuration. If you
                want to make changes, you need to reset the model first. If you
                reset your model, you can again perform any changes and train a
                new model.
              </p>
              <div class="button-group">
                <sl-tooltip
                  content="Resets the model, so you can edit the network and settings again and are able to start a new training"
                >
                  <sl-button
                    @click="${(_e: MouseEvent) => this._handleReset()}"
                  >
                    <sl-icon
                      name="arrow-counterclockwise"
                      label="Reset"
                    ></sl-icon>
                    Reset
                  </sl-button>
                </sl-tooltip>
              </div>
            </div>
          </c-card>`
        : html``}
    `
  }
}
