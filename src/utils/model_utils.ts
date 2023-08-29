import type { TrainOptions } from '@/types/train_options'
import type { ModelConf } from '@/types/model_conf'

export class ModelUtils {
  static defaultTrainOptions: TrainOptions = {
    learningRate: '0.001',
    dropoutRate: '0',
    batchSize: '32',
    lossFunction: 'meanSquaredError',
    optimizer: 'sgd',
  }

  static defaultModelConf: ModelConf = {
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

  // rounds and formats a given weight (but e.g. bias and every other number also
  // works fine)
  static formatWeight(weight: number): string {
    let weightString: string
    if (!weight) {
      weightString = ''
    } else if (!isFinite(weight)) {
      weightString = weight.toString()
    } else {
      weightString = (weight < 0 ? '' : '+') + weight
      if (weightString.indexOf('.') != -1) {
        while (weightString.length > 7 && weightString.slice(-1) != '.') {
          weightString = weightString.slice(0, -1)
        }
        weightString = weightString.padEnd(7, '0')
      }
    }
    return weightString
  }
}
