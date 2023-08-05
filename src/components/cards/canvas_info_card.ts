import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

@customElement('canvas-info-card')
export class CCanvasInfoCard extends LitElementWw {
  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Welcome :)</div>
        <div slot="content">
          Your network is currently empty - select an option below to get
          started! You can also setup everything from scratch - find the options
          in the right menu!
        </div>
      </c-card>
    `
  }
}
