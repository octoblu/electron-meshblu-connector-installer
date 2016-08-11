import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import isAdmin from 'is-admin';

import './index.css';

import {
  Spinner,
  Button,
  FormActions,
  FormField,
  FormInput,
} from 'zooid-ui';

import ErrorState from '../error-state'

class Service extends Component {
  static propTypes = {
    otpKey: PropTypes.string.isRequired,
    serviceType: PropTypes.string.isRequired,
    platform: PropTypes.string.isRequired,
  }

  renderContent(content) {
    return (
      <div>
        <div className="Service">
          <h2>Connector Installer</h2>
          {content}
        </div>
      </div>
    )
  }

  render() {
    const { otpKey, serviceType, platform } = this.props || {}
    const { error, message } = this.state || {}

    if (error) return this.renderContent(<ErrorState message={error.message} />)
    if (serviceType == 'service') {
      return this.renderContent(
        <div className="Service--actions">
          <h2>Warning: This will install as a system-level service</h2>
          <div className="Service--info-action"><strong>Using One Time Password:</strong> {otpKey}</div>
          <Link to={{pathname: '/install', query: {otpKey, serviceType, platform}}} className="Button Button--hollow-approve">Begin Install</Link>
        </div>
      );
    }
    return this.renderContent(
      <div className="Service--actions">
        <div className="Service--info-action"><strong>Using One Time Password:</strong> {otpKey}</div>
        <Link to={{pathname: '/install', query: {otpKey, serviceType, platform}}} className="Button Button--hollow-approve">Begin Install</Link>
        <Link to={{pathname: `/service/${platform}/service`, query: {otpKey}}} className="Button Button--hollow-approve">Switch to Admin</Link>
      </div>
    );
  }
}

export default Service
