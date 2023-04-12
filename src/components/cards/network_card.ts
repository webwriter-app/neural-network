import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'

import * as cytoscape from 'cytoscape'
import net from '../../network/net'

@customElement('network-card')
class NetworkCard extends LitElementWw {

  private _cy = null
  private _resizeObserver = new ResizeObserver(entries => {
    this.resizedCallback()
  });

  @state()
  private _net = net
  @state()
  private _selectedLayer = null
  @state()
  private _selectedNeuron = null

  @query('#cytoscapeCanvas')
  _canvas;

  connectedCallback() {
    super.connectedCallback()

    // Resize Observer
    this._resizeObserver.observe(this)

    setTimeout(() => {
      // Create cytoscape canvas
      this._cy = cytoscape({

        container: this._canvas, // container to render in
      
        elements: [ // list of graph elements to start with
        ],
      
        style: [ // the stylesheet for the graph
          {
            selector: 'node[type="neuron"]',
            style: {
              'shape': 'round-rectangle',
              'background-color': 'blue',
              'width': '50px',
              'height': '50px',
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
      
     /*    layout: {
          name: 'grid',
          position: function(node){
            return {row: node.data('row'), col: node.data('col')}
          }
        }, */
        userZoomingEnabled: false,
        userPanningEnabled: false,
        autoungrabify: true,
        boxSelectionEnabled: false
      });

      // Add event listener for selection of layers or nodes
      this._cy.on('tap', (e) => {
        this._selectedLayer = null
        this._selectedNeuron = null
      
        if (e.target.isNode()){
          const node = e.target
          if (node.data('type') == 'layer') {
            this._selectedLayer = node.data('id')
          } else if (node.data('type') == 'neuron') {
            this._selectedNeuron = node.data('id')
          }
        }
      })

      // Finally build the graph for the first time
      this.buildGraph()

    }, 100)
  }

  buildGraph() {

    // remove the potentially previously built graph
    this._cy.remove('node')

    // build cytoscape graph based on data in the net class
    let maxSize = this._net.getMaxNumberOfNeuronsPerLayer()
    let rows = maxSize * 2 - 1
    let actColumn = 1
    let actRow

    // input layer
    actRow = 1 + (rows - this._net.config.inputSize)
    this._cy.add({
      group: 'nodes', 
      data: { 
        id: '0', 
        type: 'layer', 
        layer: 0
      }
    })
    for (let i = 0; i < this._net.config.inputSize; i++) {
      this._cy.add({
        group: 'nodes', 
        data: { 
          id: `0-${i}`, 
          parent: '0', 
          type: 'neuron', 
          inlayer: 0
        }, 
        position: {x: actColumn * 300, y: actRow*100}
      })
      actRow += 2
    }
    actColumn += 1
    
    // hidden layers
    for (let layer = 0; layer < this._net.config.hiddenLayers.length; layer++) {
      actRow = 1 + (rows - this._net.config.hiddenLayers[layer].units)
      this._cy.add({
        group: 'nodes', 
        data: { 
          id: `${layer + 1}`, 
          type: 'layer', 
          layer: layer + 1
        }
      })
      for (let i = 0; i < this._net.config.hiddenLayers[layer].units; i++) {
        this._cy.add({
          group: 'nodes', 
          data: { 
            id: `${layer + 1}-${i}`, 
            parent: `${layer + 1}`, 
            type: 'neuron', 
            inlayer: layer + 1
          }, 
          position: {
            x: actColumn * 300, 
            y: actRow*100
          }
        })
        actRow += 2
      }
      actColumn +=1
    }

    // output layer
    actRow = 1 + (rows - this._net.config.outputSize)
    this._cy.add({
      group: 'nodes', 
      data: { 
        id: `${this._net.config.hiddenLayers.length + 1}`, 
        type: 'layer', 
        layer: this._net.config.hiddenLayers.length + 1
      }
    })
    for (let i = 0; i < this._net.config.outputSize; i++) {
      this._cy.add({
        group: 'nodes', 
        data: { 
          id: `${this._net.config.hiddenLayers.length + 1}-${i}`, 
          parent: `${this._net.config.hiddenLayers.length + 1}`, 
          type: 'neuron', 
          inlayer: this._net.config.hiddenLayers.length + 1
        }, 
        position: {
          x: actColumn * 300, 
          y: actRow*100
        }
      })
      actRow += 2
    }

    // connections
    let currentLayerNodes = this._cy.nodes().filter((node) => {
      return node.data('inlayer') == 0
    })

    let nextLayerNodes
    for (let layer = 1; layer < this._net.config.hiddenLayers.length + 2; layer++) {

      nextLayerNodes = this._cy.nodes().filter((node) => {
        return node.data('type') == 'neuron' && node.data('inlayer') == layer
      })

      for (let currentLayerNode of currentLayerNodes) {
        for (let nextLayerNode of nextLayerNodes) {
          this._cy.add({
            group: 'edges', 
            data: {
              id: `${currentLayerNode.data('id')}-${nextLayerNode.data('id')}`, 
              source: currentLayerNode.data('id'), 
              target: nextLayerNode.data('id')
            }
          })
        }
      }

      currentLayerNodes = nextLayerNodes
    }

    this._cy.fit()
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._resizeObserver.unobserve(this);
  }

  resizedCallback() {
    if (this._cy) {
      this._cy.resize()
      this._cy.fit()
    }
  }

  /* STYLES */
  static styles = css`

    .network-card {
      width: 100%;
    }

    .network-card [slot='header'] {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .network-card sl-icon-button {
      font-size: var(--sl-font-size-medium);
    }

    #cytoscapeCanvas{
      height: 400px;
      width: 100%;
    }
  `

  /* RENDERING */
  getFooter() {
    if (this._selectedLayer) {
      if (this._selectedLayer == 0) {
        return html`
          <sl-button @click="${this._handleAddLayerAfter}">Insert new layer after this layer</sl-button>
          <sl-button @click="${this._handleAddNeuron}">Add neuron</sl-button>
        `
      } else if (this._selectedLayer == this._net.config.hiddenLayers.length + 1) {
        return html`
          <sl-button @click="${this._handleAddLayerBefore}">Insert new layer before this layer</sl-button>
          <sl-button @click="${this._handleAddNeuron}">Add neuron</sl-button>
        `
      } else {
        return html`
          <sl-button @click="${this._handleAddLayerBefore}">Insert new layer before this layer</sl-button>
          <sl-button @click="${this._handleAddLayerAfter}">Insert new layer after this layer</sl-button>
          <sl-button @click="${this._handleAddNeuron}">Add neuron</sl-button>
        `
      }

    } else if (this._selectedNeuron) {
      return html`Selected Neuron`
    } else {
      return html`Select a layer or a neuron to view its data and possible actions`
    }
  }
  _handleAddLayerBefore(e) {
    this._net.insertLayer({before: this._selectedLayer})
    this.buildGraph()
  }
  _handleAddLayerAfter(e) {
    this._net.insertLayer({after: this._selectedLayer})
    this.buildGraph()
  }
  _handleAddNeuron(e) {
    this._net.addNeuronToLayer(this._selectedLayer)
    this.buildGraph()
  }

  render(){
    return html`
      <sl-card class="network-card">
        <div slot="header">
            Neural Network
            <sl-icon-button name="gear" label="Settings"></sl-icon-button>
        </div>
        <div id="cytoscapeCanvas">

        </div>
        <div slot="footer">
          ${this.getFooter()}
        </div>
      </sl-card>
    `;
  }
}