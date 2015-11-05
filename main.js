(function(){
    "use strict";

    var key = "1aCp4Ye2NoDgI2Qd_TwieXU9uvzU1tdZngsoRcg3Werg", 
        url = "https://spreadsheets.google.com/feeds/list/"+key+"/od6/public/values?alt=json";
    
    d3.json(url, function(err, sheet){
        var data = sheet.feed.entry,
            list = data.map(function(d){
                var datum = {
                    id: d.gsx$id.$t,
                    cave: d.gsx$cave.$t,
                    name: d.gsx$name.$t,
                    size: d.gsx$size.$t,
                    alc : d.gsx$alc.$t,
                    org : d.gsx$origin.$t,
                    desc: d.gsx$desc.$t,
                    list: d.gsx$details.$t,
                    temp: d.gsx$temp.$t,
                    year: d.gsx$year.$t
                };
                return datum;
            });

        console.log(list); 
        
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
        .html(function(d) { return d.name + "<br>" + d.org + " / " + d.size + " / alc. " + d.alc + "<br>" + d.list; });
        
        // sangria 
        var sangriaDesc = document.querySelector(".js-sgr-desc");
        sangriaDesc.textContent = list[0].desc + list[0].list;
              
        // cherry
        var prtData = list.filter(function(d) { return d.id.indexOf("cherry") !== -1; }),
            prtKeys = ["name", "desc", "list"],
            prtEls  = [".js-prt-name", ".js-prt-desc", ".js-prt-text"];
        addText(prtEls, prtKeys, prtData[0]);
        
        // mayador 
        var mData = list.filter(function(d) { return d.id.indexOf("m-") !== -1; });
        document.querySelector(".js-m-desc").textContent = mData[0].desc;  
        
        // vs/swiss wines
        var vsData = list.filter(function(d) { return d.id.indexOf("vs-") !== -1; });
        d3.selectAll(".js-vs").data(vsData).html(function(d) { 
          return '<span class="name">' + d.name + "</span><br>" + d.org + "<br>" + 
             d.size + " / " + "alc. " + d.alc + "% / " + d.desc + "<br>" + 
             "適飲：" + d.temp + " / " + d.year + "<br>" +
             "...";//d.list; 
        });
    });

    function addText(els, keys, data) {
      els.forEach(function(d, i) {
        document.querySelector(d).textContent = data[keys[i]];      
      });
    }

})();
