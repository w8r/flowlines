import React, { PropTypes, Component, Children } from 'react';
import { geo } from 'd3';

import './Map.scss';

export default class Map extends Component {

  static propTypes = {
    projection: PropTypes.func.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    extent: PropTypes.array
  }


  static defaultProps = {
    projection: geo.mercator(),
    width: 960,
    height: 500,
    scale: 1
  }


  constructor(props) {
    super(props);
    this.state = props;
  }


  componentWillReceiveProps(nextProps) {
    this.setState({
      extent: nextProps.extent
    });
  }


  getProjection() {
    let scale = 1, offset;
    const {width, height, extent} = this.state;
    const center = [
      (extent[0][0] + extent[1][0]) / 2,
      (extent[0][1] + extent[1][1]) / 2
    ];

    let projection = geo.mercator()
      .scale(scale)
      .translate([0, 0]);

    // Compute the bounds of a feature of interest, 
    // then derive scale & translate.
    const bounds = [projection(extent[0]), projection(extent[1])];

    scale = scale / Math.max(
      Math.abs(bounds[1][0] - bounds[0][0]) / width, 
      Math.abs(bounds[1][1] - bounds[0][1]) / height
    );
    offset = [
      (width - scale * (bounds[1][0] + bounds[0][0])) / 2, 
      (height - scale * (bounds[1][1] + bounds[0][1])) / 2
    ];

    return projection
        .scale(scale)
        .translate(offset);
  }


  render () {
    const children = Children.map(this.props.children, child => {
      return React.cloneElement(child, { map: this });
    });
    return (
      <svg className="map" preserveAspectRatio="xMidYMid" 
           width={ this.props.width }
           height={ this.props.height }>
        { children }
      </svg>
    );
  }
}
