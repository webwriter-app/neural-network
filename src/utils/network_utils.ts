import type { Activation } from '@/types/activation'

import IconActNone from "@/assets/actNone.svg"
import IconActReLu from "@/assets/actReLu.svg"
import IconActSigmoid from "@/assets/actSigmoid.svg"
import IconActTanh from "@/assets/actTanh.svg"

// The NetworkUtils class provides static preconfigured instances of activations
export class NetworkUtils {

  static getActivation(name: "none" | "ReLu" | "Sigmoid" | "Tanh" | "Softmax") {
    return this.activationOptions.find(a => a.name === name)
  }

  static actNone: Activation = {
    name: 'None',
    tfName: null,
    description: 'No additional function is applied.',
    img: IconActNone,
    range: '(-∞,∞)',
  }
  static actReLu: Activation = {
    name: 'ReLu',
    fullName: 'Rectified linear unit',
    tfName: 'relu',
    description: 'Negative values are rounded up to zero.',
    img: IconActReLu,
    range: '[0,∞)',
  }
  static actSigmoid: Activation = {
    name: 'Sigmoid',
    tfName: 'sigmoid',
    description:
      'Largely negative values are mapped to values close to zero while largely positive values will be mapped to values close to one (see the graphic).',
    img: IconActSigmoid,
    range: '(0,1)',
  }
  static actTanh: Activation = {
    name: 'Tanh',
    fullName: 'Hyperbolic tangent',
    tfName: "tanh",
    description:
      'Largely negative values are mapped to values close to minus one while largely positive values will be mapped to values close to one (see the graphic).',
    img: IconActTanh,
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
