"use strict";

const React = require('React');
const SZWine = require('./SZWine.react');
const WineDataStore = require('./WineDataStore');

const {Component} = React;

require('./SZWine.css');

class SZWineContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wineList: []
    };
    const wineDataStore = new WineDataStore()
    wineDataStore.getSZWineList()
      .then(wineList => this.setState({wineList}));
  }

  render() {
    const wines = this.state.wineList.map(
      (wine, i) => <SZWine
        key={wine.id}
        image={'imgs/' + wine.id + '.png'}
        name={wine.name}
        info={wine.info}
        details={[wine.org, wine.size, wine.alc].join(' / ')}
      />
    );
    return (
      <div className="sz-list">
        {wines}
      </div>
    );
  }
}

module.exports = SZWineContainer;
