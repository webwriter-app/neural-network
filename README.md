# Neural Network (`@webwriter/neural-network@2.0.0`)
[License: MIT](LICENSE) | Version: 2.0.0

Visualize feed-forward neural networks with custom datasets, training, and prediction.

## Snippets
[Snippets](https://webwriter.app/docs/snippets/snippets/) are examples and templates using the package's widgets.

| Name | Import Path |
| :--: | :---------: |
| Pima Indians Diabetes | `@webwriter/neural-network/snippets/Pima-Indians-Diabetes.html` |
| Boston House Pricing | `@webwriter/neural-network/snippets/Boston-House-Pricing.html` |



## `WebwriterNeuralNetwork` (`<webwriter-neural-network>`)


### Usage

Use with a CDN (e.g. [jsdelivr](https://jsdelivr.com)):
```html
<link href="https://cdn.jsdelivr.net/npm/@webwriter/neural-network/widgets/webwriter-neural-network.css" rel="stylesheet">
<script type="module" src="https://cdn.jsdelivr.net/npm/@webwriter/neural-network/widgets/webwriter-neural-network.js"></script>
<webwriter-neural-network></webwriter-neural-network>
```

Or use with a bundler (e.g. [Vite](https://vite.dev)):

```
npm install @webwriter/neural-network
```

```html
<link href="@webwriter/neural-network/widgets/webwriter-neural-network.css" rel="stylesheet">
<script type="module" src="@webwriter/neural-network/widgets/webwriter-neural-network.js"></script>
<webwriter-neural-network></webwriter-neural-network>
```

## Fields
| Name (Attribute Name) | Type | Description | Default | Reflects |
| :-------------------: | :--: | :---------: | :-----: | :------: |
| `WebwriterNeuralNetwork.scopedElements` | `object` | Scoped element registry for child components used by this widget. | `{ "canvas-area": CCanvasArea, "menu-area": MenuArea, "c-network": CNetwork }` | ✗ |
| `WebwriterNeuralNetwork.convertFrom` | `object` | - | `{ '.csv': 'importCsv', '.json': 'importJson' }` | ✗ |
| `WebwriterNeuralNetwork.convertTo` | `object` | - | `{ 'text/csv': 'exportCsv', 'application/json': 'exportJson' }` | ✗ |
| `WebwriterNeuralNetwork.options` | `object` | - | `{ editable: { type: Boolean, label: (widget: {msg: MsgFn}) => widget.msg("Allow editing") }, }` | ✗ |
| `msg` | - | - | - | ✗ |
| `signals` | `object` | Read-only signals for other widgets: the training history and its last loss. | `{ history: computed(() => this.#history.get()), loss: computed(() => { const { columns, rows } = this.#history.get() const at = columns.indexOf('loss') return rows.length && at > 0 ? (rows[rows.length - 1][at] as number \| null) : null }), }` | ✗ |
| `setupStatus` | `SetupStatus` | Setup state of the widget. | - | ✗ |
| `editable` (`editable`) | `boolean` | Whether editing is enabled. | - | ✓ |
| `settings` | `Settings` | Application settings. | - | ✗ |
| `qAndA` | `QAndAEntry[]` | Help/Q&A content. | - | ✗ |
| `canvas` | `CCanvas` | Canvas instance created by the canvas-area. | - | ✗ |
| `network` | `CNetwork` | Network instance. | - | ✗ |
| `layerConfs` | `CLayerConf[]` | Layer configuration list. | - | ✗ |
| `layerConnectionConfs` | `CLayerConnectionConf[]` | Layer connection configuration list between layers. | - | ✗ |
| `dataSet` | `DataSet` | Active dataset. | - | ✗ |
| `availableDataSets` | `DataSet[]` | Available datasets. | - | ✗ |
| `trainOptions` | `TrainOptions` | Training options. | - | ✗ |
| `modelConf` | `ModelConf` | Current model configuration. | - | ✗ |
| `selected` | `Selected` | Current multi-selection state. | - | ✗ |
| `selectedEle` | `SelectedEle` | Current single selected element. | - | ✗ |
| `panel` | `string` | Name of the open right panel, if any. | - | ✗ |

*Fields including [properties](https://developer.mozilla.org/en-US/docs/Glossary/Property/JavaScript) and [attributes](https://developer.mozilla.org/en-US/docs/Glossary/Attribute) define the current state of the widget and offer customization options.*

## Methods
| Name | Description | Parameters |
| :--: | :---------: | :-------: |
| `importCsv` | - | `file: File`
| `importJson` | - | `file: File`
| `exportCsv` | - | -
| `exportJson` | - | -

*[Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions) allow programmatic access to the widget.*

## Events
| Name | Description |
| :--: | :---------: |
| focus | - |

*[Events](https://developer.mozilla.org/en-US/docs/Web/Events) are dispatched by the widget after certain triggers.*

## Custom CSS properties
| Name | Description |
| :--: | :---------: |
| --ww-text-color | Text color of the widget and the network labels. |
| --ww-font-family | Font family of the widget. |
| --ww-theme-accent-1 | Color of the layers, neurons and edges of the network. |
| --ww-theme-accent-2 | Color of the selected layer, neuron or edge. |
| --sl-color-neutral-0 | Host background color (forwarded from Shoelace). |
| --sl-color-neutral-50 | Divider color (forwarded from Shoelace). |

*[Custom CSS properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties) offer defined customization of the widget's style.*

## CSS parts
| Name | Description |
| :--: | :---------: |
| canvas | The drawing area with the network. |
| menu | The side menu with the panels. ## Files Import: a `.csv` file becomes a new data set that is selected (a header row names the columns, the last column is the label; labels 0 to k-1 make a classification data set, others a regression data set) and a `.json` config file replaces the network and data sets. Export: `text/csv` writes the active data set (class descriptions are not part of CSV); `application/json` writes the config and, once trained, the weights and biases of each layer under `weights`. The import of a `.json` file reads the config only and ignores `weights`, so a trained model is not restored. ## Signals - `history`: table of the training history, columns `epoch`, `loss`, `val_loss`, `acc`, `val_acc` (only the logged ones), one row per epoch. Empty before training. - `loss`: number, the training loss of the last epoch, or null before training. The widget has no effects: nothing from another widget fits a network. |

*[CSS parts](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_shadow_parts) allow freely styling internals of the widget with CSS.*

## Editing config
| Name | Value |
| :--: | :---------: |
| `importFormats` | `.csv,.json` |
| `exportFormats` | `text/csv,application/json` |

*The [editing config](https://webwriter.app/docs/packages/configuring/#editingconfig) defines how explorable authoring tools such as [WebWriter](https://webwriter.app) treat the widget.*

*No public slots.*


---
*Generated with @webwriter/build@1.15.0*
