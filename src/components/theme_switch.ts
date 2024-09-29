import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { Theme } from '@/types/theme'
import { themeContext } from '@/contexts/theme_context'
import { ThemeUtils } from '@/utils/theme_utils'

import SlRadioGroup from "@shoelace-style/shoelace/dist/components/radio-group/radio-group.component.js"
import SlRadioButton from "@shoelace-style/shoelace/dist/components/radio-button/radio-button.component.js"

export class ThemeSwitch extends LitElementWw {

  static scopedElements = {
    "sl-radio-group": SlRadioGroup,
    "sl-radio-button": SlRadioButton
  }

  @consume({ context: themeContext, subscribe: true })
  accessor theme: Theme

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  setTheme(name: string) {
    const theme = ThemeUtils.themeOptions.find((theme) => theme.name == name)
    if (theme) {
      this.dispatchEvent(
        new CustomEvent<Theme>('set-theme', {
          detail: theme,
          bubbles: true,
          composed: true,
        })
      )
    }
  }

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <sl-radio-group value=${this.theme.name}>
        ${ThemeUtils.themeOptions.map(
          (theme) => html`
            <sl-radio-button
              value=${theme.name}
              @click=${(_e: MouseEvent) => this.setTheme(theme.name)}
            >
              <sl-icon src=${theme.slIcon}></sl-icon>
            </sl-radio-button>
          `
        )}
      </sl-radio-group>
    `
  }
}
