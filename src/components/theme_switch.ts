import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { Theme } from '@/types/theme'
import { themeContext } from '@/contexts/theme_context'
import { ThemeUtils } from '@/utils/theme_utils'

@customElement('theme-switch')
export class ThemeSwitch extends LitElementWw {
  @consume({ context: themeContext, subscribe: true })
  theme: Theme

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
              <sl-icon name=${theme.slIcon}></sl-icon>
            </sl-radio-button>
          `
        )}
      </sl-radio-group>
    `
  }
}
