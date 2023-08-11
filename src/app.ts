import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'
import { provide } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { ShortcutListener } from '@/utils/shortcut_listener'

import {
  SetupStatus,
  checkLoading,
  defaultSetupStatus,
  setupCompleted,
  setupStatusContext,
} from '@/contexts/setup_status_context'
import { editableContext } from '@/contexts/editable_context'
import {
  Settings,
  defaultSettings,
  settingsContext,
  setSetting,
  setSettings,
} from '@/contexts/settings_context'
import {
  HelpEntry,
  helpContext,
  addNewHelpEntry,
  removeHelpEntry,
  updateHelpEntry,
  defaultHelp,
} from '@/contexts/help_context'
import { setCanvas, canvasContext } from '@/contexts/canvas_context'
import {
  layerConfsContext,
  addLayer,
  updateLayerConfs,
  removeLayer,
} from '@/contexts/layer_confs_context'
import {
  addLayerConnection,
  layerConnectionConfsContext,
  removeLayerConnection,
} from '@/contexts/layer_con_confs_context'
import { clearNetwork, networkContext } from '@/contexts/network_context'
import { selectDataSet, dataSetContext } from '@/contexts/data_set_context'
import {
  addDataSet,
  deleteDataSet,
  availableDataSetsContext,
} from '@/contexts/available_data_sets_context'
import {
  TrainOptions,
  defaultTrainOptions,
  setTrainOption,
  trainOptionsContext,
} from '@/contexts/train_options_context'
import {
  ModelConf,
  setTrainMetricsContainer,
  buildModel,
  defaultModelConf,
  modelConfContext,
  predictModel,
  deletePrediction,
  resetModel,
  stopTraining,
  trainModel,
} from '@/contexts/model_conf_context'
import {
  Selected,
  unselect,
  selectLayer,
  selectNeuron,
  selectEdge,
  selectedContext,
} from '@/contexts/selected_context'
import {
  SelectedEle,
  selectedEleRendered,
  selectedEleContext,
} from '@/contexts/selected_ele_context'
import { panelContext, openPanel, closePanels } from '@/contexts/panels_context'

import type { CCanvas } from '@/components/canvas'
import type { FileConfigV1 } from '@/types/file_config_v1'
import type { DataSet } from '@/data_set/data_set'
import { getInputDataByKeys, getLabelData } from '@/data_set/data_set'
import { bostonHousePricing } from '@/data_set/boston'
import { pimaIndiansDiabetes } from '@/data_set/diabetes'

import { Network } from '@/network/network'
import { CLayerConf } from '@/network/c_layer_conf'
import { CLayerConnectionConf } from '@/network/c_layer_connection_conf'
import type { CLayer } from '@/network/c_layer'
import type { Neuron } from '@/network/neuron'
import type { CEdge } from '@/network/c_edge'

import '@/network/network'
import '@/components/canvas_area'
import '@/components/menu_area'

@customElement('ww-deeplearning')
export class WwDeepLearning extends LitElementWw {
  // FIELDS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // keyboard shortcuts listener
  private shortcutListener = new ShortcutListener(this)

  // CONTEXT - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // the only way lit detects changes and notifies the consumers about them is
  // if the whole context object was reassigned. thus, context functions do not
  // just assign values to some object properties but reassign the whole object
  // by either creating a new one or changing the current and reassigning it
  // with { ... } (similar but not according to the immutable pattern)

  // -> SETUP STATUS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // setup status context: provides information about which phases have been
  // completed when the app is loaded into the dom. important for components to
  // check whether they need to some unconvential things at setup that do not
  // work great with lit lifecycle hooks or the ui to check whether setup is
  // completed.
  @provide({ context: setupStatusContext })
  @property({ attribute: false })
  setupStatus: SetupStatus = defaultSetupStatus

  setupCompleted = setupCompleted
  checkLoading = checkLoading

