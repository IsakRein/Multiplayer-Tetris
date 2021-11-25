import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import settings from "./settings.json"

ReactDOM.render(
  <App
    serverIp={settings.serverIp}
    serverPort={settings.serverPort}
  />,
  document.getElementById('root')
);

