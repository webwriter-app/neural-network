import { widgetMsg } from '@webwriter/lit/localize'
import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '../global-styles'

import { ModelUtils } from '../../model/model-utils'
import { CCard } from '../reusables/c-card'

export class EdgeWeightCard extends LitElementWw {
  private readonly msg = widgetMsg(this);
  static scopedElements = {
    'c-card': CCard,
  }

  @property({ attribute: false })
  accessor weight: number

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">${this.msg('Weight')}</div>
        <div slot="content">
          <p>${ModelUtils.formatWeight(this.weight)}</p>
        </div>
      </c-card>
    `
  }
}
