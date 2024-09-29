#!/usr/bin/env node

import * as esbuild from "esbuild"
import * as fs from "fs"
import * as process from "process"

const isDev = process.argv[2] === "dev"
const isPreview = process.argv[2] === "preview"

const scriptExtensions = [".js", ".mjs", ".cjs"]

// Plugin to only resolve internal dependencies and non-ES-Module files
// Disabled for now - CJS cross-compatibility issues
const widgetPlugin = pkg => ({
  name: "esbuild-plugin-webwriter-widget",
  setup(build) {
    const deps = Object.keys(pkg?.dependencies ?? {})
    build.onResolve({filter: /.*$/}, args => {
      const isDependency = deps.some(dep => args.path.startsWith(dep))
      const isScript = scriptExtensions.some(ext => args.path.endsWith(ext))
      const isBare = !args.path.split("/").at(-1)?.includes(".")
      const isLocal = !args.path.split("/").at(-1)?.includes(".")
      return {external: isDependency && (isScript || isBare)}
    })
  }
}) 

// Tell NPM that the `dist` folder can be published
if(!fs.existsSync("./.npmignore")) {
  fs.writeFileSync("./.npmignore", "!dist", "utf8")
}


// Build with WebWriter's default options for building. Builds every `package.exports` entry of the form `"./my-widget.*": {"source": "./src/my-widget.ts", "default": "./dist/my-widget.*"} -> this should build `my-widget.js` and `my-widget.css` from the specified source into the dist directory.
const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"))
const widgetKeys = Object.keys(pkg?.exports ?? {}).filter(k => k.startsWith("./widgets/"))

const config = {
  write: true,
  bundle: true,
  plugins: [
    //widgetPlugin(pkg)
  ],
  entryPoints: widgetKeys.map(k => ({out: pkg.exports[k].default.replace(".*", ""), in: pkg.exports[k].source})),
  outdir: ".",
  target: "es2022",
  format: "esm",
  logLevel: "info",
  loader: {
    ".json": "json",
    ".jsonld": "json",
    ".htm": "text",
    ".html": "text",
    ".xml": "text",
    ".csv": "text",
    ".apng": "dataurl",
    ".jpg": "dataurl",
    ".jpeg": "dataurl",
    ".jfif": "dataurl",
    ".pjpeg": "dataurl",
    ".pjp": "dataurl",
    ".png": "dataurl",
    ".svg": "dataurl",
    ".tif": "dataurl",
    ".tiff": "dataurl",
    ".wav": "dataurl",
    ".wave": "dataurl",
    ".mp3": "dataurl",
    ".aac": "dataurl",
    ".aacp": "dataurl",
    ".oga": "dataurl",
    ".flac": "dataurl",
    ".weba": "dataurl",
    ".mp4": "dataurl",
    ".webm": "dataurl",
    ".avif": "dataurl",
    ".gif": "dataurl",
    ".mov": "dataurl",
    ".avi": "dataurl",
    ".ogv": "dataurl",
    ".mkv": "dataurl",
    ".opus": "dataurl",
    ".mpeg": "dataurl",
    ".woff": "dataurl",
    ".woff2": "dataurl",
    ".ttf": "dataurl",
    ".otf": "dataurl",
    ".pdf": "dataurl",
  }
}

if(isDev) {
  let ctx = await esbuild.context(config)
  await ctx.watch()
}
else if(isPreview) {
  const rawKey = process.argv[3]
  const key = `./widgets/${rawKey}.*`
  const path = pkg.exports[key].default.replace(".*", "")
  const contents = `
    <script src="https://cdn.jsdelivr.net/npm/@webcomponents/scoped-custom-element-registry"></script>
    <script defer src="${rawKey + ".js"}" type="module"></script>
    <link rel="stylesheet" href="${rawKey + ".css"}" type="text/css">
    <${rawKey}></${rawKey}>
  `
  fs.writeFileSync("./dist/index.html", contents, "utf8")
  let ctx = await esbuild.context(config)
  await ctx.serve({servedir: "."})
}
else {
  await esbuild.build(config)
}