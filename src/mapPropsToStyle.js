import Plugin from './Plugin'
import util from './util'
const {isString, isFunction, isObject} = util

export default new Plugin(
  'mapPropsToStyle',
  ({props, options, registry, ns, attrName, styleSheet}) => {
    const {mapPropsToStyle} = options

    //console.log('mapPropsToStyle: ' + Object.keys(mapPropsToStyle))

    const sheets = []
    for (let k in mapPropsToStyle) {
      const prop = props[k]
      if (props.hasOwnProperty(k) && prop !== undefined) {
        const fn = mapPropsToStyle[k]

        // TODO: verify ahead of time?
        if (isFunction(fn)) {
          const sheet = fn({...registry, options, ns, props, prop})
          // Returned a string, trigger :hover syntax
          if (isString(sheet)) {
            let stateStyleDeclName
            let stateStyleSheet
            if (attrName === 'style') {
              // This gives us the top-level component
              stateStyleDeclName = ns.getStateClassName(sheet)
              stateStyleSheet = styleSheet[stateStyleDeclName]
            } else{
              stateStyleDeclName = ns.getChildStateClassName(attrName, sheet)
              stateStyleSheet = styleSheet[stateStyleDeclName]
            }
            if (stateStyleSheet) {
              sheets.push(stateStyleSheet)
            }
          }else if (sheet !== undefined) {
            sheets.push(sheet)
          }
        }
      }
    }
    return sheets
  },
  {
    requireOptions: true,
    validator: (computed) => {
      console.log('VALIDATOR CALLED')
      if (!isObject(computed)) {
        throw new Error(
          `Prism you declared ${name} as an invalid type, expected object ` +
          `but got ${typeof(computed)}`
        )
      }
    }
  }
)
