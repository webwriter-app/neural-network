import { ReactiveControllerHost } from 'lit'

import { Canvas } from '@/components/canvas'
import { NetworkConf } from '@/contexts/network_conf_context'
import { Model } from '@/contexts/model_context'
import { DataSet } from '@/data_set/data_set'
import { Selected } from '@/contexts/selected_context'
import { Panels } from '@/contexts/panels_context'

export interface CReactiveControllerHost extends ReactiveControllerHost {
  canvas: Canvas
  networkConf: NetworkConf
  model: Model
  dataSet: DataSet
  panels: Panels
  selected: Selected
}
