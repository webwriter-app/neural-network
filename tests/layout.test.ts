/// <reference types="mocha" />
import "mocha/mocha.js";
import { assert } from "chai";
import { getMochaConfig } from "@webwriter/build/test";
import snippet from "../snippets/Pima-Indians-Diabetes.html";
import { canvasOf, centre, frames, item, pointer, until } from "./helpers";

mocha.setup(getMochaConfig());

const ok = (condition: unknown, message: string) => assert.isTrue(!!condition, message);

let wrapper: HTMLElement | undefined;
const mountAt = async (width: number, style = ""): Promise<any> => {
  wrapper?.remove();
  wrapper = document.createElement("div");
  wrapper.style.cssText = `width: ${width}px; ${style}`;
  document.body.append(wrapper);
  wrapper.innerHTML = snippet;
  const widget = wrapper.firstElementChild as any;
  await until(() => widget.layerConfs?.length > 0 && widget.shadowRoot?.querySelector("canvas-area") && canvasOf(widget)?.shadowRoot?.querySelector("ww-group"), "the network");
  return widget;
};

describe("<webwriter-neural-network> layout, touch and theme", function () {
  this.timeout(30000);
  afterEach(() => { wrapper?.remove(); wrapper = undefined; });

  it("the widget follows its container between 300 and 2100 px", async function () {
    for (const width of [300, 700, 2100]) {
      const widget = await mountAt(width);
      await frames();
      const box = widget.getBoundingClientRect();
      // the snippet sets 800 px, the container can only make it narrower
      ok(Math.abs(box.width - Math.min(800, width)) <= 1, `the widget is ${box.width} px wide in a ${width} px container`);
      if (width < innerWidth - 40) ok(document.documentElement.scrollWidth <= document.documentElement.clientWidth, `the page scrolls sideways at ${width} px`);
    }
  });

  it("the menu moves below the canvas in a narrow container", async function () {
    const narrow = await mountAt(320);
    narrow.shadowRoot.querySelector("canvas-area").dispatchEvent(new CustomEvent("open-panel", { detail: "train", bubbles: true, composed: true }));
    await until(() => narrow.panel === "train", "the panel");
    await frames(2);
    const canvas = narrow.shadowRoot.querySelector("canvas-area").getBoundingClientRect();
    const menu = narrow.shadowRoot.querySelector("menu-area").getBoundingClientRect();
    ok(menu.top >= canvas.bottom - 1, "the menu is not below the canvas");
    ok(menu.width >= canvas.width - 2, "the menu is not as wide as the canvas");
    const wide = await mountAt(1000);
    wide.shadowRoot.querySelector("canvas-area").dispatchEvent(new CustomEvent("open-panel", { detail: "train", bubbles: true, composed: true }));
    await until(() => wide.panel === "train", "the panel");
    await frames(2);
    const wideCanvas = wide.shadowRoot.querySelector("canvas-area").getBoundingClientRect();
    const wideMenu = wide.shadowRoot.querySelector("menu-area").getBoundingClientRect();
    ok(wideMenu.left >= wideCanvas.right - 1, "the menu is not beside the canvas");
  });

  it("a collapsed menu does not make the widget scroll", async function () {
    const widget = await mountAt(800);
    await frames(2);
    ok(widget.scrollWidth <= widget.clientWidth + 1, "the widget scrolls sideways with the menu closed");
  });

  it("a touch tap selects a neuron and every canvas control is at least 24 px", async function () {
    const widget = await mountAt(800);
    const neuron = await until(() => item(widget, "neuron-1n1"), "the first neuron").then(() => item(widget, "neuron-1n1"));
    const at = centre(neuron);
    pointer(neuron, "pointerdown", at, { buttons: 1, pointerType: "touch" });
    pointer(neuron, "pointerup", at, { buttons: 0, pointerType: "touch" });
    await until(() => widget.selected.neuron === "1n1" && widget.panel === "neuron", "the neuron to be selected by touch");
    const area = widget.shadowRoot.querySelector("canvas-area");
    for (const button of area.shadowRoot.querySelectorAll("#canvasActions sl-button")) {
      const box = button.getBoundingClientRect();
      ok(box.width >= 24 && box.height >= 24, `a canvas control is ${box.width} x ${box.height} px`);
    }
  });

  it("the theme sets the text color, the font and the accent colors", async function () {
    const widget = await mountAt(800, "--ww-text-color: rgb(1, 2, 3); --ww-font-family: Georgia, serif; --ww-theme-accent-1: rgb(200, 10, 20); --ww-theme-accent-2: rgb(10, 200, 20);");
    const scene = canvasOf(widget).shadowRoot.querySelector("ww-scene");
    ok(getComputedStyle(widget).color === "rgb(1, 2, 3)", "the host does not use --ww-text-color");
    ok(getComputedStyle(scene).color === "rgb(1, 2, 3)", "the network text does not use --ww-text-color");
    ok(/Georgia/.test(getComputedStyle(scene).fontFamily), "the network does not use --ww-font-family");
    ok(/Georgia/.test(getComputedStyle(widget).fontFamily), "the host does not use --ww-font-family");
    const body = canvasOf(widget).shadowRoot.querySelector("ww-group ww-shape.body");
    ok(getComputedStyle(body).stroke === "rgb(200, 10, 20)", `a layer does not use --ww-theme-accent-1: ${getComputedStyle(body).stroke}`);
    const plain = await mountAt(800);
    const plainBody = canvasOf(plain).shadowRoot.querySelector("ww-group ww-shape.body");
    ok(getComputedStyle(plainBody).stroke !== "rgb(200, 10, 20)", "the accent shows without a theme");
  });

  it("the widget names its parts", async function () {
    const widget = await mountAt(800);
    ok(widget.shadowRoot.querySelector("canvas-area[part=canvas]"), "no canvas part");
    await until(() => widget.shadowRoot.querySelector("menu-area[part=menu]"), "the menu part");
  });

  it("the print styles hide the menu and keep the widget on one page", async function () {
    const widget = await mountAt(800);
    const rules: string[] = [];
    const collect = (list: CSSRuleList) => { for (const rule of Array.from(list)) { if (rule instanceof CSSMediaRule && rule.conditionText.includes("print")) rules.push(rule.cssText); } };
    for (const sheet of (widget.shadowRoot.adoptedStyleSheets ?? []) as CSSStyleSheet[]) collect(sheet.cssRules);
    for (const sheet of Array.from(widget.shadowRoot.styleSheets) as CSSStyleSheet[]) collect(sheet.cssRules);
    const css = rules.join("\n");
    ok(/menu-area[^{]*\{[^}]*display:\s*none/.test(css), "the menu is not hidden in print");
    ok(/break-inside:\s*avoid/.test(css), "the widget may break across pages");
  });

  it("an open menu keeps its 435 px width at 800 px", async function () {
    const widget = await mountAt(800);
    widget.shadowRoot.querySelector("canvas-area").dispatchEvent(new CustomEvent("open-panel", { detail: "train", bubbles: true, composed: true }));
    await until(() => widget.panel === "train", "the panel");
    await frames(3);
    const width = widget.shadowRoot.querySelector("menu-area").getBoundingClientRect().width;
    ok(Math.abs(width - 435) <= 1, `the menu is ${width} px wide`);
  });
});

mocha.run();
