(function(){
    "use strict";

    var key = "1aCp4Ye2NoDgI2Qd_TwieXU9uvzU1tdZngsoRcg3Werg", 
        url = "https://spreadsheets.google.com/feeds/list/"+key+"/od6/public/values?alt=json";
    
    d3.json(url, function(err, sheet){
        var data = sheet.feed.entry,
            list = data.map(function(d){
                var datum = {
                    id: d.gsx$id.$t,
                    name: d.gsx$name.$t,
                    cave: d.gsx$cave.$t,
                    origin: d.gsx$origin.$t,
                    desc: d.gsx$desc.$t,
                    list: d.gsx$details.$t
                };
                return datum;
            });

        console.log(list); 
        
        //TODO: load data to the page
        var cavaDesc = document.querySelector(".js-cava-desc");
        var cavaList = document.querySelector(".js-cava-list");
        cavaDesc.textContent = list[1].desc;
        
        var szDesc = document.querySelector(".js-sz-desc");
        szDesc.textContent = list[4].desc;
                
        var sangriaDesc = document.querySelector(".js-sgr-desc");
        sangriaDesc.textContent = list[0].desc + list[0].list;
    });

})();
