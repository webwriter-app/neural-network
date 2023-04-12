import * as tf from '@tensorflow/tfjs';
/* 
// Generate some synthetic data for training.
const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

// Train the model using the data.
model.fit(xs, ys, {epochs: 10}).then(() => {
  // Use the model to do inference on a data point the model hasn't seen before:
  model.predict(tf.tensor2d([5], [1, 1])).print();
  // Open the browser devtools to see the output
});
 */
class NeuralNet {
    
    /* playing with the graphical neural net and any other options will only result in changes in the config.
       the model will be 'null' up until the training is started. that will prevent any changes to the
       config. if changes are made nonetheless, the model is set back to null and training progress is lost */
    config: {
        inputSize: number
        hiddenLayers: Array<{units: number, activation: tf.ActivationIdentifier}>
        outputSize: number
    }
    model: tf.LayersModel | null

    trainData: Object

    trainOptions: {
        learningRate: number
        epochs: number
        batchSize: number
        lossFunction: string
        optimizer: string
    }

    constructor() {
        this.model = null
        this.config = {
            inputSize: 1,
            hiddenLayers: [{units: 3, activation: 'ReLu'},{units: 4, activation: 'ReLu'}],
            outputSize: 2
        }
        this.trainData = 'TODO'
        this.trainOptions = {
            learningRate: 0.2,
            epochs: 3,
            batchSize: 50,
            lossFunction: 'meanSquaredError',
            optimizer: 'sgd'
        }
    }

    getMaxNumberOfNeuronsPerLayer(): number {
        let actSize = Math.max(this.config.inputSize, this.config.outputSize)
        for (let layer of this.config.hiddenLayers) {
            if (layer.units > actSize) actSize = layer.units
        }
        return actSize
    }

    /* adds a layer after the specified layer index. note: the input layer is index 0, hidden layers start with index 1
       copies the settings (units, activation, ...) of the 'after' layer
    */
    insertLayer({before = null, after = null}={}): void {
        let indexToCopy, indexToInsert
        if (before && before > 0 && before <= this.config.hiddenLayers.length + 1) {
            indexToCopy = before
            indexToInsert = before - 1
        }
        else if (after && after >= 0 && after < this.config.hiddenLayers.length + 1) {
            indexToCopy = after
            indexToInsert = after
        }
        if(indexToCopy) {
            let layer
            if (indexToCopy == 0) {
                layer = {units: this.config.inputSize, activation: 'ReLu'}
            } else if (indexToCopy == this.config.hiddenLayers.length + 1) {
                layer = {units: this.config.outputSize, activation: 'ReLu'}
            } else {
                layer = this.config.hiddenLayers[after - 1]
            }
            this.config.hiddenLayers.splice(indexToInsert, 0, layer)
        }
    }

    addNeuronToLayer(layer: number) {
        if (layer == 0) this.config.inputSize++
        else if (layer > 0 && layer < this.config.hiddenLayers.length + 1) this.config.hiddenLayers[layer - 1].units++
        else if (layer == this.config.hiddenLayers.length + 1) this.config.outputSize++
    }

    async build(): Promise<void> {

        // create model based on config
        const input: tf.SymbolicTensor = tf.input({shape: [this.config.inputSize]})

        let output: tf.SymbolicTensor | tf.SymbolicTensor[] = input
        for (let layerConfig of this.config.hiddenLayers) {
            const denseLayer: tf.Dense = tf.layers.dense({units: layerConfig.units, activation: layerConfig.activation});
            output = denseLayer.apply(output)
        }
        this.model = tf.model({inputs: input, outputs: output})

        /* COMPILE MODEL */
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

    }
  }
  
const nn = new NeuralNet()
export default nn