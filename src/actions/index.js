import { range, geo } from 'd3'
import topojson from 'topojson';
import fetch    from 'isomorphic-fetch';


export const ADD_POINT  = 'ADD_POINT';
export const SELECT_POINT = 'SELECT_POINT';

export const CREATE_POINT     = 'CREATE_POINT';
export const CREATE_FLOW      = 'CREATE_FLOW';
export const EDIT_FLOW        = 'EDIT_FLOW';


export const REQUEST_DATA = 'REQUEST_DATA';
function requestData(countryKey) {
  return {
    type: REQUEST_DATA,
    key: countryKey
  }
}


export const RECEIVE_DATA = 'RECEIVE_DATA';
function receiveData(countryKey, data) {
  if (countryKey) {
    data = topojson.feature(data, data.objects[countryKey]);
  } else {
    data = Object.keys(data.objects).reduce((result, key) => {
      result.features = result.features.concat(
      topojson.feature(data, data.objects[key]).features);
      return result;
    }, {
      type : 'FeatureCollection',
      features: []
    });
  }

  return {
    type: RECEIVE_DATA,
    key: countryKey,
    data: data,
    extent: geo.bounds(data),
    receivedAt: Date.now()
  }
}


function fetchData(key) {
  return (dispatch) => {
    dispatch(requestData(key))
    return fetch(`../data/${key}.topo.json`)
      .then(response => response.json())
      .then(json => dispatch(receiveData(key, json)));
  };
}


function shouldFetchData(state, key) {
  const data = state.data;
  if (data.features.length === 0) {
    return true;
  }

  if (data.isFetching) {
    return false;
  }

  return false;
}


export function loadData(key) {
  return (dispatch, getState) => {
    if (shouldFetchData(getState(), key)) {
      return dispatch(fetchData(key))
    }
  }
}


export function addPoint(location) {
  return {
    type: ADD_POINT,
    points: [location]
  }
}


export function selectPoint(feature, index, path) {
  return {
    type: SELECT_POINT,
    point: feature,
    index,
    path
  }
}


export function updateFlow(data) {
  return {
    type: EDIT_FLOW,
    to: data.to,
    from: data.from
  };
}
