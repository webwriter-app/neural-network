import type { ActivationIdentifier } from '@tensorflow/tfjs-layers/dist/keras_format/activation_config'

export interface Activation {
  name: string
  fullName?: string
  tfName: ActivationIdentifier
  description: string
  img?: string
  range: string
}
