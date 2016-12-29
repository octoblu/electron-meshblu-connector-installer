import _ from 'lodash'
import React, { Component } from 'react'
import Service from '../components/service'
import PageLayout from './page-layout'

export default class ServiceContainer extends Component {
  render() {
    const otpKey = _.get(this.props, 'location.query.otpKey')
    const errorMessage = _.get(this.props, 'location.query.errorMessage')
    return (
      <PageLayout>
        <Service otpKey={otpKey} errorMessage={errorMessage} />
      </PageLayout>
    )
  }
}
