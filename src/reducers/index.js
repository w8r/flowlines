import {
  ADD_POINTS,
  ADD_POINT,
  REMOVE_POINTS,
  RESTART,
  REQUEST_DATA, RECEIVE_DATA,
  SELECT_POINT,
  EDIT_FLOW
} from '../actions';

export default createReducer(

  {},

  {

    [ ADD_POINT ] (state, action) {
      let { points } = state;
      return {
        ...state,
        points: points.concat(action.points)
      }
    },

    [ REMOVE_POINTS ] (state, action) {
      let { points } = state;
      return {
        ...state,
        points: points.slice(points, - action.count)
      };
    },


    [ RESTART ] (state, action) {
      return {
        ...state,
        points: []
      };
    },


    [ REQUEST_DATA ] (state, action) {
      return { ...state,
        isFetching: true,
      };
    },


    [ RECEIVE_DATA ] (state, action) {
      return { ...state,
        isFetching: false,
        data: action.data,
        extent: action.extent,
        lastUpdated: action.receivedAt
      };
    },


    [ SELECT_POINT ] (state, action) {
      let { points, currentPoints } = state;
      let { point } = action;

      let pos = currentPoints.indexOf(point);

      if (pos !== -1) {
        points[action.index].properties.selected = false;
        currentPoints.splice(pos, 1);
      } else if (currentPoints.length === 2) {
        points.forEach((pt) => {
          pt.properties.selected = false;
        });
        currentPoints = [];
        selectFeature(points, action.index, currentPoints, currentPoints);
      } else if (currentPoints.length < 2) {
        selectFeature(points, action.index, currentPoints, currentPoints);
      }

      return {
        ...state,
        points: points,
        currentPoints: currentPoints
      }
    },


    [ EDIT_FLOW ] (state, action) {
      let { flowLinesMap, flowLines } = state;
      let p1 = action.from.point;
      let p2 = action.to.point;

      const id1 = p1.properties.id;
      const id2 = p2.properties.id;

      if (!flowLinesMap
        .hasOwnProperty(id1 + '_' + id2)) {
        flowLinesMap[id1 + '_' + id2] =
        flowLinesMap[id2 + '_' + id1] = flowLines.features.length;

        flowLines = { 
          ...flowLines, 
          features: flowLines.features.concat([{
            type: 'Feature',
            properties: {
              [id1]: action.from.value,
              [id2]: action.to.value,
              p1: id1,
              p2: id2
            },
            geometry: {
              type: 'LineString',
              coordinates: [p1.geometry.coordinates, p2.geometry.coordinates]
            }
          }])
        };
      } else {
        let line = flowLines.features[flowLinesMap[id1 + '_' + id2]];

        line.properties[id1] = action.from.value;
        line.properties[id2] = action.to.value;

        flowLines = {
          ...flowLines,
          features: flowLines.features
        }
      }

      return {
        ...state,
        flowLines,
        flowLinesMap
      }
    }

  }
);


function selectFeature(features, index, exclude, store) {
  features.forEach((feature, ind) => {
    if (ind === index) {
      feature.properties.selected = true;
      store.push(feature);
    } else if (exclude.indexOf(feature) == -1) {
      feature.properties.selected = false;
    }
  });
  return store;
}


function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };
}
