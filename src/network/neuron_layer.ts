import spawnAlert from '@/alerts'

import canvasState from '@/state/canvas_state'

import Layer from '@/network/layer'
import Neuron from '@/network/neuron'
import Activation from '@/types/activation'

// Abstract class NeuronLayer acts as a bridge between the general Layer class and specific classes such as Dense layer. It stores the number of neurons and acts as a type checker for some methods that only exists for these layers. Important as a differentation to other possible layer that to not consist of just neurons.
export default abstract class NeuronLayer extends Layer {

    id: number
    inputFrom: Array<Layer>
    units: Array<Neuron>
    activation: Activation
    outputTo: Array<Layer>

    pos: {
        x: number,
        y: number
    }

    static LAYER_TYPE: string
    static LAYER_NAME: string
    static DESCRIPTION: string

    constructor({inputFrom, units, activation, outputTo, pos}) {
        
        super({inputFrom: inputFrom, activation: activation, outputTo: outputTo, pos: pos})
        
        this.buildLayer()
        this.units = []
        for (let unit = 1; unit <= units; unit++) {
            this.addNeuron()
        }
    }

    /*
    GET INFORMATION
    */
    getConnectionIds(): Array<string> {
        return Array.from(new Array(this.units.length),(value, index)=> `${this.id}n${index+1}` );
    }

    /*
    MANIPULATING LAYER
    */
    addNeuron(): Neuron {
        // running position variable for the placement of the neurons
        let cypos = Object.create(this.pos)
        cypos.x += canvasState.LAYER_PADDING + canvasState.NEURON_SIZE/2
        cypos.y += canvasState.LAYER_PADDING + canvasState.NEURON_SIZE/2 + (canvasState.NEURON_SIZE + canvasState.NEURON_DISTANCE) * this.units.length

        const neuron = new Neuron({layer: this.id, id: this.units.length + 1, cypos: cypos})
        this.units.push(neuron)
        this.buildNeuron(neuron)
        return neuron
    }

    setNeurons(units): void {
        if (units >= 1) {
            if (units > this.units.length) {
                for (let unit = this.units.length + 1; unit <= units; unit++) {
                    this.addNeuron()
                    console.log("aaaad")
                }
            } else if (units < this.units.length) {
                for (let unit = this.units.length + 1; unit > units; unit--) {
                    this.removeNeuron()
                }
            }
            spawnAlert(`The number of neurons has been updated to ${units}!`, 'success')
        } else {
            spawnAlert("This layer needs to contain at least one neuron!", 'danger')
        }
    }

    removeNeuron(): void {
        if (this.units.length > 1) {
            this.units.pop().remove()
        } else {
            spawnAlert("Can not remove neuron: This layer needs to contain at least one neuron!", 'danger')
        }
    }

    /*
    BUILD LAYER FOR CANVAS
    */
    // update pos (note: the pos in the argument specifies cytoscape pos, thus: the middle)
    updatePos(cypos: {x: number, y: number}) {
        
    }

    // build
    buildLayer() {

        // remove the previously built layer from the canvas if exists
        this.removeFromCanvas()

        // add the layer
        canvasState.canvas.add({
            group: 'nodes',
            data: { 
                id: `${this.id}`, 
                label: `${this.constructor.LAYER_TYPE} ${this.id}`,
                type: 'layer',
                layer: this.id,
                layer_type: `${this.constructor.LAYER_TYPE}`,
            }
        })
    }

    buildNeuron(unit) {

        // add the neuron itself
        unit.buildNeuron()

        // connect the neuron to the previous layers
        let connections = []
        for (let previousLayer of this.inputFrom) {
            connections.push({layer: previousLayer.id, nodes: previousLayer.getConnectionIds()})
        }   
        unit.buildIncomingConnections(connections)

        // connect the neuron to the outgoing layers
        connections = []
        for (let nextLayer of this.outputTo) {
            connections.push({layer: nextLayer.id, nodes: nextLayer.getConnectionIds()})
        }   
        unit.buildOutgoingConnections(connections)
    }
}