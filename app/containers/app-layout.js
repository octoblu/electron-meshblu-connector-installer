import _ from 'lodash'
import React, { Component } from 'react'
import { Link } from 'react-router'

import {
  AppBar,
  AppBarPrimary,
  AppBarSecondary,
} from 'zooid-ui'

import 'zooid-ui/dist/style.css'
import '../styles/the-app.css'

class AppLayout extends Component {
  render() {
    const otpKey = _.get(this.props, 'otpKey', _.get(this.props, 'location.query.otpKey'))
    return (
      <div>
        <AppBar>
          <AppBarPrimary>
            <nav className="OctobluAppBar-nav OctobluAppBar-nav--primary" role="navigation">
              <Link className="OctobluAppBar-link" to="/">Connector Installer</Link>
            </nav>
          </AppBarPrimary>
          <AppBarSecondary>
            <nav role="navigation">
              <Link className="OctobluAppBar-link" to={{ pathname: '#/input-key', query: { otpKey } }}>
                {otpKey} <i className="fa fa-pencil" />
              </Link>
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
