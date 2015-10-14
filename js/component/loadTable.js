function getDataType(data) {
    return data.map(d => typeof(d[0]));
}

function setDataToggleDefault(data) {
    return data.map(() => true);
}
function setDataRadioDefault(data) {
    return data.map((d, i) => i===0 ? true:false);
}

function parseNumber(data) {
    return data.map(d => {
        var isNum = d.filter(f => isNaN(f)).length === 0;
        return isNum ? d.map(f => parseFloat(f)): d; 
    });
}

function str2num(str) {
    return parseInt(str.replace(/[\D]+/g,''));    
}

export default function(el, data) {
    /* data */
    // remap for table
    var dataTable = {}, dataBtns = {}, dataSort = [];
    
    dataTable.head = data.rows.splice(0, 1)[0];
    dataTable.body = data.rows[0].map((d2, i) => data.rows.map(d1 => d1[i]));
    dataTable.body = parseNumber(dataTable.body);
    dataTable.type = getDataType(dataTable.body);
    dataSort = ["default"].concat(dataTable.head);
    
    dataBtns = {
        cols: setDataToggleDefault(dataTable.head),
        rows: setDataToggleDefault(dataTable.body[0]),
        sort: setDataRadioDefault(dataSort),
    };
    console.log("data table:");
    console.log(dataTable);
    console.log("data btns (toggle):");
    console.log(dataBtns);
    console.log("======");
    
    /* view */
    // add toggle btns
    addToggleBtns(el, dataTable.head, dataBtns.cols, "#colBtns", "col-");    
    addToggleBtns(el, dataTable.body[0], dataBtns.rows, "#rowBtns", "row-");    
    addRadioBtns(el, dataSort, dataBtns.sort, "#sortBtns", "sort-");    

    // add table with data
    addDataTable(data, dataTable);

    return {
        keys: dataTable.head,
        cols: dataTable.body,
        btns: dataBtns
    };
}


function addBtns(el, dataText, dataBtn, id, cn){
    var btns = d3.select(id)
    .selectAll("input")
    .data(dataText)
    .enter().append("input")
    .attr("type", "button")
    .attr("class", (d, i) => { 
        var isOff = dataBtn[i] ? "" : " btn-off";
        return "pure-button " + cn + i + isOff;
    })
    .attr("value", d => d);
    return btns;
}

function addToggleBtns(el, dataText, dataBtn, id, cn){
    addBtns(el, dataText, dataBtn, id, cn)
    .on("click", (d, i)=> {
        // update view (table)
        var els = [ ... el.querySelectorAll("." + cn + i)];
        els.forEach(e => e.classList.toggle("btn-off"));
        // update data
        dataBtn[i] = dataBtn[i] ? false : true;
    });
}

function addRadioBtns(el, dataText, dataBtn, id, cn){
    var btns = addBtns(el, dataText, dataBtn, id, cn);
    btns
    .on("click", (d, i)=> {
        btns.classed("btn-off", (d,j) => {
            var isOff = i===j ? false:true;
            // update data
            dataBtn[j] = !isOff;
            // update view (buttons)
            return isOff;
        });
        
        // TODO: sort data
        // using data.rows
    });
}

function addDataTable(data, dataTable) {
    var dtHead = d3.select("#dtHead");
    var dtBody = d3.select("#dtBody");
   
    // remove childnodes if exists 
    dtHead.selectAll("tr").remove();
    dtBody.selectAll("tr").remove();

    // add table body
    data.rows.forEach((r, iRow)=> {
        dtBody.append("tr")
        .attr("class", () => "row-" + iRow)
        .selectAll("td")
        .data(dataTable.body).enter()
        .append("td")
        .attr("class", (c, iCol) => "b-" + iCol + " col-" + iCol)
        .attr("contentEditable", true)
        .text(d => d[iRow]);
    });

    // add table head
    var th = dtHead.append("tr")
    .selectAll("th")
    .data(dataTable.head).enter()
    .append("th")
    .attr("class", (d, i) => "col-" + i);

    th.append("span")
    .attr("id", (d, i) => "h-" + i)
    .attr("contentEditable", true)
    .text(d => d); 

    // add table type to body
    th.append("span")
    .attr("id", (d, i) => "t-" + i)
    .attr("class", "table-type")
    .text((d, i) => dataTable.type[i])
    .on("click", (d, iCol) => {
        //update body
        var txt;
        d3.selectAll(".b-" + iCol)
        .data(dataTable.body[iCol])
        .text((t, iRow) => {
            var num = str2num(t);
            txt = !isNaN(num) ? num : t;
            dataTable.body[iCol][iRow] = txt;
            return txt;
        });
        //update type
        var typeList = typeof(txt);
        document.querySelector("#t-" + iCol).textContent = typeList;
        dataTable.type[iCol] = typeList;
    });
}
