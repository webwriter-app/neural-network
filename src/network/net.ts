import * as tf from '@tensorflow/tfjs';

import spawnAlert from '@/alerts'

import canvasState from '@/state/canvas_state'

import Layer from '@/network/layer'

export default class NeuralNet {

    // playing with the graphical neural net will only result in changes in this layers array
    // e.g. layers[2] contains all layers at level 3 (for a simple feed forward network only 1 but we also allow branching)
    layers: Array<Layer>
    
    model: tf.LayersModel | null

    // during the build process
    buildQueue: Array<{layer: Layer, level: number}>

    trainOptions: {
        learningRate: number
        epochs: number
        batchSize: number
        lossFunction: string
        optimizer: string
    }

    constructor({layers}) {
        this.layers = layers

        this.model = null

        this.buildQueue = []

        this.trainOptions = {
                learningRate: 0.2,
                epochs: 3,
                batchSize: 50,
                lossFunction: 'meanSquaredError',
                optimizer: 'sgd'
        }

        // finally build the graph for the freshly created network. We need to check if the canvas does exist beforehand because
        // if not that means we can not build right now because the application has just started and the canvas needs to be
        // initialized. This is no problem, however, because the canvas manually triggers a build itself right after the 
        // initialization has been finished
        if(canvasState.canvas) {
            this.buildGraph()
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

    // returns the maximum id for layers used in the graph
    getMaxId(): number {
        let id = 0
        for (let layer of this.layers) {
            id = Math.max(id, layer.id)
        }
        return id
    }

    /*
    VISUALIZATION
    */
    buildGraph() {

        // remove the potentially previously built graph if it exists
        if(canvasState.canvas.$().length) {
            spawnAlert("Canvas has been overwritten and rebuilt!", "success")
            canvasState.clear()
        }

        // set the built option to false on all layers
        for (let layer of this.layers) {
            layer.built = false
        }

        // find the layers without an input and call their build function. these layers probably add other layers to the build queue
        let inputLayers = this.layers.filter(layer => !layer.inputFrom.length)
        for (let layer of inputLayers) {

            layer.buildGraph({net: this, level: 0})
        }

        // since the input layers should have added other layers to the buildQueue, so we iteratively build these layers in the Queue
        for (let {layer, level} of this.buildQueue) {
            layer.buildGraph({net: this, level: level})
        }

        // after all elements have been added to the graph we make the graph fit to the viewport
        canvasState.fit()
    }

    /*
    REAL TRAINING & CO
    */
    /* async build(): Promise<void> {

        // create model based on config
        const input: tf.SymbolicTensor = tf.input({shape: [this.config.inputSize]})

        let output: tf.SymbolicTensor | tf.SymbolicTensor[] = input
        for (let layerConfig of this.config.hiddenLayers) {
                const denseLayer: tf.Dense = tf.layers.dense({units: layerConfig.units, activation: layerConfig.activation});
                output = denseLayer.apply(output)
        }
        this.model = tf.model({inputs: input, outputs: output})

        // compile model
        this.model.compile({loss: this.trainOptions.lossFunction, optimizer: this.trainOptions.optimizer})
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

        // then start the training itsel
        this.model.fit(data, labels, {
                        epochs: 5,
                        batchSize: 32,
                        callbacks: {onBatchEnd}
                }).then(info => {
                        console.log('Final accuracy', info.history.acc);
                });
            
    }

    async predict() {

    } */
}