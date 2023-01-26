import React from 'react';
import "./LoadingSpinner.css"
import logo from "./logo.png"

const LoadingSpinner = () => (
  // <div className="loading-spinner">
  //   <div className="loading-spinner-inner">
  //     <div className="loading-spinner-circle"></div>
  //     <div className="loading-spinner-circle"></div>
  //     <div className="loading-spinner-circle"></div>
  //   </div>
  // </div>

//   <div class="sk-folding-cube">
//   <div class="sk-cube1 sk-cube"></div>
//   <div class="sk-cube2 sk-cube"></div>
//   <div class="sk-cube4 sk-cube"></div>
//   <div class="sk-cube3 sk-cube"></div>
// </div>

<div className="spinner">
  <img src={logo} alt="Loading..." />
</div>

);

export default LoadingSpinner;