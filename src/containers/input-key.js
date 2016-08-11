import React, { Component } from 'react';
import InputKey from '../components/input-key'

export default class InputKeyPage extends Component {
  render() {
    let otpKey
    if (this.props && this.props.location && this.props.location.query) {
      otpKey = this.props.otpKey || this.props.location.query.otpKey
    }
    return (
      <InputKey otpKey={otpKey} />
    );
  }
}
