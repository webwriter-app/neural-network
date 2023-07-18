export const activationOptions = <const>['None', 'ReLu', 'Sigmoid', 'Softmax']

export const activationsMap = new Map<string, string>()
activationsMap.set('None', null)
activationsMap.set('ReLu', 'relu')
activationsMap.set('Sigmoid', 'sigmoid')
activationsMap.set('Softmax', 'softmax')

export type ActivationOption = (typeof activationOptions)[number]
