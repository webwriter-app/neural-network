// The Lit localization CLI generates this JavaScript module.
declare module "*/locale-codes.js" {
  export const sourceLocale: string
  export const targetLocales: readonly string[]
}

declare module "@webwriter/build/test" {
  export const getMochaConfig: () => Mocha.MochaOptions
}
