import React, {Component} from 'react';
import {Prism, StyleRegistry} from '../../src/Prism'
import theme from './theme'
import Label from './Label'

const registry = new StyleRegistry()
registry.addTheme(theme)
Prism.configure(
  registry,
  {
    debug: true,
    extendedProperties: true,
    experimentalPlugins: true
  }
)
export default class Application extends Component {
  render () {
    return (
      <Label
        background='steelblue'
        color='white'
        bold
        align='center'
        text={{transform: 'capitalize'}}
        padding={15}>
        Prism example application
      </Label>
    )
  }
}