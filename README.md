# Prism

<p align="center">
  <img width="256" height="256" src="https://raw.githubusercontent.com/fika-community/prism/master/prism.png" />
</p>

Minimal, idiomatic style management for React Native.

---

- [Components](#components)
  - [Stylesheets](#stylesheets)
    - [Colors](#colors)
    - [Fonts](#fonts)
    - [Styles](#styles)
    - [Registry](#registry)
  - [Styled Components](#styled-components)

---

## Components

### Stylesheets

To configure your application stylesheets first create some colors, fonts and styles.

#### Colors

Colors are a map from color name to value.

```javascript
export default {
  orange: '#ff6600'
}
```

#### Fonts

Fonts are declared as functions that return a different string per platform as iOS uses the PostScript name and Android uses the file name.

Each font function is passed a boolean indicating if the platform is iOS.

```javascript
export default {
  regular: (ios) => {
    return ios ? 'WorkSans-Regular' : 'worksans'
  }
}
```

#### Styles

Styles are declared as a function that is passed the style registry, typically you only need access to the colors and fonts so this signature is common:

```javascript
export default ({colors, fonts}) => {
  return {
    Label: {
      fontSize: 16,
      fontFamily: fonts.regular,
      color: colors.orange
    }
  }
}
```

#### Registry

Now you can create a registry for your style definitions and instruct your components to use the registry:

```javascript
// Import all your routes, views or components

import {Prism, StyleRegistry} from 'react-native-prism'
import Colors from './Colors'
import Fonts from './Fonts'
import StyleSheet from './StyleSheet'

// Create the style registry
const registry = new StyleRegistry()
registry.addColors(Colors)
registry.addFonts(Fonts)
registry.addStyleSheet(StyleSheet)

// Use this registry for styled components
Prism.configure(registry)

// Initialize your application
```

### Styled Components

To create a styled component you just need to pass the component class to the `Prism` function which will return a HOC wrapper.

```javascript
import React, {Component} from 'react'
import {Text} from 'react-native'
import {Prism} from 'react-native-prism'

class Label extends Component {
  render () {
    // Get the computed style sheet
    const {style} = this.props
    return (
      <Text style={style}>{this.props.children}</Text>
    )
  }
}
export default Prism(Label)
```

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on January 28, 2018

