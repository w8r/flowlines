import React, { PropTypes, Component } from 'react';


import './FlowLineForm.scss';


export default class FlowLineForm extends Component {

  static propTypes = {
    fromPoint: PropTypes.object,
    toPoint: PropTypes.object,
    onChange: PropTypes.func,
    getFlowValues: PropTypes.func,
    lines: PropTypes.object
  }


  static defaultProps = {
    onChange:  () => {}
  }


  constructor(props) {
    super(props);
    this.state = props.getFlowValues(props.fromPoint, props.toPoint);
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.fromPoint !== this.props.fromPoint ||
      nextProps.toPoint !== this.props.toPoint) {
      this.setState(nextProps.getFlowValues(nextProps.fromPoint, nextProps.toPoint));
    }
  }


  onChange() {
    this.props.onChange({
      from: {
        point: this.props.fromPoint,
        value: this.state.from
      },
      to: {
        point: this.props.toPoint,
        value: this.state.to
      }
    });
  }


  onFromChange = (evt) => {
    this.setState({
      from: parseInt(evt.target.value)
    });
    setTimeout(() => {
      this.onChange();
    }, 100);
  }


  onToChange = (evt) => {
    this.setState({
      to: parseInt(evt.target.value)
    });
    setTimeout(() => {
      this.onChange();
    }, 100);
  }


  _renderPoint(point) {
    if (point) {
      return (
        <div className="FlowLineForm__point">
          { point.properties.name }
        </div>
      );
    } else {
      return '';
    }
  }


  _renderForm () {
    if (this.props.fromPoint && this.props.toPoint) {
      return (
        <div className="FlowLineForm__values">
          <label>&#8593;
            <input type="number" ref="fromValue" min="0"
                   className="FlowLineForm__value"
                   value={ this.state.from } onChange={ this.onFromChange } /></label>
          <label>
            <input type="number" ref="toValue" min="0"
                   className="FlowLineForm__value"
                   value={ this.state.to } onChange={ this.onToChange } />
            &#8595;</label>
        </div>
      );
    } else {
      return '';
    }
  }


  render() {
    let className = 'FlowLineForm';
    if (!(this.props.fromPoint || this.props.toPoint)) {
      className += ' hidden';
    }
    return (
      <div className={ className }>
        { this._renderPoint(this.props.fromPoint) }
        { this._renderForm() }
        { this._renderPoint(this.props.toPoint) }
      </div>
    );
  }

}
