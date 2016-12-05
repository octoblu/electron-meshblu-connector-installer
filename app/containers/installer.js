import _ from 'lodash'
import React, { Component } from 'react'
import Installer from '../components/installer'

export default class InstallerPage extends Component {
  render() {
    const query = _.get(this.props, 'location.query', {})
    const { otpKey, serviceType, platform } = query

    return (
      <Installer otpKey={otpKey} serviceType={serviceType} platform={platform} />
    )
  }
}
