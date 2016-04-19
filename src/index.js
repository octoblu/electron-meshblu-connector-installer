import React from 'react';
import { render } from 'react-dom';
import { Router, hashHistory } from 'react-router';
import routes from './config/routes';

import 'zooid-ui/dist/style.css';
import './app.global.css';

render(
  <Router history={hashHistory} routes={routes} />,
  document.getElementById('app')
);
