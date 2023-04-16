import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement, query, property } from 'lit/decorators.js'

import * as cytoscape from 'cytoscape'

@customElement('network-graph-card')
class NetworkGraphCard extends LitElementWw {

  @property()
  net
  @query('#cytoscapeCanvas')
  _canvas;

  connectedCallback() {
    super.connectedCallback()

    setTimeout(() => {
      // Create cytoscape canvas
      this.net._cy = cytoscape({

        container: this._canvas, // container to render in
      
        elements: [ // list of graph elements to start with
        ],
      
        style: [ // the stylesheet for the graph
          {
            selector: 'node[type="neuron"]',
            style: {
              'shape': 'round-rectangle',
              'background-color': 'blue',
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
            selector: 'node[type="layer"]',
            style: {
              'label': 'data(id)',
              'shape': 'round-rectangle',
              'background-color': 'white',
              'border-width': 5,
              'border-color': 'lightgray',
              'padding': '20px',
            }
          },
          {
            selector: 'node[type="layer"]:selected',
            style: {
              'border-color': 'orange'
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
        wheelSensitivity: 0.2,
      });

      // Add event listener for selection of layers or nodes
      this.net._cy.on('tap', (e) => {
        const evtTarget = e.target

        if( evtTarget === this.net._cy ){

          console.log("clicked on canvas")
          let event = new CustomEvent('deselected');
          this.dispatchEvent(event);

        } else if (evtTarget.isNode()) {

          const node = evtTarget
          if (node.data('type') == 'layer') {
            let event = new CustomEvent('selected-layer', {
              detail: {
                id: node.data('id')
              }
            });
            this.dispatchEvent(event);
          } else if (node.data('type') == 'neuron') {
            let event = new CustomEvent('selected-neuron', {
              detail: {
                id: node.data('id')
              }
            });
            this.dispatchEvent(event);
          }
        }
      })

      // Finally build the graph for the first time
      this.net.buildGraph()

    }, 100)
  }

  /* STYLES */
  static styles = css`

    #cytoscapeCanvasWrapper {
      height: 400px;
      width: calc(100% + 40px);
      resize: vertical;
      overflow: auto;
      margin: -20px;
    }

    #cytoscapeCanvas{
      height: calc(100% - 10px);
      width: 100%;
    }
  `

  render(){
    return html`
      <c-card>
        <div slot="title">
          Neural Network
        </div>
        <div id="cytoscapeCanvasWrapper" slot="content">
          <div id="cytoscapeCanvas">

          </div>
        </div>
      </c-card>
    `;
  }
}