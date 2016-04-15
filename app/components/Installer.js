import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './Installer.css';
import InstallerInfo from '../services/installer-info'
import DependencyDownloader from '../services/dependency-downloader'

const MAX_STEPS=5

class Installer extends Component {
  state = {
    error: null,
    config: null,
    configLoading: true,
    step: 1,
    message: "Retrieving configuration"
  }

  componentDidMount() {
    new InstallerInfo().getInfo((error, config) => {
      this.setState({error, config, step: 2, message: "Downloading dependencies...", configLoading: false})
      new DependencyDownloader(config).downloadAll((error) => {
        this.setState({error, step: 3, message: "Installing dependencies"})
      })
    })
  }

  render() {
    const { error, config, configLoading, message, step } = this.state;
    if(error) {
      return (
        <div>
          <div className={styles.container}>
            <h2>Error {error.message}</h2>
          </div>
        </div>
      )
    }
    if(configLoading) {
      return (
        <div>
          <div className={styles.container}>
            <h2>Loading...</h2>
          </div>
        </div>
      )
    }
    const { appName, key, node, connector, connector_installer, dependency_manager, legacy } = config
    const legacyStr = legacy ? "true" : "false"
    return (
      <div>
        <div className={styles.container}>
          <h2>Installing...</h2>
          <h3>Step: {step} / {MAX_STEPS} {message}</h3>
          <h4>Key: {key}; Connector: {connector}; Legacy: {legacyStr};</h4>
          <h4>Node {node}; ConnInstaller: {connector_installer}; DepManager: {dependency_manager};</h4>
        </div>
      </div>
    );
  }
}

export default Installer;
