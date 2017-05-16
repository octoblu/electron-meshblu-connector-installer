import React, { PropTypes, Component } from "react"
import { hashHistory } from "react-router"

import ErrorState from "zooid-error-state"
import CustomErrorState from "../error-state"
import Button from "zooid-button"

import "./index.css"

class AdvancedService extends Component {
  static propTypes = {
    otpKey: PropTypes.string.isRequired,
    errorMessage: PropTypes.string,
  }

  installUserLogin = () => {
    const { otpKey } = this.props
    const serviceType = "user-login"
    hashHistory.push({
      pathname: "/install",
      query: { otpKey, serviceType },
    })
  }

  installUserService() {
    const { otpKey } = this.props
    const serviceType = "user-service"
    hashHistory.push({
      pathname: "/install",
      query: { otpKey, serviceType },
    })
  }

  installSystemService = () => {
    this.goToInstall("service")
  }

  userLoginChoice() {
    if (process.platform === "win32") {
      return (
        <Button kind="no-style" onClick={this.installUserLogin}>
          <div className="choice">
            <h1 className="title">User Login</h1>
            <p className="description">The connector will run when the user logs into the system.</p>
          </div>
        </Button>
      )
    }
  }

  render() {
    const { error } = this.state || {}
    const { errorMessage } = this.props

    if (error) return <CustomErrorState message={error.message} />
    if (errorMessage) return <CustomErrorState message={errorMessage} />
    return (
      <div className="wrapper">
        <div className="card">
          <h1 className="title">Select Install Type</h1>
          {this.userLoginChoice()}
          <Button kind="no-style" onClick={this.installUserService}>
            <div className="choice">
              <h1 className="title">User Service</h1>
              <p className="description">The connector will be installed as a service, using the current users credentials.</p>
            </div>
          </Button>
          <Button kind="no-style" onClick={this.installSystemService}>
            <div className="choice">
              <h1 className="title">System Service</h1>
              <p className="description">The connector will be installed as a system-level service, requires Administrator privileges.</p>
            </div>
          </Button>
        </div>
      </div>
    )
  }
}

export default AdvancedService
