"use strict";

const React = require('React');

const {Component} = React;

require('./SwissWine.css');



class SwissWine extends Component {
  render() {
    return (
    <div className="col-3">
      <div className="col-3-top">
        <img src={this.props.image}/>
      </div>
      <div className="col-3-bottom">
        <h4 className="item-name">
          {this.props.name}
        </h4>
        <span className="fs-i">
          {this.props.details}
        </span>
        <p className="item-info">
          {this.props.info}
        </p>
      </div>
    </div>
    );
  }
}

module.exports = SwissWine;
