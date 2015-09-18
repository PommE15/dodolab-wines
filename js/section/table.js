import loadTable from "js/component/loadTable";
import sectionCharts from "js/section/charts";

export default function(data) {
    // load data
    data = loadTable(data);

    // create charts
    var importChart = document.querySelector("#inputChart");
    importChart.addEventListener("click", function(e) {
        sectionCharts(data);
        console.log(data);
    });
}
