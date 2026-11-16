import { createContext } from '@lit/context'
import type { DataSet } from '../model/data-types'
import type { ModelConf, TrainOptions } from '../model/network-types'
import type { QAndAEntry, Selected, SelectedEle, Settings, SetupStatus } from '../model/app-types'
import { CLayerConf, CLayerConnectionConf } from '../model/network-types'
import type { CNetwork } from './network/network'
import type { CCanvas } from './canvas'

export const availableDataSetsContext = createContext<DataSet[]>(
  'available-data-sets'
)

export const trainOptionsContext = createContext<TrainOptions>('train-options')

export const settingsContext = createContext<Settings>('settings')

export const panelContext = createContext<string | undefined>('panel')

export const modelConfContext = createContext<ModelConf>('model-conf')

export const layerConnectionConfsContext = createContext<
  CLayerConnectionConf[]
>('layer-connection-confs')

export const editableContext = createContext<boolean>('editable')

export const qAndAContext = createContext<QAndAEntry[]>('q-and-a')

export const setupStatusContext = createContext<SetupStatus>('setup-status')

export const dataSetContext = createContext<DataSet>('data-set')

export const networkContext = createContext<CNetwork | undefined>('network')

export const selectedContext = createContext<Selected>('selected')

export const canvasContext = createContext<CCanvas | undefined>('canvas')

export const layerConfsContext = createContext<CLayerConf[]>('layer-confs')

export const selectedEleContext = createContext<SelectedEle | undefined>('selected-ele')
