/* section 2. charts*/
import { barHorizontal, barVertical } from "js/component/createCharts";

export default function(data) {

    var chartId = "#chartList",
        chartEl = document.querySelector(chartId),
        chartList = d3.select(chartId);

    // remove all childnodes
    while(chartEl.firstChild) {
        chartEl.removeChild(chartEl.firstChild);
    }
    
    // draw charts
    barHorizontal(chartList, data.list, 1);
    barVertical(chartList, data.list, 1);
    barHorizontal(chartList, data.list, 2);
    barVertical(chartList, data.list, 2);
    barHorizontal(chartList, data.list, 3);
    barVertical(chartList, data.list, 3);
}
