"use strict";

const React = require('React');

const {Component} = React;

require('./SwissWine.css');
require('./SZWine.css');



class SZWine extends Component {
  render() {
    const style = {
      backgroundImage: 'url(' + this.props.image + ')',
    }

    return (
      <div style={style}
        className="bg-sz"
        >
        <h4 className="item-name">{this.props.name}</h4>
        <span className="fs-i">{this.props.details}</span>
        <p className="item-detail">{this.props.info}</p>
      </div>
    );
  }
}

module.exports = SZWine;
