import state from '@/state'

import spawnAlert from '@/alerts'

import Layer from '@/network/layer'
import Neuron from '@/network/neuron'

// Abstract class NeuronLayer acts as a bridge between the general Layer class and specific classes such as Dense layer. It stores the number of neurons and acts as a type checker for some methods that only exists for these layers. Important as a differentation to other possible layer that to not consist of just neurons.
export default abstract class NeuronLayer extends Layer {

    units: Array<Neuron>

    static LAYER_TYPE: string
    static LAYER_NAME: string
    static DESCRIPTION: string

    constructor({network, inputFrom, units, activation, outputTo, pos}) {
        
        super({network, inputFrom, activation, outputTo, pos})
        
        this.buildLayer()
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
    addNeuron({inputData, outputData}: {inputData?: string, outputData?: string} = {}): Neuron {
        const neuron = new Neuron({layer: this, id: this.getFreshNeuronId(), inputData: inputData, outputData: outputData})
        this.units.push(neuron)
        neuron.build({cy: state.canvas.cy, cypos: this.getPositionForUnit(this.units.length)})
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
            this.units.pop().remove({cy: state.canvas.cy})
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
    BUILD LAYER FOR CANVAS
    */
    // get the position for a specific unit, starting at 1
    getPositionForUnit(n: number): {x: number, y: number} {
        
        let cypos = Object.create(this.pos)
        cypos.x += state.canvas.LAYER_PADDING + state.canvas.NEURON_SIZE/2
        cypos.y += state.canvas.LAYER_PADDING + state.canvas.NEURON_SIZE/2
        cypos.y += (state.canvas.NEURON_SIZE + state.canvas.NEURON_DISTANCE) * (n-1)
        return cypos
    }

    buildLayer() {

        // remove potentially previously built layer
        let eles = state.canvas.cy.filter((element, i) => {
            return element.isNode() && element.data('type') == 'layer' && element.data('layer') == this.id
        }, this)
        eles.remove()
        
        // add the layer
        state.canvas.cy.add({
            group: 'nodes',
            data: { 
                id: `${this.id}`, 
                label: this.getName(),
                type: 'layer',
                layer: this.id,
                layer_type: `${this.constructor.LAYER_TYPE}`,
            }
        })
    }

    buildConnectionFrom(layer: Layer) {
        for (let neuron of this.units) {
            let source = {layer: layer.id, nodes: layer.getConnectionIds()}
            neuron.drawConnectionFrom({cy: state.canvas.cy, source: source})
        }
    }

    buildConnectionTo(layer: Layer) {
        for (let neuron of this.units) {
            let target = {layer: layer.id, nodes: layer.getConnectionIds()}
            neuron.drawConnectionTo({cy: state.canvas.cy, target: target})
        }
    }
}