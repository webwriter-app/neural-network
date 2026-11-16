import type { CLayerConf, OutputLayerConf } from '../../model/network-types'

// the name of a layer as it is shown in the UI. Do not use it to reference the
// layer.
export function layerName(
  conf: CLayerConf,
  msg: (source: string) => string
): string {
  const activation = conf.activation.tfName ? `(${conf.activation.name})` : ''
  if (conf.LAYER_TYPE == 'Input') {
    const name = conf.LAYER_NAME === 'Input layer' ? msg('Input layer') : conf.LAYER_NAME
    return `${conf.layerId} - ${name}`
  }
  if (conf.LAYER_TYPE == 'Output') {
    const name = conf.LAYER_NAME === 'Output layer' ? msg('Output layer') : conf.LAYER_NAME
    return `${(<OutputLayerConf>conf).labelDesc.key} ${name} ${activation}`
  }
  const name = conf.LAYER_NAME === 'Dense layer' ? msg('Dense layer') : conf.LAYER_NAME
  return `${conf.layerId} - ${name} ${activation}`
}
