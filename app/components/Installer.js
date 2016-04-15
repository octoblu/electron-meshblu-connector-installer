import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './Installer.css';
import InstallerInfo from '../services/installer-info'

const MAX_STEPS=5

class Installer extends Component {
  state = {
    error: null,
    config: null,
    configLoading: true,
    step: 1,
    message: "Loading..."
  }

  componentDidMount() {
    this.installerInfo = new InstallerInfo()
    this.installerInfo.getInfo((error, config) => {
      this.setState({error, config, configLoading: false})
    })
  }

  render() {
    const { error, config, configLoading, message, step } = this.state;
    if(error) {
      return (
        <div>
          <div className={styles.container}>
            <h2>Error {error.toString()}</h2>
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
    const { appName, key } = config
    
    return (
      <div>
        <div className={styles.container}>
          <h2>Installing...</h2>
          <h4>Key: {key}</h4>
          <h4>Step: {step} / {MAX_STEPS} {message}</h4>
        </div>
      </div>
    );
  }
}

export default Installer;
