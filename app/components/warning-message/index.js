import React, { PropTypes, Component } from 'react'
import FaWarning from 'react-icons/lib/fa/exclamation-triangle'
import './index.css'

class WarningMessage extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
  }

  render() {
    const { message } = this.props
    return (
      <div className="WarningMessage">
        <FaWarning size="1rem" color="orange" />
        <span className="WarningMessage--message">{message}</span>
      </div>
    )
  }
}

export default WarningMessage
