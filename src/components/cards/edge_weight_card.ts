import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { ModelUtils } from '@/utils/model_utils'

@customElement('edge-weight-card')
export class EdgeWeightCard extends LitElementWw {
  @property({ attribute: false })
  weight: number

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    console.log(this.weight)
    return html`
      <c-card>
        <div slot="title">Weight</div>
        <div slot="content">
          <p>${ModelUtils.formatWeight(this.weight)}</p>
        </div>
      </c-card>
    `
  }
}
