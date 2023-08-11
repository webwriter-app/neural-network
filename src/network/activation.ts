export interface Activation {
  name: string
  tfName: string
  description: string
  img?: string
  range: string
}

export const actNone: Activation = {
  name: 'None',
  tfName: null,
  description: 'No additional function is applied.',
  img: '/assets/actNone.svg',
  range: '(-∞,∞)',
}

export const actReLu: Activation = {
  name: 'ReLu',
  tfName: 'relu',
  description: 'Negative values are rounded up to zero.',
  img: '/assets/actReLu.svg',
  range: '[0,∞)',
}

export const actSigmoid: Activation = {
  name: 'Sigmoid',
  tfName: 'sigmoid',
  description:
    'Largely negative values are mapped to values close to zero while largely positive values will be mapped to values close to one (see the graphic).',
  img: '/assets/actSigmoid.svg',
  range: '(0,1)',
}

export const actSoftmax: Activation = {
  name: 'Softmax',
  tfName: 'softmax',
  description:
    'Create a probability distribution such that the output values of all neurons in this layer add up to one.',
  range: '(0,1)',
}

export const activationOptions = [actNone, actReLu, actSigmoid, actSoftmax]
