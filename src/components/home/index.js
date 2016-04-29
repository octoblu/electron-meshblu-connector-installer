import React, { Component } from 'react';
import { Link } from 'react-router';
import './index.css';

export default class Home extends Component {
  render() {
    return (
      <div>
        <div className="Home">
          <h2>Meshblu Connector Installer</h2>
          <div className="Home--actions">
            <Link to="/install" className="Button Button--hollow-approve">Begin Install</Link>
          </div>
        </div>
      </div>
    );
  }
}
