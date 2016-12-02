import React, { PropTypes, Component } from 'react'
import './index.css'

class ErrorState extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
  }

  render() {
    const { message } = this.props
    let friendlyMessage = message.replace(/^Error/i, '')
    return (
      <div className="ErrorState">
        <h1 className="ErrorState--icon"><i className="fa fa-warning"></i></h1>
        <h2 className="ErrorState--header"><strong>Error:</strong> {friendlyMessage}</h2>
      </div>
    )
  }
}

export default ErrorState
