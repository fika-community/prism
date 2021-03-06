import propTypes from './propTypes'
import Plugin from './Plugin'

export default new Plugin(
  'className',
  ({prop, registry}) => {
    const className = prop
    const find = (list) => {
      return list
        .reduce((arr, nm) => {
          registry.select(registry.className(nm), arr)
          return arr
        }, [])
    }
    if (Array.isArray(className)) {
      return find(className)
    }
    return find(className.split(/\s+/))
  },
  {propType: propTypes.className}
)
