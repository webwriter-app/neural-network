/**
 * Side-effect module that must be imported before '@tensorflow/tfjs'.
 *
 * tfjs keeps its engine, environment and kernel registry on globalThis. If
 * another tfjs copy was already loaded into the same window (another widget
 * bundling tfjs, or a previous build of this widget in the WebWriter editor),
 * our copy re-registers the webgl backend and every kernel, logging a warning
 * for each of them. tfjs only logs these warnings when the PROD flag is off, so
 * enable it on the shared environment while our bundle is evaluated and
 * restore it afterwards.
 */

interface TfGlobalEngine {
  ENV: {
    getBool(flag: string): boolean
    set(flag: string, value: boolean): void
  }
}

const engine = (globalThis as { _tfengine?: TfGlobalEngine })._tfengine
if (engine) {
  const wasProd = engine.ENV.getBool('PROD')
  engine.ENV.set('PROD', true)
  queueMicrotask(() => engine.ENV.set('PROD', wasProd))
}
