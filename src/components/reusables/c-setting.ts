import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { settingsContext, Settings } from '@/contexts/settings_context'
import { SlChangeEvent, SlSwitch } from '@shoelace-style/shoelace'

@customElement('c-setting')
export class CSetting extends LitElementWw {
  @consume({ context: settingsContext, subscribe: true })
  settings: Settings

  @property()
  name: string

  @property()
  description: string

  @query('sl-switch')
  _settingSwitch: SlSwitch

  @queryAssignedElements({ selector: 'c-setting' })
  _nestedSettings!: CSetting[]

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleChange(): void {
    this.dispatchEvent(
      new CustomEvent<{ name: string; value: boolean }>('set-setting', {
        detail: { name: this.name, value: this._settingSwitch.checked },
        composed: true,
        bubbles: true,
      })
    )
    if (!this._settingSwitch.checked) {
      for (const setting of this._nestedSettings) {
        setting.setToFalse()
      }
    }
  }

  setToFalse(): void {
    this.dispatchEvent(
      new CustomEvent<{ name: string; value: boolean }>('set-setting', {
        detail: { name: this.name, value: false },
        composed: true,
        bubbles: true,
      })
    )
    for (const setting of this._nestedSettings) {
      setting.setToFalse()
    }
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [
    ...globalStyles,
    css`
      sl-switch * {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .nested-settings ::slotted(*:first-child) {
        margin-top: 10px !important;
      }
    `,
  ]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      ${Object.hasOwn(this.settings, this.name)
        ? html` <sl-switch
            ?checked="${this.settings[this.name]}"
            @sl-change="${(_e: SlChangeEvent) => this.handleChange()}"
          >
            <p>${this.description}</p>

            <div class="nested-settings">
              ${this.settings[this.name] ? html`<slot></slot>` : html``}
            </div>
          </sl-switch>`
        : html`Setting ${this.name} does not exist`}
    `
  }
}
