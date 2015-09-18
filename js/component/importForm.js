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
        
        var keys, type = [], list = [];
        keys = Object.keys(data[0]); 
        
        // parse into array list 
        data.forEach(d => {
            var item = [];
            keys.forEach(k => {
                item.push(d[k]);
            }); 
            if(item!==null) { 
                list.push(item); 
            }
        });
        
        sectionTable({keys: keys, list: list});
    });
}

export function importCSV(data) {
    if (data.length < 10) return;
    var keys, type = [], list = [];

    // TODO: how to add meta
    // parse into lines
    data = data.split(/[\n|\r]/g);

    // parse into array list
    data.forEach(d => {
        var item = d.split("\t");
        if(item!==null) { 
            list.push(item); 
        }
        type.push(typeof(item));
    });
    keys = list[0];
    list = list.splice(1, list.length);

    sectionTable({keys: keys, list: list});
}
