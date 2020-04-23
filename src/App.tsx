import React from 'react';

import SignIn from './pages/SignIn';
import GlobalStyle from './styles/global';
import ContextProvider from './hooks'

const App: React.FunctionComponent = () => {
  return (
    <ContextProvider>
      <SignIn />
      <GlobalStyle />
    </ContextProvider>
  );
};

export default App;
