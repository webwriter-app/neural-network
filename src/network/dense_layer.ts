import canvasState from '@/state/canvas_state'

import NeuronLayer from '@/network/neuron_layer'

export default class DenseLayer extends NeuronLayer {

    static LAYER_TYPE: string = "Dense"
    static LAYER_NAME: string = "Dense layer"
    static DESCRIPTION: string = "A dense layer is a layer..."

    constructor({inputFrom = [], units = 2, activation = "ReLu", outputTo = [], pos = null}) {

        super({inputFrom: inputFrom, units: units, activation: activation, outputTo: outputTo, pos: pos})

        // add an event listener that updates the position if the layer is moved
        canvasState.canvas.$(`#${this.id}`).on('drag', (e) => {

            const node = e.target
            
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