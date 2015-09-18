export default function(data) {
    /* data */
    // update data types
    var type = [];
    data.list[0].forEach((d, i) => {
        type.push(typeof(d));
    });
    data.type = type;
    console.log(data);

    /* view */
    // load data to table
    var dtHead = d3.select("#dtHead");
    var dtBody = d3.select("#dtBody");
   
    // remove childnodes if exists 
    dtHead.selectAll("tr").remove();
    dtBody.selectAll("tr").remove();

    // add table head
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
    .on("click", (d, iKey) => {
        //update list
        d3.selectAll(".b-" + iKey)
        .text((t, i) => {
            var num = str2num(data.list[i][iKey]);
            if (!isNaN(num)) { data.list[i][iKey] = num; }
            return data.list[i][iKey];
        });
        //update type
        var typeList = typeof(data.list[0][iKey]);
        document.querySelector("#t-" + iKey).textContent = typeList;
        data.type[iKey] = typeList;
    });

    // add table body
    data.list.forEach((d, iList)=> {
        dtBody.append("tr")
        .selectAll("td")
        .data(data.keys).enter()
        .append("td")
        .attr("class", (k, iKey) => "b-" + iKey)
        .attr("contentEditable", true)
        .text((k, iKey) => d[iKey]);
    });
    
    return data;
}

function str2num(str) {
    return parseInt(str.replace(/[\D]+/g,''));    
}
