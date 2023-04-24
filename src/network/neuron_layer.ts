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
        const neuron = new Neuron({layer: this.id, id: this.units.length + 1})
        this.units.push(neuron)
        neuron.build({cypos: this.getPositionForUnit(this.units.length)})
        this.buildConnectionsFor(neuron)
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
                for (let unit = this.units.length; unit > units; unit--) {
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
    getPositionForUnit(n: number): {x: number, y: number} {
        
        let cypos = Object.create(this.pos)
        cypos.x += canvasState.LAYER_PADDING + canvasState.NEURON_SIZE/2
        cypos.y += canvasState.LAYER_PADDING + canvasState.NEURON_SIZE/2
        cypos.y += (canvasState.NEURON_SIZE + canvasState.NEURON_DISTANCE) * (n-1)
        return cypos
    }

    build() {        

        // build the layer
        this.buildLayer()
        
        // build the neurons
        for (let [index, neuron] of this.units.entries()) {
            neuron.build({cypos: this.getPositionForUnit(index)})
        }

        // connect the neurons
        this.buildConnections()
    }

    buildLayer() {

        // remove potentially previously built layer
        let eles = canvasState.canvas.filter((element, i) => {
            return element.isNode() && element.data('type') == 'layer' && element.data('layer') == this.id
        }, this)
        eles.remove()
        
        // add the layer
        canvasState.canvas.add({
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

    buildConnections() {

        // remove potentially previously built connections
        let eles = canvasState.canvas.filter((element, i) => {
            return element.isEdge() && (element.data('sourceLayer') == this.id || element.data('targetLayer') == this.id)
        }, this)
        eles.remove()

        for (let unit of this.units) {
            this.buildConnections(unit)
        }
    }

    buildConnectionsFor(neuron: Neuron) {

        // connect the neuron to the previous layers
        for (let previousLayer of this.inputFrom) {
            let source = {layer: previousLayer.id, nodes: previousLayer.getConnectionIds()}
            neuron.drawConnectionFrom(source)
        }

        // connect the neuron to the outgoing layers
        for (let nextLayer of this.outputTo) {
            let target = {layer: nextLayer.id, nodes: nextLayer.getConnectionIds()}
            neuron.drawConnectionTo(target)
        }
    }

    buildConnectionFrom(layer: Layer) {
        for (let neuron of this.units) {
            let source = {layer: layer.id, nodes: layer.getConnectionIds()}
            neuron.drawConnectionFrom(source)
        }
    }

    removeConnectionFrom(layer: Layer) {
        let eles = canvasState.canvas.filter((element, i) => {
            return element.isEdge() && (element.data('sourceLayer') == layer.id && element.data('targetLayer') == this.id)
        }, this)
        eles.remove()
    }

    buildConnectionTo(layer: Layer) {
        for (let neuron of this.units) {
            let target = {layer: layer.id, nodes: layer.getConnectionIds()}
            neuron.drawConnectionTo(target)
        }
    }

    removeConnectionTo(layer: Layer) {
        let eles = canvasState.canvas.filter((element, i) => {
            return element.isEdge() && (element.data('sourceLayer') == this.id && element.data('targetLayer') == layer.id)
        }, this)
        eles.remove()
    }
}