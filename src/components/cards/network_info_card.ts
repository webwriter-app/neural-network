import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('network-info-card')
class NetworkInfoCard extends LitElementWw {

  render(){
    return html`
        <c-card>
            <div slot="title">
                Info
            </div>
            <div slot="content">
                Build your network by adding layers or choose a quick setup option below. Select layers in the graph to edit their properties and connect them with other layers.
            </div>
        </c-card>
    `;
  }
}