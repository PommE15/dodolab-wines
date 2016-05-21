var SwissWine = require('./wine/SwissWine.react');
var React = require('react');
var ReactDOM = require('react-dom');

ReactDOM.render(
  <div>
  <h1>Hello, world!</h1>
  <SwissWine />
  </div>,
  document.getElementById('main')
);
