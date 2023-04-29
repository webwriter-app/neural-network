import * as cytoscape from 'cytoscape'

import state from '@/state'

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
                  'padding': `${this.LAYER_PADDING}px`,
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
                selector: 'node[type="neuron-wrapper"]',
                style: {
                  'shape': 'round-rectangle',
                  'border-width': 5,
                  'border-color': 'black',
                  'padding': `0`,
                  'label': 'data(label)',
                }
              },
              {
                selector: 'node[type="neuron"]',
                style: {
                  'shape': 'round-rectangle',
                  'background-color': 'white',
                  'border-width': 5,
                  'border-color': '#0183C7',
                  'width': '100px',
                  'height': '100px',
                  'label': 'data(label)',
                  'text-halign': 'center',
                  'text-valign': 'center'
                }
              },
              {
                selector: 'node[type="neuron"]:selected',
                style: {
                  'border-color': 'orange',
                }
              },
              {
                selector: 'node[type="invisible"]',
                style: {
                  'background-opacity': 0,
                }
              },
              {
                selector: 'edge',
                style: {
                  'width': 5,
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

        // Prevent selection of multiple nodes by holding shift
        this.cy.on('select', 'node, edge', e => this.cy.elements().not(e.target).unselect())

        // Add event listener for selection of layers or nodes
        this.cy.on('tap', (e) => {
            const evtTarget = e.target
    
            if( evtTarget === this.cy ){
            state.network.deselect()
    
            } else if (evtTarget.isNode()) {
    
                const node = evtTarget
        
                if (node.data('type') == 'layer') {
                    state.network.selectLayer({
                        layer: node.data('layer')
                    })
                } else if (node.data('type') == 'neuron') {
                    state.network.selectNeuron({
                        layer: node.data('layer'),
                        neuron: node.data('neuron')
                    })
                }
            } else if (evtTarget.isEdge()) {
    
                const edge = evtTarget
        
                state.network.selectEdge({
                    sourceLayer: edge.source().data('layer'),
                    sourceNeuron: edge.source().data('neuron'),
                    targetLayer: edge.target().data('layer'),
                    targetNeuron:  edge.target().data('neuron')
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
            this.cy.fit(this.cy.$(), 30) // fit the graph to all elements with a padding of 50 pixels
        }
    }
    zoomIn() {
        if(this.cy) {
            this.cy.zoom(this.cy.zoom() + 0.1)
        }
    }

    clear() {
        this.cy.remove('node')
    }

    /*
    POSITIONING
    */
    // get the width of an element
    getWidth(id: number) {
        let elm = this.cy.getElementById(id)
        return elm.outerWidth()
    }

    // generate a new position, currently just in the middle of the canvas
    generatePos() {
        let viewport = this.cy.extent()
        console.log(this.cy.extent())
        return {
            x: viewport.x1 + (viewport.x2 - viewport.x1) / 2,
            y: viewport.y1 + (viewport.y2 - viewport.y1) / 2
        }
    }
}