import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

@customElement('canvas-info-card')
export class CanvasInfoCard extends LitElementWw {
  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Welcome :)</div>
        <div slot="content">
          Your network is currently empty - select an option below to get
          started! You can also find these and a few more options (like for
          building your network from scratch) in the right menu under the tab
          'network'.
        </div>
      </c-card>
    `
  }
}
