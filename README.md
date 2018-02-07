<h1 align="center">Prism</h1>
<p align="center">Minimal, idiomatic style management for React Native.</p>
<p align="center">
  <img width="256" height="256" src="https://raw.githubusercontent.com/fika-community/prism/master/prism.png" />
</p>

---

- [Installation](#installation)
- [Synopsis](#synopsis)
- [Getting Started](#getting-started)
  - [Defining Styles](#defining-styles)
    - [Styles](#styles)
    - [Colors](#colors)
    - [Fonts](#fonts)
  - [Application Configuration](#application-configuration)
- [Components](#components)
  - [Defining Styled Components](#defining-styled-components)
  - [Quick Components](#quick-components)
  - [Bundling Styles](#bundling-styles)
  - [Default Styles](#default-styles)
  - [Mapping Properties To Styles](#mapping-properties-to-styles)
    - [mapPropsToStyle](#mappropstostyle)
      - [State](#state)
      - [Child Components](#child-components)
    - [mapStyleToProps](#mapstyletoprops)
  - [Property Type Validation](#property-type-validation)
  - [Namespaces](#namespaces)
  - [Requirements](#requirements)
- [Properties](#properties)
  - [Style Properties](#style-properties)
    - [style](#style)
    - [className](#classname)
  - [Extended Style Properties](#extended-style-properties)
    - [background](#background)
    - [color](#color)
    - [border](#border)
    - [padding](#padding)
    - [margin](#margin)
    - [flex](#flex)
    - [row](#row)
    - [wrap](#wrap)
    - [justify](#justify)
    - [position](#position)
    - [radius](#radius)
    - [width](#width)
    - [height](#height)
  - [Experimental Properties](#experimental-properties)
    - [font](#font)
    - [textTransform](#texttransform)
- [Cascade](#cascade)
- [Configuration](#configuration)
- [Appendix](#appendix)
  - [Color Names](#color-names)
  - [Flat Styles](#flat-styles)
  - [Plugins](#plugins)
    - [Creating Plugins](#creating-plugins)
      - [Property Plugins](#property-plugins)
      - [Global Plugins](#global-plugins)
    - [Plugin Configuration](#plugin-configuration)
      - [plugins](#plugins-1)
      - [additionalPlugins](#additionalplugins)
      - [disabledPlugins](#disabledplugins)
  - [Processor](#processor)
  - [Invariants](#invariants)
  - [Performance](#performance)
- [License](#license)

---

## Installation

Use your preferred package manager for installation.

```
npm i --save react-native-prism
yarn add react-native-prism
```

## Synopsis

Prism is a library that returns a Higher Order Component (HOC) exposing access to a style registry containing user-defined colors, fonts and styles.

It provides a simple yet flexible mechanism for mapping properties to styles and finding style declarations in the registry.

For any non-trival RN application the question arises on how to manage styles for your components. The Prism library provides a solution using idiomatic techniques that will leave your JSX clean and serene allowing you to focus on your application's state and logic.

If you want to migrate an existing application you should start with [Prism Primitives][] which provides a drop-in replacement for the RN visual components. See [Prism Components][] for some *slightly* more advanced components; if you want to see a running application clone and run the RN app in the [Prism Components][] repository.

## Getting Started

### Defining Styles

To configure your application stylesheets first create a theme with some styles, colors and fonts.

File: [theme.js](https://github.com/fika-community/prism/blob/master/doc/examples/theme.js)

```javascript
export default {
  colors: {
    bg: 'steelblue',
    highlight: '#fdfbdf',
    normal: '#9a9a9a'
  },
  fonts: {
    regular: 'WorkSans-Regular',
    medium: 'WorkSans-Medium'
  },
  styles: ({colors, fonts}) => {
    return {
      Label: {
        fontSize: 16,
        fontFamily: fonts.regular,
        color: colors.normal
      },
      bold: {
        fontFamily: fonts.medium
      }
    }
  }
}
```

#### Styles

Styles are declared as a function that is passed the style registry, typically you only need access to the colors and fonts.

#### Colors

Colors are a map from color name to string value. Use of custom color names is optional but it can help make your styles more semantic.

#### Fonts

Fonts are a map from font identifier to string font family name.

```javascript
{regular: 'WorkSans-Regular'}
```

Because Android uses the file name and iOS uses the PostScript name the easiest thing to do is name your fonts *using the PostScript* name.

If you need a conditional use a function which will be passed the value of `Platform.OS` and should return a platform-specific font family name.

```javascript
{
  regular: (os) => {
    return os === 'ios' ? 'WorkSans-Regular' : 'worksans'
  }
}
```

### Application Configuration

To configure your application create a style registry with your theme and instruct your components to use it:

File: [App.js](https://github.com/fika-community/prism/blob/master/doc/examples/App.js)

```javascript
import React, {Component} from 'react';
import {Prism, StyleRegistry} from 'react-native-prism'
import theme from './theme'
import Label from './Label'

const registry = new StyleRegistry({theme})
Prism.configure(
  registry,
  {
    extendedProperties: true,
    experimentalPlugins: true,
    textTransform: true,
    colorNames: true
  }
)
export default class Application extends Component {
  render () {
    return (
      <Label
        background='bg'
        color='highlight'
        bold
        align='center'
        textTransform='capitalize'
        padding={15}>
        Prism example application
      </Label>
    )
  }
}
```

With the `extendedProperties` option all the built in and extended [style properties](#style-properties) are available.

Note that you should `import` all your Prism enabled components *before* calling `configure()`.

## Components

### Defining Styled Components

To create a styled component you just need to pass the component class to the `Prism` function which will return the HOC component.

```javascript
import {View} from 'react-native'
import {Prism} from 'react-native-prism'
export default Prism(View)
```

Here is a working example for the application shown above.

File: [Label.js](https://github.com/fika-community/prism/blob/master/doc/examples/Label.js)

```javascript
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Text} from 'react-native'
import {Prism} from 'react-native-prism'

class Label extends Component {
  static styleOptions = {
    supportsText: true,
    mapPropsToStyle: {
      align: ({prop, styleSheet}) => {
        return {textAlign: prop}
      },
      bold: ({prop, styleSheet}) => {
        if (styleSheet.bold !== undefined) {
          return styleSheet.bold
        }
        return {fontWeight: 'bold'}
      }
    }
  }

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

The default styles for a component are extracted by class name so the stylesheet we created earlier already provides styles for our new component!

### Quick Components

```javascript
Prism.fix(Type, style, props)
```

Sometimes you want to wrap a component using fixed styles without too much fuss, use `Prism.fix()` to wrap a component with basic styles.

This is particularly useful when you just want to draw a shape, a convoluted example to illustrate inheritance:

```javascript
const Square = Prism.fix(
  View,
  {
    flex: 0,
    width: 20,
    height: 20,
    // Set absolute minimum color (defaultProps.style)
    backgroundColor: 'red'
  },
  {
    // Override backgroundColor with extended property
    background: 'green'
  }
)
```

```html
// Use the green background
<Square />
// Resize and use a blue background
<Square width={50} height={50} background='blue' />
```

### Bundling Styles

Component libraries should supply a style registry which is merged with the user-supplied registry to bundle their default styles.

```javascript
import React, {Component} from 'react'
import {Prism, StyleRegistry} from 'react-native-prism'
import theme from './theme'
const registry = new StyleRegistry({theme})
class Styled extends Component {
  static styleOptions = {
    registry: registry
  }
}
export default Prism(Styled)
```

An example of bundling default styles for a component library is in the [Layout](https://github.com/fika-community/prism-components/blob/master/src/Layout.js) and corresponding [theme](https://github.com/fika-community/prism-components/blob/master/src/theme.js) for [Prism Components][].

Users of the library can then selectively override style declarations where necessary.

### Default Styles

It is recommended that you bundle styles using a theme and style registry however it is possible to set the bare minimum styles for a component with `defaultProps`, to do so you use an object named using the corresponding property:

```javascript
static defaultProps = {
  style: {
    fontSize: 16,
    color: 'black'
  }
}
```

We can declare default styles for [child components](#child-components) too.

```javascript
static mapPropsToStyle = {
  labelStyle: {}
}
static defaultProps = {
  style: {
    flex: 1
  },
  labelStyle: {
    fontSize: 16,
    color: 'black'
  }
}
```

### Mapping Properties To Styles

Components have varied needs for mapping properties to style declarations so the library provides several ways to map properties depending upon the requirement.

Each of the mapping options may be either a function or object, when it is a function it is passed the style registry and should return an object.

You may declare these options as `static` fields on your component or within the object returned by `styleOptions`, when using the `static` declaration if often makes more sense to use the function notation so you can access the style registry.

```javascript
static mapPropsToStyle = {
  bold: ({styleSheet}) => {
    return styleSheet.bold
  }
}
```

Or using `styleOptions`:

```javascript
static styleOptions = {
  mapPropsToStyle: ({styleSheet}) => {
    bold: () => styleSheet.bold
  }
}
```

#### mapPropsToStyle

Use `mapPropsToStyle` when you want the presence of a property to trigger inclusion of styles into the computed style. Each object key maps to a property name and the corresponding function is called when the property is defined on the component.

You have access to all the properties so you can apply styles conditionally based on other properties:

```javascript
static mapPropsToStyle = {
  space: ({prop, props}) => {
    const {horizontal} = props
    const styleProp = horizontal ? 'marginRight' : 'marginBottom'
    const style = {}
    style[styleProp] = prop
    return style
  }
}
```

Functions declared in this way have access to the style registry (`styleSheet`, `colors` etc) the `props`, current `prop` and the computed component `options`. Functions should return a style object or array of objects, to take no action return `undefined`.

When the passed `prop` is returned a style rule is created using the property name and value which is useful when the property name matches the style property name:

```javascript
{color: ({prop}) => prop}
```

Is shorthand for:

```javascript
{
  color: ({prop}) => {
    return {color: prop}
  }
}
```

##### State

If you call `state()` with a string a style sheet is resolved using the familiar `a:hover` syntax.

For a component called `Notice`:

```javascript
static mapPropsToStyle = {
  error: ({prop, state}) => {
    if (prop === true) {
      // Include the style for Notice:error
      return state('error')
    }
  }
}
```

Would result in including the rule for `Notice:error` when the `error` property is `true`:

```javascript
{
  'Notice:error': {
    backgroundColor: 'red',
    color: 'white'
  }
}
```

```html
<Notice error>Error message</Notice>
```

This can be an easy way to trigger style variations that are resolved from the style sheet based on a property value. For example, if you have a `size` property that accepts `small|medium|large` you can do:

```javascript
static mapPropsToStyle = {
  size: ({prop, state}) => state(prop)
}
```

To resolve a style sheet for the value of `size`, eg: `Notice:small`, `Notice:medium` or `Notice:large`.

##### Child Components

For composite components you can route properties to styles that you apply to child components.

At it's simplest level the empty object just declares that your component wants a style object to pass to a child, but you can also route properties to child style objects:

```javascript
static mapPropsToStyle = {
  headerStyle: {
    color: ({prop}) => prop
  },
  bodyStyle: {}
}
```

Which will automatically define and create the `headerStyle` and `bodyStyle` properties for your component. The `propTypes` for the child style objects are automatically declared as we know ahead of time they should have the same property type as `style`.

The immediate benefit is that you can now define style rules using dot notation for the child components which will automatically be resolved as default styles.

```javascript
'Panel.Header': {
  color: 'blue',
  padding: 10
},
'Panel.Body': {
  padding: 20
}
```

For style declaration lookup the child component name is determined by the property name with any `Style` suffix removed and the first character converted to uppercase. If the component is namespaced use the fully qualified name, eg: `com.prism.ui.Panel.Header`.

Then your render should route the properties to child components, for example:

```javascript
render () {
  const {style, headerStyle, bodyStyle, label} = this.props
  return (
    <View style={style}>
      <Text style={headerStyle}>
        {label}
      </Text>
      <View style={bodyStyle}>
        {this.props.children}
      </View>
    </View>
  )
}
```

Now use of the `color` property on the parent is directed to the `headerStyle` object (and therefore the child component):

```html
<Panel color='red' />
```

You can combine `state()` with multiple child components to create some interesting behaviour:

```javascript
static mapPropsToStyle = {
  titleStyle: {
    size: ({state, prop}) => state(prop)
  },
  numberStyle: {
    size: ({state, prop}) => state(prop)
  }
}
```

For a component `NumberStack`:

```html
<NumberStack size='medium' />
```

Will resolve `NumberStack.Title:small` to include in `titleStyle` and `NumberStack.Number:small` for the `numberStyle`.

#### mapStyleToProps

This is the inverse mapping that extracts a style property and assigns it as a property on the component.

It is recommended to only use `mapStyleToProps` when you absolutely must as it requires flattening the computed styles.

```javascript
static mapStyleToProps = {
  tintColor: ({prop}) => prop
}
```

Typically this is used to deal with [invariants](#invariants) as in the example above which allows your component to respect `tintColor` in a style rule:

```javascript
Activity: {
  tintColor: 'purple'
}
```

And have it extracted to a property on the component:

```javascript
render () {
  const {style, tintColor} = this.props
  return (
    <View style={style}>
      <ActivityIndicator tintColor={tintColor} />
    </View>
  )
}
```

See [Activity.js](https://github.com/fika-community/prism-components/blob/master/src/Activity.js) for a complete implementation.

### Property Type Validation

It is important to know that the `propTypes` you declare are assigned to the HOC so properties work as expected and that your static `propTypes` are *augmented* with all the [style properties](#style-properties).

Built in `propTypes` are merged first so your `propTypes` will win if there is a property name collision however the behaviour is undefined so you should take care that your `propTypes` do not conflict.

If you need it the `Prism.propTypes` field exposes the system property types.

### Namespaces

The `Prism` function accepts a second argument which can be used to specify a namespace for your component. This is useful (and recommended) when designing reusable component sets.

```javascript
export default Prism(Label, 'com.prism.ui')
```

Now the default component style declaration name is `com.prism.ui.Label` and a consumer needs to declare the style using the fully qualified name:

```javascript
export default ({colors, fonts}) => {
  return {
    'com.prism.ui.Label': {
      color: colors.orange
    }
  }
}
```

### Requirements

Sometimes a component or library of components needs certain conditions to be met to be able to work correctly.

You may pass a *third* argument to `Prism()` which is a function passed the `registry` and `config` and can be used to validate the component requirements.

Here is an example from the `com.prism.ui` components:

```javascript
const requirements = ({config}) => {
  if (config.extendedProperties !== true) {
    return `extendedProperties must be set in config ` +
      `to use the ${Namespace} component library`
  }
}

export default Prism(Layout, Namespace, requirements)
```

If the component requirements are not met you can throw an error or return an error or a string. When a string is returned it is wrapped in an error and thrown.

Note that you can use this technique to validate style declarations exist, for example:

```javascript
const requirements = ({registry}) => {
  const {styleSheet} = registry
  if (!styleSheet.bold) {
    return `bold style declaration is required`
  }
}
```

If you want to specify requirements for a component that does not have a namespace pass the empty string for the `namespace` argument.

## Properties

### Style Properties

By default plugins are enabled that expose the following properties on all styled components.

#### style

`Array | Object`

Inline styles for the component.

#### className

`String | Array<String>`

Assign stylesheets to the component. When a string is given separate stylesheet names should be delimited with whitespace.

The property mapping API and these properties should be sufficient for most applications and indeed it might be considered best practice not to use the extended and experimental properties.

### Extended Style Properties

Extended properties allow for rapidly mocking layouts with a variety of convenient shortcuts for common style properties. Enable the `extendedProperties` option to use these properties.

Some extended properties require a component *opt-in* using `styleOptions` for the style to be applied, for example to receive the `color` property:

```javascript
static styleOptions = () => {
  return {
    supportsText: true
  }
}
```

* `supportsText`: Component can receive text style props.
* `supportsDimension`: Component can receive `width` and `height`.

Note that the `supportsText` option is also used to test whether a component can receive `textTransform` on it's children.

#### background

`String`

Set the `backgroundColor` style property.

#### color

`String`

Set the `color` style property, requires the `supportsText` flag.

#### border

`String | Array | Object`

Enables a border for the component, this shortcut is great for quickly visualizing component dimensions.

When a string is given `borderColor` is set and a default `borderWidth` is used.

When an array is given it takes the form `[width, color]`.

```javascript
{
  color: 'red',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
}
```

Note that not all RN components will set borders as expected when different widths are given for each side, if you experience problems with this syntax ensure the style is applied to a `View` rather than `Image` etc.

#### padding

`Number | Object | Array`

Sets padding properties, a number sets all edges to be equal.

Arrays are a shorthand for setting vertical and horizontal values and take the form: `[vertical, horizontal]`.

```javascript
{top: 0, right: 0, bottom: 0, top:0}
[5,10]
```

#### margin

`Number | Object | Array`

Sets margin properties, a number sets all edges to be equal.

Arrays are a shorthand for setting vertical and horizontal values and take the form: `[vertical, horizontal]`.

```javascript
{top: 0, right: 0, bottom: 0, top:0}
[5,10]
```

#### flex

`Number | Boolean | Object`

Shorthand for `flex` properties. A number is assigned directly to the `flex` style property, boolean is coerced to a number (yields zero or one).

Object notation supports the `grow`, `row` and `wrap` fields:

```
{
  grow: 1,
  row: true,
  wrap: true
}
```

The `row` boolean sets `flexDirection`, `wrap` sets `flexWrap` and `grow` sets the `flex` property.

#### row

`Boolean`

Set the `flexDirection` style property to `row`.

#### wrap

`Boolean`

Set the `flexWrap` style property.

#### justify

`Enum<String> (center|start|end|between|around)`

Set the `justifyContent` style property, note that the `flex-` prefixes are omitted.

#### position

`Object`

Makes a component absolutely positioned (relative to the parent as is the RN way) and sets the style properties to the given values.

```javascript
{top: 0, right: 0, bottom: 0, top:0}
```

#### radius

`Number | Object`

Sets border radius style properties.

```javascript
{
  top: {left: 0, right: 0},
  bottom: {left: 0, right: 0}
}
```

#### width

`Number | String`

Pass the `width` property into the computed style, requires the `supportsDimension` flag.

#### height

`Number | String`

Pass the `height` property into the computed style, requires the `supportsDimension` flag.

### Experimental Properties

When the `experimentalPlugins` option is given these properties are configured.

They are considered experimental due to use of `context` to propagate values to child components and the behaviour is undefined when components wrapped by `Prism()` make use of the `context`.

#### font

The `font` property provides a convenient shortcut for all the [Text Style Props][] and can be useful if you have a lot of inline text styling.

Only `Text` and `TextInput` components can accept these style properties so components that wish to receive them in their computed stylesheet must specify the `supportsText` option.

An example using [Prism Components][]:

```html
<Layout font={{size: 'large', color: 'red'}}>
  <Layout>
    <Label>Red text</Label>
    <Label font={{color: 'green'}}>
      Font style properties combined with those inherited from the grandparent
    </Label>
  </Layout>
</Layout>
```

The shape of the font object is described in [propTypes.js](https://github.com/fika-community/prism/blob/master/src/propTypes.js).

#### textTransform

```javascript
lowercase|uppercase|capitalize
```

The `textTransform` property provides a means to apply text transformations to components, it requires the `supportsText` flag on receiving components and requires that the `textTransform` and `experimentalPlugins` options are enabled.

This property is distinct from the `font` property as it's behaviour is very different, instead of injecting values into a style sheet it *modifies a component's children*.

In a style sheet:

```javascript
'Panel.Header': {
  textTransform: 'capitalize'
}
```

Inline property usage illustrating inheritance:

```html
<List space={5} textTransform='uppercase'>
  <List space={10}>
    <Paragraph>
      This is some uppercase text <Label textTransform='lowercase'>including some lowercase text in a Label</Label> in a paragraph. <Label textTransform='capitalize'>We can capitalize too</Label>.
    </Paragraph>
  </List>
</List>
```

Caveat that you cannot undo a transformation on a child (`none` is not supported), you can only override with a new transformation.

## Cascade

It can be useful to know some of the internals of how styles are computed.

Generally speaking these are the actions taken:

1. Default styles are applied.
2. Global plugins are executed.
3. Property plugins are executed.
4. Child component styles are computed.
5. Inline styles are applied.

Default styles start with any values in a style declaration inferred using the component class name, eg: `Label` when available. If the component is namespaced it is prefixed with the namespace and a period, eg: `com.prism.ui.Label`.

At this point, global plugins that handle [mapping properties to styles](mapping-properties-to-styles) are executed.

Then the property plugins which handle the extended and experimental properties are executed as well as any custom property plugins.

Subsequently the [mapStyleToProps](mapstyletocomponent) plugin is executed to create styles for child components, during this phase a child component style sheet (eg: `com.prism.ui.Panel.Header`) is added when present.

Finally any styles given in the `style` property take precedence.

## Configuration

You can pass a configuration object as the second argument to `Prism.configure()` to modify the library configuration. These are the common configuration options, some more advanced options are shown in [plugin configuration](#plugin-configuration).

When no configuration object is given support for the `className` property is enabled and the global plugins to support mapping properties to styles and resolving default styles.

This is a sensible minimal default configuration which will be sufficient for many applications and creates the least chance of conflict if you want to integrate Prism with an existing application.

* `defaultProps` use the [defaultProps](https://github.com/fika-community/prism/blob/master/src/defaultProps.js) plugin, default is `true`.
* `defaultStyleRule` use the [defaultStyleRule](https://github.com/fika-community/prism/blob/master/src/defaultStyleRule.js) plugin, default is `true`.
* `mapPropsToStyle` use the [mapPropsToStyle](https://github.com/fika-community/prism/blob/master/src/mapPropsToStyle.js) plugin, default is `true`.
* `mapStyleToProps` use the [mapStyleToProps](https://github.com/fika-community/prism/blob/master/src/mapStyleToProps.js) plugin, default is `true`.
* `className` use the property plugin for [className](https://github.com/fika-community/prism/blob/master/src/className.js), default is `true`.
* `extendedProperties` enables the [extended property plugins](https://github.com/fika-community/prism/blob/master/src/extendedPropertyPlugins.js).
* `experimentalPlugins` enables the [experimental plugins](https://github.com/fika-community/prism/blob/master/src/experimentalPlugins.js).
* `colorNames` enables the [color names](https://github.com/fika-community/prism/blob/master/src/colorNames.js) processor.
* `textTransform` enables the text transform support (requires experimental plugins).
* `debug` print configured plugins, default value is `__DEV__`.

For example to use the [extended style properties](#extended-style-properties) and enable color name lookup:

```javascript
Prism.configure(registry, {extendedProperties: true, colorNames: true})
```

To use `textTransform` you need to enable `experimentalPlugins`:

```javascript
Prism.configure(
  registry,
  {
    experimentalPlugins: true,
    textTransform: true
  }
)
```

## Appendix

### Color Names

Styles are much easier to change and we can add semantic meaning to our colors if we can refer to them by name, use the `colorNames` option to enable this functionality.

With the `colorNames` option enabled and a theme like:

```javascript
{
  colors: {
    primary: '#333333',
    muted: '#999999',
  },
  styles: ({colors}) => {
    return {
      Label: {
        fontSize: 16,
        color: colors.primary
      }
    }
  }
}
```

You can now override the color by name:

```html
<Label color='muted' />
```

To work in all scenarios (default properties, style sheets and properties) this logic is implemented as a [processor](#processor) and adds overhead therefore it is not enabled by default.

Consider that there may be a better way for your application to manage named colors internally before enabling this option.

### Flat Styles

Sometimes you are wrapping a third-party component and want to proxy the `style` object to the component but it does not accept an array for the `style` property; it enforces an object only property type.

The computed `style` property passed to your component is guaranteed to be an array; here however we need it to be an object. To do so you can use the `flat` option:

```javascript
static styleOptions = {
  flat: true
}
```

Now you can just proxy it to the child component knowing it will be an object:

```javascript
render () {
  const {style} = this.props
  return (
    <NonIdiomaticComponent style={style} />
  )
}
```

### Plugins

Plugins allow you to change the default behaviour.

#### Creating Plugins

To create a plugin you pass a plugin name, handler function and plugin options:

```javascript
new Plugin(
  'pluginName',
  () => { /* ... */ },
  {/* options */}
)
```

##### Property Plugins

If your plugin is for a property you should use the `propType` option:

```javascript
import PropTypes from 'prop-types'
const plugins = [
  new Plugin(
    'transform',
    ({prop, propName, styleSheet, colors}) => {
      // Return some transform specific style declarations
    },
    {propType: PropTypes.object}
  )
]
```

These plugins will only execute when the property is defined on the component.

See [extendedPropertyPlugins.js](https://github.com/fika-community/prism/blob/master/src/extendedPropertyPlugins.js) for several examples.

##### Global Plugins

Global plugins are those without a `propType` option:

```javascript
new Plugin(
  'globalPlugin',
  ({props, styleSheet}) => { /* ... */ },
  {requireOptions: true}
)
```

These plugins provide the ability to modify the computed style sheets without being triggered by the presence of a property.

They can provide options that filter when they are executed. For example `requireOptions` means *only run this plugin for components that have declared a corresponding options object*.

For the example above a component needs to explicitly enable the plugin:

```javascript
static styleOptions: {
  // Trigger execution of the plugin for this component
  globalPlugin: {}
}
```

#### Plugin Configuration

Use these configuration options to control plugins:

* `additionalPlugins` array of plugin definitions to append to the system plugins.
* `disabledPlugins` array of string plugin names to disable.
* `plugins` array of plugin definitions to use, overrides the system plugins.

##### plugins

Use your own `plugins` array when you want to specify a list of plugins to use *before* any plugins enabled using the configuration flags, you can disable `className` and `mapPropsToStyle` etc to use only the custom plugins you specify.

##### additionalPlugins

Use the `additionalPlugins` option to add custom functionality to all your styled components, see [plugins](#plugins) for information on defining custom plugins.

```javascript
Prism.configure(
  registry,
  {
    extendedProperties: true,
    additionalPlugins: [
      new Plugin(
        'customGlobalPlugin',
        ({props, styleSheet}) => {
          // Do something cool
        }
      )
    ]
  }
)
```

##### disabledPlugins

You may want to remove plugins you don't need or if you find a property name collision:

```javascript
Prism.configure(
  registry,
  {
    extendedProperties: true,
    disabledPlugins: ['position', 'wrap']
  }
)
```

The `disabledPlugins` option is processed after `plugins` and `additionalPlugins` so you may use this to disable your custom plugins. If you give a plugin name that does not exist it is ignored.

### Processor

TODO

### Invariants

Invariants are unknown style declarations that would trigger an error when compiling style sheets with `StyleSheet.create()`. This strict behaviour of RN is very useful but there are occasions where it makes more sense to put the information in a style sheet and invariants allow us to do that. Internally they are extracted as invariant style rules and later resolved when styles are computed.

An example of this is `tintColor` where we need to assign to the `tintColor` property of `ActivityIndicator` but really it's styling information and is better suited to being in a style sheet.

Also the experimental `textTransform` property is treated as an invariant so it can be declared in style rules and processed using the plugin system yet never appear in compiled or computed style sheets.

Invariants use a processor to ensure computed styles do not contain these properties so they incur the same performance penalty (stylesheet flattening is required).

### Performance

TODO

## License

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on February 7, 2018

[prism primitives]: https://github.com/fika-community/prism-primitives
[prism components]: https://github.com/fika-community/prism-components
[text style props]: https://facebook.github.io/react-native/docs/text-style-props.html

