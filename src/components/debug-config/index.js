import React, { PropTypes } from 'react';
import './index.css';

const DebugConfig = ({ config }) => {
  const configString = JSON.stringify(config, null, 2);
  return <div className="DebugConfig">
    <h5>Info:</h5>
    <pre>
      {configString}
    </pre>
  </div>
};

DebugConfig.propTypes = {
  config: PropTypes.object.isRequired
}

export default DebugConfig
