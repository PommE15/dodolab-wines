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
                    title: d.gsx$title.$t,
                    desc: d.gsx$desc.$t
                };
                return datum;
            });

        console.log(list); 
        
        //TODO: load data to the page
        listEl = document.querySelector(".js-list");
        
    });

})();
