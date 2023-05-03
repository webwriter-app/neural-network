import state from '@/state'

import NeuronLayer from '@/network/neuron_layer'
import spawnAlert from '@/alerts'

export default class OutputLayer extends NeuronLayer {

    static LAYER_TYPE: string = "Output"
    static LAYER_NAME: string = "Output layer"
    static DESCRIPTION: string = "An output layer in this simulation is just a normal dense layer, additionally equipped with the ability to output the incoming data out of the network. For classification problems, it is usually combined with a softmax activation function in order to provide a probability distribution."

    // since every output layer can reflect one output we store the inputs name to display it with the name of the layer. important for classification outputs, since the neurons only show the names of the classes and not the overall key term.
    outputData: string | null

    unsubscribe: Function

    constructor({network = state.network, inputFrom = [], activation = "None", outputTo = [], pos = null}) {

        super({network, inputFrom, units: 0, activation, outputTo, pos})

        // add move listener
        this.addMoveListener()

        // handle dataset change
        this.unsubscribe = state.subscribe((key: string, dataset: any, state: State) => {
            this.handleDatasetChange(dataset)
        }, ['dataset'])

        // automatically set the first unassigned dataset output as the input
        this.setOutput(state.dataset.getNonAssignedOutputKeys()[0])
    }

    // overwrite getName for the outputData
    getName(): string {
        if (this.outputData) return `${this.outputData} ${this.constructor.LAYER_NAME} ${this.activation.name != 'None' ? `(${this.activation.name})` : ``}`
        else return super.getName()
    }

    /*
    DATASET
    */
    getAssignedOutput(): string {
        return this.outputData
    }

    assignOutput(outputKey: string): void {
        this.outputData = outputKey
        state.dataset.assignOutputToLayer({key: outputKey, layer: this})

        // redraw the layer so it has the new output key as a label
        this.drawLayer()

        // draw the neuron(s): a single for regression output, once per class for classification output
        const output = state.dataset.getOutputByKey(outputKey)
        if (output.type == "regression") {
            this.addNeuron({outputData: output.key})
        } else if (output.type == "classification") {
            for (const clazz of output.classes) {
                this.addNeuron({outputData: clazz.key})
            }
        }
    }

    setOutput(outputKey: string): void {

        // remove association to previously assigned dataset if exists and different
        if (this.outputData && this.outputData != outputKey) {
            state.dataset.dismissOutput({key: this.outputData})
            this.outputData = null
            for (let index = this.units.length - 1; index >= 0; index--) {
                this.removeNeuron(this.units[index])
            }
        }

        if (outputKey) {
            // assign the new output to this layer
            this.assignOutput(outputKey)
        } else {
            // if no new output was selected delete this layer
            this.delete()
            spawnAlert(`${this.getName()} was deleted because no outputs were assigned`)
        }

        // also update the label of the layer in the canvas
        state.canvas.cy.getElementById(`${this.id}`).data("label", this.getName())
    }

    handleDatasetChange(newDataset) {

        // remove all neurons
        for (let index = this.units.length - 1; index >= 0; index--) {
            this.removeNeuron(this.units[index])
        }
        
        // assign all input data of the new dataset if possible
        if (newDataset) {
            this.assignOutput(newDataset.getNonAssignedOutputKeys()[0])
        }
    }

    /*
    LAYER & NEURONS
    */
    // duplicate layer
    duplicate(): void {
        spawnAlert("Cannot duplicate an output layer since each output is unique. if you wish to have multiple output layers, create a new output layer!")
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

        if (this.outputData) state.dataset.dismissOutput({key: this.outputData})

        this.unsubscribe()
        
        super.delete()
    }
}