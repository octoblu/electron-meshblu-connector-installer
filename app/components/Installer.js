import React, { Component } from 'react';
import styles from './Installer.css';
import InstallerInfo from '../services/installer-info';
import DependencyDownloader from '../services/dependency-downloader';
import ExecuteThings from '../services/execute-things';

const MAX_STEPS = 5;

class Installer extends Component {
  state = {
    error: null,
    config: null,
    configLoading: true,
    step: 1,
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

  getDebug = () => {
    // if (process.env.NODE_ENV === 'production') {
    //   return <div></div>;
    // }
    let debugStr = JSON.stringify(this.state.config, null, 2);
    return (
      <div className={styles.debuginfo}>
        <h5>Debug Info:</h5>
        <pre>
          {debugStr}
        </pre>
      </div>
    );
  }

  render() {
    const { error, config, configLoading, message, step } = this.state;
    if (error) {
      return (
        <div>
          <div className={styles.container}>
            <h2>Error {error.message}</h2>
          </div>
        </div>
      );
    }
    if (configLoading) {
      return (
        <div>
          <div className={styles.container}>
            <h2>{message}</h2>
          </div>
        </div>
      );
    }
    const { connector } = config;
    const debug = this.getDebug();
    return (
      <div>
        <div className={styles.container}>
          <h2>Installing: <small>{connector}</small></h2>
          <h3>Step: {step} / {MAX_STEPS} {message}</h3>
          {debug}
        </div>
      </div>
    );
  }
}

export default Installer;
