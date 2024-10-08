import type { TrainOptions } from '@/types/train_options'
import type { ModelConf } from '@/types/model_conf'

// The ModelUtils class provides a static method to better format an arbitrary
// long floating point number. In addition, it provides the default
// configuration for the training related app properties.
export class ModelUtils {
  static defaultTrainOptions: TrainOptions = {
    learningRate: '0.001',
    dropoutRate: '0',
    batchSize: '16',
    lossFunction: 'meanSquaredError',
    optimizer: 'sgd',
  }

  static defaultModelConf: ModelConf = {
    model: null,
    loss: null,
    metrics: [],
    plottedMetrics: [],
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
