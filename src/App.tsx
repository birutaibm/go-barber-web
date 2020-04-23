import React from 'react';

import SignUp from './pages/SignUp';
import GlobalStyle from './styles/global';

const App: React.FunctionComponent = () => {
  return (
    <>
      <SignUp />
      <GlobalStyle />
    </>
  );
};

export default App;
