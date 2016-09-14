import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { hashHistory, Link } from 'react-router';
import isAdmin from 'is-admin';

import ErrorState from 'zooid-error-state'
import CustomErrorState from '../error-state'

import './index.css';

import {
  Spinner,
  Button,
  FormActions,
  FormField,
  FormInput,
} from 'zooid-ui';

class Service extends Component {
  static propTypes = {
    otpKey: PropTypes.string.isRequired,
    serviceType: PropTypes.string.isRequired,
    platform: PropTypes.string.isRequired,
  }

  goInstall() {
    const { otpKey, serviceType, platform } = this.props || {}

    hashHistory.push({
      pathname: '/install',
      query: {otpKey, serviceType, platform},
    })
  }

  goAdminInstall() {
    const { otpKey, platform } = this.props || {}
    const serviceType = 'service'

    hashHistory.push({
      pathname: `/install`,
      query: {otpKey, serviceType, platform},
    })
  }

  render() {
    const { otpKey, serviceType, platform } = this.props || {}
    const { error, message } = this.state || {}

    if (error) return (<CustomErrorState message={error.message} />)
    return (
      <div>
        <ErrorState title="Ready to install!"
            description="Your connector will be installed as the current user."
            buttonText="Begin Install"
            onClick={() => this.goInstall()}/>
        <hr className="Divider" />
        <ErrorState title="Install as Administrator"
            description="Install the connector as a system-level service. You will be asked to provide administrator credentials before the install process begins."
            buttonText="Admin Install"
            buttonKind="danger"
            className="AdminInstall"
            onClick={() => this.goAdminInstall()}/>
      </div>
    )
  }
}

export default Service