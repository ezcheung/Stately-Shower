import ReactDOM from 'react-dom';

import React from 'react';
import App from './components/app.js';
import Game from './components/game.js';
import { Router, Route, Link } from 'react-router';

/**
* The routes
* NB: /plain disables style sheets
*/
ReactDOM.render((
  <Router>
  <Route path="/" component={App}>
  </Route>
  <Route path="/game" component={Game}>
  </Route>
  <Route path="/plain" component={App}>
  </Route>
  </Router>),
  document.getElementById('app'));