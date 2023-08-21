import { createContext } from '@lit-labs/context'
import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
import type { WwDeepLearning } from '@/app'
import { spawnAlert } from '@/utils/alerts'

export interface ModelConf {
  model: tf.LayersModel
  loss: string
  metrics: string[]
  isTraining: boolean
  totalEpochs: number
  actEpoch: number
  actBatch: number
  history: tf.Logs[]
  predictedValue: number | number[] // regression | classification
}
export const modelConfContext = createContext<ModelConf>('model-conf')

export const defaultModelConf: ModelConf = {
  model: null,
  loss: null,
  metrics: [],
  isTraining: false,
  totalEpochs: 0,
  actEpoch: 0,
  actBatch: 0,
  history: [],
  predictedValue: null,
}

export function setTrainMetricsContainer(container: HTMLDivElement) {
  ;(<WwDeepLearning>this).trainMetricsContainer = container
}

export function discardModel(): void {
  ;(<WwDeepLearning>this).modelConf = <ModelConf>(
    JSON.parse(JSON.stringify(defaultModelConf))
  )
  // empty the container for the metrics. if we did not do this, it would
  // also show the metrics from the previous training
  if ((<WwDeepLearning>this).trainMetricsContainer) {
    ;(<WwDeepLearning>this).trainMetricsContainer.innerHTML = ''
  }

  // remove model references (like tensor and weights) in the network
  if ((<WwDeepLearning>this).network) {
    ;(<WwDeepLearning>this).network.handlediscardModel()
  }
}

export function buildModel(): void {
  ;(<WwDeepLearning>this).discardModel()
  const model = (<WwDeepLearning>this).network.buildModel()
  if (model && (<WwDeepLearning>this).dataSet) {
    if ((<WwDeepLearning>this).dataSet.type == 'regression') {
      ;(<WwDeepLearning>this).modelConf.loss = 'meanSquaredError'
    } else if ((<WwDeepLearning>this).dataSet.type == 'classification') {
      ;(<WwDeepLearning>this).modelConf.loss = 'categoricalCrossentropy'
      ;(<WwDeepLearning>this).modelConf.metrics.push('acc')
    } else {
      return
    }
    ;(<WwDeepLearning>this).modelConf = { ...(<WwDeepLearning>this).modelConf }
    const optimizer = tf.train.sgd(
      parseFloat((<WwDeepLearning>this).trainOptions.learningRate)
    )
    model.compile({
      optimizer,
      loss: (<WwDeepLearning>this).modelConf.loss,
      metrics: (<WwDeepLearning>this).modelConf.metrics,
    })
    ;(<WwDeepLearning>this).modelConf.model = model
    spawnAlert({
      message: `The model was successfully compiled! All hyperparameter and network architecture changes were taken into account!`,
      variant: 'success',
      icon: 'check-circle',
    })
    ;(<WwDeepLearning>this).modelConf = { ...(<WwDeepLearning>this).modelConf }
  }
}

export function trainModel(epochs: number): void {
  // first build the model if it does not exist (since we allow additional
  // training steps after it has been started, we do not want to rebuild each
  // time)
  if (!(<WwDeepLearning>this).modelConf.model) {
    ;(<WwDeepLearning>this).buildModel()
  }

  // now we should have a model and can start training
  if ((<WwDeepLearning>this).modelConf.model) {
    // add the number of epochs we want to train to the total epoch count
    ;(<WwDeepLearning>this).modelConf.totalEpochs += epochs

    // set training state
    ;(<WwDeepLearning>this).modelConf.isTraining = true

    // save the changes
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

    // label tensor depends on regression vs classification type
    const labelData: number[] = (<WwDeepLearning>this).getLabelData()
    let labels: tf.Tensor
    if ((<WwDeepLearning>this).dataSet.type == 'regression') {
      labels = tf.tensor(labelData)
    } else if (
      (<WwDeepLearning>this).dataSet.type == 'classification' &&
      (<WwDeepLearning>this).dataSet.label.classes
    ) {
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
        epochs: (<WwDeepLearning>this).modelConf.totalEpochs,
        batchSize: parseInt((<WwDeepLearning>this).trainOptions.batchSize),

        callbacks: [
          {
            onBatchEnd: (batch: number, _logs: tf.Logs) => {
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
            onEpochEnd: (epoch: number, logs: tf.Logs) => {
              ;(<WwDeepLearning>this).modelConf.actEpoch = epoch + 1
              ;(<WwDeepLearning>this).modelConf.history.push(logs)
              ;(<WwDeepLearning>this).modelConf = {
                ...(<WwDeepLearning>this).modelConf,
              }
              console.log((<WwDeepLearning>this).modelConf.history)
              tfvis.show
                .history(
                  (<WwDeepLearning>this).trainMetricsContainer,
                  (<WwDeepLearning>this).modelConf.history,
                  ['loss', ...(<WwDeepLearning>this).modelConf.metrics],
                  {
                    height: 100,
                    xLabel: 'Epoch',
                  }
                )
                .then(() => {
                  ;(<WwDeepLearning>this).modelConf = {
                    ...(<WwDeepLearning>this).modelConf,
                  }
                })
                .catch((err) => console.error(err))
            },
          },
        ],
        initialEpoch: (<WwDeepLearning>this).modelConf.actEpoch,
      })
      .then((info) => {
        console.log(info)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        ;(<WwDeepLearning>this).modelConf.isTraining = false
        ;(<WwDeepLearning>this).modelConf = {
          ...(<WwDeepLearning>this).modelConf,
        }
      })
  }
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
  console.log((<WwDeepLearning>this).modelConf.predictedValue)
}

export function deletePrediction(): void {
  ;(<WwDeepLearning>this).modelConf.predictedValue = undefined
  ;(<WwDeepLearning>this).modelConf = { ...(<WwDeepLearning>this).modelConf }
}
