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

    _cy // cytoscape canvas reference
    
    /* playing with the graphical neural net and any other options will only result in changes in the config.
       the model will be 'null' up until the training is started. that will prevent any changes to the
       config. if changes are made nonetheless, the model is set back to null and training progress is lost */
    config: {
      inputSize: number
      hiddenLayers: Array<{units: number, activation: tf.ActivationIdentifier}>
      outputSize: number
    }
    subnetworks: Array<{
      name: string,
      inputSize: number,
      layers: Array<{
        type: string,
        units: number
        activation?: string
      }>
    }>
    
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
        // split
        this.subnetworks = [
            {
                name: "Feedforward Network",
                inputSize: 2,
                layers: [
                    {
                        type: 'dense',
                        units: 3,
                        activation: 'ReLu'
                    },
                    {
                        type: 'dense',
                        units: 4,
                        activation: 'ReLu'
                    },
                    {
                        type: 'output',
                        units: 2
                    },
                ]
            }
        ]
        this.trainData = 'TODO'
        this.trainOptions = {
            learningRate: 0.2,
            epochs: 3,
            batchSize: 50,
            lossFunction: 'meanSquaredError',
            optimizer: 'sgd'
        }
    }

    /* returns the number of layers (excluding input and including output layer)
    */
    getNumberOfLayers(): number {
        return 1
    }
    getMaxNumberOfNeuronsPerLayer(): number {
        let actSize = Math.max(this.config.inputSize, this.config.outputSize)
        for (let layer of this.config.hiddenLayers) {
            if (layer.units > actSize) actSize = layer.units
        }
        return actSize
    }

    /*
    EDITING
    */
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
                layer = {... this.config.hiddenLayers[indexToCopy - 1]}
            }
            this.config.hiddenLayers.splice(indexToInsert, 0, layer)
        }

        this.buildGraph()
    }

    addNeuronToLayer(layer: number) {
        if (layer == 0) this.config.inputSize++
        else if (layer > 0 && layer < this.config.hiddenLayers.length + 1) this.config.hiddenLayers[layer - 1].units++
        else if (layer == this.config.hiddenLayers.length + 1) this.config.outputSize++

        console.log(layer)
        this.buildGraph()
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
    
        // build cytoscape graph based on data in the net class
        let maxSize = this.getMaxNumberOfNeuronsPerLayer()
        let rows = maxSize * 2 - 1
        let actColumn = 1
        let actRow
    
        // input layer
        actRow = 1 + (rows - this.config.inputSize)
        this._cy.add({
          group: 'nodes', 
          data: { 
            id: '0', 
            type: 'layer', 
            layer: 0
          }
        })
        for (let i = 0; i < this.config.inputSize; i++) {
          this._cy.add({
            group: 'nodes', 
            data: { 
              id: `0-${i}`, 
              parent: '0', 
              type: 'neuron', 
              inlayer: 0
            }, 
            position: {
              x: actColumn * COLUMN_SCALE,
              y: actRow * ROW_SCALE
            }
          })
          actRow += 2
        }
        actColumn += 1
        
        // hidden layers
        for (let layer = 0; layer < this.config.hiddenLayers.length; layer++) {
          actRow = 1 + (rows - this.config.hiddenLayers[layer].units)
          this._cy.add({
            group: 'nodes', 
            data: { 
              id: `${layer + 1}`, 
              type: 'layer', 
              layer: layer + 1
            }
          })
          for (let i = 0; i < this.config.hiddenLayers[layer].units; i++) {
            this._cy.add({
              group: 'nodes', 
              data: { 
                id: `${layer + 1}-${i}`, 
                parent: `${layer + 1}`, 
                type: 'neuron', 
                inlayer: layer + 1
              }, 
              position: {
                x: actColumn * COLUMN_SCALE, 
                y: actRow * ROW_SCALE
              }
            })
            actRow += 2
          }
          actColumn +=1
        }
    
        // output layer
        actRow = 1 + (rows - this.config.outputSize)
        this._cy.add({
          group: 'nodes', 
          data: { 
            id: `${this.config.hiddenLayers.length + 1}`, 
            type: 'layer', 
            layer: this.config.hiddenLayers.length + 1
          }
        })
        for (let i = 0; i < this.config.outputSize; i++) {
          this._cy.add({
            group: 'nodes', 
            data: { 
              id: `${this.config.hiddenLayers.length + 1}-${i}`, 
              parent: `${this.config.hiddenLayers.length + 1}`, 
              type: 'neuron', 
              inlayer: this.config.hiddenLayers.length + 1
            }, 
            position: {
              x: actColumn * COLUMN_SCALE, 
              y: actRow * ROW_SCALE
            }
          })
          actRow += 2
        }
    
        // connections
        let currentLayerNodes = this._cy.nodes().filter((node) => {
          return node.data('inlayer') == 0
        })
    
        let nextLayerNodes
        for (let layer = 1; layer < this.config.hiddenLayers.length + 2; layer++) {
    
          nextLayerNodes = this._cy.nodes().filter((node) => {
            return node.data('type') == 'neuron' && node.data('inlayer') == layer
          })
    
          for (let currentLayerNode of currentLayerNodes) {
            for (let nextLayerNode of nextLayerNodes) {
              this._cy.add({
                group: 'edges', 
                data: {
                  id: `${currentLayerNode.data('id')}-${nextLayerNode.data('id')}`, 
                  source: currentLayerNode.data('id'), 
                  target: nextLayerNode.data('id')
                }
              })
            }
          }
    
          currentLayerNodes = nextLayerNodes
        }
    
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
  
const nn = new NeuralNet()
export default nn