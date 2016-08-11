import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
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

export default class InputKey extends Component {
  static propTypes = {
    otpKey: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      otpKey: null,
    }
    this.handleKeyChange = this.handleKeyChange.bind(this);
  }

  componentDidMount() {
    let otpKey
    if (this.props) {
      otpKey = this.props.otpKey
    }

    this.setState({otpKey})
  }

  handleKeyChange() {
    const ref = this.refs.otpKey;
    const otpKey = ReactDOM.findDOMNode(ref).value;
    let message = null
    let editKey = true
    if (!otpKey) {
      message = 'Missing One Time Password'
    }
    hashHistory.push({
      pathname: '/service-types',
      query: {otpKey},
    })
  }

  renderContent(content) {
    return (
      <div>
        <div className="InputKey">
          {content}
        </div>
      </div>
    )
  }

  render() {
    const { error, editKey, otpKey, message } = this.state

    if (error) return this.renderContent(<ErrorState message={error.message} />)
    return this.renderContent(
      <div className="InputKey--change-key">
        <div className="InputKey--warning-message">{message}</div>
        <FormField className="InputKey--form-field" label="Enter One Time Password" name="otpKey">
          <FormInput type="text" ref="otpKey" name="otpKey" defaultValue={otpKey} />
        </FormField>
        <FormActions>
          <Button onClick={this.handleKeyChange} kind="primary">Use Key</Button>
        </FormActions>
      </div>
    )
  }
}
