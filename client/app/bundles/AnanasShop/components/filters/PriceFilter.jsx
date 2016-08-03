import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Rcslider from 'rc-slider';
import Immutable from 'immutable';
import { FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
import _ from 'lodash';

export default class PriceFilter extends React.Component {
  static propTypes = {
    setFilter: PropTypes.func.isRequired,
    updateFilter: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
    filter: PropTypes.instanceOf(Immutable.Map)
  }

  constructor(props, context) {
    super(props, context);
    _.bindAll(this, 'blurInput', 'setFilter', 'updateFilter', 'fetchData', 'updateMinForm', 'updateMaxForm');
  }

  setFilter(value) {
    let { filter, setFilter } = this.props;
    let min = filter.get('min');
    let max = filter.get('max');
    let params = Immutable.List(value);
    if (params.equals(Immutable.List([min, max])))  {
      params = Immutable.List();
    }
    let newFilter = filter.set('minB', value[0]).set('maxB', value[1])
    .set('minFormB', value[0]).set('maxFormB', value[1]).set('params', params);
    setFilter(newFilter);
  }

  fetchData() {
    this.props.fetchData();
  }

  updateFilter() {
    let { filter, setFilter, updateFilter } = this.props;
    let { min, max, minB, maxB, minFormB, maxFormB } = filter.toJS();
    let minForm = this.getValidValue(minFormB, minB, min, maxB);
    let maxForm = this.getValidValue(maxFormB, maxB, minB, max);

    let params = Immutable.List([minForm, maxForm]);
    let newFilter = filter.set('minB', minForm).set('maxB', maxForm).set('params', params);
    updateFilter(newFilter);
  }

  getValidValue(value, defaultValue, min, max) {
    let temp = value || defaultValue;
    temp = temp.toString().match(/\d+/);
    if (_.isEmpty(temp)) { temp = defaultValue }
    temp = parseInt(temp);
    return _.clamp(temp, min, max)
  }

  blurInput(e) {
    if(e.key === 'Enter') {
      ReactDOM.findDOMNode(this.refs.minInput).blur();
      ReactDOM.findDOMNode(this.refs.maxInput).blur();
    }
  }

  updateMinForm(e) {
    let { filter, setFilter } = this.props;
    let newFilter = filter.set('minFormB', e.target.value)
    setFilter(newFilter);
  }

  updateMaxForm(e) {
    let { filter, setFilter } = this.props;
    let newFilter = filter.set('maxFormB', e.target.value)
    setFilter(newFilter);
  }

  render() {
    const { filter } = this.props;
    let { min, max, minB, maxB, minFormB, maxFormB } = filter.toJS();
    let value = [minB, maxB];
    return (
      <div>
        <h4>Цена</h4>
        <div className='price-filter'>
          <FormGroup bsSize='sm'>
            <ControlLabel>от</ControlLabel>
              <FormControl
                ref='minInput'
                className='form-control price-filter__input'
                value={minFormB}
                onChange={this.updateMinForm}
                onBlur={this.updateFilter}
                onKeyUp={this.blurInput}
                />
          </FormGroup>

          <FormGroup bsSize='sm'>
            <ControlLabel>до</ControlLabel>
            <FormControl
              ref='maxInput'
              className='form-control price-filter__input'
              value={maxFormB}
              onChange={this.updateMaxForm}
              onBlur={this.updateFilter}
              onKeyUp={this.blurInput}
              />
          </FormGroup>
        </div>

        <Rcslider
           range
           allowCross={false}
           min={min}
           max={max}
           value={value}
           tipFormatter={null}
           onChange={this.setFilter}
           onAfterChange={this.fetchData}
            />
            <hr/>
      </div>
    );
  }
}
