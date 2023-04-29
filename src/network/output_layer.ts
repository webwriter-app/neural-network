import state from '@/state'

import NeuronLayer from '@/network/neuron_layer'
import spawnAlert from '@/alerts'

export default class OutputLayer extends NeuronLayer {

    static LAYER_TYPE: string = "Output"
    static LAYER_NAME: string = "Output layer"
    static DESCRIPTION: string = "An output layer in this simulation is just a normal dense layer, additionally equipped with the ability to output the incoming data out of the network. For classification problems, it is usually combined with a softmax activation function in order to provide a probability distribution."

    // since every output layer can reflect one output we store the inputs name to display it with the name of the layer. important for classification outputs, since the neurons only show the names of the classes and not the overall key term.
    outputData: string | null

    constructor({network = state.network, inputFrom = [], activation = "None", outputTo = [], pos = null}) {

        super({network, inputFrom, units: 0, activation, outputTo, pos})

        // automatically set the first unassigned dataset output as the input
        this.setOutput(state.dataset.getNonAssignedOutputKeys()[0])

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

    // overwrite getName for the outputData
    getName(): string {
        if (this.outputData) return `${this.outputData} ${this.constructor.LAYER_NAME} (${this.activation.name})`
        else return super.getName()
    }

    // assigning inputs
    getAssignedOutput(): string {
        return this.outputData
    }

    setOutput(outputKey: string): void {

        // remove association to previously assigned dataset if exists
        if (this.outputData) {
            state.dataset.dismissOutput({key: this.outputData})
            this.outputData = null
            for (let index = this.units.length - 1; index >= 0; index--) {
                this.removeNeuron(this.units[index])
            }
        }

        // might be that the current output was only removed but no new output was selected
        if (outputKey) {
            // assign the new output to this layer
            this.outputData = outputKey
            state.dataset.assignOutputToLayer({key: outputKey, layer: this})

            // build the neuron(s): a single for regression output, once per class for classification output
            const output = state.dataset.getOutputByKey(outputKey)
            if (output.type == "regression") {
                this.addNeuron({outputData: output.key})
            } else if (output.type == "classification") {
                for (const clazz of output.classes) {
                    this.addNeuron({outputData: clazz.key})
                }
            }
        }

        // also update the label of the layer in the canvas
        state.canvas.cy.getElementById(`${this.id}`).data("label", this.getName())
    }

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
        
        super.delete()
    }
}