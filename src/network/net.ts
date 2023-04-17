import * as tf from '@tensorflow/tfjs';
import spawnAlert from '@/alerts'

import Activation from '@/types/activation'
import Entity from '@/types/entity'
import FeedForwardEntity from '@/network/feedforward-entity'


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
export class NeuralNet {

    // cytoscape canvas reference
    _cy
    
    // playing with the graphical neural net and any other options will only result in changes in this entities
    // object. the model will be 'null' up until the training is started. that will prevent any changes to the
    // config. if changes are made nonetheless, the model is set back to null and training progress is lost
    entities: Array<Entity>
    
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

        this.entities = [new FeedForwardEntity({
            name: "ff1",
            inputFrom: null,
            inputSize: 1,
            layers: [
                {
                    type: 'dense',
                    units: 3,
                    activation: Activation.ReLu
                },
                {
                    type: 'dense',
                    units: 4,
                    activation: Activation.ReLu
                },
                {
                    type: 'softmax',
                    units: 2,
                    activation: Activation.Sigmoid
                }
            ],
            outputTo: null
        })]

        this.trainData = 'TODO'
        this.trainOptions = {
                learningRate: 0.2,
                epochs: 3,
                batchSize: 50,
                lossFunction: 'meanSquaredError',
                optimizer: 'sgd'
        }
    }

    getEntityByName(name: string): Entity | null {
        for (let entity of this.entities) {
            if (entity.name == name) return entity
        }
        return null
    }

    /*
    VISUALIZATION
    */
    setCanvas(cy) {
        this._cy = cy
    }
    getCanvas() {
        return this._cy
    }
    zoomOutCanvas() {
        if(this.getCanvas()) {
            this.getCanvas().zoom(this.getCanvas().zoom() - 0.1)
        }
    }
    fitCanvas() {
        if(this.getCanvas()) {
            this.getCanvas().fit(this.getCanvas().$(), 50) // fit the graph to all elements with a padding of 50 pixels
        }
    }
    zoomInCanvas() {
        if(this.getCanvas()) {
            this.getCanvas().zoom(this.getCanvas().zoom() + 0.1)
        }
    }

    buildGraph() {

        const COLUMN_SCALE = 300
        const ROW_SCALE = 100

        // remove the potentially previously built graph
        this._cy.remove('node')

        /***********************************/
        /*************  ENTITY  ************/
        /***********************************/
        // loop through all the entities
        for (let entity of this.entities) {

            // add the entity itself
            this._cy.add({
                group: 'nodes', 
                data: { 
                    id: `entity:${entity.name}`,
                    type: 'entity'
                }
            })

            // if entity has type 'FeedForwardEntity'
            if (entity instanceof FeedForwardEntity) {

                entity.buildGraph(this._cy)

            } else {
                // other possible entities (like single neurons) here
            }
        }

        // after all elements have been added to the graph we make the graph fit to the viewport
        this.fitCanvas()
    }

    /*
    REAL TRAINING & CO
    */
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
    
export const net = new NeuralNet()