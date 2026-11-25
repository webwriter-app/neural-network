/// <reference types="mocha" />
import "mocha/mocha.js";
import { assert } from "chai";
import { getMochaConfig } from "@webwriter/build/test";
import { block, canvasOf, drawn, drawnPath, expected, fitted, frames, holdLayer, item, mountWidget, moveLayer, saved, select, sceneOf, tap, unmount, until } from "./helpers";

mocha.setup(getMochaConfig());

const ok = (condition: unknown, message: string) => assert.isTrue(!!condition, message);

for (const edit of [false, true]) {
  describe(`<webwriter-neural-network> canvas (${edit ? "edit" : "read"} mode)`, function () {
    this.timeout(30000);
    afterEach(unmount);

    it("the canvas draws every layer, neuron and edge on Scene", async function () {
      const widget = await mountWidget({ edit });
      const want = expected(widget);
      await until(() => drawn(widget).neurons === want.neurons && drawn(widget).edges === want.edges, "the network to be drawn");
      ok(drawn(widget).layers === want.layers, `expected ${want.layers} layers, found ${drawn(widget).layers}`);
      const scene = sceneOf(widget);
      ok(scene.shadowRoot, "ww-scene is not upgraded in the widget's registry");
      ok(canvasOf(widget).shadowRoot.querySelector("ww-group").shadowRoot, "ww-group is not upgraded");
      const first = widget.layerConfs[0];
      const group = item(widget, `layer-${first.layerId}`);
      ok(group.getAttribute("x") === String(first.pos.x) && group.getAttribute("y") === String(first.pos.y), "a layer is not drawn at its position");
      ok(!widget.querySelector("ww-scene, ww-node, ww-group, ww-path"), "scene elements leaked into the authored DOM");
    });

    it("the network is fitted into the window once", async function () {
      const widget = await mountWidget({ edit });
      await fitted(widget);
      const view = canvasOf(widget).viewport;
      const before = [view.x, view.y, view.scale];
      await moveLayer(widget, "1", 40, 30);
      ok([view.x, view.y, view.scale].join() === before.join(), "moving a layer changed the view");
    });

    it("tapping a neuron selects it and opens its panel, tapping the background clears", async function () {
      const widget = await mountWidget({ edit });
      const neuron = await until(() => item(widget, "neuron-1n1"), "the first neuron").then(() => item(widget, "neuron-1n1"));
      await tap(neuron);
      await until(() => widget.selected.neuron === "1n1" && widget.panel === "neuron", "the neuron panel");
      await until(() => item(widget, "neuron-1n1").hasAttribute("selected"), "the neuron to be drawn selected");
      ok(!item(widget, "layer-1").hasAttribute("selected"), "the layer is selected as well");
      sceneOf(widget).dispatchEvent(new CustomEvent("ww-select", { detail: { keys: [], items: [] }, bubbles: true, cancelable: true }));
      await until(() => !widget.selected.neuron && !widget.panel, "the selection and the panel to clear");
    });

    it("layers and edges are selected through the scene", async function () {
      const widget = await mountWidget({ edit });
      await until(() => drawn(widget).edges > 0, "the edges");
      select(widget, "layer-2");
      await until(() => widget.selected.layer === "2" && widget.panel === "layer", "the layer panel");
      await until(() => item(widget, "layer-2").hasAttribute("selected"), "the layer to be drawn selected");
      ok(widget.selectedEle?.getName?.().startsWith("2 - "), "the selected element is not the layer");
      const edge = canvasOf(widget).shadowRoot.querySelector("ww-path");
      select(widget, edge.getAttribute("data-ww-key"));
      await until(() => widget.selected.edge && widget.panel === "edge", "the edge panel");
      await until(() => edge.hasAttribute("selected"), "the edge to be drawn selected");
    });

    it("dragging a neuron moves its layer in one transaction and saves the position", async function () {
      const widget = await mountWidget({ edit });
      await fitted(widget);
      const log: string[] = [];
      for (const type of ["ww-transactionstart", "ww-transactionend"]) widget.addEventListener(type, () => log.push(type));
      const before = { ...widget.layerConfs.find((conf: any) => conf.layerId === 1).pos };
      const scale = canvasOf(widget).viewport.scale;
      await moveLayer(widget, "1", 60, -40);
      const after = widget.layerConfs.find((conf: any) => conf.layerId === 1).pos;
      ok(Math.abs(after.x - before.x - 60 / scale) < 2 && Math.abs(after.y - before.y + 40 / scale) < 2, `the layer moved to ${JSON.stringify(after)} from ${JSON.stringify(before)} at scale ${scale}`);
      await until(() => JSON.stringify(saved(widget).layerConfs.find((conf: any) => conf.layerId === 1).pos) === JSON.stringify(after), "the block to hold the new position");
      await until(() => item(widget, "layer-1").getAttribute("x") === String(after.x), "the layer to be drawn at the new position");
      ok(widget.selected.layer === "1", "dragging a neuron did not select its layer");
      ok(log.includes("ww-transactionstart") && log.at(-1) === "ww-transactionend", `no complete transaction: ${log.join()}`);
      const other = widget.layerConfs.find((conf: any) => conf.layerId === 2).pos;
      ok(other.x === saved(widget).layerConfs.find((conf: any) => conf.layerId === 2).pos.x, "another layer changed");
    });

    it("the keys move the selected layer", async function () {
      const widget = await mountWidget({ edit });
      await until(() => drawn(widget).layers > 0, "the layers");
      select(widget, "layer-1");
      await until(() => widget.selected.layer === "1", "the selection");
      const before = widget.layerConfs.find((conf: any) => conf.layerId === 1).pos;
      window.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowRight", ctrlKey: true, shiftKey: true, bubbles: true }));
      await until(() => widget.layerConfs.find((conf: any) => conf.layerId === 1).pos.x === before.x + 10, "the layer to move");
      await until(() => saved(widget).layerConfs.find((conf: any) => conf.layerId === 1).pos.x === before.x + 10, "the block to follow");
    });

    it("adding a layer and connecting it adds its neurons and edges", async function () {
      const widget = await mountWidget({ edit });
      await until(() => drawn(widget).layers === widget.layerConfs.length, "the layers");
      const before = drawn(widget);
      window.dispatchEvent(new CustomEvent("layer-conf-created", { detail: { HTML_TAG: "dense-layer", LAYER_TYPE: "Dense", LAYER_NAME: "Dense layer", units: 3, activation: { name: "ReLu", tfName: "relu", description: "", range: "" }, pos: { x: 1000, y: 900 }, firstSpawn: false, layerId: 0 } }));
      await until(() => drawn(widget).layers === before.layers + 1 && drawn(widget).neurons === before.neurons + 3, "the new layer");
      const added = widget.layerConfs.at(-1);
      ok(saved(widget).layerConfs.length === before.layers + 1, "the block does not hold the new layer");
      widget.shadowRoot.dispatchEvent(new CustomEvent("add-layer-connection", { detail: { source: 1, target: added.layerId } }));
      await until(() => drawn(widget).edges === before.edges + 8 * 3, "the edges of the new connection");
      ok(saved(widget).layerConnectionConfs.some((conf: any) => conf.sourceLayerId === 1 && conf.targetLayerId === added.layerId), "the block does not hold the connection");
    });

    it("deleting the selected layer removes it with its connections", async function () {
      const widget = await mountWidget({ edit });
      await until(() => drawn(widget).layers === widget.layerConfs.length, "the layers");
      select(widget, "layer-2");
      await until(() => widget.selected.layer === "2", "the selection");
      const before = drawn(widget);
      window.dispatchEvent(new KeyboardEvent("keyup", { code: "Backspace", ctrlKey: true, shiftKey: true, bubbles: true }));
      await until(() => drawn(widget).layers === before.layers - 1, "the layer to disappear");
      await until(() => !widget.layerConnectionConfs.some((conf: any) => conf.sourceLayerId === 2 || conf.targetLayerId === 2), "its connections to go");
      ok(drawn(widget).edges === expected(widget).edges, "edges of the removed layer are still drawn");
      ok(!widget.selected.layer, "the removed layer is still selected");
      await until(() => saved(widget).layerConfs.every((conf: any) => conf.layerId !== 2), "the block to follow");
    });

    it("the plain wheel zooms about the pointer", async function () {
      const widget = await mountWidget({ edit });
      await fitted(widget);
      const view = canvasOf(widget).viewport;
      const start = view.scale;
      const box = sceneOf(widget).getBoundingClientRect();
      const wheel = (deltaY: number) => sceneOf(widget).dispatchEvent(new WheelEvent("wheel", { deltaY, clientX: box.left + box.width / 2, clientY: box.top + box.height / 2, bubbles: true, composed: true, cancelable: true }));
      wheel(-100);
      await until(() => view.scale > start, "the wheel to zoom in");
      const zoomed = view.scale;
      wheel(100);
      wheel(100);
      await until(() => view.scale < zoomed, "the wheel to zoom out");
    });

    it("tapping the selected neuron again reopens a closed panel", async function () {
      const widget = await mountWidget({ edit });
      await fitted(widget);
      const neuron = await until(() => item(widget, "neuron-1n1"), "the first neuron").then(() => item(widget, "neuron-1n1"));
      await tap(neuron);
      await until(() => widget.selected.neuron === "1n1" && widget.panel === "neuron", "the neuron panel");
      window.dispatchEvent(new Event("close-all-panels"));
      await until(() => !widget.panel, "the panel to close");
      await tap(item(widget, "neuron-1n1"));
      await until(() => widget.panel === "neuron", "the panel to open again");
    });

    it("tapping a selected layer reopens its panel", async function () {
      const widget = await mountWidget({ edit });
      await fitted(widget);
      await until(() => drawn(widget).layers > 0, "the layers");
      const group = item(widget, "layer-1");
      const gap = (() => { const box = group.getBoundingClientRect(); return { x: box.left + 4, y: box.top + box.height / 2 }; })();
      const target = canvasOf(widget).shadowRoot.querySelector('[data-ww-key="layer-1"] ww-shape') as HTMLElement;
      const press = async () => {
        const at = gap;
        target.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true, cancelable: true, pointerId: 7, button: 0, isPrimary: true, buttons: 1, clientX: at.x, clientY: at.y }));
        target.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, composed: true, cancelable: true, pointerId: 7, button: 0, isPrimary: true, buttons: 0, clientX: at.x, clientY: at.y }));
        await frames();
      };
      await press();
      await until(() => widget.selected.layer === "1" && widget.panel === "layer", "the layer panel");
      window.dispatchEvent(new Event("close-all-panels"));
      await until(() => !widget.panel, "the panel to close");
      await press();
      await until(() => widget.panel === "layer", "the panel to open again");
    });

    it("edges end on the neurons with an arrowhead and follow a layer while it is dragged", async function () {
      const widget = await mountWidget({ edit });
      await fitted(widget);
      await until(() => drawn(widget).edges > 0, "the edges");
      const edge = [...canvasOf(widget).shadowRoot.querySelectorAll("ww-path")].find((path: Element) => path.getAttribute("data-ww-key")!.includes("-1n"));
      ok(edge && edge.getAttribute("marker-end") === "arrow", "an edge of the first layer has no arrowhead");
      const id = edge.getAttribute("data-ww-key").slice("edge-".length);
      const end = (path: any) => path.points?.at(-1) ?? path.end;
      await until(() => drawnPath(widget, id), "the drawn edge");
      const before = JSON.stringify(drawnPath(widget, id));
      const release = await holdLayer(widget, "1", 40, 90);
      const during = JSON.stringify(drawnPath(widget, id));
      await release();
      ok(before !== during, `the edge did not follow the layer while it was dragged: ${before} ${during}`);
      ok(end(drawnPath(widget, id)) !== undefined, "the edge has no end");
    });

    it("the fit shows the layer labels left of the network", async function () {
      const widget = await mountWidget({ edit });
      await fitted(widget);
      const canvas = canvasOf(widget);
      const extent = canvas.scene.extent();
      const leftmost = Math.min(...widget.layerConfs.map((conf: any) => conf.pos.x - 100));
      ok(extent.x < leftmost - 20, `the extent (${extent.x}) does not reach the labels`);
      const box = sceneOf(widget).getBoundingClientRect();
      const corner = canvas.viewport.toClient(extent.x, extent.y);
      const far = canvas.viewport.toClient(extent.x + extent.width, extent.y + extent.height);
      ok(corner.x >= box.left - 1 && corner.y >= box.top - 1 && far.x <= box.right + 1 && far.y <= box.bottom + 1, "the fitted view does not hold the whole extent");
    });

    it("zoom buttons and fit change the view", async function () {
      const widget = await mountWidget({ edit });
      const canvas = canvasOf(widget);
      await fitted(widget);
      const start = canvas.viewport.scale;
      canvas.zoomIn();
      await until(() => Math.abs(canvas.viewport.scale - (start + 0.1)) < 0.01, "zoom in");
      canvas.zoomOut();
      canvas.zoomOut();
      await until(() => Math.abs(canvas.viewport.scale - (start - 0.1)) < 0.01, "zoom out");
      canvas.fit();
      await until(() => Math.abs(canvas.viewport.scale - start) < 0.01, "fit");
    });

    it("trained weights and biases are drawn", async function () {
      const widget = await mountWidget({ edit });
      await until(() => drawn(widget).edges > 0 && widget.network, "the network");
      // layer 4 (8 neurons) takes the 12 neurons of layer 2: the kernel has 12 x 8 values
      const weights = Float32Array.from({ length: 96 }, (_, i) => (i === 0 ? 0.5 : i === 1 ? -2 : 0));
      widget.network.tensorConfs = new Map([[4, { tensor: {}, weights, bias: Float32Array.from({ length: 8 }, (_, i) => (i === 0 ? 0.25 : 0)) }]]);
      const edge = (id: string) => item(widget, `edge-${id}`);
      await until(() => edge("2n1e4n1")?.classList.contains("positive"), "a positive edge");
      ok(edge("2n1e4n2").classList.contains("negative"), "a negative weight is not drawn as negative");
      ok(edge("2n1e4n2").getAttribute("style")!.includes("12px") && edge("2n1e4n1").getAttribute("style")!.includes("3px"), "the width does not follow the weight");
      ok(!edge("2n2e4n1").classList.contains("positive") && !edge("2n2e4n1").classList.contains("negative"), "a zero weight has a colour");
      await until(() => item(widget, "neuron-4n1").textContent.includes("+0.25"), "the bias in the neuron");
    });

    it("a remote change of the layers is drawn", async function () {
      const widget = await mountWidget({ edit });
      await until(() => drawn(widget).layers === widget.layerConfs.length, "the layers");
      const data = saved(widget);
      data.layerConfs = data.layerConfs.slice(0, 1);
      data.layerConnectionConfs = [];
      block(widget).textContent = JSON.stringify(data);
      await until(() => drawn(widget).layers === 1 && drawn(widget).edges === 0, "one layer without edges");
    });
  });
}

mocha.run();
