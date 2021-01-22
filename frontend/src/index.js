import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import dotenv from 'dotenv';

dotenv.config();

ReactDOM.render(<App />, document.getElementById("app"));