import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from '../containers/app';
import Home from '../containers/home';
import Installer from '../containers/installer';
import NoMatch from '../components/no-match';

export default (
  <Route>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="install" component={Installer} />
    </Route>
    <Route path="*" status={404} component={NoMatch} />
  </Route>
);
