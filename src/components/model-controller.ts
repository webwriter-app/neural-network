import type { ReactiveController } from 'lit'
import { listen } from './listen'
import type { WebwriterNeuralNetwork } from '../widgets/webwriter-neural-network'
import type { ModelConf, TrainOptions } from '../model/network-types'

import { ModelUtils } from '../model/model-utils'
import { DataSetUtils } from './data-sets/data-set-utils'
import { AlertUtils } from '../model/alert-utils'
import * as tf from '@tensorflow/tfjs'
import { clearCharts, renderHistory } from './charts'

export class ModelController implements ReactiveController {
  host: WebwriterNeuralNetwork

  constructor(host: WebwriterNeuralNetwork) {
    this.host = host
    host.addController(this)
  }

  // HOST LIFECYCLE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  private abort = new AbortController()

  hostConnected() {
    this.abort = new AbortController()
    // add event listeners for model related events on host
    listen<{ option: string; value: string }>(this.host.renderRoot, 'set-train-option', (e) => this.setTrainOption(e.detail.option, e.detail.value), this.abort.signal)
    listen(this.host.renderRoot, 'discard-model', () =>
      this.discardModel(), this.abort.signal)
    listen<number>(this.host.renderRoot, 'train-model', (e) => {
        setTimeout(() => {
          this.trainModel(e.detail)
        }, 0)
      }, this.abort.signal)
    listen<Record<string, number>>(this.host.renderRoot, 'predict-model', (e) => this.predictModel(e.detail), this.abort.signal)
    listen(this.host.renderRoot, 'delete-prediction', () =>
      this.deletePrediction(), this.abort.signal)
  }

