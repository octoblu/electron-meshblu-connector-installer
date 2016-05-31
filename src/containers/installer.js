import React, { Component } from 'react';
import Installer from '../components/installer'

export default class InstallerPage extends Component {
  render() {
    const { key } = this.props.params

    return (
      <Installer otpKey={key} />
    );
  }
}
