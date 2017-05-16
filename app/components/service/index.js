import React, { PropTypes, Component } from "react"
import { hashHistory } from "react-router"

import ErrorState from "zooid-error-state"
import CustomErrorState from "../error-state"
import Button from "zooid-button"

import "./index.css"

class Service extends Component {
  static propTypes = {
    otpKey: PropTypes.string.isRequired,
    errorMessage: PropTypes.string,
  }

  goToInstall = () => {
    const { otpKey } = this.props
    let serviceType = "user-service"
    if (process.platform === "win32") {
      serviceType = "user-login"
    }
    hashHistory.push({
      pathname: "/install",
      query: { otpKey, serviceType },
    })
  }

  goToAdvancedInstall = () => {
    const { otpKey } = this.props

    hashHistory.push({
      pathname: "/advanced",
      query: { otpKey },
    })
  }

  render() {
    const { error } = this.state || {}
    const { errorMessage } = this.props

    if (error) return <CustomErrorState message={error.message} />
    if (errorMessage) return <CustomErrorState message={errorMessage} />
    return (
      <div className="wrapper">
        <div className="card">
          <h1 className="title">Ready to install</h1>
          <p className="description">Your connector will be installed as the current user.</p>
          <Button kind="primary" block onClick={this.goToInstall}>Install</Button>
        </div>

        <Button kind="no-style" onClick={this.goToAdvancedInstall}>
          Advanced Install Options
        </Button>
      </div>
    )
  }
}

export default Service
