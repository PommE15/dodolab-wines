import editPanelHTML from "html/editPanel.html!text";
import {drawChart} from "js/component/createCharts";

export default function(el, data, cols) {
    // load edit panel
    var editPanel;
    editPanel = document.querySelector("#editPanel");
    editPanel.innerHTML = editPanelHTML;
    
    // load svg chart to the panel
    var width = 620,
        units = (data.list.length + 1.25)*data.groups.length,
        height = Math.round(14*units);
        //height = Math.round(width*2/3);
    
    var chart = d3.select("#editChart");
    drawChart(chart, data, {
        width: width,
        height: height,
        margin: 0,
        space: 0,
        update: true
    },  el.id);
 
    chart.select("g")
    .attr("transform", "translate(0, 15)");
    
    // load embed code
    // TODO: svgContent, svg with x,y,viewbox
    var svg = document.querySelector("#editChart svg");

    var XMLS = new XMLSerializer(),
        code = XMLS.serializeToString(svg); 
    document.querySelector("#embedCode").textContent = code;
}
