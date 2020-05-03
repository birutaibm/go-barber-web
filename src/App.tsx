import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './routes';
import GlobalStyle from './styles/global';
import ContextProvider from './hooks'

const App: React.FunctionComponent = () => {
  return (
    <ContextProvider>
      <Router>
        <Routes />
      </Router>
      <GlobalStyle />
    </ContextProvider>
  );
};

export default App;
