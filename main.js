(function(){
    "use strict";

    var key = "1aCp4Ye2NoDgI2Qd_TwieXU9uvzU1tdZngsoRcg3Werg", 
        url = "https://spreadsheets.google.com/feeds/list/"+key+"/od6/public/values?alt=json";
    //url = "data.csv";
    
    d3.json(url, function(err, sheet){
    //d3.csv(url, function(err, csv){
        var data = sheet.feed.entry,
            list = data.map(function(d){
            //list = csv.map(function(d){
                var datum = {
                    
                    id  : d.gsx$id.$t,
                    cave: d.gsx$cave.$t,
                    name: d.gsx$name.$t,
                    size: d.gsx$size.$t,
                    alc : d.gsx$alc.$t,
                    org : d.gsx$origin.$t,
                    desc: d.gsx$desc.$t,
                    detail: d.gsx$details.$t,
                    prix: d.gsx$price.$t
                };
                return datum;
            });
        //console.log(list); 
        
        //TODO: load data to the page
        // cava
        var cavaList = list.filter(function(d) { return d.id.indexOf("cava") !== -1; });
        var cavaDesc = document.querySelector(".js-cava-desc");
        cavaDesc.textContent = cavaList[0].desc;
        d3.selectAll(".js-cl")
        .data(cavaList)
        .html(function(d) { return item(d); });
        
        // sz table wines
        var szList = list.filter(function(d) { return d.id.indexOf("sz") !== -1; });
        var szDesc = document.querySelector(".js-sz-desc");
        szDesc.textContent = szList[0].desc;
        d3.selectAll(".js-sz-list div").data(szList)
        .html(function(d) { return item(d); });

        // sangria 
        var sangriaInfo = document.querySelector(".js-sgr-info");
        var sangriaDesc = document.querySelector(".js-sgr-desc");
        var sgrData = filterData(list, "sgr")[0];
        sangriaInfo.innerHTML = itemInfo(sgrData);
        sangriaDesc.textContent = list[0].desc + list[0].detail;
              
        // cherry
        var prtData = filterData(list, "cherry")[0],
            prtKeys = ["name", "desc", "detail"];
        addTexts(prtKeys, prtData);
        document.querySelector(".js-prt-info").innerHTML = itemInfo(prtData);
        // mayador 
        var ciderData = filterData(list, "m-c"),
            bustoData = filterData(list, "m-b"),
            maymgData = filterData(list, "m-m");
        document.querySelector(".js-m-desc").textContent = ciderData[0].desc;  
        addItems("m-c", ciderData);
        addItems("m-b", bustoData);
        addItems("m-m", maymgData);

        // vs/swiss wines
        var vsData = list.filter(function(d) { return d.id.indexOf("vs-") !== -1; });
        d3.select(".js-vs")
        .selectAll("div").data(vsData).enter()
        .append("div")
        .attr("class", "col-3")
        .html(function(d, i) { 
          return addItem(d, i); 
       });
    });
    
    function filterData(data, str) {
        return data.filter(function(d) { return d.id.indexOf(str) !== -1; });
    }

    function addTexts(keys, data) {
      keys.forEach(function(d, i) {
        var k = keys[i];
        document.querySelector(".js-prt-" + k).textContent = data[k];      
      });
    }
    
    function itemInfo(d) {
      var alc = d.alc!=="" ? d.alc + " 酒精<br>" : " / ";
      return (
        "<span class='fs-i'>" + 
          d.org + " / " + alc +
          "售價 " + d.prix + " / " + d.size + 
        "</span>"
      ); 
    }

    function item(d) {
        return ( 
          "<h4 class='item-name'>" + d.name + "</h4>" + 
          itemInfo(d) +
          "<p class='item-detail'>" + d.detail + "</p>"
        );
    }
    function addItems(key, data) {
        var items = d3.select(".js-" + key)
        .selectAll("div")
        .data(data).enter()
        .append("div") .attr("class", "item");
        
        items
        .append("div") .attr("class", "item-txt")
        .html(function(d) { return item(d); });

        items
        .append("div") .attr("class", "item-img")
        .append("img")
        .attr("src", function(d, i) { return "imgs/" + key+(i+1) + ".png";} );
    }
    
    function addItem(d, i) {
        return (
            '<div class="col-3-top"><img src="imgs/vs/' + 
            d.id + '.jpg"></div>' +
            '<div class="col-3-bottom">' + item(d) + '</div>'
        );
    }
})();
