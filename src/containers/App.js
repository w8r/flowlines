import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';

import uuid4        from 'uuid-v4';
import AddPlace     from '../components/AddPlace';
import FlowLineForm from '../components/FlowLineForm';

import Layer from '../components/Layer';
import FlowLineLayer from '../components/FlowLineLayer';
import Map   from '../components/Map';


import './App.scss';


class App extends Component {

  componentDidMount() {
    this.props.loadData('ch');

    this._googleMapsTimer = setInterval(() => {
      if (window.google && window.google.maps) {
        this.forceUpdate();
        clearInterval(this._googleMapsTimer);
        delete this._googleMapsTimer;
      }
    }, 300);
  }


  onMapClick  = (feature, index, path, coords) => {
    this.props.addPoint({
      type: 'Feature',
      properties: {
        ...feature.properties,
        id: uuid4(),
        name: feature.properties.GEMNAME
      },
      geometry: {
        type: 'Point',
        coordinates: coords
      }
    });
  }


  getFlowValues = (p1, p2) => {
    let { appState } = this.props;
    let from = 0,  to = 0;

    const lines = appState.flowLines;
    const linesMap = appState.flowLinesMap;

    if (p1 && p2) {
      const id1 = p1.properties.id;
      const id2 = p2.properties.id;
      let lineIndex = linesMap[id1 + '_' + id2] || linesMap[id2 + '_' + id1];

      if (lineIndex !== undefined) {
        let line = lines.features[lineIndex];
        from = line.properties[id1];
        to = line.properties[id2];
      }
    }

    return {
      from: from,
      to: to
    }
  }


  getSize() {
    return {
      width: window.innerWidth - 16,
      height: window.innerHeight
    }
  }


  onFeatureClick() {
    console.log(arguments);
  }


  render() {
    let { appState } = this.props;
    let { loadData, addPoint, selectPoint } = this.props;
    let { updateFlow } = this.props;
    let { width, height } = this.getSize();

    return (
      <div className="App">

        <Map width={ width } height={ height } extent={ appState.extent }>
          <Layer data={ appState.data } className='cantones' onFeatureClick={ this.onMapClick } />
          <FlowLineLayer data={ appState.flowLines } />
          <Layer data={ { features: appState.points } } className='points'
                 loadingText='' onFeatureClick={ selectPoint } />
        </Map>

        <FlowLineForm fromPoint={ appState.currentPoints[0] }
                      toPoint={ appState.currentPoints[1] }
                      onChange={ updateFlow }
                      getFlowValues={ this.getFlowValues }
                      lines={ appState.flowLines } />
        <AddPlace country='CH' onLocationSet={ addPoint } />

      </div>
    )
  }

}


function mapStateToProps(state) {
  return {
    appState: state
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
