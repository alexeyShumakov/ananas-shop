import React, { PropTypes } from 'react';
import _ from 'lodash';

export default class AddToCart extends React.Component {
  static propTypes = {
    addToCart:         PropTypes.func.isRequired,
    productId:         PropTypes.number.isRequired,
    selectedProductId: PropTypes.number.isRequired
  };

  isSelected() {
    return this.props.productId === this.props.selectedProductId;
  }

  constructor(props, context) {
    super(props, context);

    _.bindAll(this, 'handleChange');
  }
  handleChange(e) {
    this.props.addToCart(this.props.productId);
  }
  render() {
    var button;
    if (this.isSelected()) {
      button =<a
        href='/my_cart'
        className='button btn btn-success btn-lg'>
        Перейти в корзину
      </a>
    } else {
      button =<button
                onClick={this.handleChange}
                className='btn btn-primary btn-lg'>
                Добавить в корзину
              </button>
    }
    return (
      <div>
        {button}
      </div>
    );
  }
}
