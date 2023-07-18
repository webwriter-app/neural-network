import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { consume } from '@lit-labs/context'
import { Canvas, canvasContext } from '@/contexts/canvas_context'

import { globalStyles } from '@/global_styles'

import { CLayer } from '@/components/network/c_layer'
import { Neuron } from '@/components/network/neuron'

@customElement('c-network-link')
export class CNetworkLink extends LitElementWw {
  @property({ type: Boolean })
  disabled: boolean

  @property({ type: String })
  target: CLayer | Neuron

  @consume({ context: canvasContext, subscribe: true })
  canvas: Canvas

  /* STYLES */
  static styles: CSSResult[] = [globalStyles]

  // handle link click
  _handleClick() {
    this.canvas.cy.getElementById(this.target.getCyId()).select()
  }

  render(): TemplateResult<1> {
    return html`
      <sl-button 
        size="small" 
        pill 
        @click="${(_e: MouseEvent) => this._handleClick()}"
      >
        <slot>
      </sl-button>
    `
  }
}
