import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('c-canvas-link')
class CCanvasLink extends LitElementWw {

  @property({ type: Boolean }) disabled: boolean

  /* STYLES */
  static styles = css`

    sl-button[disabled] {
      /* @TODO style the disabled button to look like the others when not hovered */
    }
  `

  render(){
    return html`
      <sl-button size="small" pill ?disabled="${this.disabled}"><slot></sl-button>
    `;
  }
}