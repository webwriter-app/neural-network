import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { observeState } from 'lit-element-state';
import networkState from '@/state/network_state.js';
import canvasState from '@/state/canvas_state.js';

import * as cytoscape from 'cytoscape'

@customElement('canvas-panel')
class CanvasPanel extends observeState(LitElementWw) {

  async connectedCallback() {
    super.connectedCallback()
    await this.updateComplete

    // Create cytoscape canvas
    canvasState.setCanvas(cytoscape({

      container: this.renderRoot.querySelector('#cytoscapeCanvas'), // container to render in
    
      elements: [ // list of graph elements to start with
      ],
    
      style: [ // the stylesheet for the graph
        {
          selector: 'node[type="entity"]',
          style: {
            'shape': 'round-rectangle',
            'background-color': '#eeeeee',
            'border-color': 'lightgray',
            'border-width': 5,
            'width': '100px',
            'height': '100px',
            'label': 'data(label)',
          }
        },
        {
          selector: 'node[type="entity"]:selected',
          style: {
            'border-color': 'orange'
          }
        },
        {
          selector: 'node[type="layer"]',
          style: {
            'shape': 'round-rectangle',
            'background-color': 'white',
            'border-width': 5,
            'border-color': 'lightgray',
            'padding': `${canvasState.LAYER_PADDING}px`,
            'label': 'data(label)',
          }
        },
        {
          selector: 'node[type="layer"]:selected',
          style: {
            'border-color': 'orange'
          }
        },
        {
          selector: 'node[type="neuron"]',
          style: {
            'shape': 'round-rectangle',
            'background-color': '#0183C7',
            'width': '100px',
            'height': '100px',
          }
        },
        {
          selector: 'node[type="neuron"]:selected',
          style: {
            'background-color': 'orange'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        },
        {
          selector: 'edge:selected',
          style: {
            'line-color': 'orange',
            'target-arrow-color': 'orange',
          }
        }
      ],
      wheelSensitivity: 0.2,
      boxSelectionEnabled: false,
      selectionType: 'single',
    }))

    // Prevent selection of multiple nodes by holding shift
    canvasState.canvas.on('select', 'node, edge', e => canvasState.canvas.elements().not(e.target).unselect())

    // Add event listener for selection of layers or nodes
    canvasState.canvas.on('tap', (e) => {
      const evtTarget = e.target

      if( evtTarget === canvasState.canvas ){
        networkState.deselect()

      } else if (evtTarget.isNode()) {

        const node = evtTarget

        if (node.data('type') == 'layer') {
          networkState.selectLayer({
            layer: node.data('layer')
          })
        } else if (node.data('type') == 'neuron') {
          networkState.selectNeuron({
            layer: node.data('layer'),
            neuron: node.data('neuron')
          })
        }
      } else if (evtTarget.isEdge()) {

        const edge = evtTarget

        networkState.selectEdge({
          sourceLayer: edge.source().data('layer'),
          sourceNeuron: edge.source().data('neuron'),
          targetLayer: edge.target().data('layer'),
          targetNeuron:  edge.target().data('neuron')
        })
      }
    })
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
    canvasState.zoomOut()
  }

  _handleCenter() {
    canvasState.fit()
  }

  _handleZoomIn() {
    canvasState.zoomIn()
  }

  render(){
    return html`
      <div id="cytoscapeCanvas">
        ${ !networkState.net
          ? html`<sl-card id="emptyCanvasInfo">Your network is currently empty. Select a 'quick action' in the 'network' tab on the right to quickly setup a network from a number of templates or start building the network yourself!</sl-card>` 
          : html``
        }
      </div>
      <div id="canvasActions">
        <sl-button @click="${this._handleZoomOut}">Zoom out</sl-button>
        <sl-button @click="${this._handleCenter}">Center</sl-button>
        <sl-button @click="${this._handleZoomIn}">Zoom in</sl-button>
      </div>
    `;
  }
}