/**
 * Created by Raaw on 5/9/2017.
 */
import React from 'react';
import 'babel-polyfill'; // generators
import { render as renderReact } from 'react-dom';

import './index.scss';

const state = JSON.parse(localStorage.getItem('state'));


const App = require('./components/app');

const render = (Component) => {
  renderReact(<Component />, document.getElementById('root'));
};


render(App);
if (module.hot) {
  module.hot.accept('./components/app', () => {
    const newApp = require('./components/app');
    console.log(newApp);
    render(newApp);
  });
}

