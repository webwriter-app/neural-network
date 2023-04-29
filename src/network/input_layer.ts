import state from '@/state'

import NeuronLayer from '@/network/neuron_layer'
import spawnAlert from '@/alerts'

// an input layer is a special type of a neuron layer. We do not allow activation functions and provide methods to assign input data from the dataset to this input layer. We do not allow manual editing of the neurons and other layers can not connect to an input layer. Neurons in the input layer are marked with the name of the associated input
export default class InputLayer extends NeuronLayer {

    static LAYER_TYPE: string = "Input"
    static LAYER_NAME: string = "Input layer"
    static DESCRIPTION: string = "An input layer is a layer that just takes data provided from outside the network and passes it on to the next layer(s)"

    constructor({network = state.network, inputFrom = [], activation = "None", outputTo = [], pos = null}) {

        super({network, inputFrom, units: 0, activation, outputTo, pos})

        // add invisible element with position
        let Ipos = this.getPositionForUnit(1)
        state.canvas.cy.add({
            group: 'nodes', 
            grabbable: false,
            selectable: false,
            data: { 
                id: `${this.id}i`, 
                parent: `${this.id}`, 
                type: 'invisible',
                layer: this.id,
                label: `No data assigned`
            },
            position: {
                x: Ipos.x,
                y: Ipos.y
            }
        })

        this.addMoveListener()
    }

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

        // @TODO right now deletes everything and everything gets added (filtering does not work)
        // determine neurons that need to be removed because their corresponding data input is not in the inputKeys
        const neuronsToRemove = this.units.filter(neuron => !inputKeys.includes(neuron.inputData))
        for (let neuron of neuronsToRemove) {
            this.removeNeuron(neuron)
            state.dataset.dismissInput({key: neuron.inputData})
        }

        // rebuild the remaining neurons to avoid empty space between them
        for (let [index, neuron] of this.units.entries()) {
            neuron.build({cy: state.canvas.cy, cypos: this.getPositionForUnit(index + 1)})
        }

        // determine the inputs that are new and add neurons for them
        const addedInputs = inputKeys.filter(inputKey => !this.units.some(neuron => neuron.inputData == inputKey));
        this.assignInputs(addedInputs)
    }

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
        
        super.delete()
    }
}