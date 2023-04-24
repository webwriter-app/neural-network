import * as tf from '@tensorflow/tfjs';

import Layer from '@/network/layer'

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

    constructor({layers = []}) {
        
        // add the specified layers to this net
        this.layers = []
        for (let layer of layers) {
            this.addLayer(layer)
        }

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

        let layers = []
        for (let layer of this.layers) {
            if (ids.includes(layer.id)) layers.push(layer)
        }

        // only return layers if for every id one layer was found. else, we return null to signal that something went wrong
        if (layers.length == ids.length) {
            return layers
        } else {
            return null
        }
    }

    // returns the maximum id for layers used in the graph
    getMaxId(): number {
        let id = 0
        for (let layer of this.layers) {
            id = Math.max(id, layer.id)
        }
        return id
    }

    // add a layer to the network and build it
    addLayer(layer: Layer) {

        // add the layer to the layer array
        this.layers.push(layer)
    }

    // remove a layer from the network. the layer's delete method also handles the removal form the canvas
    removeLayer(layerArg: Layer) {
        layerArg.delete()
        this.layers = this.layers.filter((layer) => layer != layerArg)
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