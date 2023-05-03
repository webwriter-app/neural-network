import { State } from '@lit-app/state'
import state from '@/state'

import NeuronLayer from '@/network/neuron_layer'
import spawnAlert from '@/alerts'

// an input layer is a special type of a neuron layer. We do not allow activation functions and provide methods to assign input data from the dataset to this input layer. We do not allow manual editing of the neurons and other layers can not connect to an input layer. Neurons in the input layer are marked with the name of the associated input
export default class InputLayer extends NeuronLayer {

    static LAYER_TYPE: string = "Input"
    static LAYER_NAME: string = "Input layer"
    static DESCRIPTION: string = "An input layer is a layer that just takes data provided from outside the network and passes it on to the next layer(s)"

    unsubscribe: Function

    constructor({network = state.network, inputFrom = [], activation = "None", outputTo = [], pos = null}) {

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

    // overwrite getName function because activation function is always 'None' for input layer
    getName(): string {
        return `${this.id} • ${this.constructor.LAYER_NAME}`
    }

    /*
    DATASET
    */
    // assigning inputs
    getAssignedInputs(): string[] {
        return this.units.map(unit => unit.inputData)
    }

    assignInputs(inputKeys: string[]): void {

        // add new neurons for every assigned data input
        for (let inputKey of inputKeys) {
            state.dataset.assignInputToLayer({key: inputKey, layer: this})
            this.addNeuron({inputData: inputKey})
        }
    }

    // same as assignInputs but in this case it might be that inputs have been removed
    setInputs(inputKeys: string[]): void {

        if (inputKeys.length) {
            // determine neurons that need to be removed because their corresponding data input is not in the inputKeys
            const neuronsToRemove = this.units.filter(neuron => !inputKeys.includes(neuron.inputData))

            for (let neuron of neuronsToRemove) {
                this.removeNeuron(neuron)
                state.dataset.dismissInput({key: neuron.inputData})
            }

            // redraw the remaining neurons to avoid empty space between them
            for (let [index, neuron] of this.units.entries()) {
                neuron.draw({cy: state.canvas.cy, cypos: this.getPositionForUnit(index + 1)})
            }

            // determine the inputs that are new and add neurons for them
            const addedInputs = inputKeys.filter(inputKey => !this.units.some(neuron => neuron.inputData == inputKey));
            this.assignInputs(addedInputs)

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
    LAYER AND NEURONS
    */
    // duplicate layer
    duplicate(): void {
        spawnAlert("Cannot duplicate an input layer since each data item can only be assigned to one input neuron. if you wish to have multiple input layers, create a new input layer!")
    }

    // overwrite remove layer method to allow deletion of every (even the last remaining) neuron
    removeNeuron(neuron = null): void {

        if (this.units.length > 0 && neuron) {
            const index = this.units.indexOf(neuron)
            this.units.splice(index, 1)
            neuron.remove({cy: state.canvas.cy})
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
}