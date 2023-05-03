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

    #canvasActions{
      position: absolute;
      right: 0;
      bottom: 0;
      display: grid;
      gap: 10px;
    }
  `

  _handleZoomIn() {
    state.canvas.zoomIn()
  }

  _handleCenter() {
    state.canvas.fit()
  }

  _handleZoomOut() {
    state.canvas.zoomOut()
  }

  render(){
    return html`
      <div id="cytoscapeCanvas">
      </div>
      <div id="canvasActions">
        <sl-button @click="${this._handleZoomIn}" circle><sl-icon name="zoom-in"></sl-icon></sl-button>
        <sl-button @click="${this._handleCenter}" circle><sl-icon name="arrows-collapse"></sl-icon></sl-button>
        <sl-button @click="${this._handleZoomOut}" circle><sl-icon name="zoom-out"></sl-icon></sl-button>
      </div>
    `;
  }
}