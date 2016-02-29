import React   from 'react';
import Layer   from './Layer';
import { geo } from 'd3';
import { flowLinePath } from '../util/svg-flowlines';

import './FlowLineLayer.scss';

export default class FlowLineLayer extends Layer {

  static defaultProps = {
    ...Layer.defaultProps,
    className: 'flowlines'
  }


  _renderFeatures() {
    let projection = this._map.getProjection();
    return this.state.data.features.map((feature, index) => {
      let className = this.props.className + '__feature';
      if (feature.properties.selected) {
        className += '_selected';
      }

      let { geometry, properties } = feature;

      let p1 = projection(geometry.coordinates[0]);
      let p2 = projection(geometry.coordinates[1]);
      const thickness1 = properties[properties.p1];
      const thickness2 = properties[properties.p2];

      let path1 = thickness1 ? flowLinePath(p1, p2, thickness1) : '';
      let path2 = thickness2 ? flowLinePath(p2, p1, thickness2) : '';

      return (
        <g key={ index } id={ 'f' + index } className={ className }>
          <path d={ path1 } 
                className={ className + '__flowline' } />
          <path d={ path2 } 
                className={ className + '__flowline' }/>
        </g>
      );
    });
  }


  render() {
    return (
      <g className={ this.props.className }>
      { this._renderFeatures() }
      </g>
    );
  }

}
