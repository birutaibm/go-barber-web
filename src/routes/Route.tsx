import React from 'react';
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface Props extends ReactDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<Props> = ({isPrivate = false, component: Component, ...props}) => {
  const { user } = useAuth();

  return (
    <ReactDOMRoute
      {...props}
      render={({ location }) => (isPrivate === !!user) ? <Component /> : (
        <Redirect
          to={{
            pathname: isPrivate ? '/' : '/dashboard',
            state: { from: location },
          }}
        />
      )}
    />
  );
};

export default Route;
