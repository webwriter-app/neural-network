import spawnAlert from '@/alerts'
import networkState from '@/state/network_state'
import canvasState from '@/state/canvas_state'

import Layer from '@/network/layer'
import Activation from '@/types/activation'

export default class DenseLayer extends Layer {
    
    id: number
    inputFrom: Array<Layer>
    units: number
    activation: Activation
    outputTo: Array<Layer>

    static LAYER_TYPE: string = "Dense"
    static LAYER_NAME: string = "Dense layer"
    static DESCRIPTION: string = "A dense layer is a layer..."

    constructor({inputFrom, units = 2, activation = Activation.ReLu}) {

        super({inputFrom: inputFrom, activation: activation})
        this.units = units
    }

    /*
    GET INFORMATION
    */
    getConnectionIds(): Array<string> {
        return Array.from(new Array(this.units),(value, index)=> `${this.id}-n${index}` );
    }

    /*
    MANIPULATING LAYER
    */
    addNeuron(): void {
        this.units += 1
        networkState.net.buildGraph()
        spawnAlert("Neuron has been added!")
    }

    /*
    BUILD LAYER FOR CANVAS
    */
    buildGraph({net, level}: {net, level: number}): boolean {

        // check if this layer should be built right now or later calling the function of the super class
        if (!this.shouldBuild()) {
            return false
        }

        // constants
        const NODE_SIZE: number = 100
        const NODE_DISTANCE: number = 30

        // get the basic start coordinates
        let pos: {
            x: number,
            y: number
        } = canvasState.getLayerPos(level)

        pos.x += canvasState.LAYER_PADDING + NODE_SIZE/2
        pos.y += canvasState.LAYER_PADDING + NODE_SIZE/2

        // add the layer itself
        canvasState.canvas.add({
            group: 'nodes',
            grabbable: false,
            data: { 
                id: `${this.id}`, 
                label: `${DenseLayer.LAYER_TYPE} ${this.id}`,
                type: 'layer',
                layer: `${this.id}`,
                layer_type: `${DenseLayer.LAYER_TYPE}`,
            }
        })

        // add neurons to the input layer
        for (let neuron = 0; neuron < this.units; neuron++) {
            canvasState.canvas.add({
                group: 'nodes', 
                grabbable: false,
                data: { 
                    id: `${this.id}-n${neuron}`, 
                    parent: `${this.id}`, 
                    type: 'neuron',
                    layer: `${this.id}`,
                    neuron: `${neuron}`
                }, 
                position: {
                    x: pos.x,
                    y: pos.y
                }
            })

            pos.y += NODE_SIZE + NODE_DISTANCE
        }

        // connect this layer to the inputFrom layers
        // for now every node from each previous layer gets connected to every node of this layer. might be adjusted (needs additional class fields)
        let previousNodeIDs
        let ownNodeIDs = this.getConnectionIds()

        for (let previousLayer of this.inputFrom) {
            previousNodeIDs = previousLayer.getConnectionIds()

            for (let previousNodeID of previousNodeIDs) {
                for (let ownNodeID of ownNodeIDs) {
                    canvasState.canvas.add({
                        group: 'edges', 
                        data: {
                            id: `${previousNodeID}e${ownNodeID}`, 
                            source: previousNodeID, 
                            target: ownNodeID
                        }
                    })
                }
            } 
        }

        // tell the canvas that 
        canvasState.addedLayer({
            level: level,
            id: this.id
        })

        // add the outputTo layers to the build Queue
        for(let layer of this.outputTo) {
            net.buildQueue.push({layer: layer, level: level + 1})
        }

        // set built to true to allow layers depending on this layer to be built
        this.built = true

        // done with building this layer, return true
        return true
    }
}