/// <reference types="mocha" />
import "mocha/mocha.js";
import { assert } from "chai";
import { getMochaConfig } from "@webwriter/build/test";
import { block, deep, mountWidget, saved, unmount, until } from "./helpers";

mocha.setup(getMochaConfig());

const ok = (condition: unknown, message: string) => assert.isTrue(!!condition, message);

for (const edit of [false, true]) {
  describe(`<webwriter-neural-network> data and language (${edit ? "edit" : "read"} mode)`, function () {
    this.timeout(30000);
    afterEach(unmount);

    it("the authored data block is read", async function () {
        const widget = await mountWidget({ edit });
      const authored = saved(widget);
      ok(widget.layerConfs.length === authored.layerConfs.length, "layerConfs differ from the block");
      ok(widget.layerConnectionConfs.length === authored.layerConnectionConfs.length, "layerConnectionConfs differ");
      ok(widget.dataSet.name === authored.dataSet.name || JSON.stringify(widget.dataSet) === JSON.stringify(authored.dataSet), "dataSet differs");
      ok(JSON.stringify(widget.settings) === JSON.stringify(authored.settings), "settings differ");
      ok(widget.hasAttribute("editable"), "the editable attribute is gone");
    });

    it("a change is written to the same block, once", async function () {
        const widget = await mountWidget({ edit });
      const before = saved(widget);
      const next = structuredClone(widget.settings);
      next.mayImport = false;
      widget.settings = next;
      await until(() => saved(widget).settings.mayImport === false, "the block to hold the change");
      const after = saved(widget);
      ok(widget.querySelectorAll(':scope > script[type="application/json"]').length === 1, "more than one data block");
      ok(block(widget).getAttribute("slot") === "data", "the block lost its slot");
      ok(JSON.stringify(after.layerConfs) === JSON.stringify(before.layerConfs), "an unrelated key changed");
      ok(JSON.stringify(after.availableDataSets) === JSON.stringify(before.availableDataSets), "datasets changed");
      ok(Object.keys(after).sort().join() === Object.keys(before).sort().join(), "the keys of the block changed");
    });

    it("in-place changes of an array are written when it is assigned again", async function () {
        const widget = await mountWidget({ edit });
      widget.qAndA.push({ title: "Q?", description: "A." });
      widget.qAndA = [...widget.qAndA];
      await until(() => saved(widget).qAndA.some((entry: any) => entry.title === "Q?"), "first entry");
      widget.qAndA.push({ title: "Q2?", description: "A2." });
      widget.qAndA = [...widget.qAndA];
      await until(() => saved(widget).qAndA.some((entry: any) => entry.title === "Q2?"), "second entry");
    });

    it("a remote change of the block updates the widget", async function () {
        const widget = await mountWidget({ edit });
      const data = saved(widget);
      data.layerConfs = data.layerConfs.slice(0, 1);
      data.layerConnectionConfs = [];
      block(widget).textContent = JSON.stringify(data);
      await until(() => widget.layerConfs.length === 1 && widget.layerConnectionConfs.length === 0, "the widget to follow the block");
    });

    it("a block without a key falls back to the default", async function () {
        const widget = await mountWidget({ edit });
      const data = saved(widget);
      delete data.settings;
      block(widget).textContent = JSON.stringify(data);
      await until(() => widget.settings.mayImport === true && Object.keys(widget.settings).length === 17, "default settings");
    });

    it("language follows the lang attribute, also in nested components", async function () {
        const widget = await mountWidget({ edit });
      let changes = 0;
      widget.addEventListener("optionschange", () => changes++);
      ok(widget.msg("Train") === "Train", "source language expected first");
      widget.setAttribute("lang", "de");
      await until(() => widget.msg("Train") === "Trainieren", "German in the widget");
      ok(changes > 0, "no optionschange for the drawer");
      widget.panel = "train";
      await until(() => deep(widget.shadowRoot, "training-train-card")?.shadowRoot?.textContent.includes("Trainieren"), "German in a nested card");
      widget.setAttribute("lang", "ja");
      await until(() => deep(widget.shadowRoot, "training-train-card")?.shadowRoot?.textContent.includes("電車"), "Japanese in a nested card");
      widget.removeAttribute("lang");
      await until(() => widget.msg("Train") === "Train", "back to the source language");
      await until(() => deep(widget.shadowRoot, "training-train-card")?.shadowRoot?.textContent.includes("Train for"), "source language in the nested card");
    });
  });
}

mocha.run();
