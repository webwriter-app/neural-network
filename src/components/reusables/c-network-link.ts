import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { consume } from '@lit/context'

import type { CCanvas } from '@/components/canvas'
import { canvasContext } from '@/contexts/canvas_context'
import { CLayer } from '@/components/network/c_layer'
import { CNeuron } from '@/components/network/neuron'

export @customElement('c-network-link') class CNetworkLink extends LitElementWw {
  @property({ type: Boolean })
  accessor disabled: boolean

  @property({ type: String })
  accessor target: CLayer | CNeuron

  @consume({ context: canvasContext, subscribe: true })
  accessor canvas: CCanvas

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  selectItem() {
    if (this.target instanceof CLayer) {
      this.dispatchEvent(
        new CustomEvent<string>('select-layer', {
          detail: this.target.getCyId(),
          bubbles: true,
          composed: true,
        })
      )
    } else if (this.target instanceof CNeuron) {
      this.dispatchEvent(
        new CustomEvent<string>('select-neuron', {
          detail: this.target.getCyId(),
          bubbles: true,
          composed: true,
        })
      )
    }
  }

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <sl-button 
        size="small" 
        pill 
        @click="${(_e: MouseEvent) => this.selectItem()}"
      >
        <slot>
      </sl-button>
    `
  }
}