  // -> EDITABLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // editable context: provides information if the editable attribute is set
  @provide({ context: editableContext })
  @property({ attribute: true, type: Boolean, reflect: true })
  editable: boolean = false

  // -> SETTINGS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // settings context: mostly for checking permission for actions. only use
  // together with editable!
  @provide({ context: settingsContext })
  @property({ attribute: true, type: Object, reflect: true })
  settings: Settings = { ...defaultSettings }

  setSetting = setSetting
  setSettings = setSettings

  // -> HELP - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // help context: provides the help entries
  @provide({ context: helpContext })
  @property({ attribute: true, type: Object, reflect: true })
  help: HelpEntry[] = [...defaultHelp]

  addNewHelpEntry = addNewHelpEntry
  removeHelpEntry = removeHelpEntry
  updateHelpEntry = updateHelpEntry

  // -> CANVAS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // canvas context: provides the canvas (currently a reactive controller) and
  // its corresponding actions
  @provide({ context: canvasContext })
  @property({ attribute: false })
  canvas: CCanvas

  setCanvas = setCanvas

  // -> NETWORK  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // layer conf context: provides the layer configurations
  @provide({ context: layerConfsContext })
  @property({ attribute: true, type: Array, reflect: true })
  layerConfs: CLayerConf[] = []

  addLayer = addLayer
  updateLayerConfs = updateLayerConfs
  removeLayer = removeLayer

  // layer connections conf context: provides the layer connection
  // configurations
  @provide({ context: layerConnectionConfsContext })
  @property({ attribute: true, type: Array, reflect: true })
  layerConnectionConfs: CLayerConnectionConf[] = []

  addLayerConnection = addLayerConnection
  removeLayerConnection = removeLayerConnection

  @query('c-network')
  _network: Network

  @provide({ context: networkContext })
  @property({ attribute: false })
  network: Network

  clearNetwork = clearNetwork

  // -> DATA SET - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // dataSet context: provides the dataSet (currently a simple class instance)
  // and its corresponding actions
  @provide({ context: dataSetContext })
  @property({ attribute: true, type: Object, reflect: true })
  dataSet: DataSet = bostonHousePricing

  selectDataSet = selectDataSet

  getInputDataByKeys = getInputDataByKeys
  getLabelData = getLabelData

  // available data sets
  @provide({ context: availableDataSetsContext })
  @property({ attribute: true, type: Array, reflect: true })
  availableDataSets: DataSet[] = [bostonHousePricing, pimaIndiansDiabetes]

  addDataSet = addDataSet
  deleteDataSet = deleteDataSet

  // -> TRAIN OPTIONS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // trainOptions context: provides the dataSet (currently a simple class instance)
  // and its corresponding actions
  @provide({ context: trainOptionsContext })
  @property({ attribute: true, type: Object, reflect: true })
  trainOptions: TrainOptions = { ...defaultTrainOptions }

  setTrainOption = setTrainOption

  // HTML container where metrics like accuracy and loss are plotted into
  @state()
  trainMetricsContainer: HTMLDivElement

  // -> MODEL  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // model context: provides the tensorflow.js model based on the network and
  // corresponding actions like training
  @provide({ context: modelConfContext })
  @property({ attribute: false })
  modelConf: ModelConf = { ...defaultModelConf }

  setTrainMetricsContainer = setTrainMetricsContainer
  resetModel = resetModel
  buildModel = buildModel
  trainModel = trainModel
  stopTraining = stopTraining
  predictModel = predictModel
  deletePrediction = deletePrediction

  // -> SELECTED - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // selected context: provides info about what kind of item in the canvas (layer,
  // neuron, edge) is currently selected and its cyId
  @provide({ context: selectedContext })
  @property({ attribute: false })
  selected: Selected = {}

  unselect = unselect
  selectLayer = selectLayer
  selectNeuron = selectNeuron
  selectEdge = selectEdge

  @provide({ context: selectedEleContext })
  @property({ attribute: false })
  selectedEle: SelectedEle

