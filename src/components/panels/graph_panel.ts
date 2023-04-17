import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { observeState } from 'lit-element-state';
import networkState from '@/state/network_state.js';

import * as cytoscape from 'cytoscape'

@customElement('graph-panel')
class GraphPanel extends observeState(LitElementWw) {

  connectedCallback() {
    super.connectedCallback()

    setTimeout(() => {
      // Create cytoscape canvas
      networkState.net.setCanvas(cytoscape({

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
              'padding': '20px',
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
            selector: 'node[type="activation"]',
            style: {
              'shape': 'ellipse',
              'background-color': 'black',
              'width': '100px',
              'height': '100px',
            }
          },
          {
            selector: 'node[type="activation"]:selected',
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
          }
        ],
        autoungrabify: true,
        boxSelectionEnabled: false,
        wheelSensitivity: 0.2
      }))

      // Add event listener for selection of layers or nodes
      networkState.net.getCanvas().on('tap', (e) => {
        const evtTarget = e.target

        if( evtTarget === networkState.net.getCanvas() ){
          networkState.deselect()
        } else if (evtTarget.isNode()) {

          const node = evtTarget
          if (node.data('type') == 'layer') {
            networkState.selectLayer(node.data('id'))
          } else if (node.data('type') == 'neuron') {
            networkState.selectNeuron(node.data('id'))
          }
        }
      })

      // Finally build the graph for the first time
      networkState.net.buildGraph()

    }, 100)
  }

  /* STYLES */
  static styles = css`

    :host {
      position: relative;
    }

    #cytoscapeCanvas{
      height: 100%;
      width: 100%;
    }

    #canvasActions{
      position: absolute;
      right: 20px;
      bottom: 20px;
    }
  `

  _handleZoomOut() {
    networkState.net.zoomOutCanvas()
  }

  _handleCenter() {
    networkState.net.fitCanvas()
  }

  _handleZoomIn() {
    networkState.net.zoomInCanvas()
  }

  render(){
    return html`
      <div id="cytoscapeCanvas">

      </div>
      <div id="canvasActions">
        <sl-button @click="${this._handleZoomOut}">Zoom out</sl-button>
        <sl-button @click="${this._handleCenter}">Center</sl-button>
        <sl-button @click="${this._handleZoomIn}">Zoom in</sl-button>
      </div>
    `;
  }
}