import _ from 'lodash'
import React, { PropTypes, Component } from 'react'
import ReactDOM from 'react-dom'
import { hashHistory } from 'react-router'

import './index.css'

import {
  Button,
  FormActions,
  FormField,
  FormInput,
} from 'zooid-ui'

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
    this.handleKeyChange = this.handleKeyChange.bind(this)
    this.handleKeySubmit = this.handleKeySubmit.bind(this)
  }

  componentDidMount() {
    const otpKey = _.get(this.props, 'otpKey', _.get(this.props, 'location.query.otpKey'))
    this.setState({otpKey})
  }

  handleKeySubmit() {
    const { otpKey } = this.state
    if (!otpKey) {
      this.setState({ message: 'Missing One Time Password' })
      return
    }
    hashHistory.push({
      pathname: '/service-types',
      query: { otpKey },
    })
  }

  handleKeyChange() {
    const ref = this.refs.otpKey
    const otpKey = ReactDOM.findDOMNode(ref).value
    this.setState({ otpKey })
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
    const { error, otpKey, message } = this.state

    if (error) return this.renderContent(<ErrorState message={error.message} />)
    return this.renderContent(
      <div className="InputKey--change-key">
        <div className="InputKey--warning-message">{message}</div>
        <FormField className="InputKey--form-field" label="Enter One Time Password" name="otpKey">
          <FormInput onChange={this.handleKeyChange} type="text" ref="otpKey" name="otpKey" value={otpKey || ''} />
        </FormField>
        <FormActions>
          <Button onClick={this.handleKeySubmit} kind="primary">Use Key</Button>
        </FormActions>
      </div>
    )
  }
}