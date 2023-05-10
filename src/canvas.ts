import * as cytoscape from 'cytoscape'

import state from '@/state'
import NeuronLayer from '@/network/neuron_layer'

export default class Canvas {

    cy

    LAYER_WIDTH: number
    LAYER_PADDING: number
    LAYER_DISTANCE: number
    NEURON_SIZE: number
    NEURON_DISTANCE: number

    constructor(ref) {

        this.LAYER_WIDTH = 300,
        this.LAYER_PADDING = 20,
        this.LAYER_DISTANCE = 150,
        this.NEURON_SIZE = 100,
        this.NEURON_DISTANCE = 40

        // create cytoscape canvas
        this.cy = cytoscape({

            container: ref, // container to render in
          
            elements: [ // list of graph elements to start with
            ],
          
            style: [ // the stylesheet for the graph
              {
                selector: 'node[type="layer"]',
                style: {
                  'shape': 'round-rectangle',
                  'background-color': '#efefef',
                  'border-color': '#efefef',
                  'border-width': 5,
                  'padding': this.LAYER_PADDING,
                  'label': 'data(label)',
                  'text-halign': 'left',
                  'text-valign': 'center',
                  'text-margin-x' : -20,
                  'z-compound-depth': 'bottom'
                }
              },
              {
                selector: 'node[type="layer"]:selected',
                style: {
                  'border-color': 'orange'
                }
              },
              {
                selector: 'node[type="neuron-wrapper"]',
                style: {
                  'shape': 'round-rectangle',
                  'border-width': 5,
                  'border-color': 'black',
                  'padding': 0,
                  'label': 'data(label)',
                  'text-halign': 'center',
                  'text-valign': 'bottom',
                  'text-margin-y': 20,
                  'z-compound-depth': 'bottom'
                }
              },
              {
                selector: 'node[type="neuron"]',
                style: {
                  'shape': 'round-rectangle',
                  'background-color': 'white',
                  'border-width': 5,
                  'border-color': '#0183C7',
                  'width': '95px',
                  'height': '95px',
                  'label': 'data(label)',
                  'text-halign': 'center',
                  'text-valign': 'center',
                  'z-compound-depth': 'bottom'
                }
              },
              {
                selector: 'node[type="neuron"][wrapped="true"]',
                style: {
                  'width': '90px',
                  'height': '90px'
                }
              },
              {
                selector: 'node[type="neuron"]:selected',
                style: {
                  'border-color': 'orange',
                }
              },
              {
                selector: 'edge',
                style: {
                  'width': 3,
                  'line-color': 'lightgray',
                  'target-arrow-color': 'gray',
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
        })

        // Add event listener when tapped on canvas
        this.cy.on('tap', (e) => {
          if( e.target === this.cy ){
            state.network.deselect()
          }
        })

        // Add event listener for selection of layers or nodes
        this.cy.on('select', 'node, edge', (e) => {

            // Prevent selection of multiple nodes by holding shift
            this.cy.elements().not(e.target).unselect()
            const evtTarget = e.target
    
            if (evtTarget.isNode()) {
    
              const node = evtTarget
      
              if (node.data('type') == 'layer') {
                const layer = state.network.getLayerById(node.data('layer'))
                state.network.selectLayer({
                  layer: layer
                })
              } else if (node.data('type') == 'neuron') {
                const layer = <NeuronLayer>state.network.getLayerById(node.data('layer'))
                state.network.selectNeuron({
                  layer: layer,
                  neuron: layer.units[node.data('neuron') - 1]
                })
              }

            } else if (evtTarget.isEdge()) {
    
              const edge = evtTarget
              const sourceLayer = state.network.getLayerById(edge.source().data('layer'))
              let sourceNeuron = null
              if (sourceLayer instanceof NeuronLayer) {
                sourceNeuron = sourceLayer.units[edge.source().data('neuron') - 1]
              }
              const targetLayer = state.network.getLayerById(edge.target().data('layer'))
              let targetNeuron = null
              if (targetLayer instanceof NeuronLayer) {
                targetNeuron = targetLayer.units[edge.target().data('neuron') - 1]
              }
      
              state.network.selectEdge({
                sourceLayer: sourceLayer,
                sourceNeuron: sourceNeuron,
                targetLayer: targetLayer,
                targetNeuron: targetNeuron
              })
            }
        })
    }

    /*
    CANVAS MANIPULATION
    */
    zoomOut() {
        if(this.cy) {
            this.cy.zoom(this.cy.zoom() - 0.1)
        }
    }
    fit() {
        if(this.cy) {
            this.cy.fit(this.cy.$(), 30) // fit the graph to all elements with a specified padding
        }
    }
    zoomIn() {
        if(this.cy) {
            this.cy.zoom(this.cy.zoom() + 0.1)
        }
    }
    
    /*
    POSITIONING
    */
    // get the width of an element
    getHeight(id: number) {
        let elm = this.cy.getElementById(id)
        return elm.outerHeight()
    }

    // generate a new position, currently just in the middle of the canvas
    generatePos() {
        let viewport = this.cy.extent()
        return {
            x: viewport.x1 + (viewport.x2 - viewport.x1) / 2,
            y: viewport.y1 + (viewport.y2 - viewport.y1) / 2
        }
    }
}