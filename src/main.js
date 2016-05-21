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
                    info: d.gsx$details.$t,
                    temp: d.gsx$temp.$t,
                    year: d.gsx$year.$t
                    /*
                    id  : d.id,//d.gsx$id.$t,
                    cave: d.cave,//d.gsx$cave.$t,
                    name: d.name,//d.gsx$name.$t,
                    size: d.size,//d.gsx$size.$t,
                    alc : d.alc,//d.gsx$alc.$t,
                    org : d.origin,//d.gsx$origin.$t,
                    desc: d.desc,//d.gsx$desc.$t,
                    info: d.details,//d.gsx$details.$t,
                    temp: d.temp,//d.gsx$temp.$t,
                    year: d.year//d.gsx$year.$t
                    */
                };
                return datum;
            });
        //console.log(list); 
        
        //TODO: load data to the page
        // cava
        var cavaList = list.filter(function(d) { return d.id.indexOf("cava") !== -1; });
        var cavaDesc = document.querySelector(".js-cava-desc");
        cavaDesc.textContent = cavaList[0].desc;
        d3.selectAll(".js-cl").data(cavaList)
        .html(function(d) { return d.name + "<br>" + d.org + " / " + d.size; });
        
        // sz table wines
        var szList = list.filter(function(d) { return d.id.indexOf("sz") !== -1; });
        var szDesc = document.querySelector(".js-sz-desc");
        szDesc.textContent = szList[0].desc;
        d3.selectAll(".js-sz-list div").data(szList)
        .html(function(d) { return item(d); });

        // sangria 
        var sangriaDesc = document.querySelector(".js-sgr-desc");
        sangriaDesc.textContent = list[0].desc + list[0].info;
              
        // cherry
        var prtData = list.filter(function(d) { return d.id.indexOf("cherry") !== -1; }),
            prtKeys = ["name", "desc", "info"];
        addTexts(prtKeys, prtData[0]);
        
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

    function item(d) {
        return ( 
            "<h4 class='item-name'>" + d.name + "</h4>" + 
            "<span class='fs-i'>" + d.org + " / " + d.size + " / 酒精 " + d.alc +
            "</span><p class='item-info'>" + d.info + "</p>"
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
