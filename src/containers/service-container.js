import React, { Component } from 'react'
import Service from '../components/service'
import PageLayout from './page-layout'

export default class ServiceContainer extends Component {
  render() {
    const { platform, serviceType } = this.props.params
    const { otpKey } = this.props.location.query
    let title = "Install Connector"
    if (serviceType === 'service') {
      title = "Install Connector as Admin"
    }
    return (
      <PageLayout>
        <div>
          <Service otpKey={otpKey} serviceType={serviceType} platform={platform} />
        </div>
      </PageLayout>
    )
  }
}
