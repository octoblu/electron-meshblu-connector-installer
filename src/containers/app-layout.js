import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Toast from 'zooid-ui-toast'

import {
  AppBar,
  AppBarPrimary,
  AppBarSecondary,
} from 'zooid-ui'

import 'zooid-ui/dist/style.css'
import '../styles/the-app.css'

class AppLayout extends Component {
  render() {
    let otpKey
    if (this.props && this.props.location && this.props.location.query) {
      otpKey = this.props.otpKey || this.props.location.query.otpKey
    }
    return (
      <div>
        <AppBar>
          <AppBarPrimary>
            <nav className="OctobluAppBar-nav OctobluAppBar-nav--primary" role="navigation">
              <a className="OctobluAppBar-link" href="/">Connector Installer</a>
            </nav>
          </AppBarPrimary>
          <AppBarSecondary>
            <nav role="navigation">
              <a className="OctobluAppBar-link" href="/">{otpKey}</a>
            </nav>
          </AppBarSecondary>
        </AppBar>
        <div className="Container">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default AppLayout
