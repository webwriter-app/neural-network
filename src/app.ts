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
import { Guard, guard, guardContext } from '@/contexts/guard_context'
import { canvasContext } from '@/contexts/canvas_context'
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
import { networkContext } from '@/contexts/network_context'
import { dataSetContext } from '@/contexts/data_set_context'
import {
  addDataSet,
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
  buildModel,
  defaultModelConf,
  modelConfContext,
  predictModel,
  resetModel,
  stopTraining,
  trainModel,
} from '@/contexts/model_conf_context'
import { Selected, select, selectedContext } from '@/contexts/selected_context'
import {
  panelGroups,
  openPanelsContext,
  openPanel,
  closePanels,
} from '@/contexts/panels_context'

import type { CCanvas } from '@/components/canvas'
import type { FileConfigV1 } from '@/types/file_config_v1'
import type { DataSet } from '@/data_set/data_set'
import { getInputDataByKeys, getLabelData } from '@/data_set/data_set'
import { bostonHousePricing } from '@/data_set/boston'
import { pimaIndiansDiabetes } from '@/data_set/diabetes'

import { Network } from '@/components/network/network'
import { CLayerConf } from '@/components/network/c_layer_conf'
import { CLayerConnectionConf } from '@/components/network/c_layer_connection_conf'
import { CLayer } from '@/components/network/c_layer'
import { Neuron } from '@/components/network/neuron'
import { Edge } from '@/components/network/edge'

