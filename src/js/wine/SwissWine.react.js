"use strict";

const React = require('React');

const {Component} = React;

require('./SwissWine.css');



class SwissWine extends Component {
  render() {
    return (
    <div className="col-3">
      <div className="col-3-top">
        <img src="imgs/vs/vs-6.jpg"/>
      </div>
      <div className="col-3-bottom">
        <h4 className="item-name">
          2013 Rouge de Venthône / 婚禮黑皮諾
        </h4>
        <span className="fs-i">
          瑞士 Valais A.O.C / 750ml / 酒精 14.4%
        </span>
        <p className="item-info">
          嚴選 100% Pinot Noir 足夠成熟的葡萄，經過至少一年法國橡木桶熟成。有豐富野草莓芳香，酒體濃厚。適合單飲或多樣多變的台菜。適飲 17℃ 。
        </p>
      </div>
    </div>
    );
  }
}

module.exports = SwissWine;
