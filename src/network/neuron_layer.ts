import * as tf from '@tensorflow/tfjs';

import state from '@/state'

import spawnAlert from '@/alerts'

import Layer from '@/network/layer'
import Neuron from '@/network/neuron'

// Abstract class NeuronLayer acts as a bridge between the general Layer class and specific classes such as Dense layer. It stores the number of neurons and acts as a type checker for some methods that only exists for these layers. Important as a differentation to other possible layer that to not consist of just neurons.
export default abstract class NeuronLayer extends Layer {

    units: Array<Neuron>
    neuronY: number // y coordinate for the neurons

    static LAYER_TYPE: string
    static LAYER_NAME: string
    static DESCRIPTION: string

    constructor({network, inputFrom, units, activation, outputTo, pos}) {
        
        super({network, inputFrom, activation, outputTo, pos})
        
        this.neuronY = this.pos.y

        this.drawLayer()
        
        this.units = []
        for (let unit = 1; unit <= units; unit++) {
            this.addNeuron({})
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
    // add a neuron to the layer
    addNeuron({inputData, outputData}: {inputData?: string, outputData?: string} = {}): Neuron {

        this.network.resetBuild()

        // create a new neuron with a fresh id and specified data and add it to our array of neurons
        const neuron = new Neuron({layer: this, id: this.getFreshNeuronId(), inputData: inputData, outputData: outputData})
        this.units.push(neuron)

        // draw the freshly added neuron
        neuron.draw({canvas: state.canvas, cypos: this.getPositionForUnit(this.units.length - 1)})

        // return the neuron
        return neuron
    }

    setNeurons(units): void {
        if (units >= 1) {
            if (units > this.units.length) {
                for (let unit = this.units.length + 1; unit <= units; unit++) {
                    this.addNeuron({})
                }
            } else if (units < this.units.length) {
                for (let unit = this.units.length; unit > units; unit--) {
                    this.removeNeuron()
                }
            }
            spawnAlert(`The number of neurons has been updated to ${units}!`, 'success')
        } else {
            spawnAlert("This layer needs to contain at least one neuron!", 'danger')
        }
    }

    // remove the last neuron. we can ignore the neuron argument since we generally do not allow the deletion of specific neurons. might be allowed by subclasses of NeuronLayer
    removeNeuron(neuron = null): void {
        if (this.units.length > 1) {
            this.network.resetBuild()
            this.units.pop().remove({canvas: state.canvas})
        } else {
            spawnAlert("Can not remove neuron: This layer needs to contain at least one neuron!", 'danger')
        }
    }

    // create an unused id for a neuron. since we principally allow deletion of any neuron we need to get the maximum id (which is always the last neurons id) and add 1 to be sure to have an unused one
    getFreshNeuronId(): number {
        if (this.units.length) {
            return this.units[this.units.length - 1].id + 1
        } else {
            return 1
        }
    }

    /*
    DRAW LAYER ON CANVAS
    */
    // get the position for a specific unit, starting at 0
    // neuron has been added to our units array beforehand
    // @TODO when duplicating layers, x positions of the duplicated layer to not match
    getPositionForUnit(unit: number): {x: number, y: number} {

        let newX
        if (unit == 0) {

            newX = this.pos.x

        } else {

            // the new x position depends on
            newX = this.pos.x + state.canvas.NEURON_SIZE/2 + state.canvas.NEURON_DISTANCE

            // for each other unit add half of the units size
            if (this.units.length >= 2) newX += (unit) * state.canvas.NEURON_SIZE/2

            // for each other unit except one add half of the distance
            if (this.units.length >= 3) newX += (unit - 1) * state.canvas.NEURON_DISTANCE/2

        }
        
        return {
            x: newX,
            y: this.neuronY
        }
    }

    drawLayer() {

        // remove potentially previously built layer
        let eles = state.canvas.cy.filter((element, i) => {
            return element.isNode() && element.data('type') == 'layer' && element.data('layer') == this.id
        }, this)
        eles.remove()
        
        // add the layer
        state.canvas.cy.add({
            group: 'nodes',
            data: { 
                id: this.getCyId(), 
                label: this.getName(),
                type: 'layer',
                layer: this.id,
                layer_type: `${this.constructor.LAYER_TYPE}`,
            },
            css: {
                "z-index": this.id * 3
            }
        })
    }

    drawConnectionFrom(layer: Layer) {
        for (let neuron of this.units) {
            let source = {layer: layer.id, nodes: layer.getConnectionIds()}
            neuron.drawConnectionFrom({cy: state.canvas.cy, source: source})
        }
    }

    drawConnectionTo(layer: Layer) {
        for (let neuron of this.units) {
            let target = {layer: layer.id, nodes: layer.getConnectionIds()}
            neuron.drawConnectionTo({cy: state.canvas.cy, target: target})
        }
    }
}