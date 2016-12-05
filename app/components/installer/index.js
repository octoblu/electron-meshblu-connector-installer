import React, { Component, PropTypes } from 'react'
import FaBug from 'react-icons/lib/fa/bug'
import {
  Spinner,
  ProgressBar,
} from 'zooid-ui'

import ZooidOctobluIntercom from 'zooid-octoblu-intercom'
import DebugConfig from '../debug-config'
import DebugLines from '../debug-lines'
import ErrorState from '../error-state'
import InstallerMaster from './installer-master'

import './index.css'

const MAX_STEPS = 5

class Installer extends Component {
  static propTypes = {
    otpKey: PropTypes.string.isRequired,
    serviceType: PropTypes.string.isRequired,
    platform: PropTypes.string.isRequired,
  }

  state = {
    error: null,
    config: null,
    configLoading: true,
    step: 0,
    showDebug: false,
    lines: [],
    message: 'Loading...',
  }

  componentDidMount() {
    const { otpKey, serviceType } = this.props
    this.installer = new InstallerMaster({ otpKey, serviceType })
    this.installer.on('debug', (line) => {
      const { lines } = this.state
      lines.push(`-- ${line}`)
      this.setState({ lines })
    })
    this.installer.on('step', (message) => {
      const { step, lines } = this.state
      const newStep = step + 1
      lines.push(`[Step ${newStep}]: ${message}`)
      this.setState({ message, step: newStep })
    })
    this.installer.on('config', (config) => {
      this.setState({ config, configLoading: false })
    })
    this.installer.on('error', (error) => {
      this.setState({ error })
    })
    this.installer.start(() => {
      this.setState({ done: true, step: 5, message: 'done' })
    })
  }

  componentWillUnmount() {
    this.installer.removeAllListeners()
    this.installer.stop()
  }

  getIntercom({ uuid, token } = {}) {
    if (!uuid || !token) {
      return null
    }
    return <ZooidOctobluIntercom appId="ux5bbkjz" uuid={uuid} token={token} />
  }

  getDebug = () => {
    const { config, lines, showDebug } = this.state
    if (!showDebug) {
      return (
        <div
          onClick={this.toggleDebug}
          className="Button Button--hollow-neutral Installer--button"
        >
          <FaBug className="Installer--faicon" /> Show Debug
        </div>
      )
    }
    return (
      <div className="Installer--split">
        <div className="Installer--split-item Installer-split-small">
          <DebugConfig config={config} />
        </div>
        <div className="Installer--split-item">
          <DebugLines lines={lines} />
        </div>
      </div>
    )
  }

  exitApp = () => {
  }

  toggleDebug = () => {
    this.setState({ showDebug: !this.state.showDebug })
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
          <small>* Sorry I currently can't do it for you *</small>
        </div>
      )
    }

    const { config, message, step } = this.state
    const { connector, octoblu } = config
    const percentage = (step / MAX_STEPS) * 100

    return this.renderContent(
      <div>
        <h2>Installing: <strong>{connector}</strong></h2>
        <ProgressBar completed={percentage} />
        <h3>Step: {step} / {MAX_STEPS} {message}</h3>
        {this.getIntercom(octoblu)}
      </div>
    )
  }
}

export default Installer
