import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('canvas-info-card')
class CanvasInfoCard extends LitElementWw {

  render(){
    return html`
        <c-card>
            <div slot="title">
                Info
            </div>
            <div slot="content">
                You currently do not have an item selected in the network graph. Select a layer or a neuron to view and edit its corresponding information.
            </div>
        </c-card>
    `;
  }
}