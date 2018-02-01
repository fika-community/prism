import {Platform, StyleSheet} from 'react-native'

let registered = false

export default class StyleRegistry {
  fonts = {}
  colors = {}
  colorNames = []
  colorProperties = []
  styles = {}
  styleSheet = null

  addColors (colors) {
    this.colors =
      Object.assign(this.colors, colors)
    this.colorNames = Object.keys(this.colors)
  }

  addFonts (map) {
    for (let k in map) {
      const fn = map[k]
      this.fonts[k] = fn(Platform.OS)
    }
  }

  addStyleSheet (styleSheet) {
    const {colors, fonts, colorNames, colorProperties} = this

    // styleSheet should be a function
    this.styles = Object.assign(
      {},
      styleSheet({colors, fonts, colorNames, colorProperties})
    )

    // Compile the raw styles
    this.styleSheet = StyleSheet.create(this.styles)

    if (!registered) {
      StyleSheet.setStyleAttributePreprocessor('color', (propValue) => {
        console.log('preprocessor for color prop: ' + propValue)
        return this.colors[propValue] || propValue
      })
      registered = true
    }
  }
}
