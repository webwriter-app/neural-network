# Neural Network (`@webwriter/neural-network@1.1.5`)
[License: MIT](LICENSE) | Version: 1.1.5

Deep learning visualization for feed-forward networks with custom datasets, training and prediction.

## Snippets
[Snippets](https://webwriter.app/docs/snippets/snippets/) are examples and templates using the package's widgets.

| Name | Import Path |
| :--: | :---------: |
| Pima Indians Diabetes | `@webwriter/neural-network/snippets/Pima-Indians-Diabetes.html` |
| Boston House Pricing | `@webwriter/neural-network/snippets/Boston-House-Pricing.html` |



## `NeuralNetwork` (`<webwriter-neural-network>`)


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
| `NeuralNetwork.scopedElements` | `object` | Scoped element registry for child components used by this widget. | `{ "canvas-area": CCanvasArea, "menu-area": MenuArea, "c-network": CNetwork, "theme-switch": ThemeSwitch }` | ✗ |
| `setupStatus` | `SetupStatus` | Setup state of the widget. | - | ✗ |
| `editable` (`editable`) | `boolean` | Whether editing is enabled. | - | ✓ |
| `settings` (`settings`) | `Settings` | Application settings. | - | ✓ |
| `qAndA` (`qAndA`) | `QAndAEntry[]` | Help/Q&A content. | - | ✓ |
| `canvas` | `CCanvas` | Canvas instance created by the canvas-area. | - | ✗ |
| `network` | `CNetwork` | Network instance. | - | ✗ |
| `layerConfs` (`layerConfs`) | `CLayerConf[]` | Layer configuration list. | - | ✓ |
| `layerConnectionConfs` (`layerConnectionConfs`) | `CLayerConnectionConf[]` | Layer connection configuration list between layers. | - | ✓ |
| `dataSet` (`dataSet`) | `DataSet` | Active dataset. | - | ✓ |
| `availableDataSets` (`availableDataSets`) | `DataSet[]` | Available datasets. | - | ✓ |
| `trainOptions` (`trainOptions`) | `TrainOptions` | Training options. | - | ✓ |
| `modelConf` | `ModelConf` | Current model configuration. | - | ✗ |
| `selected` | `Selected` | Current multi-selection state. | - | ✗ |
| `selectedEle` | `SelectedEle` | Current single selected element. | - | ✗ |
| `panel` | `boolean` | Whether the right panel is open. | - | ✗ |
| `theme` | `Theme` | Active theme object with style string. | - | ✗ |
| `setupStatusProvider` | - | - | `new ContextProvider(this, {context: setupStatusContext, initialValue: SetupUtils.defaultSetupStatus})` | ✗ |
| `editableProvider` | - | - | `new ContextProvider(this, {context: editableContext, initialValue: false})` | ✗ |
| `settingsProvider` | - | - | `new ContextProvider(this, {context: settingsContext, initialValue: JSON.parse(JSON.stringify(SettingsUtils.defaultSettings))})` | ✗ |
| `qAndAProvider` | - | - | `new ContextProvider(this, {context: qAndAContext, initialValue: [...QAndAUtils.defaultQAndA]})` | ✗ |
| `canvasProvider` | - | - | `new ContextProvider(this, {context: canvasContext})` | ✗ |
| `networkProvider` | - | - | `new ContextProvider(this, {context: networkContext})` | ✗ |
| `layerConfsProvider` | - | - | `new ContextProvider(this, {context: layerConfsContext, initialValue: []})` | ✗ |
| `layerConnectionConfsProvider` | - | - | `new ContextProvider(this, {context: layerConnectionConfsContext, initialValue: []})` | ✗ |
| `dataSetProvider` | - | - | `new ContextProvider(this, {context: dataSetContext, initialValue: DataSetUtils.defaultDataSet})` | ✗ |
| `availableDataSetsProvider` | - | - | `new ContextProvider(this, {context: availableDataSetsContext, initialValue: DataSetUtils.defaultAvailableDataSets})` | ✗ |
| `trainOptionsProvider` | - | - | `new ContextProvider(this, {context: trainOptionsContext, initialValue: <TrainOptions>(JSON.parse(JSON.stringify(ModelUtils.defaultTrainOptions)))})` | ✗ |
| `modelConfProvider` | - | - | `new ContextProvider(this, {context: modelConfContext, initialValue: <ModelConf>(JSON.parse(JSON.stringify(ModelUtils.defaultModelConf)))})` | ✗ |
| `selectedProvider` | - | - | `new ContextProvider(this, {context: selectedContext, initialValue: {}})` | ✗ |
| `selectedEleProvider` | - | - | `new ContextProvider(this, {context: selectedEleContext})` | ✗ |
| `panelProvider` | - | - | `new ContextProvider(this, {context: panelContext})` | ✗ |
| `themeProvider` | - | - | `new ContextProvider(this, {context: themeContext, initialValue: ThemeUtils.lightTheme})` | ✗ |

*Fields including [properties](https://developer.mozilla.org/en-US/docs/Glossary/Property/JavaScript) and [attributes](https://developer.mozilla.org/en-US/docs/Glossary/Attribute) define the current state of the widget and offer customization options.*

## Events
| Name | Description |
| :--: | :---------: |
| focus | - |

*[Events](https://developer.mozilla.org/en-US/docs/Web/Events) are dispatched by the widget after certain triggers.*

## Custom CSS properties
| Name | Description |
| :--: | :---------: |
| --sl-color-neutral-0 | Host background color (forwarded from Shoelace). |
| --sl-color-neutral-50 | Divider color (forwarded from Shoelace). |

*[Custom CSS properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties) offer defined customization of the widget's style.*

## Editing config
| Name | Value |
| :--: | :---------: |


*The [editing config](https://webwriter.app/docs/packages/configuring/#editingconfig) defines how explorable authoring tools such as [WebWriter](https://webwriter.app) treat the widget.*

*No public methods, slots, or CSS parts.*


---
*Generated with @webwriter/build@1.9.0*