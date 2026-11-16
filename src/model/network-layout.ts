import type { DataSet } from './data-types'
import type {
  CLayerConf,
  CLayerConnectionConf,
  InputLayerConf,
  OutputLayerConf,
  TensorConf,
} from './network-types'

// Geometry of the network drawing, in scene pixels. A layer is placed by its
// centre (conf.pos); its neurons sit in one row around that centre.
export const NEURON_SIZE = 100
export const NEURON_DISTANCE = 40
export const LAYER_PADDING = 20
export const LAYER_BORDER = 5
export const LAYER_DISTANCE = 150
export const NEURON_RADIUS = 10
export const LAYER_RADIUS = 10

export interface NeuronDescription {
  // the id of the neuron in its layer: the first neuron gets id 1
  neuronId: number
  // the key of the corresponding data set feature or label
  key?: string
  keyPos?: 'top' | 'bottom'
  bias?: number
}

export interface NeuronLayout extends NeuronDescription {
  // id of the neuron in the whole network, e.g. 2n3
  id: string
  // centre of the neuron in scene coordinates
  x: number
  y: number
}

export interface LayerLayout {
  conf: CLayerConf
  id: string
  x: number
  y: number
  width: number
  height: number
  neurons: NeuronLayout[]
}

export interface EdgeLayout {
  id: string
  source: NeuronLayout
  target: NeuronLayout
  weight?: number
}

export interface NetworkLayout {
  layers: LayerLayout[]
  edges: EdgeLayout[]
}

// the neurons a layer shows, without positions
export function describeNeurons(
  conf: CLayerConf,
  dataSet: DataSet,
  bias?: Float32Array
): NeuronDescription[] {
  if (conf.LAYER_TYPE == 'Input') {
    return ((<InputLayerConf>conf).featureKeys ?? []).map((key, i) => ({
      neuronId: i + 1,
      key,
      keyPos: 'bottom',
    }))
  }
  if (conf.LAYER_TYPE == 'Output') {
    const labelDesc = (<OutputLayerConf>conf).labelDesc
    if (!labelDesc) return []
    if (dataSet.type == 'regression') {
      return [{ neuronId: 1, key: labelDesc.key, keyPos: 'top', bias: bias?.[0] }]
    }
    return (labelDesc.classes ?? []).map((clazz, i) => ({
      neuronId: i + 1,
      key: clazz.id?.toString(),
      keyPos: 'top',
      bias: bias?.[i],
    }))
  }
  const units = (<{ units?: number }>conf).units ?? 0
  return Array.from({ length: Math.max(0, units) }, (_, i) => ({
    neuronId: i + 1,
    bias: bias?.[i],
  }))
}

export function layerSize(neuronCount: number): { width: number; height: number } {
  const count = Math.max(1, neuronCount)
  return {
    width:
      count * NEURON_SIZE +
      (count - 1) * NEURON_DISTANCE +
      2 * LAYER_PADDING +
      LAYER_BORDER,
    height: NEURON_SIZE + 2 * LAYER_PADDING + LAYER_BORDER,
  }
}

export function neuronCount(conf: CLayerConf, dataSet: DataSet): number {
  return describeNeurons(conf, dataSet).length
}

// lays out the layers with their neurons and the edges between neurons
export function layoutNetwork(
  layerConfs: CLayerConf[],
  connections: CLayerConnectionConf[],
  dataSet: DataSet,
  tensorConfs: ReadonlyMap<number, Pick<TensorConf, 'bias' | 'weights'>> = new Map()
): NetworkLayout {
  const layers: LayerLayout[] = layerConfs
    .filter((conf) => conf.pos)
    .map((conf) => {
      const described = describeNeurons(
        conf,
        dataSet,
        tensorConfs.get(conf.layerId)?.bias
      )
      const step = NEURON_SIZE + NEURON_DISTANCE
      const neurons = described.map((neuron, i) => ({
        ...neuron,
        id: `${conf.layerId}n${neuron.neuronId}`,
        x: conf.pos.x + i * step - ((described.length - 1) * step) / 2,
        y: conf.pos.y,
      }))
      return {
        conf,
        id: `${conf.layerId}`,
        x: conf.pos.x,
        y: conf.pos.y,
        ...layerSize(neurons.length),
        neurons,
      }
    })
  const byId = new Map(layers.map((layer) => [layer.conf.layerId, layer]))

  const edges: EdgeLayout[] = []
  // the kernel of a layer concatenates its sources in the order of the
  // connections, one block of rows per source neuron
  const rowsBefore = new Map<number, number>()
  for (const connection of connections) {
    const source = byId.get(connection.sourceLayerId)
    const target = byId.get(connection.targetLayerId)
    if (!source || !target) continue
    const offset = rowsBefore.get(target.conf.layerId) ?? 0
    rowsBefore.set(target.conf.layerId, offset + source.neurons.length)
    const weights = tensorConfs.get(target.conf.layerId)?.weights
    source.neurons.forEach((from, s) => {
      target.neurons.forEach((to, t) => {
        edges.push({
          id: `${from.id}e${to.id}`,
          source: from,
          target: to,
          weight: weights?.[(offset + s) * target.neurons.length + t],
        })
      })
    })
  }
  return { layers, edges }
}

// the width of an edge: thicker for larger weights
export function edgeWidth(weight?: number): number {
  return weight && isFinite(weight) ? Math.min(15, Math.abs(weight) * 6) : 3
}

export function edgeSign(weight?: number): 'positive' | 'negative' | 'none' {
  if (!weight) return 'none'
  return weight < 0 ? 'negative' : weight > 0 ? 'positive' : 'none'
}
