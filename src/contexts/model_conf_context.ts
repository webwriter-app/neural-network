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
}
export const modelConfContext = createContext<ModelConf>('model-conf')

export const defaultModelConf: ModelConf = {
  model: null,
  isTraining: false,
  actBatch: null,
  actEpoch: null,
  stopRequested: false,
}

export function resetModel(): void {
  if ((<WwDeepLearning>this).modelConf.model) {
    // set stopRequested to true because we want to be able to call reset()
    // also to abort a current running training session. Will not have any
    // complications because the train method itself sets it to false before
    // it is used
    ;(<WwDeepLearning>this).modelConf.stopRequested = true

    // set the model to null
    ;(<WwDeepLearning>this).modelConf.model = null
    ;(<WwDeepLearning>this).modelConf = { ...(<WwDeepLearning>this).modelConf }

    // empty the container for the metrics. if we did not do this, it would
    // also show the metrics from the previous training
    ;(<WwDeepLearning>this).trainMetricsContainer.innerHTML = ''

    // remove model references (like tensor and weights) in the network
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
  //if (!this.model.model) {
  ;(<WwDeepLearning>this).buildModel()
  //}

  if ((<WwDeepLearning>this).modelConf.model) {
    // a manual stop can be requested by setting this variable to true (is
    // periodically checked)
    ;(<WwDeepLearning>this).modelConf.stopRequested = false

    // set the isTraining boolean variable that is used in the ui do
    // determine what to display
    ;(<WwDeepLearning>this).modelConf.actEpoch = 0
    ;(<WwDeepLearning>this).modelConf.actBatch = 0
    ;(<WwDeepLearning>this).modelConf.isTraining = true
    ;(<WwDeepLearning>this).modelConf = { ...(<WwDeepLearning>this).modelConf }

    // inputs
    const inputData: number[][] = []
    for (const inputLayer of (<WwDeepLearning>this).network.getInputLayers()) {
      inputData.push(
        ...(<WwDeepLearning>this).getInputDataByKeys(
          inputLayer.conf.dataSetKeys
        )
      )
    }
    const inputs: tf.Tensor = tf.tensor(inputData)

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

export function stopTraining() {
  ;(<WwDeepLearning>this).modelConf.stopRequested = true
}

export function predictModel(): void {
  return
}
