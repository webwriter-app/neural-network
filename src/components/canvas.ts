import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement, state, query, property } from 'lit/decorators.js'
import { consume } from '@lit/context'

import cytoscape from 'cytoscape'

import type { Position } from '@/types/position'
import { InputLayer } from '@/components/network/input_layer'
import { DenseLayer } from '@/components/network/dense_layer'
import { OutputLayer } from '@/components/network/output_layer'
import type { Theme } from '@/types/theme'
import { themeContext } from '@/contexts/theme_context'

import colorsea from 'colorsea'

export class CCanvas extends LitElementWw {
  LAYER_WIDTH = 300
  LAYER_PADDING = 20
  LAYER_DISTANCE = 150
  NEURON_SIZE = 100
  NEURON_DISTANCE = 40

  @query('#canvasElm', true)
  accessor _canvasElm: HTMLDivElement

  @consume({ context: themeContext, subscribe: true })
  @property({ attribute: false })
  accessor theme: Theme

  @state()
  accessor cy: cytoscape.Core

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async connectedCallback() {
    super.connectedCallback()
    await this.updateComplete
    if (!this.cy) {
      // create cytoscape canvas
      this.cy = cytoscape({
        container: this._canvasElm,
        elements: [],
        style: this.getStylesheetForCy(),
        // wheelSensitivity: 0.2,
        boxSelectionEnabled: false,
        selectionType: 'single',
      })
    }

    // notify the root element that the canvas was created
    this.dispatchEvent(
      new CustomEvent<CCanvas>('canvas-created', {
        detail: this,
        bubbles: true,
        composed: true,
      })
    )

    // notify the root element that the setup for the canvas is completed
    this.dispatchEvent(
      new CustomEvent<string>('setup-completed', {
        detail: 'canvas',
        bubbles: true,
        composed: true,
      })
    )

    // Add event listener: when tapped on canvas, remove the current selection
    // and close the panels as well
    this.cy.on('tap', (e) => {
      if (e.target === this.cy) {
        this.dispatchEvent(
          new Event('unselect', {
            bubbles: true,
            composed: true,
          })
        )
        this.dispatchEvent(
          new Event('close-all-panels', {
            bubbles: true,
            composed: true,
          })
        )
      }
    })

    // Add event listener for selection of layers, neurons or edges
    this.cy.on('click', 'node, edge', (e: cytoscape.EventObject) => {
      const evtTarget = <cytoscape.SingularData>e.target

      // Prevent selection of multiple nodes by holding shift
      this.cy
        .elements()
        .not(<cytoscape.CollectionArgument>evtTarget)
        .unselect()

      if (evtTarget.isNode()) {
        const cyNode = evtTarget

        if (cyNode.data('type') == 'layer') {
          this.dispatchEvent(
            new CustomEvent<string>('select-layer', {
              detail: <string>cyNode.data('id'),
              bubbles: true,
              composed: true,
            })
          )
        } else if (cyNode.data('type') == 'neuron') {
          this.dispatchEvent(
            new CustomEvent<string>('select-neuron', {
              detail: <string>cyNode.data('id'),
              bubbles: true,
              composed: true,
            })
          )
        }
      } else if (evtTarget.isEdge()) {
        const cyEdge = evtTarget
        this.dispatchEvent(
          new CustomEvent<string>('select-edge', {
            detail: <string>cyEdge.data('id'),
            bubbles: true,
            composed: true,
          })
        )
      }
    })
  }

  updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties)
    // when the themed changed, update the stylesheet for the canvas
    if (changedProperties.has('theme')) {
      this.cy?.style(this.getStylesheetForCy())
    }
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> STYLING  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  getStylesheetForCy(): cytoscape.Stylesheet[] {
    const MAIN_COLOR: string = colorsea(
      getComputedStyle(this).getPropertyValue('--sl-color-primary-200')
    ).hex()
    const TEXT_COLOR: string = colorsea(
      getComputedStyle(this).getPropertyValue('--sl-color-primary-900')
    ).hex()
    const ACCENT_COLOR: string = colorsea(
      getComputedStyle(this).getPropertyValue('--sl-color-primary-500')
    ).hex()
    const SELECTED_COLOR: string = colorsea(
      getComputedStyle(this).getPropertyValue('--sl-color-primary-900')
    ).hex()
    const POSITIVE_COLOR: string = colorsea(
      getComputedStyle(this).getPropertyValue('--sl-color-success-500')
    ).hex()
    const NEGATIVE_COLOR: string = colorsea(
      getComputedStyle(this).getPropertyValue('--sl-color-danger-500')
    ).hex()

    return [
      {
        selector: 'node[type="layer"]',
        style: {
          shape: 'round-rectangle',
          'background-color': MAIN_COLOR,
          'border-color': ACCENT_COLOR,
          color: TEXT_COLOR,
          'border-width': 5,
          padding: this.LAYER_PADDING,
          label: 'data(label)',
          'text-halign': 'left',
          'text-valign': 'center',
          'text-margin-x': -20,
          'z-index': function (ele: cytoscape.NodeSingular) {
            return ele.data('layer') * 3
          },
          'z-compound-depth': 'bottom',
        },
      },
      {
        selector: 'node[type="layer"]:selected',
        style: {
          'border-color': SELECTED_COLOR,
        },
      },
      {
        selector: 'node[type="neuron-wrapper"]',
        style: {
          shape: 'round-rectangle',
          'border-width': 1,
          'background-opacity': 0,
          'border-color': MAIN_COLOR,
          padding: 0,
          label: 'data(label)',
          color: TEXT_COLOR,
          'text-halign': 'center',
          'text-valign': function (ele: cytoscape.NodeSingular) {
            return <'bottom' | 'top'>ele.data('textPos')
          },
          'text-margin-y': function (ele: cytoscape.NodeSingular) {
            if (ele.data('textPos') == 'top') {
              return 30
            } else {
              return -30
            }
          },
          'z-index': function (ele: cytoscape.NodeSingular) {
            return ele.data('layer') * 3 + 1
          },
          'z-compound-depth': 'bottom',
        },
      },
      {
        selector: 'node[type="neuron"]',
        style: {
          shape: 'round-rectangle',
          'border-width': 5,
          'background-opacity': 0,
          'border-color': ACCENT_COLOR,
          width: '95px',
          height: '95px',
          'text-halign': 'center',
          'text-valign': 'center',
          'z-index': function (ele: cytoscape.NodeSingular) {
            return ele.data('layer') * 3 + 2
          },
          'z-compound-depth': 'bottom',
        },
      },
      {
        selector: 'node[type="neuron"][label]',
        style: {
          color: TEXT_COLOR,
          label: 'data(label)',
        },
      },
      {
        selector: 'node[type="neuron"][wrapped="true"]',
        style: {
          width: '93px',
          height: '93px',
        },
      },
      {
        selector: 'node[type="neuron"]:selected',
        style: {
          'border-color': SELECTED_COLOR,
        },
      },
      {
        selector: 'edge',
        style: {
          width: function (ele: cytoscape.EdgeSingular) {
            if (ele.data('weight') && isFinite(<number>ele.data('weight'))) {
              return Math.min(15, Math.abs(<number>ele.data('weight')) * 6)
            } else {
              return 3
            }
          },
          'curve-style': 'bezier',
          'line-cap': 'round',
          'line-color': function (ele: cytoscape.EdgeSingular) {
            if (ele.data('weight')) {
              if (ele.data('weight') < 0) {
                return NEGATIVE_COLOR
              } else if (ele.data('weight') > 0) {
                return POSITIVE_COLOR
              }
            }
            return ACCENT_COLOR
          },
          'target-arrow-color': function (ele: cytoscape.EdgeSingular) {
            if (ele.data('weight')) {
              if (ele.data('weight') < 0) {
                return NEGATIVE_COLOR
              } else if (ele.data('weight') > 0) {
                return POSITIVE_COLOR
              }
            }
            return ACCENT_COLOR
          },
          'target-arrow-shape': 'triangle',
        },
      },
      {
        selector: 'edge:selected',
        style: {
          'line-color': SELECTED_COLOR,
          'target-arrow-color': SELECTED_COLOR,
        },
      },
    ]
  }
  // -> MANIPULATION - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  zoomOut(): void {
    if (this.cy) {
      this.cy.zoom(this.cy.zoom() - 0.1)
    }
  }
  // fit the canvas to all elements with a specified padding
  fit(): void {
    if (this.cy) {
      this.cy.fit(this.cy.$(''), 30)
    }
  }
  zoomIn(): void {
    if (this.cy) {
      this.cy.zoom(this.cy.zoom() + 0.1)
    }
  }

  // -> POSITIONING  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get the width of an element
  getHeight(id: string): number {
    const elm = this.cy.getElementById(id)
    return elm.outerHeight()
  }

  // generate a new position, currently just in the middle of the canvas
  generatePos(): Position {
    const viewport = this.cy.extent()
    return {
      x: viewport.x1 + (viewport.x2 - viewport.x1) / 2,
      y: viewport.y1 + (viewport.y2 - viewport.y1) / 2,
    }
  }

  toModelPosition(renderedPos: Position) {
    const pan = this.cy.pan()
    const zoom = this.cy.zoom()
    return {
      x: (renderedPos.x - pan.x) / zoom,
      y: (renderedPos.y - pan.y) / zoom,
    }
  }

  // -> DROPPING LAYERS  - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleDrop(e: DragEvent) {
    this.dispatchEvent(
      new Event('drag-leaved', {
        bubbles: true,
        composed: true,
      })
    )
    const LAYER_TYPE: string = e.dataTransfer.getData('LAYER_TYPE')
    if (LAYER_TYPE && ['Input', 'Dense', 'Output'].includes(LAYER_TYPE)) {
      const renderedPos = {
        x: e.clientX,
        y: e.clientY,
      }
      const pos = this.toModelPosition(renderedPos)
      switch (LAYER_TYPE) {
        case 'Input':
          InputLayer.create({
            pos,
          })
          break
        case 'Dense':
          DenseLayer.create({
            pos,
          })
          break
        case 'Output':
          OutputLayer.create({
            pos,
          })
          break
      }
    }
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = css`
    #canvasElm {
      height: 100%;
      width: 100%;
    }
  `

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html` <style>
        ${this.theme.styles}
      </style>
      <div
        id="canvasElm"
        @dragenter="${(_e: DragEvent) =>
          this.dispatchEvent(
            new Event('drag-entered', {
              bubbles: true,
              composed: true,
            })
          )}"
        @dragover="${(e: DragEvent) => e.preventDefault()}"
        @dragleave="${(_e: DragEvent) =>
          this.dispatchEvent(
            new Event('drag-leaved', {
              bubbles: true,
              composed: true,
            })
          )}"
        @drop="${(e: DragEvent) => this.handleDrop(e)}"
      ></div>`
  }
}
