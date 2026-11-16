import { css } from 'lit'

// Layout of the widget host: canvas area, menu area, divider and loading page.
export const neuralNetworkStyles = css`
  :host {
    position: relative;
    display: flex!important;
    flex-direction: row;
    overflow: hidden;
    box-sizing: border-box;
    background-color: var(--sl-color-neutral-0);
    height: 500px;
  }

  :host(:fullscreen), :host(.ww-fullscreen) {
    height: 100%;
    width: 100%;
  }

  :host(:not(:fullscreen):not(.ww-fullscreen)) {
    border: 1px solid var(--sl-color-neutral-300, #d4d4d8);
    border-radius: var(--sl-border-radius-medium, 0.375rem);
  }


  #loadingPage {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: var(--sl-color-neutral-0);
  }

  #loadingDiv {
    position: absolute;
    left: 50%;
    top: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  canvas-area {
    flex: 1 1 0;
    min-width: 0;
    height: 100%;
  }

  menu-area {
    flex: 0 0 435px;
    min-width: 0;
  }

  menu-area.right-collapsed {
    flex-basis: 0;
  }

  #divider {
    position: absolute;
    right: calc(435px - 2px);
    width: 2px;
    top: 10px;
    bottom: 10px;
    background-color: var(--sl-color-neutral-50);
  }

  #divider.hidden {
    display: none;
  }
`
