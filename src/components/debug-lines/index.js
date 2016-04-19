import React, { PropTypes } from 'react';
import _ from 'lodash'
import './index.css';

const DebugLines = ({ lines }) => {
  const theLines = _.map(lines, (line, key) => {
    return <li key={key}>{line}</li>;
  })
  return <div className="DebugLines">
    <h3>Console:</h3>
    <div className="DebugLines--console">
      <ul>
        {theLines}
      </ul>
    </div>
  </div>
};

DebugLines.propTypes = {
  lines: PropTypes.array.isRequired
}

export default DebugLines
