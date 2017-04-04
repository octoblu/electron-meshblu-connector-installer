import React, { PropTypes, Component } from 'react'
import { hashHistory } from 'react-router'

import ErrorState from 'zooid-error-state'
import CustomErrorState from '../error-state'

import './index.css'

class Service extends Component {
  static propTypes = {
    otpKey: PropTypes.string.isRequired,
    errorMessage: PropTypes.string,
  }

  goToInstall() {
    const { otpKey } = this.props
    let serviceType = 'user-service'
    if (process.platform === 'win32') {
      serviceType = 'user-login'
    }
    hashHistory.push({
      pathname: '/install',
      query: { otpKey, serviceType },
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
    const { errorMessage } = this.props

    if (error) return (<CustomErrorState message={error.message} />)
    if (errorMessage) return (<CustomErrorState message={errorMessage} />)
    return (
      <div>
        <ErrorState
          title="Install as Current User"
          description="Your connector will be installed as the current user."
          buttonText="Install"
          onClick={() => this.goToInstall()}
        />
        <hr className="Divider" />
        <ErrorState
          title="Install as Administrator"
          description="Install the connector as a system-level service. You will be asked to provide administrator credentials before the install process begins."
          buttonText="Install"
          buttonKind="danger"
          className="AdminInstall"
          onClick={() => this.goToAdminInstall()}
        />
      </div>
    )
  }
}

export default Service
