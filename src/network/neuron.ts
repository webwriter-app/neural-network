import spawnAlert from '@/alerts'

import canvasState from '@/state/canvas_state'
// Abstract class NeuronLayer acts as a bridge between the general Layer class and specific classes such as Dense layer. It stores the number of neurons and acts as a type checker for some methods that only exists for these layers. Important as a differentation to other possible layer that to not consist of just neurons.
export default class Neuron {

    // reference to the layer id
    layer: number

    // the id of the neuron in this layer. first neuron added gets id 1; not to be confused with the id of the corresponding node in the cytoscape canvas which is `${this.layer}n${this.id}`
    id: number

    // the exact position in the cytoscape canvas (= the middle of the node)
    cypos: {
        x: number,
        y: number
    }

    constructor({layer, id, cypos}: {layer: number, id:number, cypos: {x: number, y: number}}) {
        
        this.layer = layer
        this.id = id
        this.cypos = cypos
    }

    // update position
    updatePos(cypos: {x: number, y: number}) {
        this.cypos = cypos
    }

    /*
    BUILD LAYER FOR CANVAS
    */
    // build the neuron itself (without the connections)
    buildNeuron() {

        // remove the previously built neuron if exists
        this.remove()

        /// add the neuron to the canvas
        canvasState.canvas.add({
            group: 'nodes', 
            grabbable: false,
            data: { 
                id: `${this.layer}n${this.id}`, 
                parent: `${this.layer}`, 
                type: 'neuron',
                layer: this.layer,
                neuron: this.id
            }, 
            position: {
                x: this.cypos.x,
                y: this.cypos.y
            }
        })
    }

    buildIncomingConnections(layerConnections: Array<{layer: number, nodes: Array<number>}>) {

        for (let layerConnection of layerConnections) {
            for (let node of layerConnection.nodes) {
                canvasState.canvas.add({
                    group: 'edges', 
                    data: {
                        id: `${node}e${this.layer}n${this.id}`, 
                        source: node, 
                        target: `${this.layer}n${this.id}`,
                        sourceLayer: layerConnection.layer,
                        targetLayer: this.layer
                    }
                })
            }
        } 
    }

    buildOutgoingConnections(layerConnections: Array<{layer: number, nodes: Array<number>}>) {

        for (let layerConnection of layerConnections) {
            for (let node of layerConnection.nodes) {
                canvasState.canvas.add({
                    group: 'edges', 
                    data: {
                        id: `${this.id}n${node}e${this.layer}`, 
                        source: `${this.layer}n${this.id}`, 
                        target: node,
                        sourceLayer: this.layer,
                        targetLayer: layerConnection.layer
                    }
                })
            }
        } 
    }

    remove() {
        let eles = canvasState.canvas.filter((element, i) => {
            return element.isNode() && element.data('layer') == this.layer && element.data('neuron') == this.id
        }, this)
        eles.remove()
    }
}