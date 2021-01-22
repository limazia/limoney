import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import dotenv from 'dotenv';

dotenv.config();

if (process.env.NODE_ENV === "production") {
    console.log = function () {};
}

ReactDOM.render(<App />, document.getElementById("app"));