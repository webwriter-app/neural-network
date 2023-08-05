import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'
import { provide } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { ShortcutListener } from '@/utils/shortcut_listener'

import {
  SetupStatus,
  setupStatusContext,
} from '@/contexts/setup_status_context'
import { Guard, guardContext } from '@/contexts/guard_context'
import { canvasContext } from '@/contexts/canvas_context'
import { layerConfsContext } from '@/contexts/layer_confs_context'
import { layerConnectionConfsContext } from '@/contexts/layer_con_confs_context'
import { networkContext } from '@/contexts/network_context'
import { dataSetContext } from '@/contexts/data_set_context'
import { availableDataSetsContext } from '@/contexts/available_data_sets_context'
import {
  TrainOptions,
  trainOptionsContext,
} from '@/contexts/train_options_context'
import { Model, modelContext } from '@/contexts/model_context'
import { Selected, selectedContext } from '@/contexts/selected_context'
import { panelGroups, openPanelsContext } from '@/contexts/panels_context'

import type { CCanvas } from '@/components/canvas'
import type { FileConfig } from '@/types/file_config'
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

import { spawnAlert } from '@/utils/alerts'

import '@/components/network/network'
import '@/components/canvas_area'
import '@/components/menu_area'

import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'

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
  setupStatus: SetupStatus = {
    canvasCompleted: false,
    dataSetCompleted: false,
    loading: true,
  }

  setupCompleted(name: string): void {
    this.setupStatus[`${name}Completed`] = true
    this.setupStatus = { ...this.setupStatus }
    this.checkLoading()
  }

  checkLoading(): void {
    if (!Object.values(this.setupStatus).some((value) => value == false)) {
      this.setupStatus.loading = false
      this.setupStatus = { ...this.setupStatus }
    }
  }

  // -> GUARD  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // guard context: provides boolean functions that are used throughout the
  // widget to check if some action is currently allowed. since the guard
  // context does not provide data itself, it is unnecessary to store it as an
  // attribute (which would even cause problems)
  @provide({ context: guardContext })
  @property({ attribute: false })
  guard: Guard = {
    mayChangeNetworkTopology: () => {
      if (this.model.model) return false
      return true
    },
  }

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

  addLayer(layerConf: CLayerConf): void {
    this.layerConfs.push(layerConf)
    this.updateLayerConfs()
  }

  updateLayerConfs() {
    this.layerConfs = [...this.layerConfs]
  }

  removeLayer(layerId: number): void {
    const index = this.layerConfs.findIndex((layerConf) => {
      return layerConf.layerId == layerId
    })
    if (index > -1) {
      this.layerConfs.splice(index, 1)
      this.updateLayerConfs()
    }
  }

  // layer connections conf context: provides the layer connection
  // configurations
  @provide({ context: layerConnectionConfsContext })
  @property({ attribute: true, type: Array, reflect: true })
  layerConnectionConfs: CLayerConnectionConf[] = []

  addLayerConnection(source: number, target: number): void {
    const layerConnectionConf: CLayerConnectionConf = {
      sourceLayerId: source,
      targetLayerId: target,
    }
    this.layerConnectionConfs.push(layerConnectionConf)
    this.layerConnectionConfs = [...this.layerConnectionConfs]
  }

  removeLayerConnection(source: number, target: number): void {
    const index = this.layerConnectionConfs.findIndex((layerConnectionConf) => {
      return (
        layerConnectionConf.sourceLayerId == source &&
        layerConnectionConf.targetLayerId == target
      )
    })
    if (index > -1) {
      this.layerConnectionConfs.splice(index, 1)
      this.layerConnectionConfs = [...this.layerConnectionConfs]
    }
  }

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
  dataSet: DataSet

  // available data sets
  @provide({ context: availableDataSetsContext })
  @property({ attribute: false })
  availableDataSets: DataSet[] = [bostonHousePricing, pimaIndiansDiabetes]

  addDataSet(dataSet: DataSet) {
    this.availableDataSets.push(dataSet)
    this.availableDataSets = [...this.availableDataSets]
  }

  // bind functions to 'this'
  getInputDataByKeys = getInputDataByKeys
  getLabelData = getLabelData

  // -> TRAIN OPTIONS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // trainOptions context: provides the dataSet (currently a simple class instance)
  // and its corresponding actions
  @provide({ context: trainOptionsContext })
  @property({ attribute: true, type: Object, reflect: true })
  trainOptions: TrainOptions = {
    learningRate: '0.001',
    dropoutRate: '0',
    epochs: '7',
    batchSize: '32',
    lossFunction: 'meanSquaredError',
    optimizer: 'sgd',
  }

  setTrainOption(option: string, value: string) {
    this.trainOptions[option] = value
    this.trainOptions = { ...this.trainOptions }
  }

  // HTML container where metrics like accuracy and loss are plotted into
  @state()
  trainMetricsContainer: HTMLDivElement

  // -> MODEL  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // model context: provides the tensorflow.js model based on the network and
  // corresponding actions like training
  @provide({ context: modelContext })
  @property({ attribute: false })
  model: Model = {
    model: null,
    isTraining: false,
    actBatch: null,
    actEpoch: null,
    stopRequested: false,
  }

  resetModel(): void {
    if (this.model.model) {
      // set stopRequested to true because we want to be able to call reset()
      // also to abort a current running training session. Will not have any
      // complications because the train method itself sets it to false before
      // it is used
      this.model.stopRequested = true

      // set the model to null
      this.model.model = null
      this.model = { ...this.model }

      // empty the container for the metrics. if we did not do this, it would
      // also show the metrics from the previous training
      this.trainMetricsContainer.innerHTML = ''

      // remove model references (like tensor and weights) in the network
      this.network.handleResetModel()
    }
  }

  buildModel(): void {
    this.resetModel()
    const model = this.network.buildModel()
    if (model && this.dataSet) {
      const metrics: string[] = []
      let loss: string
      if (this.dataSet.type == 'regression') {
        loss = 'meanSquaredError'
      } else if (this.dataSet.type == 'classification') {
        loss = 'categoricalCrossentropy'
        metrics.push('acc')
      } else {
        return
      }
      const optimizer = tf.train.sgd(parseFloat(this.trainOptions.learningRate))
      model.compile({
        optimizer,
        loss,
        metrics,
      })
      this.model.model = model
      console.log(model.summary())
      spawnAlert({
        message: `The model was successfully compiled! All hyperparameter and network architecture changes were taken into account!`,
        variant: 'success',
        icon: 'check-circle',
      })
      this.model = { ...this.model }
    }
  }

  trainModel(): void {
    //if (!this.model.model) {
    this.buildModel()
    //}

    if (this.model.model) {
      // a manual stop can be requested by setting this variable to true (is
      // periodically checked)
      this.model.stopRequested = false

      // set the isTraining boolean variable that is used in the ui do
      // determine what to display
      this.model.actEpoch = 0
      this.model.actBatch = 0
      this.model.isTraining = true
      this.model = { ...this.model }

      // inputs
      const inputData: number[][] = []
      for (const inputLayer of this.network.getInputLayers()) {
        inputData.push(...this.getInputDataByKeys(inputLayer.conf.dataSetKeys))
      }
      const inputs: tf.Tensor = tf.tensor(inputData)

      // metrics and label tensors depend on regression vs classification type
      const labelData: number[] = this.getLabelData()
      const metrics: string[] = ['loss']
      let labels: tf.Tensor
      if (this.dataSet.type == 'regression') {
        labels = tf.tensor(labelData)
      } else if (
        this.dataSet.type == 'classification' &&
        this.dataSet.label.classes
      ) {
        metrics.push('acc')
        labels = tf.oneHot(
          tf.tensor(labelData, undefined, 'int32'),
          this.dataSet.label.classes.length
        )
      } else {
        return
      }

      // start the training itself
      void this.model.model
        .fit(inputs, labels, {
          epochs: parseInt(this.trainOptions.epochs),
          batchSize: parseInt(this.trainOptions.batchSize),
          callbacks: [
            tfvis.show.fitCallbacks(this.trainMetricsContainer, metrics, {
              height: 100,
            }),
            {
              onBatchEnd: (batch: number, _logs) => {
                // after each batch check if a stop was requested
                if (this.model.stopRequested) {
                  this.model.model.stopTraining = true
                }
                // update the act batch var (for displaying purposes)
                this.model.actBatch = batch + 1
                // update the weights to be displayed in the neurons
                this.network.updateWeights(this.model.model.getWeights())
                // update the model to reflect all changes
                this.model = { ...this.model }
              },
              onEpochEnd: (epoch: number, _logs) => {
                this.model.actEpoch = epoch + 1
                this.model = { ...this.model }
              },
            },
          ],
        })
        .then((info) => {
          console.log(info)
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          setTimeout(() => {
            this.model.isTraining = false
            this.model = { ...this.model }
          }, 500)
        })
    }
  }

  // stop training
  stopTraining() {
    this.model.stopRequested = true
  }

  predict(): void {
    return
  }

  // -> SELECTED - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // selected context: provides info about what item in the canvas (layer,
  // neuron, edge) is currently selected and a function to change that
  @provide({ context: selectedContext })
  @property({ attribute: false })
  selected: Selected = {}

  select({
    layer = null,
    neuron = null,
    edge = null,
  }: { layer?: CLayer; neuron?: Neuron; edge?: Edge } = {}): void {
    const newSelected = {}
    if (neuron && layer) {
      newSelected['neuron'] = neuron
      newSelected['layer'] = layer
      this.openPanel('neuron', 'right')
    } else if (layer) {
      newSelected['layer'] = layer
      this.openPanel('layer', 'right')
    } else if (edge) {
      /* if(elm instanceof Edge) */
      newSelected['edge'] = edge
      this.openPanel('edge', 'right')
    }
    this.selected = newSelected
  }

  // -> PANELS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // panels context: provide the open panels and functions to change them
  @provide({ context: openPanelsContext })
  @property({ attribute: false })
  openPanels: string[] = []

  openPanel(panel: string, group?: string): void {
    if (group) {
      this.closePanels(panelGroups[group])
    }
    this.openPanels.push(panel)
    this.openPanels = [...this.openPanels]
  }

  closePanels(panels: string[]): void {
    this.openPanels = this.openPanels.filter((openPanel: string) => {
      return !panels.includes(openPanel)
    })
    this.openPanels = [...this.openPanels]
  }

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
      'config-imported',
      (e: CustomEvent<FileConfig>) => this.handleConfigImported(e.detail)
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

    // -> DATA SET
    // load the standard dataSet if none was loaded by default
    if (!this.dataSet) {
      this.dataSet = this.availableDataSets[0]
      this.setupCompleted('dataSet')
    } else {
      this.setupCompleted('dataSet')
    }
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

  // OWN METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> IMPORTING  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleConfigImported(config: FileConfig): void {
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
    this.select({})

    // empty the network
    this.layerConfs = []
    this.layerConnectionConfs = []
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
