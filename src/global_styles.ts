import { CSSResult, css } from 'lit'
import darkTheme from '@shoelace-style/shoelace/dist/themes/dark.styles.js'

export const globalStyles: CSSResult[] = [
  <CSSResult>darkTheme,
  css`
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: var(--sl-font-sans);
    }

    .sl-toast-stack {
      position: absolute;
      top: 0;
      left: 0;
      right: auto;
    }

    h1,
    h2,
    h3,
    h4 {
      text-transform: uppercase;
    }

    h1 {
      font-size: 18px;
      margin: 10px 0 15px 0;
    }

    h2 {
      font-size: 16px;
      margin: 15px 0 5px 0;
    }

    h3 {
      font-size: 14px;
      margin: 15px 0 5px 0;
    }

    h4 {
      font-size: 12px;
      margin: 15px 0 5px 0;
    }

    .hidden {
      display: none !important;
    }

    .hscroll-container {
      width: 100%;
      overflow-x: auto;
      white-space: nowrap;
    }

    .button-group {
      width: 100%;
      display: flex;
      justify-content: space-between;
      gap: 20px;
      flex-wrap: wrap;
    }

    .button-group * {
      flex-grow: 1;
    }

    .tag-group {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    sl-details::part(content) {
      display: flex;
      flex-direction: column !important;
      gap: 10px;
    }

    sl-input {
      max-width: 100%;
    }

    sl-progress-bar {
      --height: 7px;
      --track-color: var(--sl-color-primary-100);
      --indicator-color: var(--sl-color-primary-600);
      margin-bottom: 10px;
    }

    sl-range {
      --track-color-active: var(--sl-color-primary-600);
      --track-color-inactive: var(--sl-color-primary-100);
    }

    sl-switch::part(base) {
      display: inline-flex;
      align-items: flex-start;
    }

    sl-tag[draggable='true'] {
      cursor: grab;
    }

    sl-tooltip {
      max-width: 100%;
    }
  `,
]
