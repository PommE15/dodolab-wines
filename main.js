(function(){
    "use strict";

    var key = "1aCp4Ye2NoDgI2Qd_TwieXU9uvzU1tdZngsoRcg3Werg", 
        url = "https://spreadsheets.google.com/feeds/list/"+key+"/od6/public/values?alt=json";
    
    d3.json(url, function(err, sheet){
        var data = sheet.feed.entry,
            list = data.map(function(d){
                var datum = {
                    headline: d.gsx$headline.$t,
                    context: d.gsx$context.$t
                };
                return datum;
            });

        console.log(list); 
        
        //TODO: load data to the page
    });

})();
