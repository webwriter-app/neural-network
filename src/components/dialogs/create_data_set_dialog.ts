import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, css, html, nothing } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '@/global_styles'

import type { DataSet } from '@/types/data_set'
import { availableDataSetsContext } from '@/contexts/available_data_sets_context'

import {
  SlChangeEvent,
  SlDialog,
  SlButton,
  SlInput,
  SlTextarea,
  SlTooltip,
  SlRadioGroup,
  SlRadioButton,
} from '@shoelace-style/shoelace'
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js'
import { AlertUtils } from '@/utils/alert_utils'

import IconQuestionCircle from 'bootstrap-icons/icons/question-circle.svg'
import IconArrowLeftCircle from 'bootstrap-icons/icons/arrow-left-circle.svg'
import IconArrowRightCircle from 'bootstrap-icons/icons/arrow-right-circle.svg'
import { CCard } from '../reusables/c-card'
import { msg } from '@lit/localize'

export class CreateDataSetDialog extends LitElementWw {
  static scopedElements = {
    'sl-dialog': SlDialog,
    'sl-textarea': SlTextarea,
    'sl-tooltip': SlTooltip,
    'sl-input': SlInput,
    'c-card': CCard,
    'sl-button': SlButton,
    'sl-radio-group': SlRadioGroup,
    'sl-radio-button': SlRadioButton,
  }

  @consume({ context: availableDataSetsContext, subscribe: true })
  accessor availableDataSets: DataSet[]

  private emptyConfig: DataSet = {
    name: '',
    description: '',
    type: 'regression',
    featureDescs: [{ key: '', description: '' }],
    labelDesc: {
      key: '',
      description: '',
      classes: [
        { id: 0, description: '' },
        { id: 1, description: '' },
      ],
    },
    data: [],
  }
  @property()
  accessor config: DataSet = <DataSet>(
    JSON.parse(JSON.stringify(this.emptyConfig))
  )

  @state()
  accessor step: number = 1

  @query('sl-dialog')
  accessor _dialog: SlDialog

