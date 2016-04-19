import React, { PropTypes } from 'react';
import _ from 'lodash'
import './index.css';

const DebugLines = ({ lines }) => {
  const theLines = _.map(lines, line => {
    return <li>{line}</li>;
  })
  return <div className="DebugLines">
    <h5>Console:</h5>
    <ul>
      {theLines}
    </ul>
  </div>
};

DebugLines.propTypes = {
  lines: PropTypes.array.isRequired
}

export default DebugLines
