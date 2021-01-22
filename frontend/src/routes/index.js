import React from 'react';
import { BrowserRouter, Switch, Redirect } from 'react-router-dom';

import Guest from './guest';
import PrivateRoute from './private';

import Register from '../pages/Register';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import History from '../pages/History';
import Settings from '../pages/Settings';
import Transfer from '../pages/Transfer';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Guest path="/" exact component={Login} />
      <Guest path="/register" component={Register} />
      <PrivateRoute path="/dashboard" component={Dashboard} />
      <PrivateRoute path="/history" component={History} />
      <PrivateRoute path="/settings" component={Settings} />
      <PrivateRoute path="/:id/transfer" component={Transfer} />
      <Redirect from="*" to="/" />
    </Switch>
  </BrowserRouter>
);

export default Routes;