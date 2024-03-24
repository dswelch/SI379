import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import DimensionGuesser from './DimensionGuesser';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DimensionGuesser />
  </React.StrictMode>
);