  hostDisconnected() {
    this.abort.abort()
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // the container where the metrics are rendered into informs the host about
  // itself when connected. Then, here, a reference to this container is stored
  // to render the metrics into it.
  setTrainMetricsContainer(container: HTMLDivElement) {
    this.host.trainMetricsContainer = container
  }

  // changes a (hyper-)parameter for the training
  setTrainOption(option: string, value: string) {
    this.host.trainOptions[option as keyof TrainOptions] = value
    this.host.trainOptions = {
      ...this.host.trainOptions,
    }
  }

  // discards the current model by deleting the model, deleting the metrics and
  // informing the network so it can also respond to it (remove model
  // references)
  discardModel(): void {
    this.host.modelConf = <ModelConf>(
      JSON.parse(JSON.stringify(ModelUtils.defaultModelConf))
    )
    // empty the container for the metrics. if we did not do this, it would
    // also show the metrics from the previous training
    if (this.host.trainMetricsContainer) {
      clearCharts(this.host.trainMetricsContainer)
    }

    // remove model references (like tensor and weights) in the network
    if (this.host.network) {
      this.host.network.tensorConfs = new Map()
      this.host.networkController.updateLayerConfs()
    }
  }

  // tells the network to build a model and compiles it - usually this method is
  // called when training is started and there is no model yet.
  buildModel(): void {
    this.discardModel()
    const model = this.host.networkController.buildModel()
    if (model && this.host.dataSet) {
      this.host.modelConf.plottedMetrics.push('loss')
      this.host.modelConf.plottedMetrics.push('val_loss')
      if (this.host.dataSet.type == 'regression') {
        this.host.modelConf.loss = 'meanSquaredError'
      } else if (this.host.dataSet.type == 'classification') {
        this.host.modelConf.loss = 'categoricalCrossentropy'
        this.host.modelConf.metrics.push('acc')
        this.host.modelConf.plottedMetrics.push('acc')
        this.host.modelConf.plottedMetrics.push('val_acc')
      }
      this.host.modelConf = { ...this.host.modelConf }
      const optimizer = tf.train.adam(
        parseFloat(this.host.trainOptions.learningRate)
      )
      model.compile({
        optimizer,
        loss: this.host.modelConf.loss!,
        metrics: this.host.modelConf.metrics,
      })
      this.host.modelConf.model = model
      AlertUtils.spawn({
        message: this.host.msg('The model was successfully compiled! All hyperparameter and network architecture changes were taken into account!'),
        variant: 'success',
        icon: 'check-circle',
      })
      this.host.modelConf = { ...this.host.modelConf }
    }
  }

  // trains the model for a specific number of epochs by performing the training
  // itself but also handing training data to the network during the training to
  // visualize it and update the metrics
  trainModel(epochs: number): void {
    // first build the model if it does not exist
    if (!this.host.modelConf.model) {
      this.buildModel()
    }

    // now we should have a model and can start training
    const model = this.host.modelConf.model
    if (model) {
      // add the number of epochs we want to train to the total epoch count
      this.host.modelConf.totalEpochs += epochs

      // set training state
      this.host.modelConf.isTraining = true

      // save the changes
      this.host.modelConf = { ...this.host.modelConf }

      // inputs
      const inputs: tf.Tensor[] = []
      for (const inputLayer of this.host.network!.getInputLayers()) {
        const inputData: number[][] = []
        inputData.push(
          ...DataSetUtils.getFeatureDataByKeys(
            this.host.dataSet,
            inputLayer.conf.featureKeys
          )
        )
        inputs.push(tf.tensor(inputData))
      }

      // label tensor depends on regression vs classification type
      const labelData: number[] = DataSetUtils.getLabelData(this.host.dataSet)
      let labels: tf.Tensor
      if (this.host.dataSet.type == 'regression') {
        labels = tf.tensor(labelData)
      } else if (
        this.host.dataSet.type == 'classification' &&
        this.host.dataSet.labelDesc.classes
      ) {
        labels = tf.oneHot(
          tf.tensor(labelData, undefined, 'int32'),
          this.host.dataSet.labelDesc.classes.length
        )
      } else {
        return
      }

      renderHistory(
        this.host.trainMetricsContainer,
        this.host.modelConf.history,
        ['loss', 'val_loss', 'val_acc', ...this.host.modelConf.metrics],
        'Epoch'
      )


      // start the training itself
      void model
        .fit(inputs, labels, {
          epochs: this.host.modelConf.totalEpochs,
          batchSize: parseInt(this.host.trainOptions.batchSize),
          validationSplit: 0.1,
          callbacks: [
            {
              onBatchEnd: (batch: number) => {
                // update the act batch var (for displaying purposes)
                this.host.modelConf.actBatch = batch + 1
                // update the weights to be displayed in the neurons
                this.host.networkController.updateWeights(
                  model.getWeights()
                )
                // update the model to reflect all changes
                this.host.modelConf = {
                  ...this.host.modelConf,
                }
              },
              onEpochEnd: (epoch: number, logs?: tf.Logs) => {
                this.host.modelConf.actEpoch = epoch + 1
                if (logs) this.host.modelConf.history.push(logs)
                this.host.modelConf = {
                  ...this.host.modelConf,
                }
                renderHistory(
        this.host.trainMetricsContainer,
        this.host.modelConf.history,
        ['loss', 'val_loss', 'val_acc', ...this.host.modelConf.metrics,],
        'Epoch'
      )
              },
            },
          ],
          initialEpoch: this.host.modelConf.actEpoch,
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          this.host.modelConf.isTraining = false
          this.host.modelConf = {
            ...this.host.modelConf,
          }
        })
    }
  }

  // predict a label based on a input object
  predictModel(inputObject: Record<string, number>): void {
    // inputs
    const inputs: tf.Tensor[] = []
    for (const inputLayer of this.host.network!.getInputLayers()) {
      const inputData: number[] = []
      Object.keys(inputObject).forEach((featureKey) => {
        if (inputLayer.conf.featureKeys.includes(featureKey)) {
          inputData.push(inputObject[featureKey])
        }
      })
      inputs.push(tf.tensor([inputData]))
    }
    const model = this.host.modelConf.model
    if (!model) return
    const predictedTensor = <tf.Tensor>model.predict(inputs)
    const predictedArray = <number[]>predictedTensor.arraySync()
    this.host.modelConf.predictedValue = predictedArray[0]
    this.host.modelConf = { ...this.host.modelConf }
  }

  // deletes the current prediction - this is used to be able to make a new
  // prediction request
  deletePrediction(): void {
    this.host.modelConf.predictedValue = null
    this.host.modelConf = { ...this.host.modelConf }
  }
}
