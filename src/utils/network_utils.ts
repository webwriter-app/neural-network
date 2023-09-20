import type { Activation } from '@/types/activation'

// The NetworkUtils class provides static preconfigured instances of activations
export class NetworkUtils {
  static actNone: Activation = {
    name: 'None',
    tfName: null,
    description: 'No additional function is applied.',
    img: '/assets/actNone.svg',
    range: '(-∞,∞)',
  }
  static actReLu: Activation = {
    name: 'ReLu',
    fullName: 'Rectified linear unit',
    tfName: 'relu',
    description: 'Negative values are rounded up to zero.',
    img: '/assets/actReLu.svg',
    range: '[0,∞)',
  }
  static actSigmoid: Activation = {
    name: 'Sigmoid',
    tfName: 'sigmoid',
    description:
      'Largely negative values are mapped to values close to zero while largely positive values will be mapped to values close to one (see the graphic).',
    img: '/assets/actSigmoid.svg',
    range: '(0,1)',
  }
  static actTanh: Activation = {
    name: 'Tanh',
    fullName: 'Hyperbolic tangent',
    tfName: 'tanh',
    description:
      'Largely negative values are mapped to values close to minus one while largely positive values will be mapped to values close to one (see the graphic).',
    img: '/assets/actTanh.svg',
    range: '(-1,1)',
  }
  static actSoftmax: Activation = {
    name: 'Softmax',
    tfName: 'softmax',
    description:
      'Create a probability distribution such that the output values of all neurons in this layer add up to one.',
    range: '(0,1)',
  }
  static activationOptions: Activation[] = [
    this.actNone,
    this.actReLu,
    this.actSigmoid,
    this.actTanh,
    this.actSoftmax,
  ]
}
