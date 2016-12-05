import React, { PropTypes, Component } from 'react'
import FaWarning from 'react-icons/lib/fa/exclamation-triangle'
import './index.css'

class ErrorState extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
  }

  render() {
    const { message } = this.props
    const friendlyMessage = message.replace(/^Error/i, '')
    return (
      <div className="ErrorState">
        <h1 className="ErrorState--icon"><FaWarning size="5rem" color="orange" /></h1>
        <h2 className="ErrorState--header"><strong>Error:</strong> <span className="ErrorState--message">{friendlyMessage}</span></h2>
      </div>
    )
  }
}

export default ErrorState
