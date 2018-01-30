import PropTypes from 'prop-types'
import propTypes from './PropTypes'

export default [

  // Support for className
  [
    ({prop, styleSheet}) => {
      const className = prop
      const find = (list) => {
        return list
          .filter((nm) => styleSheet.hasOwnProperty(nm))
          .map((nm) => styleSheet[nm])
      }

      if (Array.isArray(className)) {
        return find(className)
      }

      return find(className.split(/\s+/))
    },
    {className: propTypes.className}
  ],

  // Color name handling
  [
    'colorNames',
    ({plugin, props, colors, options, definition}) => {
      const {Type} = definition
      let {propNames} = plugin
      const sheet = {}
      propNames.forEach((propName) => {
        const val = props[propName] || (Type.defaultProps && Type.defaultProps[propName])
        if (val) {
          if (colors[val]) {
            sheet[propName] = colors[val]
          } else if (Type.defaultProps && Type.defaultProps[propName]) {
            sheet[propName] = val
          }
        }
      })
      return sheet
    },
    propTypes.colorNames
  ],

  // Support for mapPropsToStyleDecl
  [
    'mapPropsToStyleDecl',
    ({props, options, definition}) => {
      const {mapPropsToStyleDecl} = options
      const {Name} = definition
      if (mapPropsToStyleDecl) {
        const sheets = []
        for (let k in mapPropsToStyleDecl) {
          if (props[k] !== undefined) {
            const sheet = mapPropsToStyleDecl[k]
            if (sheet !== undefined) {
              sheets.push(sheet)
            } else {
              throw new Error(
                `Prism mapPropsToStyleDecl missing style ` +
                `declaration for "${k}" in component ${Name}`
              )
            }
          }
        }
        return sheets
      }
    }
  ],

  // Support for mapPropsToStyleProp
  [
    'mapPropsToStyleProp',
    ({props, options, definition}) => {
      const {mapPropsToStyleProp} = options
      const {Name} = definition
      if (mapPropsToStyleProp) {
        const sheets = []
        for (let k in mapPropsToStyleProp) {
          if (props[k] !== undefined) {
            const sheet = {}
            sheet[mapPropsToStyleProp[k]] = props[k]
            sheets.push(sheet)
          }
        }
        return sheets
      }
    }
  ],

  // Support for mapping properties to child objects
  [
    'mapPropsToObject',
    (pluginOptions) => {
      const {props, options} = pluginOptions
      const {mapPropsToObject} = options
      if (mapPropsToObject) {
        for (let k in mapPropsToObject) {
          const def = mapPropsToObject[k]
          // NOTE: we take advantage of the fact
          // NOTE: that Object.freeze() is shallow
          // NOTE: here, would like to find a better
          // NOTE: way to propagate these props

          // Property object must already be declared
          if (props[k]) {
            if (Array.isArray(def)) {
              def.forEach((propName) => {
                props[k][propName] = props[propName]
              })
            } else {
              for (let z in def) {
                props[k][z] = props[def[z]]
              }
            }
          }
        }
      }
    }
  ],

  // Support for mapPropsToStyle
  [
    'mapPropsToStyle',
    (pluginOptions) => {
      const {props, definition, options, util} = pluginOptions
      const {mapPropsToStyle} = options
      const {Type} = definition
      if (util.isObject(mapPropsToStyle)) {
        const sheets = []
        for (let k in mapPropsToStyle) {
          const prop = props[k]
          const mapOptions = {...pluginOptions, prop}
          if (props.hasOwnProperty(k) && prop !== undefined) {
            const fn = mapPropsToStyle[k]
            if (util.isFunction(fn)) {
              const sheet = fn(mapOptions)
              if (sheet !== undefined) {
                sheets.push(sheet)
              }
            }
          }
        }
        return sheets
      }
    }
  ],

]
