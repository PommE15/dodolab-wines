"use strict";

class WineDataStore {
  constructor() {
    this.wineList = null;
  }

  getWineList() {
    const key = "1aCp4Ye2NoDgI2Qd_TwieXU9uvzU1tdZngsoRcg3Werg";
    const url = "https://spreadsheets.google.com/feeds/list/"+key+"/od6/public/values?alt=json";
    if (this.wineList) {
      return this.wineList;
    }
    return fetch(url)
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
      .then(wineList => this._wineList = wineList);
  }

  getSwissWineList() {
    return this.getWineList()
      .then(wineList => wineList.filter(
        w => w.id.indexOf("vs-") !== -1
      ));
  }

}

module.exports = WineDataStore;
