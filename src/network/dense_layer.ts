import state from '@/state'

import NeuronLayer from '@/network/neuron_layer'

export default class DenseLayer extends NeuronLayer {

    static LAYER_TYPE: string = "Dense"
    static LAYER_NAME: string = "Dense layer"
    static DESCRIPTION: string = "A dense layer, also called fully-connected layer, is a layer whose inside neurons connect to every neuron in the preceding layer."

    constructor({network = state.network, inputFrom = [], units = 2, activation = "ReLu", outputTo = [], pos = null}) {

        super({network, inputFrom, units, activation, outputTo, pos})

        this.addMoveListener()
    }

    // duplicate layer
    duplicate(): DenseLayer {
        const height = state.canvas.getHeight(this.id)
        const newPos = {
            x: this.pos.x,
            y: this.pos.y - height - state.canvas.LAYER_DISTANCE
        }
        return new DenseLayer({inputFrom: [this], units: this.units.length, activation: this.activation.name, pos: newPos})
    }
}