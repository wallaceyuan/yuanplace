import React, {Component} from 'react';
import './style.scss';
export default class Layout extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
