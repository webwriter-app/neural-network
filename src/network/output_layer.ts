import * as tf from '@tensorflow/tfjs';

import state from '@/state'

import NeuronLayer from '@/network/neuron_layer'
import spawnAlert from '@/alerts'
import DatasetClassificationLabel from '@/types/dataset_classification_label';

export default class OutputLayer extends NeuronLayer {

    static LAYER_TYPE: string = "Output"
    static LAYER_NAME: string = "Output layer"
    static DESCRIPTION: string = "An output layer in this simulation is just a normal dense layer, additionally equipped with the ability to output the incoming data out of the network. For classification problems, it is usually combined with a softmax activation function in order to provide a probability distribution."

    // since every output layer can reflect one output we store the inputs name to display it with the name of the layer. important for classification outputs, since the neurons only show the names of the classes and not the overall key term.
    outputKey: string | null
    outputType: 'regression' | 'classification'

    unsubscribe: Function

    constructor({network, inputFrom = [], activation = "None", outputTo = [], pos = null}) {

        super({network, inputFrom, units: 0, activation, outputTo, pos})

        // add move listener
        this.addMoveListener()

        // handle dataset change
        this.unsubscribe = state.subscribe((key: string, dataset: any, state) => {
            this.handleDatasetChange(dataset)
        }, ['dataset'])

        // automatically set the unassigned output as the input if exists
        this.setOutput(state.dataset.getNonAssignedLabelKey())
    }

    // overwrite getName for the outputKey
    getName(): string {
        if (this.outputKey) return `${this.outputKey} ${this.constructor.LAYER_NAME} ${this.activation.name != 'None' ? `(${this.activation.name})` : ``}`
        else return super.getName()
    }

    /*
    DATASET
    */
    setOutput(outputKey: string): void {

        if (outputKey) {

            // remove all neurons
            for (let index = this.units.length - 1; index >= 0; index--) {
                this.removeNeuron(this.units[index])
            }

            // assign the new output to this layer
            const output = state.dataset.getLabel()
            this.outputKey = output.key
            this.outputType = output.type
            state.dataset.assignLabelToLayer({layer: this})

            // redraw the layer so it has the new output key as a label
            this.drawLayer()

            // draw the neuron(s): a single for regression output, once per class for classification output
            if (this.outputType == "regression") {
                this.addNeuron({outputData: output.key})
            } else if (this.outputType == "classification") {
                for (const clazz of (<DatasetClassificationLabel>output).classes) {
                    this.addNeuron({outputData: clazz.key})
                }
            }

        } else {

            // if no new output was selected delete this layer
            this.delete()
            spawnAlert(`${this.getName()} was deleted because no outputs were assigned`)
        }

        // also update the label of the layer in the canvas
        state.canvas.cy.getElementById(`${this.id}`).data("label", this.getName())
    }

    handleDatasetChange(newDataset) {
        
        // assign the new label to this layer
        if (newDataset) {
            this.setOutput(newDataset.getNonAssignedLabelKey())
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
            neuron.remove({canvas: state.canvas})
        }
    }

    // overwrite delete function to also notify dataset
    delete(): void {

        if (this.outputKey) state.dataset.dismissLabel()

        this.unsubscribe()
        
        super.delete()
    }

    /*
    BUILD
    */
    build(): tf.SymbolicTensor[] {

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

        console.log(`This tensor (returned):`)
        console.log(this.tensor)
    }
}