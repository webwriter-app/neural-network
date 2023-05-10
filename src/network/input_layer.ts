import * as tf from '@tensorflow/tfjs';

import { State } from '@lit-app/state'
import state from '@/state'

import NeuronLayer from '@/network/neuron_layer'
import Layer from '@/network/layer'

import spawnAlert from '@/alerts'

// an input layer is a special type of a neuron layer. We do not allow activation functions and provide methods to assign input data from the dataset to this input layer. We do not allow manual editing of the neurons and other layers can not connect to an input layer. Neurons in the input layer are marked with the name of the associated input
export default class InputLayer extends NeuronLayer {

    static LAYER_TYPE: string = "Input"
    static LAYER_NAME: string = "Input layer"
    static DESCRIPTION: string = "An input layer is a layer that just takes data provided from outside the network and passes it on to the next layer(s)"

    unsubscribe: Function

    constructor({network, inputFrom = [], activation = "None", outputTo = [], pos = null}) {

        super({network, inputFrom, units: 0, activation, outputTo, pos})

        // add move listener
        this.addMoveListener()

        // handle dataset change
        this.unsubscribe = state.subscribe((key: string, dataset: any, state: State) => {
            this.handleDatasetChange(dataset)
        }, ['dataset'])

        // for simplicity, we assign all inputs to the input layer at creation.
        this.setInputs(state.dataset.getNonAssignedInputKeys())
    }

    /*
    LAYER AND NEURONS
    */
    // overwrite getName function because activation function is always 'None' for input layer
    getName(): string {
        return `${this.id} - ${this.constructor.LAYER_NAME}`
    }

    // duplicate layer
    duplicate(): void {
        spawnAlert("Cannot duplicate an input layer since each data item can only be assigned to one input neuron. if you wish to have multiple input layers, create a new input layer!")
    }

    // overwrite remove layer method to allow deletion of every (even the last remaining) neuron
    removeNeuron(neuron = null): void {

        this.network.resetBuild()

        if (this.units.length > 0 && neuron) {
            const index = this.units.indexOf(neuron)
            this.units.splice(index, 1)
            neuron.remove({canvas: state.canvas})
        }
    }

    // overwrite delete function to also notify dataset
    delete(): void {

        // notify dataset to dismiss the layer from the input
        for (const neuron of this.units) {
            if (neuron.inputData) state.dataset.dismissInput({key: neuron.inputData})
        }

        // unscribe from dataset change event
        this.unsubscribe()
        
        super.delete()
    }

    /*
    DATASET
    */
    // assigning inputs
    getAssignedInputs(): string[] {
        return this.units.map(unit => unit.inputData)
    }

    private assignInputs(inputKeys: string[]): void {

        // add new neurons for every assigned data input
        for (let inputKey of inputKeys) {
            state.dataset.assignInputToLayer({key: inputKey, layer: this})
            this.addNeuron({inputData: inputKey})
        }
    }

    // same as assignInputs but in this case it might be that inputs have been removed
    setInputs(inputKeys: string[]): void {

        this.network.resetBuild()

        if (inputKeys.length) {

            // remove all neurons
            for (let index = this.units.length - 1; index >= 0; index--) {
                state.dataset.dismissInput({key: this.units[index].inputData})
                this.removeNeuron(this.units[index])
            }

            // add the units for the new inputs keys
            this.assignInputs(inputKeys)

        } else {

            // if we assign no input we delete this layer because we always want at least one input
            spawnAlert(`${this.getName()} was deleted because no inputs were assigned`)
            this.delete()
        }
    }

    handleDatasetChange(newDataset) {
        // remove all neurons
        for (let index = this.units.length - 1; index >= 0; index--) {
            this.removeNeuron(this.units[index])
        }
        // assign all input data of the new dataset if possible
        if (newDataset) {
            this.assignInputs(newDataset.getNonAssignedInputKeys())
        }
    }

    /*
    BUILD
    */
    build(): void {

        console.log(`Building layer ${this.getName()}`)

        //  create our input tensor
        this.tensor = tf.input({shape: [this.units.length], name: this.getTensorName()});
        this.tensor["layer_id"] = this.id
        console.log(`This input tensor:`)
        console.log(this.tensor)

        // try to build all connected outputs
        for (const connectedOutput of this.outputTo) {
            connectedOutput.build()
        }
    }
}