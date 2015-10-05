import { CSV2Array } from "js/lib/common";
import sectionTable from "js/section/table";

export function importJsonFromS3(key) {
    key = key.trim();
    if (key.length!==44) return;
    var url = "http://visuals.guim.co.uk/spreadsheetdata/"+key+".json";
    
    d3.json(url, function(err, json){
        var sheets = json.sheets;
        
        var meta, data;
        // parse sheets as meta and data
        if (sheets.tableDataSheet) {
            meta = sheets.tableMeta[0]; 
            data = sheets.tableDataSheet;
            //console.log("meta", meta.title);
            //console.log("meta", meta.subtitle);
        } else {
            console.log("your data format is not yet supported");
            return;
        } 
        
        var head, type = [], list = [];
        head = Object.keys(data[0]); 
        
        // parse into lines 
        data.forEach(d => {
            var item = [];
            head.forEach(k => {
                item.push(d[k]);
            }); 
            if(item!==null) { 
                list.push(item); 
            }
        });
        
        // parse into array list as data for charts
        list = list[0].map((d2, i) => list.map(d1 => d1[i]));

        //sectionTable({head: head, list: list});
    });
}

export function importCSV(data) {
    if (data.length < 10) return;
    var head, type = [], list = [];

    // TODO: how to add meta
    // parse into lines
    data = data.split(/[\n|\r]/g);

    // parse into items
    data.forEach(d => {
        var item = d.split("\t");
        if(item!==null) {
            list.push(item); 
        }
    });
    //head = list[0];
    //list = list.splice(1, list.length);
    
    // parse into array list as data for charts
    //var cols = list[0].map((d2, i) => list.map(d1 => d1[i]));
    //console.log(cols);
    //console.log(list);
    sectionTable({rows: list});
}
