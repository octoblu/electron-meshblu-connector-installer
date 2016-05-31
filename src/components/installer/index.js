import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import './index.css';

import DebugConfig from '../debug-config';
import DebugLines from '../debug-lines';
import ErrorState from '../error-state';
import InstallerMaster from './installer-master';

import {
  Spinner,
  ProgressBar,
  Button,
  EmptyState,
} from 'zooid-ui';

const MAX_STEPS = 5;

class Installer extends Component {
  state = {
    error: null,
    config: null,
    configLoading: true,
    step: 0,
    showDebug: false,
    lines: [],
    message: 'Loading...'
  }

  componentDidMount() {
    const key = this.props.otpKey
    this.installer = new InstallerMaster({ key })
    this.installer.on('debug', (line) => {
      let { lines } = this.state;
      lines.push(`-- ${line}`)
      this.setState({ lines });
    });
    this.installer.on('step', (message) => {
      let { step, lines } = this.state;
      const newStep = step + 1;
      lines.push(`[Step ${newStep}]: ${message}`);
      this.setState({ message, step: newStep });
    });
    this.installer.on('config', (config) => {
      this.setState({ config, configLoading: false });
    });
    this.installer.on('error', (error) => {
      this.setState({ error });
    });
    this.installer.start(() => {
      this.setState({ done: true, step: 5, message: "done" })
    })
  }

  toggleDebug = () => {
    this.setState({ showDebug: !this.state.showDebug });
  }

  exitApp = () => {
    console.log('exitApp');
  }

  getDebug = () => {
    const { config, lines, showDebug } = this.state;
    if (!showDebug) return (
      <div onClick={this.toggleDebug}
        className="Button Button--hollow-neutral Installer--button">
        <i className="fa fa-bug"></i> Show Debug
      </div>
    );
    return (
      <div className="Installer--split">
        <div className="Installer--split-item Installer-split-small">
          <DebugConfig config={config} />
        </div>
        <div className="Installer--split-item">
          <DebugLines lines={lines} />
        </div>
      </div>
    );
  }

  renderContent = (content) => {
    return (
      <div className="Installer">
        <div className="Installer--top-actions">
          <Link to="/"><i className="fa fa-chevron-left"></i> Start Over</Link>
        </div>
        <div className="Installer--content">
          {content}
        </div>
        {this.getDebug()}
      </div>
    );
  }

  render() {
    const { error, configLoading, done } = this.state;

    if (error) return this.renderContent(<ErrorState message={error.message} />);
    if (configLoading) return this.renderContent(<Spinner size="large"/>);
    if (done) return this.renderContent(<Button className="Installer--done" kind="hollow-approve" onClick={this.exitApp}>Success! Please Close.</Button>);

    const { config, message, step } = this.state
    const { connector } = config;
    const percentage = step / MAX_STEPS * 100;

    return this.renderContent(
      <div>
        <h2>Installing: <strong>{connector}</strong></h2>
        <ProgressBar completed={percentage}/>
        <h3>Step: {step} / {MAX_STEPS} {message}</h3>
      </div>
    );
  }
}

Installer.propTypes = {
  otpKey: PropTypes.string.isRequired
}

export default Installer;
