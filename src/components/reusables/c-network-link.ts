import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { canvasContext } from '@/contexts/canvas_context'

import type { CCanvas } from '@/components/canvas'

import { CLayer } from '@/network/c_layer'
import { Neuron } from '@/network/neuron'

@customElement('c-network-link')
export class CNetworkLink extends LitElementWw {
  @property({ type: Boolean })
  disabled: boolean

  @property({ type: String })
  target: CLayer | Neuron

  @consume({ context: canvasContext, subscribe: true })
  canvas: CCanvas

  /* STYLES */
  static styles: CSSResult[] = [globalStyles]

  // handle link click
  _handleClick() {
    if (this.target instanceof CLayer) {
      this.dispatchEvent(
        new CustomEvent<string>('select-layer', {
          detail: this.target.getCyId(),
          bubbles: true,
          composed: true,
        })
      )
    } else if (this.target instanceof Neuron) {
      this.dispatchEvent(
        new CustomEvent<string>('select-neuron', {
          detail: this.target.getCyId(),
          bubbles: true,
          composed: true,
        })
      )
    }
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
