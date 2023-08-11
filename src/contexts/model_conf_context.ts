import { createContext } from '@lit-labs/context'
import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
import type { WwDeepLearning } from '@/app'
import { spawnAlert } from '@/utils/alerts'

export interface ModelConf {
  model: tf.LayersModel
  isTraining: boolean
  actEpoch: number
  actBatch: number
  stopRequested: boolean
  predictedValue: number
}
export const modelConfContext = createContext<ModelConf>('model-conf')

export const defaultModelConf: ModelConf = {
  model: null,
  isTraining: false,
  actBatch: 0,
  actEpoch: 0,
  stopRequested: false,
  predictedValue: null,
}

export function setTrainMetricsContainer(container: HTMLDivElement) {
  ;(<WwDeepLearning>this).trainMetricsContainer = container
}

export function resetModel(): void {
  ;(<WwDeepLearning>this).modelConf = { ...defaultModelConf }
  // empty the container for the metrics. if we did not do this, it would
  // also show the metrics from the previous training
  if ((<WwDeepLearning>this).trainMetricsContainer) {
    ;(<WwDeepLearning>this).trainMetricsContainer.innerHTML = ''
  }

  // remove model references (like tensor and weights) in the network
  if ((<WwDeepLearning>this).network) {
    ;(<WwDeepLearning>this).network.handleResetModel()
  }
}

export function buildModel(): void {
  ;(<WwDeepLearning>this).resetModel()
  const model = (<WwDeepLearning>this).network.buildModel()
  if (model && (<WwDeepLearning>this).dataSet) {
    const metrics: string[] = []
    let loss: string
    if ((<WwDeepLearning>this).dataSet.type == 'regression') {
      loss = 'meanSquaredError'
    } else if ((<WwDeepLearning>this).dataSet.type == 'classification') {
      loss = 'categoricalCrossentropy'
      metrics.push('acc')
    } else {
      return
    }
    const optimizer = tf.train.sgd(
      parseFloat((<WwDeepLearning>this).trainOptions.learningRate)
    )
    model.compile({
      optimizer,
      loss,
      metrics,
    })
    ;(<WwDeepLearning>this).modelConf.model = model
    console.log(model.summary())
    spawnAlert({
      message: `The model was successfully compiled! All hyperparameter and network architecture changes were taken into account!`,
      variant: 'success',
      icon: 'check-circle',
    })
    ;(<WwDeepLearning>this).modelConf = { ...(<WwDeepLearning>this).modelConf }
  }
}

export function trainModel(): void {
  // first build the model if it does not exist (since we allow additional
  // training steps after it has been started, we do not want to rebuild each
  // time)
  if (!(<WwDeepLearning>this).modelConf.model) {
    ;(<WwDeepLearning>this).buildModel()
  }

  // now we should have a model and can start training
  if ((<WwDeepLearning>this).modelConf.model) {
    // set the stop requested variable initially to false (if set to true the
    // training will stop)
    ;(<WwDeepLearning>this).modelConf.stopRequested = false

    // set training state
    ;(<WwDeepLearning>this).modelConf.isTraining = true
    ;(<WwDeepLearning>this).modelConf = { ...(<WwDeepLearning>this).modelConf }

    // inputs
    const inputs: tf.Tensor[] = []
    for (const inputLayer of (<WwDeepLearning>this).network.getInputLayers()) {
      const inputData: number[][] = []
      inputData.push(
        ...(<WwDeepLearning>this).getInputDataByKeys(
          inputLayer.conf.dataSetKeys
        )
      )
      inputs.push(tf.tensor(inputData))
    }

    // metrics and label tensors depend on regression vs classification type
    const labelData: number[] = (<WwDeepLearning>this).getLabelData()
    const metrics: string[] = ['loss']
    let labels: tf.Tensor
    if ((<WwDeepLearning>this).dataSet.type == 'regression') {
      labels = tf.tensor(labelData)
    } else if (
      (<WwDeepLearning>this).dataSet.type == 'classification' &&
      (<WwDeepLearning>this).dataSet.label.classes
    ) {
      metrics.push('acc')
      labels = tf.oneHot(
        tf.tensor(labelData, undefined, 'int32'),
        (<WwDeepLearning>this).dataSet.label.classes.length
      )
    } else {
      return
    }

    // start the training itself
    void (<WwDeepLearning>this).modelConf.model
      .fit(inputs, labels, {
        epochs: parseInt((<WwDeepLearning>this).trainOptions.epochs),
        batchSize: parseInt((<WwDeepLearning>this).trainOptions.batchSize),
        callbacks: [
          tfvis.show.fitCallbacks(
            (<WwDeepLearning>this).trainMetricsContainer,
            metrics,
            {
              height: 100,
            }
          ),
          {
            onBatchEnd: (batch: number, _logs) => {
              // after each batch check if a stop was requested
              if ((<WwDeepLearning>this).modelConf.stopRequested) {
                ;(<WwDeepLearning>this).modelConf.model.stopTraining = true
              }
              // update the act batch var (for displaying purposes)
              ;(<WwDeepLearning>this).modelConf.actBatch = batch + 1
              // update the weights to be displayed in the neurons
              ;(<WwDeepLearning>this).network.updateWeights(
                (<WwDeepLearning>this).modelConf.model.getWeights()
              )
              // update the model to reflect all changes
              ;(<WwDeepLearning>this).modelConf = {
                ...(<WwDeepLearning>this).modelConf,
              }
            },
            onEpochEnd: (epoch: number, _logs) => {
              ;(<WwDeepLearning>this).modelConf.actEpoch = epoch + 1
              ;(<WwDeepLearning>this).modelConf = {
                ...(<WwDeepLearning>this).modelConf,
              }
            },
          },
        ],
      })
      .then((info) => {
        console.log(info)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setTimeout(() => {
          ;(<WwDeepLearning>this).modelConf.isTraining = false
          ;(<WwDeepLearning>this).modelConf = {
            ...(<WwDeepLearning>this).modelConf,
          }
        }, 500)
      })
  }
}

export function stopTraining(): void {
  ;(<WwDeepLearning>this).modelConf.stopRequested = true
}

export function predictModel(inputObject: Record<string, number>): void {
  // inputs
  const inputs: tf.Tensor[] = []
  for (const inputLayer of (<WwDeepLearning>this).network.getInputLayers()) {
    const inputData: number[] = []
    Object.keys(inputObject).forEach((inputKey) => {
      if (inputLayer.conf.dataSetKeys.includes(inputKey)) {
        inputData.push(inputObject[inputKey])
      }
    })
    inputs.push(tf.tensor([inputData]))
  }
  const predictedTensor = <tf.Tensor>(
    (<WwDeepLearning>this).modelConf.model.predict(inputs)
  )
  const predictedArray = <number[]>predictedTensor.arraySync()
  console.log('PREDICTION INPUTS:')
  console.log(inputObject)
  console.log('PREDICTED ARRAY:')
  console.log(predictedArray)
  ;(<WwDeepLearning>this).modelConf.predictedValue = predictedArray[0]
  ;(<WwDeepLearning>this).modelConf = { ...(<WwDeepLearning>this).modelConf }
}

export function deletePrediction(): void {
  ;(<WwDeepLearning>this).modelConf.predictedValue = undefined
  ;(<WwDeepLearning>this).modelConf = { ...(<WwDeepLearning>this).modelConf }
}
