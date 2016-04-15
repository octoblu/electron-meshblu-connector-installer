import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';


export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container}>
          <h2>Meshblu Connector Installer</h2>
          <div className={styles.actions}>
            <Link to="/install" className={styles.installer}>Begin Install</Link>
          </div>
        </div>
      </div>
    );
  }
}
