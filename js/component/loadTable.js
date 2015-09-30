function getDataType(data) {
    var type = [];
    data.list.forEach(d =>
        type.push(typeof(d[0]))
    );
    return type;
}
function parseNumber(data) {
    return data.map(d => {
        var isNum = d.filter(f => isNaN(f)).length === 0;
        return isNum ? d.map(f => parseFloat(f)): d; 
    });
}

export default function(data) {
    /* data */
    data.list = parseNumber(data.list);

    /* view */
    // load data to table
    var dtHead = d3.select("#dtHead");
    var dtBody = d3.select("#dtBody");
   
    // remove childnodes if exists 
    dtHead.selectAll("tr").remove();
    dtBody.selectAll("tr").remove();

    // add table body
    data.list[0].forEach((d, iRow)=> {
        dtBody.append("tr")
        .selectAll("td")
        .data(data.list).enter()
        .append("td")
        .attr("class", (d, iCol) => "b-" + iCol)
        .attr("contentEditable", true)
        .text(d => d[iRow]);
    });

    // add table head
    data.type = getDataType(data);
    var th = dtHead.append("tr")
    .selectAll("th")
    .data(data.keys).enter()
    .append("th");

    th.append("span")
    .attr("id", (d, i) => "h-" + i)
    .attr("contentEditable", true)
    .text(d => d); 

    th.append("span")
    .attr("id", (d, i) => "t-" + i)
    .attr("class", "table-type")
    .text((d, i) => data.type[i])
    .on("click", (d, iCol) => {
        //update list
        var txt;
        d3.selectAll(".b-" + iCol)
        .data(data.list[iCol])
        .text((t, iRow) => {
            var num = str2num(t);
            txt = !isNaN(num) ? num : t;
            data.list[iCol][iRow] = txt;
            return txt;
        });
        //update type
        var typeList = typeof(txt);
        document.querySelector("#t-" + iCol).textContent = typeList;
        data.type[iCol] = typeList;
    });
    
    return data;
}

function str2num(str) {
    return parseInt(str.replace(/[\D]+/g,''));    
}
