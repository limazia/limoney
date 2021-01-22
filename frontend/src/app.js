import React from 'react';

import Routes from './routes';
import Toastify from './components/Toastify';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Routes />
      <Toastify />
    </>
  );
}

export default App;