/// <reference types="mocha" />
import "mocha/mocha.js";
import { assert } from "chai";
import { getMochaConfig } from "@webwriter/build/test";
import people from "./fixtures/people.csv";
import prices from "./fixtures/prices.csv";
import { mountWidget, unmount, until } from "./helpers";

mocha.setup(getMochaConfig());

const ok = (condition: unknown, message: string) => assert.isTrue(!!condition, message);
const csv = (text: string, name = "data.csv") => new File([text], name, { type: "text/csv" });

describe("<webwriter-neural-network> files and signals", function () {
  this.timeout(30000);
  afterEach(unmount);

  it("declares its formats", async function () {
    const widget = await mountWidget({ edit: false });
    const ctor = widget.constructor;
    ok(".csv" in ctor.convertFrom && ".json" in ctor.convertFrom, "import formats");
    ok("text/csv" in ctor.convertTo && "application/json" in ctor.convertTo, "export formats");
    for (const method of [...Object.values(ctor.convertFrom), ...Object.values(ctor.convertTo)]) ok(typeof widget[method as string] === "function", `${method} is missing`);
  });

  it("a CSV file becomes a selected data set only when the apply function runs", async function () {
    const widget = await mountWidget({ edit: true });
    const before = widget.availableDataSets.length;
    const apply = await widget.importCsv(csv(people, "People Data.csv"));
    ok(widget.availableDataSets.length === before, "the widget changed before apply");
    apply();
    ok(widget.availableDataSets.length === before + 1, "the data set was not added");
    const set = widget.dataSet;
    ok(set.name === "People-Data" && set.type === "classification", `name ${set.name}, type ${set.type}`);
    ok(set.featureDescs.map((f: any) => f.key).join() === "age,income" && set.labelDesc.key === "label", "columns");
    ok(set.data.length === 4 && set.data[2].features[1] === 55, "rows");
    await until(() => JSON.parse(widget.querySelector(':scope > script[type="application/json"]').textContent).dataSet.name === "People-Data", "the block to hold the data set");
  });

  it("a semicolon file with a numeric label is a regression data set, and names stay unique", async function () {
    const widget = await mountWidget({ edit: true });
    (await widget.importCsv(csv(prices, "prices.csv")))();
    (await widget.importCsv(csv(prices, "prices.csv")))();
    ok(widget.dataSet.type === "regression" && widget.dataSet.name === "prices-2", `${widget.dataSet.type} ${widget.dataSet.name}`);
    ok(widget.dataSet.featureDescs[0].key === "x1", "feature key");
  });

  it("invalid CSV files are refused and change nothing", async function () {
    const widget = await mountWidget({ edit: true });
    const name = widget.dataSet.name;
    for (const text of ["", "a,b\n", "a,b\n1,2\n3\n", "a,b\n1,2\n3,x\n", "7\n8\n"]) {
      let error: Error | undefined;
      try { await widget.importCsv(csv(text)); } catch (e) { error = e as Error; }
      ok(error?.message, `no error for ${JSON.stringify(text)}`);
    }
    ok(widget.dataSet.name === name, "the data set changed");
  });

  it("export then import of CSV keeps the rows", async function () {
    const widget = await mountWidget({ edit: true });
    (await widget.importCsv(csv(people, "people.csv")))();
    const file = await widget.exportCsv();
    ok(file.name === "people.csv" && file.type === "text/csv", `file ${file.name} ${file.type}`);
    const text = await file.text();
    ok(text.split("\n")[0] === "age,income,label", "header row");
    (await widget.importCsv(csv(text, "again.csv")))();
    ok(JSON.stringify(widget.dataSet.data) === JSON.stringify(widget.availableDataSets.find((s: any) => s.name === "people").data), "rows differ");
  });

  it("the JSON export is a config that the import takes back, and a bad file is refused", async function () {
    const widget = await mountWidget({ edit: true });
    const file = await widget.exportJson();
    ok(file.type === "application/json" && file.name.endsWith(".json"), "file");
    const config = JSON.parse(await file.text());
    ok(config.version === 1 && config.layerConfs.length === widget.layerConfs.length, "config content");
    const layers = widget.layerConfs.length;
    widget.layerConfs = widget.layerConfs.slice(0, 1);
    (await widget.importJson(file))();
    ok(widget.layerConfs.length === layers, "the layers were not restored");
    let error: Error | undefined;
    try { await widget.importJson(new File(["{\"version\": 2}"], "x.json")); } catch (e) { error = e as Error; }
    ok(error, "version 2 was accepted");
    error = undefined;
    try { await widget.importJson(new File(["nope"], "x.json")); } catch (e) { error = e as Error; }
    ok(error, "invalid JSON was accepted");
  });

  it("publishes the training history and its last loss", async function () {
    const widget = await mountWidget({ edit: false });
    const { history, loss } = widget.signals;
    ok(history.get().columns[0] === "epoch" && history.get().rows.length === 0 && loss.get() === null, "empty at the start");
    const before = history.get();
    widget.modelConf = { ...widget.modelConf, history: [{ loss: 0.9, acc: 0.5 }, { loss: 0.4, acc: 0.7, val_loss: 0.5 }] };
    ok(history.get() !== before && history.get().rows.length === 2, "the table did not follow");
    ok(history.get().columns.join() === "epoch,loss,val_loss,acc" && history.get().rows[0][2] === null, `columns ${history.get().columns}`);
    ok(loss.get() === 0.4, `loss ${loss.get()}`);
    ok(widget.signals.history === history, "the signal instance changed");
    // a different history of the same length replaces the table
    widget.modelConf = { ...widget.modelConf, history: [{ loss: 0.8, acc: 0.1 }, { loss: 0.3, acc: 0.9 }] };
    ok(loss.get() === 0.3 && history.get().rows[0][1] === 0.8, "a replaced history of the same length was not published");
  });
});

mocha.run();
