import _ from 'lodash'
import React, { Component } from 'react'
import InputKey from '../components/input-key'

export default class InputKeyPage extends Component {
  render() {
    const otpKey = _.get(this.props, 'location.query.otpKey')
    const errorMessage = _.get(this.props, 'location.query.errorMessage')
    return (
      <div>
        <InputKey otpKey={otpKey || ''} errorMessage={errorMessage} />
      </div>
    )
  }
}