  @query('.dialog-form')
  accessor _dialogForm: HTMLFormElement

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async connectedCallback(): Promise<void> {
    super.connectedCallback()
    await this.updateComplete
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async show() {
    await this._dialog.show()
    console.log(this._dialogForm)
    console.log(serialize(this._dialogForm).data)
    if (this.step != 1 || serialize(this._dialogForm).data) {
      AlertUtils.spawn({
        message: msg(
          'The progress you made in creating your own data set was successfully restored!',
        ),
        variant: 'success',
        icon: 'check-circle',
      })
    }
  }

  nextStep(e: MouseEvent) {
    const form: any = e.target
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    if (this.step == 5) {
      void this.validateAndCreate()
    } else {
      this.step++
    }

    e.preventDefault()
  }

  // step 3 (configuring the features (keys/descriptions))
  addFeature() {
    this.config.featureDescs.push({ key: '', description: '' })
    this.config = { ...this.config }
  }

  removeFeature() {
    this.config.featureDescs.pop()
    this.config = { ...this.config }
  }

  // step 4 (configuring the label (key/description) and its classes
  // (keys/descriptions))
  addLabelClass() {
    this.config.labelDesc.classes.push({ id: undefined, description: '' })
    this.config = { ...this.config }
  }

  removeLabelClass() {
    this.config.labelDesc.classes.pop()
    this.config = { ...this.config }
  }

  // step 5 (paste data set form)
  async validateAndCreate() {
    // get data
    const data: string = <string>serialize(this._dialogForm).data

    if (
      this.availableDataSets.find((dataSet) => dataSet.name == this.config.name)
    ) {
      AlertUtils.spawn({
        message: msg('A data set with the same name already exists!'),
        variant: 'danger',
        icon: 'x-circle',
      })
      return
    }

    // additional validation
    const pattern = new RegExp(
      `^(\\s*(?:(?:[-+]?\\d+(?:\\.\\d*)?)|(?:\\d*\\.\\d+))(?:\\s*,\\s*(?:(?:[-+]?\\d+(?:\\.\\d*)?)|(?:\\d*\\.\\d+))){${this.config.featureDescs.length}}\\s*)+$`,
    )
    const result = pattern.test(data)
    if (!result) {
      AlertUtils.spawn({
        message: msg(
          'The provided data does not match the required format! Please check again',
        ),
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
      const values: string[] = line.trim().split(',')
      console.log(values)

      // parse feature and label data (config.featureDescs.length * features and
      // one label)
      const features: number[] = []
      let index = 0
      for (const _feature of this.config.featureDescs) {
        features.push(parseInt(values[index].trim()))
        index += 1
      }
      const label: number = parseInt(values[index])

      // add parsed data from this line to the data array
      this.config.data.push({
        features,
        label,
      })
    }

    const dataSet: DataSet = <DataSet>JSON.parse(JSON.stringify(this.config))
    this.dispatchEvent(
      new CustomEvent<DataSet>('add-data-set', {
        detail: dataSet,
        bubbles: true,
        composed: true,
      }),
    )
    this.dispatchEvent(
      new CustomEvent<DataSet>('select-data-set', {
        detail: dataSet,
        bubbles: true,
        composed: true,
      }),
    )

    this.config = <DataSet>JSON.parse(JSON.stringify(this.emptyConfig))
    this.step = 1
    this._dialogForm.reset()

    AlertUtils.spawn({
      message: msg(
        'A new data set was successfully created and automatically selected!',
      ),
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
      <sl-dialog label=${msg('Create a new data set')}>
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
        <form
          class="dialog-form"
          @submit=${(e) => {
            this.nextStep(e)
          }}
        >
          <div class="form-main">
            <div ?hidden=${this.step !== 1} ?inert=${this.step !== 1}>
              <h1>${msg('Welcome')}</h1>
              <p>
                ${msg(
                  'This tour will guide you through creating your own data set in a few simple steps. Everything is stored automatically, so you can close this modal at any time and resume.',
                )}
              </p>
            </div>
            <div ?hidden=${this.step !== 2} ?inert=${this.step !== 2}>
              <h1>${msg('General info about the data set')}</h1>
              <p>
                ${msg(
                  'Choose a short but meaningful name for your data set and write a description.',
                )}
              </p>
              <sl-input
                name="name"
                label=${msg('Name')}
                placeholder=${msg('Boston House Pricing')}
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
                label=${msg('Description')}
                placeholder=${msg(
                  'The Boston House Price data set involves the prediction of a house price in thousands of dollars given details of the house and its neighborhood.',
                )}
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
                    ${msg(
                      "Choose 'regression' if you want to predict continous values like house or gas prices",
                    )}
                  </p>
                  <p>
                    ${msg(
                      "Choose 'classification' if you want information about the affiliation of the feature(s) to a class (e.g. what animal can be seen in this image? A dog, cat or horse?)",
                    )}
                  </p>
                </div>
                <p>
                  ${msg('Choose a type')}
                  <sl-icon src=${IconQuestionCircle}></sl-icon>
                </p>
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
                  >${msg('Regression')}</sl-radio-button
                >
                <sl-radio-button pill value="classification"
                  >${msg('Classification')}</sl-radio-button
                >
              </sl-radio-group>
            </div>
            <div ?hidden=${this.step !== 3} ?inert=${this.step !== 3}>
              <h1>${msg('Features')}</h1>
              <p>
                ${msg(
                  'Which data will be put into the neural network? Create arbitrary many features!',
                )}
              </p>
              ${this.config.featureDescs.map(
                (featureDesc, index) => html`
                  <c-card>
                    <div slot="content">
                      <sl-input
                        value=${featureDesc.key}
                        label=${msg('Key')}
                        placeholder="DIS"
                        help-text=${msg('1-6 capital letters')}
                        ?required=${this.step == 3}
                        maxlength=${this.step == 3 ? 6 : nothing}
                        pattern=${this.step == 3 ? '[A-Z]+' : nothing}
                        @sl-change=${(e: SlChangeEvent) => {
                          this.config.featureDescs[index].key = (
                            e.target as HTMLInputElement
                          ).value
                          this.config = { ...this.config }
                        }}
                      ></sl-input>
                      <sl-textarea
                        rows="2"
                        value=${featureDesc.description}
                        label=${msg('Description')}
                        placeholder=${msg(
                          'Weighted distances to five Boston employment centers',
                        )}
                        ?required=${this.step == 3}
                        minlength=${this.step == 3 ? 1 : nothing}
                        @sl-change=${(e: SlChangeEvent) => {
                          this.config.featureDescs[index].description = (
                            e.target as HTMLInputElement
                          ).value
                          this.config = { ...this.config }
                        }}
                      ></sl-textarea>
                    </div>
                  </c-card>
                `,
              )}
              ${this.config.featureDescs.length >= 2
                ? html`
                    <sl-button
                      @click="${(_e: MouseEvent) => this.removeFeature()}"
                      >${msg('Remove feature')}</sl-button
                    >
                  `
                : html``}
              <sl-button @click="${(_e: MouseEvent) => this.addFeature()}"
                >${msg('Add feature')}</sl-button
              >
            </div>
            <div ?hidden=${this.step !== 4} ?inert=${this.step !== 4}>
              <h1>${msg('Label')}</h1>
              <p>${msg('What shall be the output of the network?')}</p>
              <sl-input
                value=${this.config.labelDesc.key}
                label=${msg('Key')}
                placeholder="MEDV"
                help-text=${msg('1-6 capital letters')}
                ?required=${this.step == 4}
                maxlength=${this.step == 4 ? 6 : nothing}
                pattern=${this.step == 4 ? '[A-Z]+' : nothing}
                @sl-change=${(e: SlChangeEvent) => {
                  this.config.labelDesc.key = (<HTMLInputElement>e.target).value
                  this.config = { ...this.config }
                }}
              ></sl-input>
              <sl-textarea
                rows="2"
                value=${this.config.labelDesc.description}
                label=${msg('Description')}
                placeholder=${msg(
                  'Median value of owner-occupied homes in $1000s',
                )}
                ?required=${this.step == 4}
                minlength=${this.step == 4 ? 1 : nothing}
                @sl-change=${(e: SlChangeEvent) => {
                  this.config.labelDesc.description = (<HTMLInputElement>(
                    e.target
                  )).value
                  this.config = { ...this.config }
                }}
              ></sl-textarea>
              ${this.config.type == 'classification'
                ? html`
                    <h3>Classes</h3>
                    ${this.config.labelDesc.classes?.map(
                      (clazz, index) => html`
                        <c-card>
                          <div slot="content">
                            <sl-input
                              type="number"
                              value=${clazz.id}
                              label=${msg('Key')}
                              placeholder="0"
                              help-text=${msg('an integer')}
                              ?required=${this.step == 4}
                              maxlength=${this.step == 4 ? 6 : nothing}
                              pattern=${this.step == 4 ? '[A-Z]+' : nothing}
                              @sl-change=${(e: SlChangeEvent) => {
                                this.config.labelDesc.classes[index].id =
                                  parseInt((e.target as HTMLInputElement).value)
                                this.config = { ...this.config }
                              }}
                            ></sl-input>
                            <sl-textarea
                              rows="2"
                              value=${clazz.description}
                              label=${msg('Description')}
                              placeholder=${msg(
                                'Animal was detected as a horse',
                              )}
                              ?required=${this.step == 4}
                              minlength=${this.step == 4 ? 1 : nothing}
                              @sl-change=${(e: SlChangeEvent) => {
                                this.config.labelDesc.classes[
                                  index
                                ].description = (<HTMLInputElement>(
                                  e.target
                                )).value
                                this.config = { ...this.config }
                              }}
                            ></sl-textarea>
                          </div>
                        </c-card>
                      `,
                    )}
                    ${this.config.labelDesc.classes.length >= 3
                      ? html`
                          <sl-button
                            @click="${(_e: MouseEvent) =>
                              this.removeLabelClass()}"
                            >${msg('Remove class')}</sl-button
                          >
                        `
                      : html``}
                    <sl-button
                      @click="${(_e: MouseEvent) => this.addLabelClass()}"
                      >${msg('Add class')}</sl-button
                    >
                  `
                : html``}
            </div>
            <div ?hidden=${this.step !== 5} ?inert=${this.step !== 5}>
              <h1>${msg('You are nearly done')}</h1>
              <p>${msg('Now add your data in the following format')}*:</p>
              <div
                class="tag-group"
                style="justify-content: center !important;"
              >
                ${this.config.featureDescs.map(
                  (featureDesc) => html`
                    <c-data-info
                      type="feature"
                      .dataDesc="${featureDesc}"
                      .dataSet="${this.config}"
                      class="clickable"
                    ></c-data-info
                    >,
                  `,
                )}
                <c-data-info
                  type="label"
                  .dataDesc="${this.config.labelDesc}"
                  .dataSet="${this.config}"
                  class="clickable"
                ></c-data-info>
              </div>
              <sl-textarea
                id="dataTextarea"
                rows="10"
                name="data"
                help-text="*${msg(
                  'Each row needs to represent one set containing the features and the label. Seperate items with a comma (spaces before and after the comma are okay). The single last item always represents the label while the items before it represent the features. Make sure to use only dots and no commas for floating point values. If you have data in CSV format, you can just paste it here but make sure to remove any comments.',
                )}"
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
                    <sl-icon slot="prefix" src=${IconArrowLeftCircle}></sl-icon>
                    ${msg('Previous')}
                  </sl-button>
                `
              : html``}
            <sl-button variant="primary" type="submit" id="nextStepButton">
              ${this.step < 5
                ? html`
                    ${msg('Next')}
                    <sl-icon
                      slot="suffix"
                      src=${IconArrowRightCircle}
                    ></sl-icon>
                  `
                : html`
                    ${msg('Validate and create')}
                    <sl-icon
                      slot="suffix"
                      src=${IconArrowRightCircle}
                    ></sl-icon>
                  `}
            </sl-button>
          </div>
        </form>
      </sl-dialog>
    `
  }
}
