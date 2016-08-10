import React, { Component } from 'react';
import Service from '../components/service'

export default class ServiceContainer extends Component {
  render() {
    const { platform, serviceType } = this.props.params
    const { otpKey } = this.props.location.query
    return (
      <Service otpKey={otpKey} serviceType={serviceType} platform={platform} />
    );
  }
}
