import 'babel-polyfill';

import React        from 'react';
import { render }   from 'react-dom';
import { Provider } from 'react-redux';

import App from './containers/App';

import configureStore from './store/store';
import initialState   from './store/initialState';

const store = configureStore(initialState);

let div = document.body.appendChild(document.createElement('div'));
// ugly ugly
let gmaps = document.head.appendChild(document.createElement('script'));
gmaps.src = '//maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&libraries=places';

render(
  <Provider store={ store }>
    <App />
  </Provider>,
  div
);


