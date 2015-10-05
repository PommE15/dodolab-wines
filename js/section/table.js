import loadTable from "js/component/loadTable";
import sectionCharts from "js/section/charts";

export default function(data) {
    var cols, btnChart;
    
    // load data to table
    data = loadTable(data);

    // pass data to charts
    btnChart = document.querySelector("#inputChart");
    btnChart.addEventListener("click", function(e) {
        //TODO: remap data for charts
        data.groups = data.list[0];
        data.list = data.list.filter((d, i) => i > 0);
        data.count = {
            color: data.list.length,
            group: data.groups.length
        };
        //console.log(data);

        sectionCharts(data);
    }, false);
}