  selectedEleRendered = selectedEleRendered

  // -> PANELS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // panel context: provide the current panel
  @provide({ context: panelContext })
  @property({ attribute: false })
  panel: string

  openPanel = openPanel
  closePanels = closePanels

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  connectedCallback() {
    super.connectedCallback()

    // set theme to dark
    document.documentElement.classList.add('sl-theme-dark')

    // -> ADD EVENT LISTENERS
    // ---> SETUP
    this.renderRoot.addEventListener(
      'setup-completed',
      (e: CustomEvent<string>) => this.setupCompleted(e.detail)
    )
    // ---> IMPORT
    this.renderRoot.addEventListener(
      'import-config',
      (e: CustomEvent<FileConfigV1>) => this.importConfig(e.detail)
    )
    // ---> SETTINGS
    window.addEventListener(
      'set-setting',
      (
        e: CustomEvent<{
          name: string
          value: boolean
        }>
      ) => this.setSetting(e.detail.name, e.detail.value)
    )
    this.renderRoot.addEventListener(
      'set-settings',
      (e: CustomEvent<Settings>) => this.setSettings(e.detail)
    )

    // ---> HELP
    this.renderRoot.addEventListener(
      'add-new-help-entry',
      (e: CustomEvent<HelpEntry>) => this.addNewHelpEntry(e.detail)
    )
    this.renderRoot.addEventListener(
      'update-help-entry',
      (e: CustomEvent<HelpEntry>) => this.updateHelpEntry(e.detail)
    )
    this.renderRoot.addEventListener(
      'remove-help-entry',
      (e: CustomEvent<string>) => this.removeHelpEntry(e.detail)
    )
    // ---> SELECT
    this.renderRoot.addEventListener('unselect', (_e: Event) => this.unselect())
    this.renderRoot.addEventListener('select-layer', (e: CustomEvent<string>) =>
      this.selectLayer(e.detail)
    )
    this.renderRoot.addEventListener(
      'select-neuron',
      (e: CustomEvent<string>) => this.selectNeuron(e.detail)
    )
    this.renderRoot.addEventListener('select-edge', (e: CustomEvent<string>) =>
      this.selectEdge(e.detail)
    )
    this.renderRoot.addEventListener(
      'selected-ele-rendered',
      (e: CustomEvent<CLayer | Neuron | CEdge>) =>
        this.selectedEleRendered(e.detail)
    )
    // ---> PANELS
    this.renderRoot.addEventListener('open-panel', (e: CustomEvent<string>) =>
      this.openPanel(e.detail)
    )
    // we need to listen on window element since events to close panels
    // sometimes are emitted in disconnected callback functions, so they need to
    // emit the event at window level since they are not in the DOM anymore at
    // this point
    window.addEventListener('close-panels', (e: CustomEvent<string[]>) =>
      this.closePanels(e.detail)
    )
    // ---> DATA SET
    this.renderRoot.addEventListener(
      'select-data-set',
      (e: CustomEvent<DataSet>) => this.selectDataSet(e.detail)
    )
    this.renderRoot.addEventListener(
      'add-data-set',
      (e: CustomEvent<DataSet>) => this.addDataSet(e.detail)
    )
    this.renderRoot.addEventListener(
      'delete-data-set',
      (e: CustomEvent<string>) => this.deleteDataSet(e.detail)
    )
    // ---> NETWORK
    this.renderRoot.addEventListener('clear-network', (_e: Event) =>
      this.clearNetwork()
    )
    this.renderRoot.addEventListener(
      'add-layer',
      (e: CustomEvent<CLayerConf>) => this.addLayer(e.detail)
    )
    this.renderRoot.addEventListener('remove-layer', (e: CustomEvent<number>) =>
      this.removeLayer(e.detail)
    )
    this.renderRoot.addEventListener(
      'add-layer-connection',
      (e: CustomEvent<{ source: number; target: number }>) =>
        this.addLayerConnection(e.detail.source, e.detail.target)
    )
    this.renderRoot.addEventListener('update-layer-confs', (_e: Event) =>
      this.updateLayerConfs()
    )
    this.renderRoot.addEventListener(
      'remove-layer-connection',
      (e: CustomEvent<{ source: number; target: number }>) =>
        this.removeLayerConnection(e.detail.source, e.detail.target)
    )
    // ---> TRAIN
    this.renderRoot.addEventListener(
      'set-train-option',
      (
        e: CustomEvent<{
          option: string
          value: string
        }>
      ) => this.setTrainOption(e.detail.option, e.detail.value)
    )
    this.renderRoot.addEventListener('reset-model', (_e: Event) =>
      this.resetModel()
    )
    this.renderRoot.addEventListener('train-model', (_e: Event) =>
      this.trainModel()
    )
    this.renderRoot.addEventListener(
      'predict-model',
      (e: CustomEvent<Record<string, number>>) => this.predictModel(e.detail)
    )
    this.renderRoot.addEventListener('delete-prediction', (_e: Event) =>
      this.deletePrediction()
    )
    this.renderRoot.addEventListener('stop-training', (_e: Event) =>
      this.stopTraining()
    )
  }

  updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties)

    if (!this.network) {
      this.network = this._network
    }
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> IMPORTING  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  importConfig(config: FileConfigV1): void {
    // import settings: only overwrite the current when in editable mode
    if (this.editable) {
      this.settings = { ...config.settings }
      this.help = [...config.help]
    }

    this.dataSet = config.dataSet
    this.availableDataSets = config.availableDataSets
    this.layerConfs = config.layerConfs
    this.layerConnectionConfs = config.layerConnectionConfs
    this.trainOptions = config.trainOptions
    this.resetModel()
    this.panel = undefined
    this.selected = {}
    setTimeout(() => {
      this.canvas.fit()
    }, 50)
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [
    globalStyles,
    css`
      :host {
        height: 100vh;
        display: flex;
        flex-direction: row;
        overflow: hidden;
        background-color: var(--sl-color-neutral-0);
      }

      #loadingPage {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: var(--sl-color-neutral-0);
      }

      #loadingDiv {
        position: absolute;
        left: 50%;
        top: 50%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      canvas-area {
        width: calc(100% - 450px);
        height: 100%;
      }

      canvas-area.right-collapsed {
        width: 100%;
      }

      menu-area {
        width: 450px;
      }

      menu-area.right-collapsed {
        width: 0;
      }

      #divider {
        position: absolute;
        right: 449px;
        width: 2px;
        top: 10px;
        bottom: 10px;
        background-color: var(--sl-color-neutral-50);
      }
    `,
  ]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // @TODO move all event handlers in connected callback
  render(): TemplateResult<1>[] {
    const renderedHTML: TemplateResult<1>[] = []
    renderedHTML.push(html` <canvas-area
      class="${!this.panel ? 'right-collapsed' : ''}"
      @canvas-created="${(e: CustomEvent<CCanvas>) => this.setCanvas(e.detail)}"
    >
    </canvas-area>`)
    if (this.setupStatus.loading) {
      renderedHTML.push(html`
        <div id="loadingPage">
          <div id="loadingDiv">
            <h1>Loading</h1>
            <sl-spinner style="font-size: 3rem;"></sl-spinner>
          </div>
        </div>
      `)
    } else {
      renderedHTML.push(html`
        <div id="divider" class="${!this.panel ? 'hidden' : ''}"></div>

        <menu-area
          part="action"
          class="${!this.panel ? 'right-collapsed' : ''}"
          @set-train-metrics-container="${(e: CustomEvent<HTMLDivElement>) =>
            this.setTrainMetricsContainer(e.detail)}"
        ></menu-area>

        <c-network></c-network>
      `)
    }
    return renderedHTML
  }
}
