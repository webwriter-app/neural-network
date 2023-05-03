import * as tf from '@tensorflow/tfjs';

import state from '@/state'

import Layer from '@/network/layer'
import InputLayer from './input_layer';

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
    getInputLayers() {
        return this.layers.filter(layer => layer instanceof InputLayer)
    }

    // returns the maximum id for layers used in the graph
    getFreshId(): number {
        return this.layers.length
    }

    // add a layer to the network
    addLayer(layer: Layer) {
        this.layers.push(layer)
    }

    // remove a layer from the network. does not delete the layer itself (therfore call the layers delete method which should call this method)
    removeLayer(layerArg: Layer) {
        this.deselect()
        this.layers = this.layers.filter((layer) => layer != layerArg)
    }

    // method to run before deletion (removes all layers which is important for e.g. subscribed events)
    cleanup() {
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
    async build(): Promise<void> {

        // create a model beginning at the input layer(s)
        for (const inputLayer of this.getInputLayers()) {

        }
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

    async train(steps, callback) {

        // first build the network if it has not been already
        if (this.model) {
            try {
                await this.build()
            } catch (err) {
                console.error(err)
            }
        }

        /* // then start the training itsel
        this.model.fit(data, labels, {
                        epochs: 5,
                        batchSize: 32,
                        callbacks: {onBatchEnd}
                }).then(info => {
                        console.log('Final accuracy', info.history.acc);
                }); */
            
    }

    async predict() {

    }
}