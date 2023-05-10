import * as tf from '@tensorflow/tfjs';

import state from '@/state'

import NeuronLayer from '@/network/neuron_layer'

export default class DenseLayer extends NeuronLayer {

    static LAYER_TYPE: string = "Dense"
    static LAYER_NAME: string = "Dense layer"
    static DESCRIPTION: string = "A dense layer, also called fully-connected layer, is a layer whose inside neurons connect to every neuron in the preceding layer."

    constructor({network, inputFrom = [], units = 2, activation = "ReLu", outputTo = [], pos = null}) {

        super({network, inputFrom, units, activation, outputTo, pos})

        this.addMoveListener()
    }

    // duplicate layer
    duplicate(): DenseLayer {
        const height = state.canvas.getHeight(this.getCyId())
        const newPos = {
            x: this.pos.x,
            y: this.pos.y - height - state.canvas.LAYER_DISTANCE
        }
        return new DenseLayer({network: this.network, inputFrom: [this], units: this.units.length, activation: this.activation.name, pos: newPos})
    }

    /*
    BUILD
    */
    build(): void {

        console.log(`Building layer ${this.getName()}`)

        // first check if all connected inputs have been build.
        if (!this.inputFrom.every((input) => input.tensor)) {
            return
        }

        // check if we have multiple inputs.
        let input
        if (this.inputFrom.length > 1) {

            // if there are multiple inputs we concatenate them into one
            input = tf.layers.concatenate({axis : 1, name: `concatinputs-${this.getTensorName()}`}).apply(this.inputFrom.map((input => input.tensor)));
        } else {

            // we know that we must have one input since this method has to have been called from somewhere, so we set the input to the tensor of the first (and single) input of our inputFrom array
            input = this.inputFrom[0].tensor
        }
        console.log(`Input tensor:`)
        console.log(input)

        // lets now create the main tensor
        this.tensor = <tf.SymbolicTensor>tf.layers.dense({units: this.units.length, activation: <tf.ActivationIdentifier>this.activation.identifier, name: this.getTensorName()}).apply(input);
        this.tensor["layer_id"] = this.id

        console.log(`This tensor:`)
        console.log(this.tensor)

        // finally, try to build all connected outputs
        for (const connectedOutput of this.outputTo) {
            connectedOutput.build()
        }
    }
}