import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, css, html, nothing } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { SlChangeEvent, SlDialog } from '@shoelace-style/shoelace'
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js'

import { globalStyles } from '@/global_styles'

import { availableDataSetsContext } from '@/contexts/available_data_sets_context'

import { spawnAlert } from '@/utils/alerts'
import type { DataSet } from '@/data_set/data_set'

@customElement('create-data-set-dialog')
export class CreateDataSetDialog extends LitElementWw {
  // CONSUME - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @consume({ context: availableDataSetsContext, subscribe: true })
  availableDataSets: DataSet[]

  // STATE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  emptyConfig: DataSet = {
    name: '',
    description: '',
    type: 'regression',
    inputs: [{ key: '', description: '' }],
    label: {
      key: '',
      description: '',
      classes: [
        { key: '', description: '' },
        { key: '', description: '' },
      ],
    },
    data: [],
  }

  @state()
  step: number = 1

  @property()
  config: DataSet = this.emptyConfig

  @state()
  data: string

  // QUERY - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @query('sl-dialog')
  _dialog: SlDialog

  @query('.dialog-form')
  _dialogForm: HTMLFormElement

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async connectedCallback(): Promise<void> {
    super.connectedCallback()
    await this.updateComplete
    this._dialogForm.addEventListener('submit', (e: MouseEvent) =>
      this.nextStep(e)
    )
    /*     setInterval(() => {
      const formControls = getFormControls(this._dialogForm)

      console.log(formControls) // e.g. [input, sl-input, ...]
    }, 1000) */
  }
  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async show() {
    await this._dialog.show()
    console.log(this._dialogForm)
    console.log(serialize(this._dialogForm).data)
    if (this.step != 1 || serialize(this._dialogForm).data) {
      spawnAlert({
        message:
          'The progress you made in creating your own data set was successfully restored!',
        variant: 'success',
        icon: 'check-circle',
      })
    }
  }

  nextStep(e: MouseEvent) {
    e.preventDefault()
    if (this.step == 5) {
      void this.validateAndCreate()
    } else {
      this.step++
    }
  }

  // step 3 (configuring the inputs and outputs (names/descriptions))
  addInput() {
    this.config.inputs.push({ key: '', description: '' })
    this.config = { ...this.config }
  }

  removeInput() {
    this.config.inputs.pop()
    this.config = { ...this.config }
  }

  // step 4 (configuring the inputs and outputs (names/descriptions))

  addClazz() {
    this.config.label.classes.push({ key: '', description: '' })
    this.config = { ...this.config }
  }

  removeClazz() {
    this.config.label.classes.pop()
    this.config = { ...this.config }
  }

  // step 5 (pastte data set form)
  async validateAndCreate() {
    // get data
    const data: string = <string>serialize(this._dialogForm).data

    if (
      this.availableDataSets.find((dataSet) => dataSet.name == this.config.name)
    ) {
      spawnAlert({
        message: `A data set with the same name already exists!`,
        variant: 'danger',
        icon: 'x-circle',
      })
      return
    }

    // additional validation
    const pattern = new RegExp(
      `^(\\s*(?:(?:[-+]?\\d+(?:\\.\\d*)?)|(?:\\d*\\.\\d+))(?:\\s+(?:(?:[-+]?\\d+(?:\\.\\d*)?)|(?:\\d*\\.\\d+))){${this.config.inputs.length}}\\s*)+$`
    )
    const result = pattern.test(data)
    if (!result) {
      spawnAlert({
        message: `The provided data does not match the required format! Please check again`,
        variant: 'danger',
        icon: 'x-circle',
      })
      return
    }

    // checks all passed, we can proceed parsing data
    const lines = data.split('\n')
    for (const line of lines) {
      // remove spaces in the beginning and end with trim and use split to
      // convert into array of the values
      const values: string[] = line.trim().split(/\s+/)

      // parse input and output data (config.inputs.length * input values and
      // one output/label)
      const inputs: number[] = []
      let index = 0
      for (const _input of this.config.inputs) {
        inputs.push(parseInt(values[index]))
        index += 1
      }
      const label: number = parseInt(values[index])

      // add parsed data from this line to the data array
      this.config.data.push({
        inputs,
        label,
      })
    }

    this.dispatchEvent(
      new CustomEvent<DataSet>('add-data-set', {
        detail: this.config,
        bubbles: true,
        composed: true,
      })
    )
    this.dispatchEvent(
      new CustomEvent<DataSet>('select-data-set', {
        detail: this.config,
        bubbles: true,
        composed: true,
      })
    )

    this.config = this.emptyConfig
    this.step = 1

    spawnAlert({
      message:
        'A new data set was successfully created and automatically selected!',
      variant: 'success',
      icon: 'check-circle',
    })
    await this._dialog.hide()
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [
    globalStyles,
    css`
      sl-dialog::part(body) {
        text-align: center;
      }
      .form-main {
        margin: 15px 0;
      }
      p,
      sl-input,
      sl-textarea,
      sl-button,
      c-card {
        margin-bottom: 10px;
      }
      form *[label] {
        text-align: left;
      }
      .step-chooser {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;

        margin-bottom: 20px;
      }
    `,
  ]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <sl-dialog label="Create a new data set">
        <div class="step-chooser">
          <sl-button
            circle
            variant="${this.step == 1 ? 'primary' : 'default'}"
            @click="${(_e: MouseEvent) => (this.step = 1)}"
          >
            1
          </sl-button>
          <sl-button
            circle
            variant="${this.step == 2 ? 'primary' : 'default'}"
            @click="${(_e: MouseEvent) => (this.step = 2)}"
            .disabled="${this.step < 2}"
          >
            2
          </sl-button>
          <sl-button
            circle
            variant="${this.step == 3 ? 'primary' : 'default'}"
            @click="${(_e: MouseEvent) => (this.step = 3)}"
            .disabled="${this.step < 3}"
          >
            3
          </sl-button>
          <sl-button
            circle
            variant="${this.step == 4 ? 'primary' : 'default'}"
            @click="${(_e: MouseEvent) => (this.step = 4)}"
            .disabled="${this.step < 4}"
          >
            4
          </sl-button>
          <sl-button
            circle
            variant="${this.step == 5 ? 'primary' : 'default'}"
            @click="${(_e: MouseEvent) => (this.step = 5)}"
            .disabled="${this.step < 5}"
          >
            5
          </sl-button>
        </div>
        <form class="dialog-form">
          <div class="form-main">
            <div class="${this.step != 1 ? 'hidden' : ''}">
              <h1>Welcome</h1>
              <p>
                This tour will guide you through creating your own data set in a
                few simple steps. Everything is stored automatically, so you can
                close this modal at any time and resume.
              </p>
            </div>
            <div class="${this.step != 2 ? 'hidden' : ''}">
              <h1>General info about the data set</h1>
              <p>
                Choose a short but meaningful name for your data set and write a
                description.
              </p>
              <sl-input
                name="name"
                label="Name"
                placeholder="Boston House Pricing"
                ?required=${this.step == 2}
                minlength=${this.step == 2 ? 1 : nothing}
                @sl-change=${(e: SlChangeEvent) => {
                  this.config.name = (<HTMLInputElement>e.target).value
                  this.config = { ...this.config }
                }}
              ></sl-input>
              <sl-textarea
                rows="4"
                name="description"
                label="Description"
                placeholder="The Boston House Price data set involves the prediction of a house price in thousands of dollars given details of the house and its neighborhood."
                ?required=${this.step == 2}
                minlength=${this.step == 2 ? 1 : nothing}
                @sl-change=${(e: SlChangeEvent) => {
                  this.config.description = (<HTMLInputElement>e.target).value
                  this.config = { ...this.config }
                }}
              ></sl-textarea>
              <sl-tooltip>
                <div slot="content">
                  <p>
                    Choose 'regression' if you want to predict continous values
                    like house or gas prices
                  </p>
                  <p>
                    Choose 'classification' if you want information about the
                    affiliation of the input(s) to a class (e.g. what animal can
                    be seen in this image? A dog, cat or horse?
                  </p>
                </div>
                <p>Choose a type <sl-icon name="question-circle"></sl-icon></p>
              </sl-tooltip>
              <sl-radio-group
                value="${this.config.type}"
                @sl-change="${(e: SlChangeEvent) => {
                  this.config.type = <'regression' | 'classification'>(
                    (<HTMLInputElement>e.target).value
                  )
                  this.config = { ...this.config }
                }}"
              >
                <sl-radio-button pill value="regression"
                  >Regression</sl-radio-button
                >
                <sl-radio-button pill value="classification"
                  >Classification</sl-radio-button
                >
              </sl-radio-group>
            </div>
            <div class="${this.step != 3 ? 'hidden' : ''}">
              <h1>Input data</h1>
              <p>
                Which data will be put into the neural network? Create arbitrary
                many inputs!
              </p>
              ${this.config.inputs.map(
                (input, index) =>
                  html`
                    <c-card>
                      <div slot="content">
                        <sl-input
                          name="input-key-${index}"
                          value=${input.key}
                          label="Key"
                          placeholder="DIS"
                          help-text="1-4 capital letters"
                          ?required=${this.step == 3}
                          maxlength=${this.step == 3 ? 4 : nothing}
                          pattern=${this.step == 3 ? '[A-Z]+' : nothing}
                          @sl-change=${(e: SlChangeEvent) => {
                            this.config.inputs[index].key = (<HTMLInputElement>(
                              e.target
                            )).value
                            this.config = { ...this.config }
                          }}
                        ></sl-input>
                        <sl-textarea
                          rows="2"
                          name="input-description-${index}"
                          value=${input.description}
                          label="Description"
                          placeholder="Weighted distances to five Boston employment centers"
                          ?required=${this.step == 3}
                          minlength=${this.step == 3 ? 1 : nothing}
                          @sl-change=${(e: SlChangeEvent) => {
                            this.config.inputs[index].description = (<
                              HTMLInputElement
                            >e.target).value
                            this.config = { ...this.config }
                          }}
                        ></sl-textarea>
                      </div>
                    </c-card>
                  `
              )}
              ${this.config.inputs.length >= 2
                ? html`
                    <sl-button
                      @click="${(_e: MouseEvent) => this.removeInput()}"
                      >Remove input</sl-button
                    >
                  `
                : html``}
              <sl-button @click="${(_e: MouseEvent) => this.addInput()}"
                >Add input</sl-button
              >
            </div>
            <div class="${this.step != 4 ? 'hidden' : ''}">
              <h1>Label data</h1>
              <p>What shall be the output of the network?</p>
              <sl-input
                name="label-key"
                value=${this.config.label.key}
                label="Key"
                placeholder="MEDV"
                help-text="1-4 capital letters"
                ?required=${this.step == 4}
                maxlength=${this.step == 4 ? 4 : nothing}
                pattern=${this.step == 4 ? '[A-Z]+' : nothing}
                @sl-change=${(e: SlChangeEvent) => {
                  this.config.label.key = (<HTMLInputElement>e.target).value
                  this.config = { ...this.config }
                }}
              ></sl-input>
              <sl-textarea
                rows="2"
                name="label-description"
                value=${this.config.label.description}
                label="Description"
                placeholder="Median value of owner-occupied homes in $1000s"
                ?required=${this.step == 4}
                minlength=${this.step == 4 ? 1 : nothing}
                @sl-change=${(e: SlChangeEvent) => {
                  this.config.label.description = (<HTMLInputElement>(
                    e.target
                  )).value
                  this.config = { ...this.config }
                }}
              ></sl-textarea>
              ${this.config.type == 'classification'
                ? html`
                    <h3>Classes</h3>
                    ${this.config.label.classes?.map(
                      (clazz, index) =>
                        html`
                          <c-card>
                            <div slot="content">
                              <sl-input
                                name="input-key-${index}"
                                value=${clazz.key}
                                label="Key"
                                placeholder="HRS"
                                help-text="1-4 capital letters"
                                ?required=${this.step == 4}
                                maxlength=${this.step == 4 ? 4 : nothing}
                                pattern=${this.step == 4 ? '[A-Z]+' : nothing}
                                @sl-change=${(e: SlChangeEvent) => {
                                  this.config.label.classes[index].key = (<
                                    HTMLInputElement
                                  >e.target).value
                                  this.config = { ...this.config }
                                }}
                              ></sl-input>
                              <sl-textarea
                                rows="2"
                                name="input-description-${index}"
                                value=${clazz.description}
                                label="Description"
                                placeholder="Animal was detected as a horse"
                                ?required=${this.step == 4}
                                minlength=${this.step == 4 ? 1 : nothing}
                                @sl-change=${(e: SlChangeEvent) => {
                                  this.config.label.classes[index].description =
                                    (<HTMLInputElement>e.target).value
                                  this.config = { ...this.config }
                                }}
                              ></sl-textarea>
                            </div>
                          </c-card>
                        `
                    )}
                    ${this.config.label.classes.length >= 3
                      ? html`
                          <sl-button
                            @click="${(_e: MouseEvent) => this.removeClazz()}"
                            >Remove class</sl-button
                          >
                        `
                      : html``}
                    <sl-button @click="${(_e: MouseEvent) => this.addClazz()}"
                      >Add class</sl-button
                    >
                  `
                : html``}
            </div>
            <div class="${this.step != 5 ? 'hidden' : ''}">
              <h1>You are nearly done</h1>
              <p>The only thing missing now is the data itself</p>
              <div class="tag-group">
                ${this.config.inputs.map(
                  (input) => html`
                    <c-data-info
                      type="feature"
                      .dataProperty="${input}"
                      .dataSet="${this.config}"
                      class="clickable"
                    ></c-data-info>
                  `
                )}
                <c-data-info
                  type="label"
                  .dataProperty="${this.config.label}"
                  .dataSet="${this.config}"
                  class="clickable"
                ></c-data-info>
              </div>
              <sl-textarea
                id="dataTextarea"
                rows="10"
                name="data"
                label="Paste your own data set here"
                placeholder="0 0 0
0 1 1
1 0 1
1 1 0"
                help-text="Each row needs to represent one set containing inputs and one label. Seperate items with one or more spaces. The single last item always represents the label while the items before it represent the inputs. You can see a simple configuration for a logical xor-gate as a placeholder! Make sure to use no commas and only dots for floating point values"
                ?required=${this.step == 5}
              ></sl-textarea>
            </div>
          </div>
          <div class="button-group form-footer">
            ${this.step != 1
              ? html`
                  <sl-button
                    id="abortButton"
                    @click="${(_e: MouseEvent) => this.step--}"
                  >
                    <sl-icon slot="prefix" name="arrow-left-circle"></sl-icon>
                    Previous
                  </sl-button>
                `
              : html``}
            <sl-button variant="primary" type="submit" id="nextStepButton">
              ${this.step < 5
                ? html`
                    Next
                    <sl-icon slot="suffix" name="arrow-right-circle"></sl-icon>
                  `
                : html`
                    Validate and create
                    <sl-icon slot="suffix" name="arrow-right-circle"></sl-icon>
                  `}
            </sl-button>
          </div>
        </form>
      </sl-dialog>
    `
  }
}
