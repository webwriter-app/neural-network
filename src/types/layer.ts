import ActivationFunction from '@/types/activation-function'

export default interface Layer {
    type: string
    units: number,
    activation: ActivationFunction
}