import '@/components/network/network'
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

  // -> GUARD  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // guard context: provides boolean functions that are used throughout the
  // widget to check if some action is currently allowed. since the guard
  // context does not provide data itself, it is unnecessary to store it as an
  // attribute (which would even cause problems)
  @provide({ context: guardContext })
  @property({ attribute: false })
  guard: Guard = guard

  // -> CANVAS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // canvas context: provides the canvas (currently a reactive controller) and
  // its corresponding actions
  @provide({ context: canvasContext })
  @property({ attribute: false })
  canvas: CCanvas

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

  // -> DATA SET - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // dataSet context: provides the dataSet (currently a simple class instance)
  // and its corresponding actions
  @provide({ context: dataSetContext })
  @property({ attribute: true, type: Object, reflect: true })
  dataSet: DataSet = bostonHousePricing

  getInputDataByKeys = getInputDataByKeys
  getLabelData = getLabelData

  // available data sets
  @provide({ context: availableDataSetsContext })
  @property({ attribute: false })
  availableDataSets: DataSet[] = [bostonHousePricing, pimaIndiansDiabetes]

  addDataSet = addDataSet

  // -> TRAIN OPTIONS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // trainOptions context: provides the dataSet (currently a simple class instance)
  // and its corresponding actions
  @provide({ context: trainOptionsContext })
  @property({ attribute: true, type: Object, reflect: true })
  trainOptions: TrainOptions = defaultTrainOptions

  setTrainOption = setTrainOption

  // HTML container where metrics like accuracy and loss are plotted into
  @state()
  trainMetricsContainer: HTMLDivElement

  // -> MODEL  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // model context: provides the tensorflow.js model based on the network and
  // corresponding actions like training
  @provide({ context: modelConfContext })
  @property({ attribute: false })
  modelConf: ModelConf = defaultModelConf

  resetModel = resetModel
  buildModel = buildModel
  trainModel = trainModel
  stopTraining = stopTraining
  predictModel = predictModel

  // -> SELECTED - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // selected context: provides info about what item in the canvas (layer,
  // neuron, edge) is currently selected and a function to change that
  @provide({ context: selectedContext })
  @property({ attribute: false })
  selected: Selected = {}

  select = select

  // -> PANELS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // panels context: provide the open panels and functions to change them
  @provide({ context: openPanelsContext })
  @property({ attribute: false })
  openPanels: string[] = []

  openPanel = openPanel
  closePanels = closePanels

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  connectedCallback() {
    super.connectedCallback()

    // -> ADD EVENT LISTENERS
    // ---> SETUP
    this.renderRoot.addEventListener(
      'setup-completed',
      (e: CustomEvent<string>) => this.setupCompleted(e.detail)
    )
    // ---> IMPORT
    this.renderRoot.addEventListener(
      'config-v1-imported',
      (e: CustomEvent<FileConfigV1>) => this.handleConfigV1Imported(e.detail)
    )
    // ---> SELECT
    this.renderRoot.addEventListener(
      'select',
      (
        e: CustomEvent<{
          layer?: CLayer
          neuron?: Neuron
          Edge?: Edge
        }>
      ) => this.select(e.detail)
    )
    // ---> PANELS
    this.renderRoot.addEventListener(
      'open-panel',
      (
        e: CustomEvent<{
          panel: string
          group?: string
        }>
      ) => this.openPanel(e.detail.panel, e.detail.group)
    )
    // we need to listen on window element since events to close panels
    // sometimes are emitted in disconnected callback functions, so they need to
    // emit the event at window level since they are not in the DOM anymore at
    // this point
    window.addEventListener('close-panels', (e: CustomEvent<string[]>) =>
      this.closePanels(e.detail)
    )
    // ---> DATA SEt
    this.renderRoot.addEventListener(
      'add-data-set',
      (e: CustomEvent<DataSet>) => this.addDataSet(e.detail)
    )
    // ---> NETWORK
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
    this.renderRoot.addEventListener('layer-confs-updated', (_e: Event) =>
      this.updateLayerConfs()
    )
    this.renderRoot.addEventListener(
      'remove-layer-connection',
      (e: CustomEvent<{ source: number; target: number }>) =>
        this.removeLayerConnection(e.detail.source, e.detail.target)
    )
  }

  updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties)

    if (!this.network) {
      this.network = this._network
    }

    // reset the model on data set change
    if (changedProperties.has('dataSet')) {
      this.resetModel()
    }
  }

  // EVENT HANDLERS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> IMPORTING  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleConfigV1Imported(config: FileConfigV1): void {
    if (this.availableDataSets.includes(this.dataSet)) {
      this.addDataSet(config.dataSet)
    }
    this.dataSet = config.dataSet
    this.layerConfs = config.layerConfs
    this.layerConnectionConfs = config.layerConnectionConfs
    this.resetModel()
    this.openPanels = []
    this.selected = {}
    this.trainOptions = config.trainOptions
    setTimeout(() => {
      this.canvas.fit()
    }, 50)
  }

  // initialize the canvas
  createCanvas(canvas: CCanvas) {
    this.canvas = canvas
    this.setupCompleted('canvas')
  }

  // reset the network by resetting the network conf
  clearNetwork() {
    // deselect the currently selected element since it will be removed
    this.select()

    // empty the network
    this.layerConnectionConfs = []
    this.layerConfs = []
  }

  // set error rate container
  setTrainMetricsContainer(container: HTMLDivElement) {
    this.trainMetricsContainer = container
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
        background-color: #f7f7f7;
      }

      #loadingPage {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: #f7f7f7;
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
        background-color: #efefef;
      }
    `,
  ]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1>[] {
    const renderedHTML: TemplateResult<1>[] = []
    renderedHTML.push(html` <canvas-area
      class="${!this.openPanels.some((openPanel: string) => {
        return panelGroups['right'].includes(openPanel)
      })
        ? 'right-collapsed'
        : ''}"
      @canvas-created="${(e: CustomEvent<CCanvas>) =>
        this.createCanvas(e.detail)}"
    ></canvas-area>`)
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
        <div
          id="divider"
          class="${!this.openPanels.some((openPanel: string) => {
            return panelGroups['right'].includes(openPanel)
          })
            ? 'hidden'
            : ''}"
        ></div>

        <menu-area
          class="${!this.openPanels.some((openPanel: string) => {
            return panelGroups['right'].includes(openPanel)
          })
            ? 'right-collapsed'
            : ''}"
          @change-data-set="${(e: CustomEvent<DataSet>) =>
            (this.dataSet = e.detail)}"
          @clear-network="${(_e: Event) => this.clearNetwork()}"
          @set-train-metrics-container="${(e: CustomEvent<HTMLDivElement>) =>
            this.setTrainMetricsContainer(e.detail)}"
          @set-train-option="${(
            e: CustomEvent<{
              option: string
              value: string
            }>
          ) => this.setTrainOption(e.detail.option, e.detail.value)}"
          @reset-model="${(_e: Event) => this.resetModel()}"
          @train-model="${(_e: Event) => this.trainModel()}"
          @stop-training="${(_e: Event) => this.stopTraining()}"
        ></menu-area>

        <c-network></c-network>
      `)
    }
    return renderedHTML
  }
}
