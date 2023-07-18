import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { consume } from '@lit-labs/context'
import { Model, modelContext } from '@/contexts/model_context'

import { globalStyles } from '@/global_styles'

@customElement('training-train-card')
export class TrainingTrainCard extends LitElementWw {
  @consume({ context: modelContext, subscribe: true })
  model: Model

  _handleTrainStep(): void {
    void this.model.train()
  }

  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Train</div>
        <div slot="content">
          <div>
            <sl-tooltip content="Reset training progress">
              <sl-button size="large" circle>
                <sl-icon name="arrow-counterclockwise" label="Reset"></sl-icon>
              </sl-button>
            </sl-tooltip>
            <sl-tooltip content="Start training">
              <sl-button
                variant="primary"
                size="large"
                circle
                @click="${(_e: MouseEvent) => this._handleTrainStep()}"
              >
                <sl-icon name="play" label="Run"></sl-icon>
              </sl-button>
            </sl-tooltip>
            <sl-tooltip content="Train a single batch">
              <sl-button size="large" circle>
                <sl-icon name="fast-forward" label="Next"></sl-icon>
              </sl-button>
            </sl-tooltip>
            <sl-tooltip content="Train a single epoch">
              <sl-button size="large" circle>
                <sl-icon name="fast-forward" label="Next"></sl-icon>
              </sl-button>
            </sl-tooltip>
          </div>
        </div>
      </c-card>
    `
  }
}
