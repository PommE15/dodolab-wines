var SwissWine = require('./wine/SwissWine.react');
var SwissWineContainer = require('./wine/SwissWineContainer.react');
var SZWineContainer = require('./wine/SZWineContainer.react');
var React = require('react');
var ReactDOM = require('react-dom');

ReactDOM.render(
  <div>
    <h1>Hello, world!</h1>
    <SwissWine
      image="imgs/vs/vs-6.jpg"
      name="2013 Rouge de Venthône / 婚禮黑皮諾"
      details="瑞士 Valais A.O.C / 750ml / 酒精 14.4%"
      info="嚴選 100% Pinot Noir 足夠成熟的葡萄，經過至少一年法國橡木桶熟成。有豐富野草莓芳香，酒體濃厚。適合單飲或多樣多變的台菜。適飲 17℃ 。"
    />

    <p> Container </p>
    <SwissWineContainer />
    <SZWineContainer />
  </div>,
  document.getElementById('main')
);
