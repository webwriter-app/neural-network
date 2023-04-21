import idState from '@/state/id_state'

import Activation from '@/types/activation'

export default abstract class Layer {
    id: number
    inputFrom: Array<Layer>
    activation: Activation
    outputTo: Array<Layer>

    // since some layers can have multiple input layers and layers call the build function of their 
    built: boolean 

    // a type and description that is displayed as an info for the layer
    static LAYER_TYPE: string
    static LAYER_NAME: string
    static DESCRIPTION: string

    constructor({inputFrom: inputFrom, activation: activation}) {
        this.id = idState.getFreshId()
        this.inputFrom = inputFrom
        this.outputTo = []
        this.activation = activation
        this.built = false
    
        // notify all the inputs
        for (let input of this.inputFrom) {
            this.notifyInput(input)
        }
    }

    // each subclass should specify a function that returns an array of cytoscape node ids that should be connected to other allow to allow flexibility in whether connecting the layer as a whole, all neurons in the layer or anything other
    abstract getConnectionIds(): Array<string>

    // when we construct a layer we usually specify its input and not the output. To notify the layer that inputs its data into this layer, we call the notifyInput method which calls the addOutput method in the layer that acts as the input
    notifyInput(input: Layer) {
        input.addOutput(this)
    }
    addOutput(output: Layer) {
        this.outputTo.push(output)
    }

    // each subclass should specify a buildGraph method that adds nodes and edges to the canvas
    abstract buildGraph({net, level}: {net, level: number})

    // subclasses should call shouldBuild() at the beginning of the build function. it checks whether all inputs have been built and returns false otherwise.
    shouldBuild() {
        return this.inputFrom.every(input => input.built)
    }
}