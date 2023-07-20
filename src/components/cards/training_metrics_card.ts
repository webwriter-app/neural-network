import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, query } from 'lit/decorators.js'

import { consume } from '@lit-labs/context'
import { Model, modelContext } from '@/contexts/model_context'

import { globalStyles } from '@/global_styles'

@customElement('training-metrics-card')
export class TrainingMetricsCard extends LitElementWw {
  @consume({ context: modelContext, subscribe: true })
  model: Model

  @query('#trainMetricsContainer')
  _trainMetricsContainer: HTMLDivElement

  firstUpdated(): void {
    console.log('connected training metrics card')
    console.log(this._trainMetricsContainer)
    const event = new CustomEvent<HTMLDivElement>(
      'set-train-metrics-container',
      {
        detail: this._trainMetricsContainer,
        bubbles: true,
        composed: true,
      }
    )
    this.dispatchEvent(event)
  }

  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Metrics</div>
        <div slot="content">
          <div id="trainMetricsContainer"></div>
        </div>
      </c-card>
    `
  }
}
