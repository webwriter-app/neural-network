import { CSSResult } from 'lit'
import type { Theme } from '@/types/theme'

import shoelaceLightStyles from '@shoelace-style/shoelace/dist/themes/light.styles.js'
import shoelaceDarkStyles from '@shoelace-style/shoelace/dist/themes/dark.styles.js'

import IconSun from "bootstrap-icons/icons/sun.svg"
import IconMoon from "bootstrap-icons/icons/moon.svg"

// The ThemeUtils class provides the static default themes.
export class ThemeUtils {
  static lightTheme: Theme = {
    styles: <CSSResult>shoelaceLightStyles,
    name: 'light',
    slIcon: IconSun,
  }
  static darkTheme: Theme = {
    styles: <CSSResult>shoelaceDarkStyles,
    name: 'dark',
    slIcon: IconMoon,
  }
  static themeOptions: Theme[] = [ThemeUtils.lightTheme, ThemeUtils.darkTheme]
}
