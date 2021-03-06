import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import { isAuthenticated } from '../services/auth';

const Guest = ({ component: Component, ...rest }) => (
  <Route {...rest}
    render={(props) => !isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/dashboard", state: { from: props.location } }} />
      )
    }
  />
);

Guest.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  location: PropTypes.shape(),
};

  //.isRequired,

Guest.defaultProps = {
  location: null,
};

export default Guest;