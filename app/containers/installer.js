import React, { Component } from 'react'
import Installer from '../components/installer'

export default class InstallerPage extends Component {
  render() {
    const { otpKey, serviceType, platform } = this.props.location.query

    return (
      <Installer otpKey={otpKey} serviceType={serviceType} platform={platform} />
    )
  }
}
