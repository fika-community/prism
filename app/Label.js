import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Text} from 'react-native'
import {Prism} from '../src/Prism'

class Label extends Component {

  static styleOptions = () => {
    return {
      colorNames: ['color'],

    }
  }

  static propTypes = {
    color: PropTypes.string
  }

  render () {
    // Get the computed style sheet
    const {style} = this.props
    return (
      <Text style={style}>{this.props.children}</Text>
    )
  }
}

//export default Prism(Label, 'com.fika.text')
export default Prism(Label)
