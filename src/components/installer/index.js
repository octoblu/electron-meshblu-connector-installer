import React, { Component } from 'react';
import './index.css';

import DebugConfig from '../debug-config'
import DebugLines from '../debug-lines'
import InstallerMaster from './installer-master'

import {
  Spinner,
  ProgressBar,
  ErrorState,
  Button,
  EmptyState,
  Icon
} from 'zooid-ui'

const MAX_STEPS = 4;

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
    this.installer = new InstallerMaster()
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
      this.setState({ done: true })
    })
  }

  toggleDebug = () => {
    this.setState({ showDebug: !this.state.showDebug });
  }

  getDebug = () => {
    const { config, lines, showDebug } = this.state;
    if (!showDebug) return (
      <Button
        kind="neutral"
        onClick={this.toggleDebug}
        className="Installer--button">
        <Icon name="MdBugReport" /> Show Debug
      </Button>
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

  render() {
    const { error, config, configLoading, done, message, step } = this.state;

    if (error) return <div className="Installer"><ErrorState title={error.message} /></div>;
    if (configLoading) return <div className="Installer"><Spinner size="large"/></div>;

    const { connector } = config;
    const percentage = step / MAX_STEPS * 100;

    let content = (
      <div>
        <h2>Installing: <strong>{connector}</strong></h2>
        <ProgressBar completed={percentage}/>
        <h3>Step: {step} / {MAX_STEPS} {message}</h3>
      </div>
    );
    if(done) {
      content = <div className="Action-Button Installer--done">Success! Exit app.</div>
    }
    return (
      <div className="Installer">
        <div className="Installer--content">
          {content}
        </div>
        {this.getDebug()}
      </div>
    );
  }
}

export default Installer;
