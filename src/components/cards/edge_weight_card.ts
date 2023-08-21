import { LitElement } from 'lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { formatWeight } from '@/utils/formatWeight'

@customElement('edge-weight-card')
export class EdgeWeightCard extends LitElement {
  @property({ attribute: false })
  weight: number

  static styles: CSSResult[] = globalStyles

  render(): TemplateResult<1> {
    console.log(this.weight)
    return html`
      <c-card>
        <div slot="title">Edge</div>
        <div slot="content">
          <p>Weight: ${formatWeight(this.weight)}</p>
        </div>
      </c-card>
    `
  }
}
