"use strict";

const React = require('React');
const SwissWine = require('./SwissWine.react');
const WineDataStore = require('./WineDataStore');

const {Component} = React;

class SwissWineContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wineList: []
    };
    const wineDataStore = new WineDataStore()
    wineDataStore.getSwissWineList()
      .then(wineList => this.setState({wineList}));
  }

  render() {
    const wines = this.state.wineList.map(
      (wine, i) => <SwissWine
        key={wine.id}
        image={'imgs/vs/' + wine.id + '.jpg'}
        name={wine.name}
        info={wine.info}
        details={[wine.org, wine.size, wine.alc].join(' / ')}
      />
    );
    return (
      <div>
        {wines}
      </div>
    );
  }
}

module.exports = SwissWineContainer;
