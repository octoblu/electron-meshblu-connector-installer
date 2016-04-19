import React, { Component } from 'react';
import './index.css';

import DebugConfig from '../debug-config'
import DebugLines from '../debug-lines'
import InstallerInfo from '../../services/installer-info';
import DependencyDownloader from '../../services/dependency-downloader';
import ExecuteThings from '../../services/execute-things';

import {
  Spinner,
  ProgressBar,
  ErrorState,
  Button,
  EmptyState
} from 'zooid-ui'

const MAX_STEPS = 5;

class Installer extends Component {
  state = {
    error: null,
    config: null,
    configLoading: true,
    step: 1,
    debugOn: true,
    lines: [],
    message: 'Retrieving configuration...'
  }

  componentDidMount() {
    new InstallerInfo().getInfo((error, config) => {
      if (error) {
        return this.setState({ error });
      }
      this.setState({
        config,
        step: 2,
        message: 'Downloading dependencies...',
        configLoading: false
      });
      new DependencyDownloader(config).downloadAll((error) => {
        if (error) {
          return this.setState({ error });
        }
        this.setState({ step: 3, message: 'Installing dependencies...' });
        const executeThings = new ExecuteThings(config);
        executeThings.installDeps((error) => {
          if (error) {
            return this.setState({ error });
          }
          this.setState({ step: 4, message: 'Installing connector...' });
          executeThings.installConnector((error) => {
            if (error) {
              return this.setState({ error });
            }
            this.setState({ step: 5, message: 'Connector Installed!' });
          });
        });
      });
    });
  }

  toggleDebug = () => {
    this.state.debugOn = !this.state.debugOn
  }

  getDebug = () => {
    const { config, lines, debugOn } = this.state;
    if (!debugOn) return <div></div>
    return (
      <div className="Installer--split">
        <div className="Installer--split-item">
          <DebugConfig config={config} />
        </div>
        <div className="Installer--split-item">
          <DebugLines lines={lines} />
        </div>
      </div>
    );
  }

  render() {
    const { error, config, configLoading, message, step } = this.state;

    if (error) return <ErrorState title={error.message} />;
    if (configLoading) return <Spinner size="large"/>;

    const { connector } = config;
    const percentage = step / MAX_STEPS * 100

    return (
      <div>
        <div className="Installer">
          <h2>Installing: <small>{connector}</small></h2>
          <ProgressBar completed={percentage}/>
          <h3>Step: {step} / {MAX_STEPS} {message}</h3>
          <Button kind="neutral" onClick={this.toggleDebug}><i class="fa fa-debug"></i></Button>
          {this.getDebug()}
        </div>
      </div>
    );
  }
}

export default Installer;
