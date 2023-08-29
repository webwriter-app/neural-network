import type { ReactiveController } from 'lit'
import type { WwDeepLearning } from '@/app'
import type { ModelConf } from '@/types/model_conf'

import { ModelUtils } from '@/utils/model_utils'
import { DataSetUtils } from '@/utils/data_set_utils'
import { AlertUtils } from '@/utils/alert_utils'
import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'

export class ModelController implements ReactiveController {
  host: WwDeepLearning

  constructor(host: WwDeepLearning) {
    this.host = host
    host.addController(this)
  }

  hostConnected() {
    this.host.renderRoot.addEventListener(
      'set-train-option',
      (
        e: CustomEvent<{
          option: string
          value: string
        }>
      ) => this.setTrainOption(e.detail.option, e.detail.value)
    )
    this.host.renderRoot.addEventListener('discard-model', (_e: Event) =>
      this.discardModel()
    )
    this.host.renderRoot.addEventListener(
      'train-model',
      (e: CustomEvent<number>) => this.trainModel(e.detail)
    )
    this.host.renderRoot.addEventListener(
      'predict-model',
      (e: CustomEvent<Record<string, number>>) => this.predictModel(e.detail)
    )
    this.host.renderRoot.addEventListener('delete-prediction', (_e: Event) =>
      this.deletePrediction()
    )
  }

  hostDisconnected() {}

  setTrainMetricsContainer(container: HTMLDivElement) {
    this.host.trainMetricsContainer = container
  }

  setTrainOption(option: string, value: string) {
    this.host.trainOptions[option] = value
    this.host.trainOptions = {
      ...this.host.trainOptions,
    }
  }

  discardModel(): void {
    this.host.modelConf = <ModelConf>(
      JSON.parse(JSON.stringify(ModelUtils.defaultModelConf))
    )
    // empty the container for the metrics. if we did not do this, it would
    // also show the metrics from the previous training
    if (this.host.trainMetricsContainer) {
      this.host.trainMetricsContainer.innerHTML = ''
    }

    // remove model references (like tensor and weights) in the network
    if (this.host.network) {
      this.host.network.handlediscardModel()
    }
  }

  buildModel(): void {
    this.discardModel()
    const model = this.host.network.buildModel()
    if (model && this.host.dataSet) {
      if (this.host.dataSet.type == 'regression') {
        this.host.modelConf.loss = 'meanSquaredError'
      } else if (this.host.dataSet.type == 'classification') {
        this.host.modelConf.loss = 'categoricalCrossentropy'
        this.host.modelConf.metrics.push('acc')
      } else {
        return
      }
      this.host.modelConf = { ...this.host.modelConf }
      const optimizer = tf.train.sgd(
        parseFloat(this.host.trainOptions.learningRate)
      )
      model.compile({
        optimizer,
        loss: this.host.modelConf.loss,
        metrics: this.host.modelConf.metrics,
      })
      this.host.modelConf.model = model
      AlertUtils.spawn({
        message: `The model was successfully compiled! All hyperparameter and network architecture changes were taken into account!`,
        variant: 'success',
        icon: 'check-circle',
      })
      this.host.modelConf = { ...this.host.modelConf }
    }
  }

  trainModel(epochs: number): void {
    // first build the model if it does not exist (since we allow additional
    // training steps after it has been started, we do not want to rebuild each
    // time)
    if (!this.host.modelConf.model) {
      this.buildModel()
    }

    // now we should have a model and can start training
    if (this.host.modelConf.model) {
      // add the number of epochs we want to train to the total epoch count
      this.host.modelConf.totalEpochs += epochs

      // set training state
      this.host.modelConf.isTraining = true

      // save the changes
      this.host.modelConf = { ...this.host.modelConf }

      // inputs
      const inputs: tf.Tensor[] = []
      for (const inputLayer of this.host.network.getInputLayers()) {
        const inputData: number[][] = []
        inputData.push(
          ...DataSetUtils.getInputDataByKeys(
            this.host.dataSet,
            inputLayer.conf.dataSetKeys
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
        this.host.dataSet.label.classes
      ) {
        labels = tf.oneHot(
          tf.tensor(labelData, undefined, 'int32'),
          this.host.dataSet.label.classes.length
        )
      } else {
        return
      }

      // start the training itself
      void this.host.modelConf.model
        .fit(inputs, labels, {
          epochs: this.host.modelConf.totalEpochs,
          batchSize: parseInt(this.host.trainOptions.batchSize),

          callbacks: [
            {
              onBatchEnd: (batch: number, _logs: tf.Logs) => {
                // update the act batch var (for displaying purposes)
                this.host.modelConf.actBatch = batch + 1
                // update the weights to be displayed in the neurons
                this.host.network.updateWeights(
                  this.host.modelConf.model.getWeights()
                )
                // update the model to reflect all changes
                this.host.modelConf = {
                  ...this.host.modelConf,
                }
              },
              onEpochEnd: (epoch: number, logs: tf.Logs) => {
                this.host.modelConf.actEpoch = epoch + 1
                this.host.modelConf.history.push(logs)
                this.host.modelConf = {
                  ...this.host.modelConf,
                }
                console.log(this.host.modelConf.history)
                tfvis.show
                  .history(
                    this.host.trainMetricsContainer,
                    this.host.modelConf.history,
                    ['loss', ...this.host.modelConf.metrics],
                    {
                      height: 100,
                      xLabel: 'Epoch',
                    }
                  )
                  .then(() => {
                    this.host.modelConf = {
                      ...this.host.modelConf,
                    }
                  })
                  .catch((err) => console.error(err))
              },
            },
          ],
          initialEpoch: this.host.modelConf.actEpoch,
        })
        .then((info) => {
          console.log(info)
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

  predictModel(inputObject: Record<string, number>): void {
    // inputs
    const inputs: tf.Tensor[] = []
    for (const inputLayer of this.host.network.getInputLayers()) {
      const inputData: number[] = []
      Object.keys(inputObject).forEach((inputKey) => {
        if (inputLayer.conf.dataSetKeys.includes(inputKey)) {
          inputData.push(inputObject[inputKey])
        }
      })
      inputs.push(tf.tensor([inputData]))
    }
    const predictedTensor = <tf.Tensor>this.host.modelConf.model.predict(inputs)
    const predictedArray = <number[]>predictedTensor.arraySync()
    console.log('PREDICTION INPUTS:')
    console.log(inputObject)
    console.log('PREDICTED ARRAY:')
    console.log(predictedArray)
    this.host.modelConf.predictedValue = predictedArray[0]
    this.host.modelConf = { ...this.host.modelConf }
    console.log(this.host.modelConf.predictedValue)
  }

  deletePrediction(): void {
    this.host.modelConf.predictedValue = undefined
    this.host.modelConf = { ...this.host.modelConf }
  }
}
