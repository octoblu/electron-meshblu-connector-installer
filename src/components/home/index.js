import React, { Component } from 'react';
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

import GetOTPKey from '../../services/get-otp-key'
import ErrorState from '../error-state'

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      key: null,
      loading: true,
      editKey: false
    }
    this.handleKeyChange = this.handleKeyChange.bind(this);
    this.editKey = this.editKey.bind(this);
  }

  checkIfPrivileged(callback) {
    if(process.platform !== 'win32') {
      return callback(null, true)
    }
    isAdmin().then((admin) => {
      callback(null, admin)
    }, (error) => {
      callback(error)
    })
  }

  componentDidMount() {
    this.checkIfPrivileged((error, privileged) => {
      if(error) return this.setState({ error })
      if(!privileged) {
        return this.setState({ error: new Error('Installer must be run as administrator')})
      }
      new GetOTPKey().getKey((error, response) => {
        if (error) return this.setState({ error })
        const { key } = response;
        this.setState({ key, editKey: !key, loading: false })
      })
    })
  }

  editKey() {
    this.setState({ editKey: true })
  }

  handleKeyChange() {
    const ref = this.refs.otpKey;
    const key = ReactDOM.findDOMNode(ref).value;
    let message = null
    let editKey = true
    if(!key) {
      message = "Missing One Time Password"
    } else {
      editKey = false
    }
    this.setState({ key, message, editKey })
  }

  renderContent(content){
    return (
      <div>
        <div className="Home">
          <h2>Meshblu Connector Installer</h2>
          {content}
        </div>
      </div>
    )
  }

  render() {
    const { error, loading, editKey, key, message } = this.state

    if (error) return this.renderContent(<ErrorState message={error.message} />)
    if (loading) return this.renderContent(<Spinner size="large" />)
    if (editKey) {
      return this.renderContent(
        <div className="Home--change-key">
          <div className="Home--warning-message">{message}</div>
          <FormField className="Home--form-field" label="Enter One Time Password" name="otpKey">
            <FormInput type="text" ref="otpKey" name="otpKey" defaultValue={key} />
          </FormField>
          <FormActions>
            <Button onClick={this.handleKeyChange} kind="primary">Use Key</Button>
          </FormActions>
        </div>
      )
    }
    return this.renderContent(
      <div className="Home--actions">
        <div className="Home--info-action"><strong>Using One Time Password:</strong> {key} <i onClick={this.editKey} className="fa fa-pencil"></i></div>
        <Link to={`/install/${key}`} className="Button Button--hollow-approve">Begin Install</Link>
      </div>
    );
  }
}
