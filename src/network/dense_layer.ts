import canvasState from '@/state/canvas_state'

import NeuronLayer from '@/network/neuron_layer'

export default class DenseLayer extends NeuronLayer {

    static LAYER_TYPE: string = "Dense"
    static LAYER_NAME: string = "Dense layer"
    static DESCRIPTION: string = "A dense layer, also called fully-connected layer, is a layer whose inside neurons connect to every neuron in the preceding layer."

    constructor({inputFrom = [], units = 2, activation = "ReLu", outputTo = [], pos = null}) {

        super({inputFrom: inputFrom, units: units, activation: activation, outputTo: outputTo, pos: pos})

        // add an event listener that updates the position if the layer is moved
        canvasState.canvas.$(`#${this.id}`).on('drag', (e) => {

            const node = e.target
            const cyPos = node.position()
            this.updatePos({x: cyPos.x, y: cyPos.y, w: node.outerWidth(), h: node.outerHeight()})
        })
    }

    // duplicate layer
    duplicate(): DenseLayer {
        const width = canvasState.getWidth(this.id)
        const newPos = {
            x: this.pos.x + width + canvasState.LAYER_DISTANCE,
            y: this.pos.y
        }
        return new DenseLayer({inputFrom: [this], units: this.units.length, activation: this.activation, pos: newPos})
    }
}