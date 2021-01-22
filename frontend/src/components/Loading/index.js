import React from 'react';

import Header from '../Header';

import './styles.css';

function Loading() {
  document.body.style.overflowY = "hidden";

  return (
    <>
      <Header />
      <div className="container h-100">
        <div className="row h-100 justify-content-center align-items-center loading">
          <div
            className="spinner-border"
            role="status"
            style={{
              width: "5rem",
              height: "5rem",
              marginBottom: "100px",
            }}
          ></div>
        </div>
      </div>
    </>
  );
}

export default Loading;
