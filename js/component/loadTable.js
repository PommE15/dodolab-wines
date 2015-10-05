function getDataType(data) {
    return data.map(d => typeof(d[0]));
}

function getDataRows(data) {
    return data.map(d => true);
}

function getDataCols(data) {
    return data.map(d => true);
}

function parseNumber(data) {
    return data.map(d => {
        var isNum = d.filter(f => isNaN(f)).length === 0;
        return isNum ? d.map(f => parseFloat(f)): d; 
    });
}

export default function(data) {
    /* data */
    // head
    data.keys = data.rows.splice(0, 1)[0];
    // body
    data.cols = data.rows[0].map((d2, i) => data.rows.map(d1 => d1[i]));
    data.cols = parseNumber(data.cols);

    data.type = getDataType(data.cols);
    data.toggle = {
        rows: getDataRows(data.rows),
        cols: getDataCols(data.cols)
    };
    console.log(data);

    /* view */
    // load data to table
    var dtHead = d3.select("#dtHead");
    var dtBody = d3.select("#dtBody");
   
    // remove childnodes if exists 
    dtHead.selectAll("tr").remove();
    dtBody.selectAll("tr").remove();

    // add table body
    data.rows.forEach((r, iRow)=> {
        dtBody.append("tr")
        .selectAll("td")
        .data(data.cols).enter()
        .append("td")
        .attr("class", (c, iCol) => "b-" + iCol)
        .attr("contentEditable", true)
        .text(d => d[iRow]);
    });

    // add table head
    var th = dtHead.append("tr")
    .selectAll("th")
    .data(data.keys).enter()
    .append("th");

    th.append("span")
    .attr("id", (d, i) => "h-" + i)
    .attr("contentEditable", true)
    .text(d => d); 

    // add table type to cols
    th.append("span")
    .attr("id", (d, i) => "t-" + i)
    .attr("class", "table-type")
    .text((d, i) => (i!==0) ? data.type[i]:"")
    .on("click", (d, iCol) => {
        //update body
        var txt;
        d3.selectAll(".b-" + iCol)
        .data(data.cols[iCol])
        .text((t, iRow) => {
            var num = str2num(t);
            txt = !isNaN(num) ? num : t;
            data.cols[iCol][iRow] = txt;
            return txt;
        });
        //update type
        var typeList = typeof(txt);
        document.querySelector("#t-" + iCol).textContent = typeList;
        data.type[iCol] = typeList;
    });
    
    return { 
        keys: data.keys,
        list: data.cols
    };
}

function str2num(str) {
    return parseInt(str.replace(/[\D]+/g,''));    
}
