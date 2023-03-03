import {LitElementWw} from "@webwriter/lit"
import {html} from "lit"
import {customElement} from "lit/decorators.js"

@customElement("ww-machinelearningvisualizer")
export class WwMachinelearningvisualizer extends LitElementWw {
  render() {
    return html`<sl-button>Button</sl-button>`
  }
}
