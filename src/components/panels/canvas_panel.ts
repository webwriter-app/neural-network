import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { StateController } from "@lit-app/state";
import state from '@/state'
import Canvas from '@/canvas';

@customElement('canvas-panel')
class CanvasPanel extends LitElementWw {

  state = new StateController(this, state)

  async connectedCallback() {
    super.connectedCallback()
    await this.updateComplete

    // Create cytoscape canvas and save it to state
    state.canvas = new Canvas(this.renderRoot.querySelector('#cytoscapeCanvas'))
  }

  /* STYLES */
  static styles = css`

    :host {
      position: relative;
    }

    #cytoscapeCanvas{
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
    }

    #emptyCanvasInfo{
      position: absolute;
      margin: 50px;
    }

    #canvasActions{
      position: absolute;
      right: 20px;
      bottom: 20px;
    }
  `

  _handleZoomOut() {
    state.canvas.zoomOut()
  }

  _handleCenter() {
    state.canvas.fit()
  }

  _handleZoomIn() {
    state.canvas.zoomIn()
  }

  render(){
    return html`
      <div id="cytoscapeCanvas">
        ${ !state.network
          ? html`<sl-card id="emptyCanvasInfo">Your network is currently empty. Select a 'quick action' in the 'network' tab on the right to quickly setup a network from a number of templates or start building the network yourself!</sl-card>` 
          : html``
        }
      </div>
      <div id="canvasActions">
        <sl-button @click="${this._handleZoomOut}" circle><sl-icon name="zoom-out"></sl-icon></sl-button>
        <sl-button @click="${this._handleCenter}" circle><sl-icon name="arrows-collapse"></sl-icon></sl-button>
        <sl-button @click="${this._handleZoomIn}" circle><sl-icon name="zoom-in"></sl-icon></sl-button>
      </div>
    `;
  }
}