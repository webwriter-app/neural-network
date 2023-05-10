import * as tf from '@tensorflow/tfjs';

import state from '@/state'

import Layer from '@/network/layer'
import InputLayer from '@/network/input_layer';
import OutputLayer from '@/network/output_layer';
import spawnAlert from '@/alerts';

export default class NeuralNet {

    // playing with the graphical neural net will only result in changes in this layers array
    // e.g. layers[2] contains all layers at level 3 (for a simple feed forward network only 1 but we also allow branching)
    layers: Array<Layer>
    
    model: tf.LayersModel | null

    trainOptions: {
        learningRate: number
        epochs: number
        batchSize: number
        lossFunction: string
        optimizer: string
    }

    constructor() {

        this.layers = []

        this.model = null

        this.trainOptions = {
                learningRate: 0.2,
                epochs: 3,
                batchSize: 50,
                lossFunction: 'meanSquaredError',
                optimizer: 'sgd'
        }
    }

    /* 
    LAYER MANAGEMENT
    */
    getLayerById(id: number): Layer | null {
        for (let layer of this.layers) {
            if (layer.id == id) return layer
        }
        return null
    }
    getLayersByIds(ids: number[]): Layer[] {

        let layers = this.layers.filter(layer => ids.includes(layer.id))

        // only return layers if for every id one layer was found. else, we return null to signal that something went wrong
        if (layers.length == ids.length) {
            return layers
        } else {
            return null
        }
    }
    // get the input layers. important for everything related to training, testing or predicting because the entrypoint is always in these layers
    getInputLayers(): InputLayer[] {
        return <InputLayer[]> this.layers.filter(layer => layer instanceof InputLayer)
    }

    // get the output layer
    getOutputLayer(): OutputLayer {
        return <OutputLayer>this.layers.find(layer => layer instanceof OutputLayer)
    }

    // returns an id currently not in the layer. Since new layers are added in the end of our layers array and always get higher ids than the previous layers, it suffices to take the id of the last layer and add 1 to it to get an unused id
    getFreshId(): number {
        if (!this.layers.length) {
            return 1
        } else {
            return this.layers[this.layers.length - 1].id + 1
        }
    }

    // add a layer to the network
    addLayer(layer: Layer): void {
        this.layers.push(layer)
        this.resetBuild()
    }

    // remove a layer from the network. does not delete the layer itself (therfore call the layers delete method which should call this method)
    removeLayer(layerArg: Layer): void {
        this.deselect()
        this.layers = this.layers.filter((layer) => layer != layerArg)
        this.resetBuild()
    }

    // method to run before deletion (removes all layers which is important for e.g. subscribed events)
    cleanup(): void {
        for (const layer of this.layers) {
            layer.delete()
        }
    }

    /*
    SELECTION
    */
    deselect() {
        state.selected = null
        state.activeLayer = null
        state.activeNeuron = null
        state.activeEdge = null
        state.activeRightPanel = 'network'
    }

    selectLayer({layer}) {
        this.deselect()
        state.activeLayer = layer
        state.selected = 'layer'
        state.activeRightPanel = 'layer'
    }

    selectNeuron({layer = null, neuron}) {
        this.deselect()
        state.activeLayer = layer
        state.activeNeuron = neuron
        state.selected = 'neuron'
        state.activeRightPanel = 'neuron'
    }

    selectEdge({sourceLayer, sourceNeuron = null, targetLayer, targetNeuron = null}) {
        this.deselect()
        state.activeEdge = {
            sourceLayer: sourceLayer,
            sourceNeuron: sourceNeuron,
            targetLayer: targetLayer,
            targetNeuron: targetNeuron
        }
        state.selected = 'edge'
        state.activeRightPanel = 'edge'
    }


    /*
    REAL TRAINING & CO
    */
    resetBuild(): void {

        if (this.model) {
            // remove current model
            this.model = null

            // set the tensors of all layers to null
            for (const layer of this.layers) {
                layer.tensor = null
            }
        }
    }

    build(): boolean {

        console.log("building network")

        this.resetBuild()

        // check if at least one input layer exists
        if (!this.getInputLayers().length) {
            spawnAlert("Your network must contain at least one output layer", "danger")
            return false
        }

        // check if an output layer exists
        if (!this.getOutputLayer()) {
            spawnAlert("Your network must contain at least one output layer", "danger")
            return false
        }

        // create a model beginning at the input layer(s) 
        // layers are built somehow recursively
        for (const inputLayer of this.getInputLayers()) {
            inputLayer.build()
        }

        // check if there is a connected output layer, else abort (might lead to some problems else)
        if (!this.getOutputLayer().tensor) {
            spawnAlert("Make sure to connect all output layers to some input!", "danger")
            this.resetBuild()
            return false
        }

        // get the inputs from the input layers
        const inputs = this.getInputLayers().map((layer) => layer.tensor)

        // get the output from the output layer
        const output = this.getOutputLayer().tensor

        // with the inputs and the outputs available we can build the model
        this.model = tf.model({inputs, outputs: output})

        // finally, compile the model with the configuration (@TODO allow changing configuration in train panel)
        this.model.compile({
            optimizer: 'sgd',
            loss: 'meanSquaredError',
            metrics: ['mse']
        });

        console.log(this.model)

        return true
        // after 
     /*    const input: tf.SymbolicTensor = tf.input({shape: [this.config.inputSize]})

        let output: tf.SymbolicTensor | tf.SymbolicTensor[] = input
        for (let layerConfig of this.config.hiddenLayers) {
                const denseLayer: tf.Dense = tf.layers.dense({units: layerConfig.units, activation: layerConfig.activation});
                output = denseLayer.apply(output)
        }
        this.model = tf.model({inputs: input, outputs: output})

        // compile model
        this.model.compile({loss: this.trainOptions.lossFunction, optimizer: this.trainOptions.optimizer}) */
    }

    async train({steps = 0} = {}): Promise<void> {

        // first build the network if it has not been already
        if (true /*!this.model*/) {
            if (!this.build()) {
                return
            }
        }

        // inputs
        let inputs = []
        for (const inputLayer of this.getInputLayers()) {
            inputs.push(... state.dataset.getInputDataForLayer(inputLayer))
        }

        // labels
        let labels = state.dataset.getLabelData()

        // start the training itself
        this.model.fit(tf.tensor(inputs), tf.tensor(labels), {
                epochs: 10,
                batchSize: 10,
                callbacks: {onBatchEnd: (batch, logs) => {
                    console.log('MSE', logs.mse);
                }}
            }).then(info => {
                console.log('Final MSE', info.history.mse);
            });
            
    }

    async predict() {

    }
}