import { LitElement } from 'lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { editableContext } from '@/contexts/editable_context'
import { HelpEntry, helpContext } from '@/contexts/help_context'

import { SlInput, SlTextarea } from '@shoelace-style/shoelace'

@customElement('help-card')
export class HelpCard extends LitElement {
  @consume({ context: editableContext, subscribe: true })
  editable: boolean

  @consume({ context: helpContext, subscribe: true })
  help: HelpEntry[]

  @query('#newHelpEntryTitle')
  _newHelpEntryTitle: SlInput

  addEntry(e: MouseEvent): void {
    e.preventDefault()
    const entry: HelpEntry = {
      title: this._newHelpEntryTitle.value,
      description: '',
    }
    this.dispatchEvent(
      new CustomEvent<HelpEntry>('add-new-help-entry', {
        detail: entry,
        bubbles: true,
        composed: true,
      })
    )
    this._newHelpEntryTitle.value = ''
  }

  updateEntry(e: MouseEvent): void {
    const entry: HelpEntry = {
      title: <string>e.target.title,
      description: <SlTextarea>(
        (<HTMLDivElement>e.target.parentNode).previousElementSibling.value
      ),
    }
    this.dispatchEvent(
      new CustomEvent<HelpEntry>('update-help-entry', {
        detail: entry,
        bubbles: true,
        composed: true,
      })
    )
  }

  removeEntry(e: MouseEvent): void {
    this.dispatchEvent(
      new CustomEvent<HelpEntry>('remove-help-entry', {
        detail: <string>e.target.title,
        bubbles: true,
        composed: true,
      })
    )
  }

  static styles: CSSResult[] = globalStyles

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Help</div>
        <div slot="content">
          ${!this.help.length && this.editable
            ? html`There are currently no help entries. If you publish the
              widget like this, the help section will be hidden.`
            : html``}
          ${this.help.map(
            (entry) => html` <sl-details summary=${entry.title}>
              ${this.editable
                ? html` <sl-textarea value=${entry.description}></sl-textarea>
                    <div class="button-group">
                      <sl-button
                        variant="primary"
                        title=${entry.title}
                        @click="${(e: MouseEvent) => this.updateEntry(e)}"
                      >
                        Update entry
                      </sl-button>
                    </div>
                    <div class="button-group">
                      <sl-button
                        variant="danger"
                        title=${entry.title}
                        @click="${(e: MouseEvent) => this.removeEntry(e)}"
                      >
                        Remove entry
                      </sl-button>
                    </div>`
                : html`${entry.description}`}
            </sl-details>`
          )}
          ${this.editable
            ? html` <form
                @submit="${(e: MouseEvent) => this.addEntry(e)}"
                id="test"
              >
                <div class="button-group">
                  <sl-input
                    form="test"
                    placeholder="Title"
                    required
                    minlength="5"
                    id="newHelpEntryTitle"
                  ></sl-input>
                  <sl-button variant="primary" type="submit">
                    Add entry
                  </sl-button>
                </div>
              </form>`
            : html``}
        </div>
      </c-card>
    `
  }
}
