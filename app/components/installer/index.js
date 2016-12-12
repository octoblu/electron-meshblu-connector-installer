import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import FaBug from 'react-icons/lib/fa/bug'

import Spinner from 'zooid-spinner'

import InstallerInfo from '../../services/installer-info'
import DebugConfig from '../debug-config'
import DebugLines from '../debug-lines'
import ErrorState from '../error-state'
import InstallerMaster from './installer-master'

import './index.css'

class Installer extends Component {
  static propTypes = {
    otpKey: PropTypes.string.isRequired,
    serviceType: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
  }

  state = {
    error: null,
    config: null,
    configLoading: true,
    started: false,
    showDebug: false,
    lines: [],
    message: 'Loading...',
  }

  componentDidMount() {
    const { otpKey, serviceType } = this.props
    new InstallerInfo({ emitDebug: this.emitDebug })
      .getInfo({ otpKey, serviceType }, (infoError, config) => {
        if (infoError) {
          this.setState({ error: infoError })
          return
        }
        this.setState({ config, configLoading: false })
        this.start(config)
      })
  }

  componentWillUnmount() {
    this.stop()
  }

  getDebug = () => {
    const { error, config, lines, showDebug } = this.state
    if (!showDebug && !error) {
      return (
        <button
          onClick={this.toggleDebug}
          className="Button Button--hollow-neutral Installer--button"
        >
          <FaBug size="1rem" /> Show Debug
        </button>
      )
    }
    return (
      <div className="Installer--split">
        <div className="Installer--split-item Installer-split-small">
          <DebugConfig config={config || {}} />
        </div>
        <div className="Installer--split-item">
          <DebugLines lines={lines} />
        </div>
      </div>
    )
  }

  toggleDebug = () => {
    this.setState({ showDebug: !this.state.showDebug })
  }

  start(config) {
    if (_.isEmpty(config)) {
      this.setState({ error: new Error('Missing configuration') })
      return
    }
    const installer = new InstallerMaster()
    installer.on('debug', (line, isError) => {
      const { lines } = this.state
      lines.push({ line, isError, timestamp: Date.now() })
      this.setState({ lines })
    })
    installer.on('error', (error) => {
      this.setState({ error })
    })
    installer.on('done', () => {
      this.setState({ done: true, message: 'done' })
    })
    installer.start(config)
    this.setState({ started: true })
    this.installer = installer
  }

  stop() {
    if (!this.installer) {
      return
    }
    this.installer.removeAllListeners()
    this.installer.stop()
  }

  renderContent = (content) => {
    return (
      <div className="Installer">
        <div className="Installer--content">
          {content}
        </div>
        {this.getDebug()}
      </div>
    )
  }

  render() {
    const { error, configLoading, done } = this.state

    if (error) return this.renderContent(<ErrorState message={error.message} />)
    if (configLoading) return this.renderContent(<Spinner size="large" />)
    if (done) {
      return this.renderContent(
        <div className="Installer--done">
          Success! Please Close. <br />
          <small>* Sorry I currently can&rsquo;t do it for you *</small>
        </div>
      )
    }

    const { config } = this.state
    const { connector } = config

    return this.renderContent(
      <div>
        <h2>Installing: <strong>{connector}</strong></h2>
        <Spinner size="large" />
      </div>
    )
  }
}

export default Installer
