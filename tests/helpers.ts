import snippet from "../snippets/Pima-Indians-Diabetes.html";
import "../src/widgets/webwriter-neural-network";

export type Widget = any;

export const until = async (condition: () => unknown, what: string, timeout = 20000) => {
  const start = performance.now();
  while (!(await condition())) {
    if (performance.now() - start > timeout) throw new Error(`timed out waiting for: ${what}`);
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
};

export const block = (widget: Widget) => widget.querySelector(':scope > script[type="application/json"][slot="data"]') as HTMLScriptElement;
export const saved = (widget: Widget) => JSON.parse(block(widget).textContent!);

let mount: HTMLElement | undefined;

export const mountWidget = async ({ edit }: { edit: boolean }): Promise<Widget> => {
  unmount();
  document.designMode = edit ? "on" : "off";
  mount = document.createElement("div");
  mount.style.cssText = "width: 800px; height: 600px";
  document.body.append(mount);
  mount.innerHTML = snippet;
  const widget = mount.firstElementChild as Widget;
  if (edit) widget.setAttribute("contenteditable", "");
  await until(() => widget.layerConfs?.length > 0 && widget.shadowRoot?.querySelector("canvas-area"), "the snippet's network");
  return widget;
};

export const unmount = () => {
  mount?.remove();
  mount = undefined;
  document.designMode = "off";
};

// the deepest match through open shadow roots
export const deep = (root: ParentNode, selector: string): Element | null => {
  const found = root.querySelector?.(selector);
  if (found) return found;
  for (const element of root.querySelectorAll?.("*") ?? []) {
    if (element.shadowRoot) {
      const inner = deep(element.shadowRoot, selector);
      if (inner) return inner;
    }
  }
  return null;
};

export const canvasOf = (widget: Widget): any => deep(widget.shadowRoot, "c-canvas");
export const sceneOf = (widget: Widget) => canvasOf(widget).shadowRoot.querySelector("ww-scene") as HTMLElement;
export const item = (widget: Widget, key: string) => canvasOf(widget)?.shadowRoot.querySelector(`[data-ww-key="${key}"]`) as HTMLElement;

export const drawn = (widget: Widget) => {
  const root = canvasOf(widget)?.shadowRoot;
  return { layers: root?.querySelectorAll("ww-group").length ?? 0, neurons: root?.querySelectorAll("ww-node.neuron").length ?? 0, edges: root?.querySelectorAll("ww-path").length ?? 0 };
};

// what the saved layers and connections add up to
export const expected = (widget: Widget) => {
  const count = (conf: any) => conf.LAYER_TYPE === "Input" ? conf.featureKeys.length : conf.LAYER_TYPE === "Dense" ? conf.units : widget.dataSet.type === "regression" ? 1 : widget.dataSet.labelDesc.classes.length;
  const counts = new Map<number, number>(widget.layerConfs.map((conf: any) => [conf.layerId, count(conf)]));
  return {
    layers: widget.layerConfs.length,
    neurons: [...counts.values()].reduce((sum, n) => sum + n, 0),
    edges: widget.layerConnectionConfs.reduce((sum: number, conf: any) => sum + counts.get(conf.sourceLayerId)! * counts.get(conf.targetLayerId)!, 0),
  };
};

// the canvas fits the network once the scene has settled, then leaves the view alone
export const fitted = async (widget: Widget) => {
  await until(() => canvasOf(widget)?.viewport, "the viewport");
  await canvasOf(widget).viewport.fitted();
};

export const frames = async (n = 2) => { for (let i = 0; i < n; i++) await new Promise((resolve) => requestAnimationFrame(resolve)); };

export const pointer = (target: Element, type: string, at: { x: number; y: number }, init: PointerEventInit = {}) =>
  target.dispatchEvent(new PointerEvent(type, { bubbles: true, composed: true, cancelable: true, pointerId: 7, button: 0, isPrimary: true, clientX: at.x, clientY: at.y, ...init }));

export const centre = (element: Element) => { const box = element.getBoundingClientRect(); return { x: box.left + box.width / 2, y: box.top + box.height / 2 }; };

export const tap = async (target: Element) => {
  const at = centre(target);
  pointer(target, "pointerdown", at, { buttons: 1 });
  pointer(target, "pointerup", at, { buttons: 0 });
  await frames();
};

// a drag with the pointer on a neuron of the layer, by dx, dy screen pixels
export const moveLayer = async (widget: Widget, layerId: string, dx: number, dy: number) => {
  const target = item(widget, `neuron-${layerId}n1`);
  const from = centre(target);
  pointer(target, "pointerdown", from, { buttons: 1 });
  pointer(target, "pointermove", { x: from.x + 6, y: from.y + 6 }, { buttons: 1 });
  await frames();
  pointer(target, "pointermove", { x: from.x + dx, y: from.y + dy }, { buttons: 1 });
  await frames();
  pointer(target, "pointerup", { x: from.x + dx, y: from.y + dy }, { buttons: 0 });
  await frames(3);
};

// what the scene reports when the reader selects an item
export const select = (widget: Widget, key: string) =>
  sceneOf(widget).dispatchEvent(new CustomEvent("ww-select", { detail: { keys: [key], items: [] }, bubbles: true, cancelable: true }));

// a pointer drag on a neuron that stays held until the returned function is called
export const holdLayer = async (widget: Widget, layerId: string, dx: number, dy: number) => {
  const target = item(widget, `neuron-${layerId}n1`);
  const from = centre(target);
  pointer(target, "pointerdown", from, { buttons: 1 });
  pointer(target, "pointermove", { x: from.x + 6, y: from.y + 6 }, { buttons: 1 });
  await frames();
  pointer(target, "pointermove", { x: from.x + dx, y: from.y + dy }, { buttons: 1 });
  await frames();
  return async () => {
    pointer(target, "pointerup", { x: from.x + dx, y: from.y + dy }, { buttons: 0 });
    await frames(3);
  };
};

// the drawn path of an edge: its end points in the scene
export const drawnPath = (widget: Widget, id: string): any => (sceneOf(widget) as any).drawingOf(item(widget, `edge-${id}`));
