import type { Activation } from '../../model/network-types'
import { msg } from '@lit/localize'

import IconActNone from "../../assets/act-none.svg"
import IconActReLu from "../../assets/act-re-lu.svg"
import IconActSigmoid from "../../assets/act-sigmoid.svg"
import IconActTanh from "../../assets/act-tanh.svg"

// The NetworkUtils class provides static preconfigured instances of activations
export class NetworkUtils {

  static getActivation(name: string) {
    return this.activationOptions.find(a => a.name === name)
  }

  static actNone: Activation = {
    name: msg('None'),
    tfName: null,
    description: msg('No additional function is applied.'),
    img: IconActNone,
    range: '(-∞,∞)',
  }
  static actReLu: Activation = {
    name: 'ReLu',
    fullName: 'Rectified linear unit',
    tfName: 'relu',
    description: msg('Negative values are rounded up to zero.'),
    img: IconActReLu,
    range: '[0,∞)',
  }
  static actSigmoid: Activation = {
    name: 'Sigmoid',
    tfName: 'sigmoid',
    description: msg(
      'Largely negative values are mapped to values close to zero while largely positive values will be mapped to values close to one (see the graphic).',
    ),
    img: IconActSigmoid,
    range: '(0,1)',
  }
  static actTanh: Activation = {
    name: 'Tanh',
    fullName: 'Hyperbolic tangent',
    tfName: "tanh",
    description: msg(
      'Largely negative values are mapped to values close to minus one while largely positive values will be mapped to values close to one (see the graphic).',
    ),
    img: IconActTanh,
    range: '(-1,1)',
  }
  static actSoftmax: Activation = {
    name: 'Softmax',
    tfName: 'softmax',
    description: msg(
      'Create a probability distribution such that the output values of all neurons in this layer add up to one.',
    ),
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
