import React, { PropTypes, Component } from 'react'
import { hashHistory } from 'react-router'

import ErrorState from 'zooid-error-state'
import CustomErrorState from '../error-state'

import './index.css'

class Service extends Component {
  static propTypes = {
    otpKey: PropTypes.string.isRequired,
  }

  goToInstall() {
    const { otpKey } = this.props
    console.log('user-service')

    hashHistory.push({
      pathname: '/install',
      query: { otpKey, serviceType: 'user-service' },
    })
  }

  goToAdminInstall() {
    const { otpKey } = this.props

    hashHistory.push({
      pathname: '/install',
      query: { otpKey, serviceType: 'service' },
    })
  }

  render() {
    const { error } = this.state || {}

    if (error) return (<CustomErrorState message={error.message} />)
    return (
      <div>
        <ErrorState
          title="Ready to install!"
          description="Your connector will be installed as the current user."
          buttonText="Begin Install"
          onClick={() => this.goToInstall()}
        />
        <hr className="Divider" />
        <ErrorState
          title="Install as Administrator"
          description="Install the connector as a system-level service. You will be asked to provide administrator credentials before the install process begins."
          buttonText="Admin Install"
          buttonKind="danger"
          className="AdminInstall"
          onClick={() => this.goToAdminInstall()}
        />
      </div>
    )
  }
}

export default Service
