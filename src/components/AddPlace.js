import React, { Component, PropTypes } from 'react';
import Location from 'react-place';
import Geosuggest from 'react-geosuggest';
import uuid4    from 'uuid-v4';


import './AddPlace.scss';

export default class AddPlace extends Component {

  static propTypes = {
    onLocationSet: PropTypes.func,
    country: PropTypes.string
  }


  static defaultProps = {
  }


  onLocationSet_ = (location) => {
    this.props.onLocationSet({
      type: 'Feature',
      properties: {
        id: uuid4(),
        name: location.description
      },
      geometry: {
        type: 'Point',
        coordinates: [location.coords.lng, location.coords.lat]
      }
    });
  }


  onLocationSet = (location) => {
    let { types, address_components } = location.gmaps;
    let admLevel1 = address_components.filter((level) => {
      return level.types[0] === 'administrative_area_level_1';
    });

    this.props.onLocationSet({
      type: 'Feature',
      properties: {
        id: uuid4(),
        name: location.label,
        code: admLevel1 ? admLevel1.short_name : ''
      },
      geometry: {
        type: 'Point',
        coordinates: [location.location.lng, location.location.lat]
      }
    });
  }


  render() {
    /* <Geosuggest placeholder="Add place"
                      initialValue=""
                      country={ this.props.country }
                      onSuggestSelect={ this.onLocationSet }
           /> */
    if (window.google && window.google.maps) {
      return (
        <div className='AddPlace'>
          <Location className='location'
                    placeholder='Add place'
                    country={ this.props.country }
                    noMatching='Sorry, I can not find {{value}}.'
                    onLocationSet={ this.onLocationSet_ }
          />
        </div>
      );
    } else {
      return (<div />);
    }
  }
}
