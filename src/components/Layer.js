import React, { Component, PropTypes } from 'react';
import { geo } from 'd3';

export default class Layer extends Component {

  static propTypes = {
    data: PropTypes.object,
    className: PropTypes.string,
    onFeatureClick: PropTypes.func
  }


  static defaultProps = {
    className: 'layer',
    loadingText: 'Loading...',
    onFeatureClick: () => {}
  }


  constructor(props) {
    super(props);
    this.state = {
      data: props.data
    };
    this._map = props.map;
    this.path = geo.path().projection(this._map.getProjection());
  }


  componentWillReceiveProps(nextProps) {
    this.path = geo.path()
      .projection(this._map.getProjection())
      .pointRadius((f) => {
        return 5;
      });
    this.setState({ data: nextProps.data });
  }


  onClick = (evt) => {
    // TODO: container position
    var coords = this._map.getProjection().invert([evt.clientX, evt.clientY]);
    let featureId = this._evtToFeatureId(evt);
    if (featureId !== null) {
      evt.stopPropagation();
      console.time('pt');
      this.props.onFeatureClick(this.state.data.features[featureId], featureId, 
        evt.target, coords);
    }
  }


  _evtToFeatureId(evt) {
    if (/feature/.test(evt.target.className.baseVal)) {
      return parseInt(evt.target.id.substring(1));
    } else {
      return null;
    }
  }


  _renderFeatures() {
    if (this.state.data && this.state.data.features.length !== 0) {
      return this.state.data.features.map((feature, index) => {
        let className = this.props.className + '__feature';
        if (feature.properties.selected) {
          className += '_selected';
        }

        return (
          <path d={ this.path(feature) } className={ className } 
                key={ index } id={  'f' + index } />
        );
      });
    } else {
      return (
        <text x={ this._map.props.width / 2 }
              y={ this._map.props.height / 2 }>{ this.props.loadingText }</text>
      );
    }
  }


  render() {
    console.timeEnd('pt');
    return (
      <g className={ this.props.className }  onClick={ this.onClick }>
        { this._renderFeatures() }
      </g>
    );
  }

}
