/* section 2. load table and toggle data */
import toggleTableHTML from "html/toggleTable.html!text";
import sectionCharts from "js/section/charts";

import loadTable from "js/component/loadTable";

export default function(data) {
    console.log("data form:");
    console.log(data);
    console.log("======");

    var el, chartBtn;
    // add table
    el = document.querySelector("#toggleTable");
    el.innerHTML = toggleTableHTML;

    // load data to table
    data = loadTable(el, data);

    // pass data to charts
    chartBtn = document.querySelector("#chartBtn");
    chartBtn.addEventListener("click", function(e) {
        //TODO: remap data for charts
        var dataChart = {},
            keys = filterKeyByBtns(data.keys, data.btns.cols),
            cols = filterColByBtns(data.cols, data.btns.cols, data.btns.rows);
        
        dataChart.color = keys.slice(1, keys.length);
        dataChart.clist = cols.slice(1, cols.length);
        dataChart.group = cols[0];
        dataChart.glist = cols[0].map((r, i) => 
            dataChart.clist.map(c => c[i])
        );
        dataChart.tests = cols[0].map((r, i) => 
            dataChart.clist.map(c => {
                return {key: r, val: c[i]};
        }));
        dataChart.count = {
            color: dataChart.color.length,
            group: dataChart.group.length
        };
        
        sectionCharts(dataChart);
        // section control
        document.querySelector(".sec-panel > div").classList.add("d-n");
        document.querySelector(".sec-code > div").classList.add("d-n");
    }, false);
}

function filterKeyByBtns(dataTable, dataBtns) {
    return dataTable.filter((d, i) => dataBtns[i]);
}

function filterColByBtns(dataTable, dataColBtns, dataRowBtns) {
    var dataCols = filterKeyByBtns(dataTable, dataColBtns);
    return dataCols.map(col => col.filter((d, i) => dataRowBtns[i]));
}
