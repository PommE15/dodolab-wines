"use strict";

const React = require('React');
const SwissWine = require('./SwissWine.react');

const {Component} = React;

class SwissWineContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wineList: []
    };
  }

  componentWillMount() {
    const key = "1aCp4Ye2NoDgI2Qd_TwieXU9uvzU1tdZngsoRcg3Werg";
    const url = "https://spreadsheets.google.com/feeds/list/"+key+"/od6/public/values?alt=json";
    fetch(url)
      .then(res => res.json())
      .then(json => json.feed.entry.map(d => ({
          id  : d.gsx$id.$t,
          cave: d.gsx$cave.$t,
          name: d.gsx$name.$t,
          size: d.gsx$size.$t,
          alc : d.gsx$alc.$t,
          org : d.gsx$origin.$t,
          desc: d.gsx$desc.$t,
          info: d.gsx$details.$t,
          price: d.gsx$price.$t
        }))
      )
      .then(data => data.filter(d => d.id.indexOf("vs-") !== -1))
      .then(data => this.setState({wineList: data}));
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
    return <div>
      {wines}
    </div>;
  }
}

module.exports = SwissWineContainer;
